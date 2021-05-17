import getSortVariables from './get-sort-variables'
import type { SearchProductsInput } from '../product/use-search'

export const getSearchVariables = ({
  brandId,
  search,
  categoryId,
  sort,
}: SearchProductsInput) => {
  return {
    categoryId,
    filter: { search },
    sortBy: getSortVariables(sort),
  }
}

export default getSearchVariables
