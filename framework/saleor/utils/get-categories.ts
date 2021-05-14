import { SaleorConfig } from '../api'
import getSiteCollectionsQuery from './queries/get-all-collections-query'

export type Category = {
  entityId: string
  name: string
  path: string
}

const getCategories = async (config: SaleorConfig): Promise<Category[]> => {
  const { data } = await config.fetch(getSiteCollectionsQuery, {
    variables: {
      first: 100,
    },
  })

  return (
    data.collections?.edges?.map(
      ({ node: { id: entityId, name, slug } }: any) => ({
        entityId,
        name,
        path: `/${slug}`,
      })
    ) ?? []
  )
}

export default getCategories
