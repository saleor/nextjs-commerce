import { SWRHook } from '@commerce/utils/types'
import { Product } from '@commerce/types'
import useSearch, { UseSearch } from '@commerce/product/use-search'

import { ProductCountableEdge } from '../schema'
import { getSearchVariables, normalizeProduct } from '../utils'

import * as query from '../utils/queries'

export default useSearch as UseSearch<typeof handler>

export type SearchProductsInput = {
  search?: string
  categoryId?: string
  brandId?: string
  sort?: string
}

export type SearchProductsData = {
  products: Product[]
  found: boolean
}

export const handler: SWRHook<SearchProductsData, SearchProductsInput, SearchProductsInput> = {
  fetchOptions: {
    query: query.ProductMany,
  },
  async fetcher({ input, options, fetch }) {
    const data = await fetch({
      query: categoryId ? query.CollectionOne : options.query,
      method: options?.method,
      variables: getSearchVariables(input),
    })

    let edges

    if (categoryId) {
      edges = data.collection?.products?.edges ?? []
      // FIXME @zaiste, no `vendor` in Saleor
      // if (brandId) {
      //   edges = edges.filter(
      //     ({ node: { vendor } }: ProductCountableEdge) =>
      //       vendor.replace(/\s+/g, '-').toLowerCase() === brandId
      //   )
      // }
    } else {
      edges = data.products?.edges ?? []
    }

    return {
      products: edges.map(({ node }: ProductCountableEdge) => normalizeProduct(node)),
      found: !!edges.length,
    }
  },
  useHook:
    ({ useData }) =>
    (input = {}) => {
      return useData({
        input: [
          ['search', input.search],
          ['categoryId', input.categoryId],
          ['brandId', input.brandId],
          ['sort', input.sort],
        ],
        swrOptions: {
          revalidateOnFocus: false,
          ...input.swrOptions,
        },
      })
    },
}
