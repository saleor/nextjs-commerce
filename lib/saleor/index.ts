import { TAGS } from 'lib/constants';
import { Cart, Collection, Menu, Page, Product } from 'lib/types';
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import {
  CheckoutAddLineDocument,
  CheckoutDeleteLineDocument,
  CheckoutUpdateLineDocument,
  CreateCheckoutDocument,
  GetCategoryBySlugDocument,
  GetCategoryProductsBySlugDocument,
  GetCheckoutByIdDocument,
  GetCollectionBySlugDocument,
  GetCollectionProductsBySlugDocument,
  GetCollectionsDocument,
  GetMenuBySlugDocument,
  GetPageBySlugDocument,
  GetPagesDocument,
  GetProductBySlugDocument,
  MenuItemFragment,
  OrderDirection,
  ProductOrderField,
  SearchProductsDocument,
  TypedDocumentString,
} from './generated/graphql';
import { verifySignature } from './jwks';
import { saleorCheckoutToVercelCart, saleorProductToVercelProduct } from './mappers';
import { invariant } from './utils';

const endpoint = process.env.SALEOR_INSTANCE_URL;
invariant(endpoint, `Missing SALEOR_INSTANCE_URL!`);

type GraphQlError = {
  message: string;
};
type GraphQlErrorRespone<T> = { data: T } | { errors: readonly GraphQlError[] };

export async function saleorFetch<Result, Variables>({
  query,
  variables,
  headers,
  cache,
  tags,
}: {
  query: TypedDocumentString<Result, Variables>;
  variables: Variables;
  headers?: HeadersInit;
  cache?: RequestCache;
  tags?: NextFetchRequestConfig['tags'];
}): Promise<Result> {
  invariant(endpoint, `Missing SALEOR_INSTANCE_URL!`);

  const options = cache ? { cache, next: { tags } } : { next: { revalidate: 900, tags } };

  const result = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify({
      query: query.toString(),
      ...(variables && { variables }),
    }),
    ...options,
  });

  const body = (await result.json()) as GraphQlErrorRespone<Result>;

  if ('errors' in body) {
    throw body.errors[0];
  }

  return body.data;
}

export async function getCollections(): Promise<Collection[]> {
  const saleorCollections = await saleorFetch({
    query: GetCollectionsDocument,
    variables: {},
    tags: [TAGS.collections],
  });

  return (
    saleorCollections.collections?.edges
      .map((edge) => {
        return {
          handle: edge.node.slug,
          title: edge.node.name,
          description: edge.node.description as string,
          seo: {
            title: edge.node.seoTitle || edge.node.name,
            description: edge.node.seoDescription || '',
          },
          updatedAt: edge.node.products?.edges?.[0]?.node.updatedAt || '',
          path: `/search/${edge.node.slug}`,
        };
      })
      .filter((el) => !el.handle.startsWith(`hidden-`)) ?? []
  );
}

export async function getPage(handle: string): Promise<Page> {
  const saleorPage = await saleorFetch({
    query: GetPageBySlugDocument,
    variables: {
      slug: handle,
    },
  });

  if (!saleorPage.page) {
    throw new Error(`Page not found: ${handle}`);
  }

  return {
    id: saleorPage.page.id,
    title: saleorPage.page.title,
    handle: saleorPage.page.slug,
    body: saleorPage.page.content || '',
    bodySummary: saleorPage.page.seoDescription || '',
    seo: {
      title: saleorPage.page.seoTitle || saleorPage.page.title,
      description: saleorPage.page.seoDescription || '',
    },
    createdAt: saleorPage.page.created,
    updatedAt: saleorPage.page.created,
  };
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  const saleorProduct = await saleorFetch({
    query: GetProductBySlugDocument,
    variables: {
      slug: handle,
    },
    tags: [TAGS.products],
  });

  if (!saleorProduct.product) {
    throw new Error(`Product not found: ${handle}`);
  }

  return saleorProductToVercelProduct(saleorProduct.product);
}

const _getCollection = async (handle: string) =>
  (
    await saleorFetch({
      query: GetCollectionBySlugDocument,
      variables: {
        slug: handle,
      },
      tags: [TAGS.collections],
    })
  ).collection;
const _getCategory = async (handle: string) =>
  (
    await saleorFetch({
      query: GetCategoryBySlugDocument,
      variables: {
        slug: handle,
      },
      tags: [TAGS.collections],
    })
  ).category;

export async function getCollection(handle: string): Promise<Collection | undefined> {
  const saleorCollection = (await _getCollection(handle)) || (await _getCategory(handle));

  if (!saleorCollection) {
    throw new Error(`Collection not found: ${handle}`);
  }

  return {
    handle: saleorCollection.slug,
    title: saleorCollection.name,
    description: saleorCollection.description as string,
    seo: {
      title: saleorCollection.seoTitle || saleorCollection.name,
      description: saleorCollection.seoDescription || '',
    },
    updatedAt: saleorCollection.products?.edges?.[0]?.node.updatedAt || '',
    path: `/search/${saleorCollection.slug}`,
  };
}

const _getCollectionProducts = async ({
  collection,
  reverse,
  sortKey,
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: ProductOrderField;
}) =>
  (
    await saleorFetch({
      query: GetCollectionProductsBySlugDocument,
      variables: {
        slug: collection,
        sortBy:
          sortKey === ProductOrderField.Rank
            ? ProductOrderField.Rating
            : sortKey || ProductOrderField.Rating,
        sortDirection: reverse ? OrderDirection.Desc : OrderDirection.Asc,
      },
      tags: [TAGS.collections, TAGS.products],
    })
  ).collection;
const _getCategoryProducts = async ({
  category,
  reverse,
  sortKey,
}: {
  category: string;
  reverse?: boolean;
  sortKey?: ProductOrderField;
}) =>
  (
    await saleorFetch({
      query: GetCategoryProductsBySlugDocument,
      variables: {
        slug: category,
        sortBy:
          sortKey === ProductOrderField.Rank
            ? ProductOrderField.Rating
            : sortKey || ProductOrderField.Rating,
        sortDirection: reverse ? OrderDirection.Desc : OrderDirection.Asc,
      },
      tags: [TAGS.collections, TAGS.products],
    })
  ).category;

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey,
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: ProductOrderField;
}): Promise<Product[]> {
  if (typeof reverse === 'undefined' && typeof sortKey === 'undefined') {
    reverse = true;
    sortKey = ProductOrderField.Name;
  }

  const saleorCollectionProducts =
    (await _getCollectionProducts({
      collection,
      reverse,
      sortKey,
    })) ||
    (await _getCategoryProducts({
      category: collection,
      reverse,
      sortKey,
    }));

  if (!saleorCollectionProducts) {
    throw new Error(`Collection not found: ${collection}`);
  }

  return (
    saleorCollectionProducts.products?.edges.map((product) =>
      saleorProductToVercelProduct(product.node),
    ) || []
  );
}

export async function getMenu(handle: string): Promise<Menu[]> {
  const handleToSlug: Record<string, string> = {
    'next-js-frontend-footer-menu': 'footer',
    'next-js-frontend-header-menu': 'navbar',
  };

  const saleorMenu = await saleorFetch({
    query: GetMenuBySlugDocument,
    variables: {
      slug: handleToSlug[handle] || handle,
    },
  });

  if (!saleorMenu.menu) {
    throw new Error(`Menu not found: ${handle}`);
  }

  const saleorUrl = new URL(endpoint!);
  saleorUrl.pathname = '';

  const result = flattenMenuItems(saleorMenu.menu.items)
    .filter(
      // unique by path
      (item1, idx, arr) => arr.findIndex((item2) => item2.path === item1.path) === idx,
    )
    .map((item) => ({
      ...item,
      path: item.path.replace('http://localhost:8000', saleorUrl.toString().slice(0, -1)),
    }));

  if (handle === 'next-js-frontend-header-menu') {
    // limit number of items in header to 3
    return result.slice(0, 3);
  }
  return result;
}

type MenuItemWithChildren = MenuItemFragment & {
  children?: null | undefined | MenuItemWithChildren[];
};
function flattenMenuItems(menuItems: null | undefined | MenuItemWithChildren[]): Menu[] {
  return (
    menuItems?.flatMap((item) => {
      // Remove empty categories and collections from menu
      if (item.category && !item.category.products?.totalCount) {
        return [];
      }
      if (item.collection && !item.collection.products?.totalCount) {
        return [];
      }

      const path =
        item.url ||
        (item.collection
          ? `/search/${item.collection.slug}`
          : item.category
          ? `/search/${item.category.slug}`
          : '');

      return [
        ...(path
          ? [
              {
                path: path,
                title: item.name,
              },
            ]
          : []),
        ...flattenMenuItems(item.children),
      ];
    }) || []
  );
}

export async function getProducts({
  query,
  reverse,
  sortKey,
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: ProductOrderField;
}): Promise<Product[]> {
  const saleorProducts = await saleorFetch({
    query: SearchProductsDocument,
    variables: {
      search: query || '',
      sortBy: query
        ? sortKey || ProductOrderField.Rank
        : sortKey === ProductOrderField.Rank
        ? ProductOrderField.Rating
        : sortKey || ProductOrderField.Rating,
      sortDirection: reverse ? OrderDirection.Desc : OrderDirection.Asc,
    },
    tags: [TAGS.products],
  });

  return (
    saleorProducts.products?.edges.map((product) => saleorProductToVercelProduct(product.node)) ||
    []
  );
}

export async function getPages(): Promise<Page[]> {
  const saleorPages = await saleorFetch({
    query: GetPagesDocument,
    variables: {},
  });

  return (
    saleorPages.pages?.edges.map((page) => {
      return {
        id: page.node.id,
        title: page.node.title,
        handle: page.node.slug,
        body: page.node.content || '',
        bodySummary: page.node.seoDescription || '',
        seo: {
          title: page.node.seoTitle || page.node.title,
          description: page.node.seoDescription || '',
        },
        createdAt: page.node.created,
        updatedAt: page.node.created,
      };
    }) || []
  );
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const saleorCheckout = await saleorFetch({
    query: GetCheckoutByIdDocument,
    variables: {
      id: cartId,
    },
    cache: 'no-store',
  });

  if (!saleorCheckout.checkout) {
    return null;
  }

  return saleorCheckoutToVercelCart(saleorCheckout.checkout);
}

export async function createCart(): Promise<Cart> {
  const saleorCheckout = await saleorFetch({
    query: CreateCheckoutDocument,
    variables: {
      input: {
        channel: 'default-channel',
        lines: [],
      },
    },
    cache: 'no-store',
  });

  if (!saleorCheckout.checkoutCreate?.checkout) {
    console.error(saleorCheckout.checkoutCreate?.errors);
    throw new Error(`Couldn't create checkout.`);
  }

  return saleorCheckoutToVercelCart(saleorCheckout.checkoutCreate.checkout);
}

export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  const saleorCheckout = await saleorFetch({
    query: CheckoutAddLineDocument,
    variables: {
      checkoutId: cartId,
      lines: lines.map(({ merchandiseId, quantity }) => ({ variantId: merchandiseId, quantity })),
    },
    cache: 'no-store',
  });

  if (!saleorCheckout.checkoutLinesAdd?.checkout) {
    console.error(saleorCheckout.checkoutLinesAdd?.errors);
    throw new Error(`Couldn't add lines to checkout.`);
  }

  return saleorCheckoutToVercelCart(saleorCheckout.checkoutLinesAdd.checkout);
}

export async function updateCart(
  cartId: string,
  lines: { id: string; merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  const saleorCheckout = await saleorFetch({
    query: CheckoutUpdateLineDocument,
    variables: {
      checkoutId: cartId,
      lines: lines.map(({ id, quantity }) => ({ lineId: id, quantity })),
    },
    cache: 'no-store',
  });

  if (!saleorCheckout.checkoutLinesUpdate?.checkout) {
    console.error(saleorCheckout.checkoutLinesUpdate?.errors);
    throw new Error(`Couldn't update lines in checkout.`);
  }

  return saleorCheckoutToVercelCart(saleorCheckout.checkoutLinesUpdate.checkout);
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<Cart> {
  const saleorCheckout = await saleorFetch({
    query: CheckoutDeleteLineDocument,
    variables: {
      checkoutId: cartId,
      lineIds,
    },
    cache: 'no-store',
  });

  if (!saleorCheckout.checkoutLinesDelete?.checkout) {
    console.error(saleorCheckout.checkoutLinesDelete?.errors);
    throw new Error(`Couldn't remove lines from checkout.`);
  }

  return saleorCheckoutToVercelCart(saleorCheckout.checkoutLinesDelete.checkout);
}

// eslint-disable-next-line no-unused-vars
export async function getProductRecommendations(productId: string): Promise<Product[]> {
  // @todo
  // tags: [TAGS.products],
  return [];
}

// eslint-disable-next-line no-unused-vars
export async function revalidate(req: NextRequest): Promise<Response> {
  const json = await verifySignature(req, endpoint!);
  console.log(json);
  if (!json || !('__typename' in json)) {
    return NextResponse.json({ status: 204 });
  }

  switch (json.__typename) {
    case 'CategoryCreated':
    case 'CategoryUpdated':
    case 'CategoryDeleted':
    case 'CollectionCreated':
    case 'CollectionUpdated':
    case 'CollectionDeleted':
      console.log(`revalidateTag(TAGS.collections)`);
      revalidateTag(TAGS.collections);
      break;
    case 'ProductVariantCreated':
    case 'ProductVariantUpdated':
    case 'ProductVariantDeleted':
    case 'ProductCreated':
    case 'ProductUpdated':
    case 'ProductDeleted':
      console.log(`revalidateTag(TAGS.products)`);
      revalidateTag(TAGS.products);
      break;
  }
  console.log('Done revalidating');
  return NextResponse.json({ status: 204 });
}
