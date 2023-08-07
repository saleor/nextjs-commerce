import { Cart, Product } from 'lib/types';
import { parseEditorJsToHtml } from './editorjs';
import { CheckoutFragment, GetProductBySlugQuery, VariantFragment } from './generated/graphql';

export function saleorProductToVercelProduct(
  product: Exclude<GetProductBySlugQuery['product'], null | undefined>,
): Product {
  const images =
    product.media
      ?.filter((media) => media.type === 'IMAGE')
      .map((media) => {
        return {
          url: media.url,
          altText: media.alt || product.seoTitle || product.name,
          width: 2048,
          height: 2048,
        };
      }) || [];

  return {
    id: product.id,
    handle: product.slug,
    availableForSale: product.isAvailableForPurchase || true,
    title: product.name,
    description: product.description || '',
    descriptionHtml: product.description ? parseEditorJsToHtml(product.description) : '',
    options: saleorVariantsToVercelOptions(product.variants),
    priceRange: {
      maxVariantPrice: {
        amount: product.pricing?.priceRange?.stop?.gross.amount.toString() || '0',
        currencyCode: product.pricing?.priceRange?.stop?.gross.currency || '',
      },
      minVariantPrice: {
        amount: product.pricing?.priceRange?.start?.gross.amount.toString() || '0',
        currencyCode: product.pricing?.priceRange?.start?.gross.currency || '',
      },
    },
    variants: saleorVariantsToVercelVariants(product.variants, product.isAvailableForPurchase),
    images: images,
    featuredImage: images[0]!,
    seo: {
      title: product.seoTitle || product.name,
      description: product.seoDescription || '',
    },
    tags: product.collections?.map((c) => c.name) || [],
    updatedAt: product.updatedAt,
  };
}

export function saleorVariantsToVercelOptions(variants: VariantFragment[] | null | undefined) {
  return (
    variants
      ?.flatMap((variant) => {
        return variant.attributes.flatMap((attribute) => {
          return {
            id: attribute.attribute.slug || '',
            name: attribute.attribute.name || '',
            values:
              attribute.attribute.choices?.edges.map((choice) => choice.node.name || '') || [],
          };
        });
      })
      .filter(
        (value1, idx, arr) =>
          // filter unique
          arr.findIndex((value2) => value1.id === value2.id) === idx,
      ) || []
  );
}

export function saleorVariantsToVercelVariants(
  variants: null | undefined | VariantFragment[],
  isAvailableForPurchase: null | undefined | boolean,
): Product['variants'] {
  return (
    variants?.map((variant) => {
      return {
        id: variant.id,
        title: variant.name,
        availableForSale: isAvailableForPurchase || true,
        selectedOptions: variant.attributes.flatMap((attribute) => {
          return attribute.values.map((value) => {
            return {
              name: attribute.attribute.name || '',
              value: value.name || '',
            };
          });
        }),
        price: {
          amount: variant.pricing?.price?.gross.amount.toString() || '0',
          currencyCode: variant.pricing?.price?.gross.currency || '',
        },
      };
    }) || []
  );
}

export function saleorCheckoutToVercelCart(checkout: CheckoutFragment): Cart {
  const domain = new URL(process.env.SALEOR_INSTANCE_URL!).hostname;
  const checkoutUrl = new URL(`https://demo.saleor.io/checkout/`);
  checkoutUrl.searchParams.append('checkout', checkout.id);
  checkoutUrl.searchParams.append('locale', `en-US`);
  checkoutUrl.searchParams.append('channel', `default-channel`);
  checkoutUrl.searchParams.append('saleorApiUrl', process.env.SALEOR_INSTANCE_URL!);
  checkoutUrl.searchParams.append('domain', domain);

  return {
    id: checkout.id,
    checkoutUrl: checkoutUrl.toString(),
    cost: {
      subtotalAmount: {
        amount: checkout.subtotalPrice.gross.amount.toString(),
        currencyCode: checkout.subtotalPrice.gross.currency,
      },
      totalAmount: {
        amount: checkout.totalPrice.gross.amount.toString(),
        currencyCode: checkout.totalPrice.gross.currency,
      },
      totalTaxAmount: {
        amount: checkout.totalPrice.tax.amount.toString(),
        currencyCode: checkout.totalPrice.tax.currency,
      },
    },
    lines: checkout.lines.map((line) => {
      const title = line.variant.name.trim() === line.variant.id ? '' : line.variant.name.trim();
      return {
        id: line.id,
        quantity: line.quantity,
        cost: {
          totalAmount: {
            amount: line.variant.pricing?.price?.gross.amount.toString() || '0',
            currencyCode: line.variant.pricing?.price?.gross.currency || '',
          },
        },
        merchandise: {
          id: line.variant.id,
          title,
          selectedOptions: line.variant.attributes.flatMap((attribute) => {
            return attribute.values.map((value) => {
              return {
                name: attribute.attribute.name || '',
                value: value.name || '',
              };
            });
          }),
          product: saleorProductToVercelProduct(line.variant.product),
        },
      };
    }),
    totalQuantity: checkout.quantity,
  };
}
