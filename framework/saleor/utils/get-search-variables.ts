import getSortVariables from './get-sort-variables'
import type { SearchProductsInput } from '../product/use-search'

export const getSearchVariables = ({
  categoryId,
  search,
  sort,
}: SearchProductsInput) => {
  return {
    categoryId,
    filter: { search, ...(categoryId && { collections: [categoryId] }) },
    sortBy: getSortVariables(sort),
  }
}

export default getSearchVariables
