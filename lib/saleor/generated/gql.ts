/* eslint-disable */
import * as types from './graphql';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
  'fragment Checkout on Checkout {\n  id\n  totalPrice {\n    gross {\n      currency\n      amount\n    }\n    tax {\n      currency\n      amount\n    }\n  }\n  subtotalPrice {\n    gross {\n      currency\n      amount\n    }\n  }\n  quantity\n  lines {\n    id\n    quantity\n    variant {\n      ...Variant\n      product {\n        ...ProductDetails\n      }\n    }\n  }\n}':
    types.CheckoutFragmentDoc,
  'fragment FeaturedProduct on Product {\n  id\n  slug\n  name\n  isAvailableForPurchase\n  description\n  seoTitle\n  seoDescription\n  pricing {\n    priceRange {\n      start {\n        gross {\n          currency\n          amount\n        }\n      }\n      stop {\n        gross {\n          currency\n          amount\n        }\n      }\n    }\n  }\n  media {\n    url(size: 1080)\n    type\n    alt\n  }\n  collections {\n    name\n  }\n  updatedAt\n  variants {\n    id\n    name\n    pricing {\n      price {\n        gross {\n          currency\n          amount\n        }\n      }\n    }\n  }\n}':
    types.FeaturedProductFragmentDoc,
  'fragment ProductDetails on Product {\n  id\n  slug\n  name\n  isAvailableForPurchase\n  description\n  seoTitle\n  seoDescription\n  pricing {\n    priceRange {\n      start {\n        gross {\n          currency\n          amount\n        }\n      }\n      stop {\n        gross {\n          currency\n          amount\n        }\n      }\n    }\n  }\n  media {\n    url(size: 1080)\n    type\n    alt\n  }\n  collections {\n    name\n  }\n  updatedAt\n  variants {\n    ...Variant\n  }\n}':
    types.ProductDetailsFragmentDoc,
  'fragment Variant on ProductVariant {\n  id\n  name\n  attributes {\n    attribute {\n      slug\n      name\n      choices(first: 100) {\n        edges {\n          node {\n            name\n          }\n        }\n      }\n    }\n    values {\n      name\n    }\n  }\n  pricing {\n    price {\n      gross {\n        currency\n        amount\n      }\n    }\n  }\n}':
    types.VariantFragmentDoc,
  'mutation CheckoutAddLine($checkoutId: ID!, $lines: [CheckoutLineInput!]!) {\n  checkoutLinesAdd(id: $checkoutId, lines: $lines) {\n    errors {\n      code\n      message\n      field\n    }\n    checkout {\n      ...Checkout\n    }\n  }\n}':
    types.CheckoutAddLineDocument,
  'mutation CheckoutDeleteLine($checkoutId: ID!, $lineIds: [ID!]!) {\n  checkoutLinesDelete(id: $checkoutId, linesIds: $lineIds) {\n    errors {\n      code\n      message\n      field\n    }\n    checkout {\n      ...Checkout\n    }\n  }\n}':
    types.CheckoutDeleteLineDocument,
  'mutation CheckoutUpdateLine($checkoutId: ID!, $lines: [CheckoutLineUpdateInput!]!) {\n  checkoutLinesUpdate(id: $checkoutId, lines: $lines) {\n    errors {\n      code\n      message\n      field\n    }\n    checkout {\n      ...Checkout\n    }\n  }\n}':
    types.CheckoutUpdateLineDocument,
  'mutation CreateCheckout($input: CheckoutCreateInput!) {\n  checkoutCreate(input: $input) {\n    errors {\n      code\n      message\n      field\n    }\n    checkout {\n      ...Checkout\n    }\n  }\n}':
    types.CreateCheckoutDocument,
  'query GetCategoryBySlug($slug: String!) {\n  category(slug: $slug) {\n    id\n    name\n    slug\n    description\n    seoTitle\n    seoDescription\n    products(\n      channel: "default-channel"\n      first: 1\n      sortBy: {field: LAST_MODIFIED_AT, direction: DESC}\n    ) {\n      edges {\n        node {\n          updatedAt\n        }\n      }\n    }\n  }\n}':
    types.GetCategoryBySlugDocument,
  'query GetCategoryProductsBySlug($slug: String!, $sortBy: ProductOrderField!, $sortDirection: OrderDirection!) {\n  category(slug: $slug) {\n    products(\n      channel: "default-channel"\n      first: 100\n      sortBy: {field: $sortBy, direction: $sortDirection}\n    ) {\n      edges {\n        node {\n          id\n          slug\n          name\n          isAvailableForPurchase\n          description\n          seoTitle\n          seoDescription\n          pricing {\n            priceRange {\n              start {\n                gross {\n                  currency\n                  amount\n                }\n              }\n              stop {\n                gross {\n                  currency\n                  amount\n                }\n              }\n            }\n          }\n          media {\n            url(size: 2160)\n            type\n            alt\n          }\n          collections {\n            name\n          }\n          updatedAt\n          variants {\n            ...Variant\n          }\n        }\n      }\n    }\n  }\n}':
    types.GetCategoryProductsBySlugDocument,
  'query GetCheckoutById($id: ID!) {\n  checkout(id: $id) {\n    ...Checkout\n  }\n}':
    types.GetCheckoutByIdDocument,
  'query GetCollectionBySlug($slug: String!) {\n  collection(channel: "default-channel", slug: $slug) {\n    id\n    name\n    slug\n    description\n    seoTitle\n    seoDescription\n    products(first: 1, sortBy: {field: LAST_MODIFIED_AT, direction: DESC}) {\n      edges {\n        node {\n          updatedAt\n        }\n      }\n    }\n  }\n}':
    types.GetCollectionBySlugDocument,
  'query GetCollectionProductsBySlug($slug: String!, $sortBy: ProductOrderField!, $sortDirection: OrderDirection!) {\n  collection(channel: "default-channel", slug: $slug) {\n    products(first: 100, sortBy: {field: $sortBy, direction: $sortDirection}) {\n      edges {\n        node {\n          id\n          slug\n          name\n          isAvailableForPurchase\n          description\n          seoTitle\n          seoDescription\n          pricing {\n            priceRange {\n              start {\n                gross {\n                  currency\n                  amount\n                }\n              }\n              stop {\n                gross {\n                  currency\n                  amount\n                }\n              }\n            }\n          }\n          media {\n            url(size: 2160)\n            type\n            alt\n          }\n          collections {\n            name\n          }\n          updatedAt\n          variants {\n            ...Variant\n          }\n        }\n      }\n    }\n  }\n}':
    types.GetCollectionProductsBySlugDocument,
  'query GetCollections {\n  collections(channel: "default-channel", first: 100) {\n    edges {\n      node {\n        id\n        name\n        slug\n        description\n        seoTitle\n        seoDescription\n        products(first: 1, sortBy: {field: LAST_MODIFIED_AT, direction: DESC}) {\n          edges {\n            node {\n              updatedAt\n            }\n          }\n        }\n      }\n    }\n  }\n}':
    types.GetCollectionsDocument,
  'query GetFeaturedProducts($first: Int!) {\n  products(first: $first, channel: "default-channel") {\n    edges {\n      node {\n        ...FeaturedProduct\n      }\n    }\n  }\n}':
    types.GetFeaturedProductsDocument,
  'fragment MenuItem on MenuItem {\n  id\n  name\n  url\n  collection {\n    slug\n    products(first: 0) {\n      totalCount\n    }\n  }\n  category {\n    slug\n    products(channel: "default-channel", first: 0) {\n      totalCount\n    }\n  }\n  page {\n    slug\n  }\n}\n\nquery GetMenuBySlug($slug: String!) {\n  menu(slug: $slug, channel: "default-channel") {\n    id\n    slug\n    name\n    items {\n      ...MenuItem\n      children {\n        ...MenuItem\n        children {\n          ...MenuItem\n          children {\n            ...MenuItem\n          }\n        }\n      }\n    }\n  }\n}':
    types.MenuItemFragmentDoc,
  'query GetPageBySlug($slug: String!) {\n  page(slug: $slug) {\n    id\n    title\n    slug\n    content\n    seoTitle\n    seoDescription\n    created\n  }\n}':
    types.GetPageBySlugDocument,
  'query GetPages {\n  pages(first: 10) {\n    edges {\n      node {\n        id\n        title\n        slug\n        content\n        seoTitle\n        seoDescription\n        created\n      }\n    }\n  }\n}':
    types.GetPagesDocument,
  'query GetProductBySlug($slug: String!) {\n  product(channel: "default-channel", slug: $slug) {\n    ...ProductDetails\n  }\n}':
    types.GetProductBySlugDocument,
  'query SearchProducts($search: String!, $sortBy: ProductOrderField!, $sortDirection: OrderDirection!) {\n  products(\n    first: 100\n    channel: "default-channel"\n    sortBy: {field: $sortBy, direction: $sortDirection}\n    filter: {search: $search}\n  ) {\n    edges {\n      node {\n        id\n        slug\n        name\n        isAvailableForPurchase\n        description\n        seoTitle\n        seoDescription\n        pricing {\n          priceRange {\n            start {\n              gross {\n                currency\n                amount\n              }\n            }\n            stop {\n              gross {\n                currency\n                amount\n              }\n            }\n          }\n        }\n        media {\n          url(size: 2160)\n          type\n          alt\n        }\n        collections {\n          name\n        }\n        updatedAt\n        variants {\n          ...Variant\n        }\n      }\n    }\n  }\n}':
    types.SearchProductsDocument,
  'query GetProducts {\n  products(first: 10, channel: "default-channel") {\n    edges {\n      node {\n        name\n      }\n    }\n  }\n}':
    types.GetProductsDocument,
  'subscription WebhookSubscription {\n  event {\n    ... on CategoryCreated {\n      __typename\n      category {\n        id\n        slug\n      }\n    }\n    ... on CategoryDeleted {\n      __typename\n      category {\n        id\n        slug\n      }\n    }\n    ... on CategoryUpdated {\n      __typename\n      category {\n        id\n        slug\n      }\n    }\n    ... on CollectionUpdated {\n      __typename\n      collection {\n        id\n        slug\n      }\n    }\n    ... on CollectionDeleted {\n      __typename\n      collection {\n        id\n        slug\n      }\n    }\n    ... on CollectionCreated {\n      __typename\n      collection {\n        id\n        slug\n      }\n    }\n    ... on ProductCreated {\n      __typename\n      product {\n        id\n        slug\n      }\n    }\n    ... on ProductDeleted {\n      __typename\n      product {\n        id\n        slug\n      }\n    }\n    ... on ProductUpdated {\n      __typename\n      product {\n        id\n        slug\n      }\n    }\n    ... on ProductVariantCreated {\n      __typename\n      productVariant {\n        product {\n          id\n          slug\n        }\n      }\n    }\n    ... on ProductVariantDeleted {\n      __typename\n      productVariant {\n        product {\n          id\n          slug\n        }\n      }\n    }\n    ... on ProductVariantUpdated {\n      __typename\n      productVariant {\n        product {\n          id\n          slug\n        }\n      }\n    }\n  }\n}':
    types.WebhookSubscriptionDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'fragment Checkout on Checkout {\n  id\n  totalPrice {\n    gross {\n      currency\n      amount\n    }\n    tax {\n      currency\n      amount\n    }\n  }\n  subtotalPrice {\n    gross {\n      currency\n      amount\n    }\n  }\n  quantity\n  lines {\n    id\n    quantity\n    variant {\n      ...Variant\n      product {\n        ...ProductDetails\n      }\n    }\n  }\n}',
): typeof import('./graphql').CheckoutFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'fragment FeaturedProduct on Product {\n  id\n  slug\n  name\n  isAvailableForPurchase\n  description\n  seoTitle\n  seoDescription\n  pricing {\n    priceRange {\n      start {\n        gross {\n          currency\n          amount\n        }\n      }\n      stop {\n        gross {\n          currency\n          amount\n        }\n      }\n    }\n  }\n  media {\n    url(size: 1080)\n    type\n    alt\n  }\n  collections {\n    name\n  }\n  updatedAt\n  variants {\n    id\n    name\n    pricing {\n      price {\n        gross {\n          currency\n          amount\n        }\n      }\n    }\n  }\n}',
): typeof import('./graphql').FeaturedProductFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'fragment ProductDetails on Product {\n  id\n  slug\n  name\n  isAvailableForPurchase\n  description\n  seoTitle\n  seoDescription\n  pricing {\n    priceRange {\n      start {\n        gross {\n          currency\n          amount\n        }\n      }\n      stop {\n        gross {\n          currency\n          amount\n        }\n      }\n    }\n  }\n  media {\n    url(size: 1080)\n    type\n    alt\n  }\n  collections {\n    name\n  }\n  updatedAt\n  variants {\n    ...Variant\n  }\n}',
): typeof import('./graphql').ProductDetailsFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'fragment Variant on ProductVariant {\n  id\n  name\n  attributes {\n    attribute {\n      slug\n      name\n      choices(first: 100) {\n        edges {\n          node {\n            name\n          }\n        }\n      }\n    }\n    values {\n      name\n    }\n  }\n  pricing {\n    price {\n      gross {\n        currency\n        amount\n      }\n    }\n  }\n}',
): typeof import('./graphql').VariantFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'mutation CheckoutAddLine($checkoutId: ID!, $lines: [CheckoutLineInput!]!) {\n  checkoutLinesAdd(id: $checkoutId, lines: $lines) {\n    errors {\n      code\n      message\n      field\n    }\n    checkout {\n      ...Checkout\n    }\n  }\n}',
): typeof import('./graphql').CheckoutAddLineDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'mutation CheckoutDeleteLine($checkoutId: ID!, $lineIds: [ID!]!) {\n  checkoutLinesDelete(id: $checkoutId, linesIds: $lineIds) {\n    errors {\n      code\n      message\n      field\n    }\n    checkout {\n      ...Checkout\n    }\n  }\n}',
): typeof import('./graphql').CheckoutDeleteLineDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'mutation CheckoutUpdateLine($checkoutId: ID!, $lines: [CheckoutLineUpdateInput!]!) {\n  checkoutLinesUpdate(id: $checkoutId, lines: $lines) {\n    errors {\n      code\n      message\n      field\n    }\n    checkout {\n      ...Checkout\n    }\n  }\n}',
): typeof import('./graphql').CheckoutUpdateLineDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'mutation CreateCheckout($input: CheckoutCreateInput!) {\n  checkoutCreate(input: $input) {\n    errors {\n      code\n      message\n      field\n    }\n    checkout {\n      ...Checkout\n    }\n  }\n}',
): typeof import('./graphql').CreateCheckoutDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'query GetCategoryBySlug($slug: String!) {\n  category(slug: $slug) {\n    id\n    name\n    slug\n    description\n    seoTitle\n    seoDescription\n    products(\n      channel: "default-channel"\n      first: 1\n      sortBy: {field: LAST_MODIFIED_AT, direction: DESC}\n    ) {\n      edges {\n        node {\n          updatedAt\n        }\n      }\n    }\n  }\n}',
): typeof import('./graphql').GetCategoryBySlugDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'query GetCategoryProductsBySlug($slug: String!, $sortBy: ProductOrderField!, $sortDirection: OrderDirection!) {\n  category(slug: $slug) {\n    products(\n      channel: "default-channel"\n      first: 100\n      sortBy: {field: $sortBy, direction: $sortDirection}\n    ) {\n      edges {\n        node {\n          id\n          slug\n          name\n          isAvailableForPurchase\n          description\n          seoTitle\n          seoDescription\n          pricing {\n            priceRange {\n              start {\n                gross {\n                  currency\n                  amount\n                }\n              }\n              stop {\n                gross {\n                  currency\n                  amount\n                }\n              }\n            }\n          }\n          media {\n            url(size: 2160)\n            type\n            alt\n          }\n          collections {\n            name\n          }\n          updatedAt\n          variants {\n            ...Variant\n          }\n        }\n      }\n    }\n  }\n}',
): typeof import('./graphql').GetCategoryProductsBySlugDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'query GetCheckoutById($id: ID!) {\n  checkout(id: $id) {\n    ...Checkout\n  }\n}',
): typeof import('./graphql').GetCheckoutByIdDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'query GetCollectionBySlug($slug: String!) {\n  collection(channel: "default-channel", slug: $slug) {\n    id\n    name\n    slug\n    description\n    seoTitle\n    seoDescription\n    products(first: 1, sortBy: {field: LAST_MODIFIED_AT, direction: DESC}) {\n      edges {\n        node {\n          updatedAt\n        }\n      }\n    }\n  }\n}',
): typeof import('./graphql').GetCollectionBySlugDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'query GetCollectionProductsBySlug($slug: String!, $sortBy: ProductOrderField!, $sortDirection: OrderDirection!) {\n  collection(channel: "default-channel", slug: $slug) {\n    products(first: 100, sortBy: {field: $sortBy, direction: $sortDirection}) {\n      edges {\n        node {\n          id\n          slug\n          name\n          isAvailableForPurchase\n          description\n          seoTitle\n          seoDescription\n          pricing {\n            priceRange {\n              start {\n                gross {\n                  currency\n                  amount\n                }\n              }\n              stop {\n                gross {\n                  currency\n                  amount\n                }\n              }\n            }\n          }\n          media {\n            url(size: 2160)\n            type\n            alt\n          }\n          collections {\n            name\n          }\n          updatedAt\n          variants {\n            ...Variant\n          }\n        }\n      }\n    }\n  }\n}',
): typeof import('./graphql').GetCollectionProductsBySlugDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'query GetCollections {\n  collections(channel: "default-channel", first: 100) {\n    edges {\n      node {\n        id\n        name\n        slug\n        description\n        seoTitle\n        seoDescription\n        products(first: 1, sortBy: {field: LAST_MODIFIED_AT, direction: DESC}) {\n          edges {\n            node {\n              updatedAt\n            }\n          }\n        }\n      }\n    }\n  }\n}',
): typeof import('./graphql').GetCollectionsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'query GetFeaturedProducts($first: Int!) {\n  products(first: $first, channel: "default-channel") {\n    edges {\n      node {\n        ...FeaturedProduct\n      }\n    }\n  }\n}',
): typeof import('./graphql').GetFeaturedProductsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'fragment MenuItem on MenuItem {\n  id\n  name\n  url\n  collection {\n    slug\n    products(first: 0) {\n      totalCount\n    }\n  }\n  category {\n    slug\n    products(channel: "default-channel", first: 0) {\n      totalCount\n    }\n  }\n  page {\n    slug\n  }\n}\n\nquery GetMenuBySlug($slug: String!) {\n  menu(slug: $slug, channel: "default-channel") {\n    id\n    slug\n    name\n    items {\n      ...MenuItem\n      children {\n        ...MenuItem\n        children {\n          ...MenuItem\n          children {\n            ...MenuItem\n          }\n        }\n      }\n    }\n  }\n}',
): typeof import('./graphql').MenuItemFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'query GetPageBySlug($slug: String!) {\n  page(slug: $slug) {\n    id\n    title\n    slug\n    content\n    seoTitle\n    seoDescription\n    created\n  }\n}',
): typeof import('./graphql').GetPageBySlugDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'query GetPages {\n  pages(first: 10) {\n    edges {\n      node {\n        id\n        title\n        slug\n        content\n        seoTitle\n        seoDescription\n        created\n      }\n    }\n  }\n}',
): typeof import('./graphql').GetPagesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'query GetProductBySlug($slug: String!) {\n  product(channel: "default-channel", slug: $slug) {\n    ...ProductDetails\n  }\n}',
): typeof import('./graphql').GetProductBySlugDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'query SearchProducts($search: String!, $sortBy: ProductOrderField!, $sortDirection: OrderDirection!) {\n  products(\n    first: 100\n    channel: "default-channel"\n    sortBy: {field: $sortBy, direction: $sortDirection}\n    filter: {search: $search}\n  ) {\n    edges {\n      node {\n        id\n        slug\n        name\n        isAvailableForPurchase\n        description\n        seoTitle\n        seoDescription\n        pricing {\n          priceRange {\n            start {\n              gross {\n                currency\n                amount\n              }\n            }\n            stop {\n              gross {\n                currency\n                amount\n              }\n            }\n          }\n        }\n        media {\n          url(size: 2160)\n          type\n          alt\n        }\n        collections {\n          name\n        }\n        updatedAt\n        variants {\n          ...Variant\n        }\n      }\n    }\n  }\n}',
): typeof import('./graphql').SearchProductsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'query GetProducts {\n  products(first: 10, channel: "default-channel") {\n    edges {\n      node {\n        name\n      }\n    }\n  }\n}',
): typeof import('./graphql').GetProductsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'subscription WebhookSubscription {\n  event {\n    ... on CategoryCreated {\n      __typename\n      category {\n        id\n        slug\n      }\n    }\n    ... on CategoryDeleted {\n      __typename\n      category {\n        id\n        slug\n      }\n    }\n    ... on CategoryUpdated {\n      __typename\n      category {\n        id\n        slug\n      }\n    }\n    ... on CollectionUpdated {\n      __typename\n      collection {\n        id\n        slug\n      }\n    }\n    ... on CollectionDeleted {\n      __typename\n      collection {\n        id\n        slug\n      }\n    }\n    ... on CollectionCreated {\n      __typename\n      collection {\n        id\n        slug\n      }\n    }\n    ... on ProductCreated {\n      __typename\n      product {\n        id\n        slug\n      }\n    }\n    ... on ProductDeleted {\n      __typename\n      product {\n        id\n        slug\n      }\n    }\n    ... on ProductUpdated {\n      __typename\n      product {\n        id\n        slug\n      }\n    }\n    ... on ProductVariantCreated {\n      __typename\n      productVariant {\n        product {\n          id\n          slug\n        }\n      }\n    }\n    ... on ProductVariantDeleted {\n      __typename\n      productVariant {\n        product {\n          id\n          slug\n        }\n      }\n    }\n    ... on ProductVariantUpdated {\n      __typename\n      productVariant {\n        product {\n          id\n          slug\n        }\n      }\n    }\n  }\n}',
): typeof import('./graphql').WebhookSubscriptionDocument;

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
