export const getSortVariables = (sort?: string) => {
  let output = {}
  switch (sort) {
    case 'price-asc':
      output = {
        field: 'PRICE',
        direction: 'ASC',
      }
      break
    case 'price-desc':
      output = {
        field: 'PRICE',
        direction: 'DESC',
      }
      break
    case 'trending-desc':
      output = {
        field: 'RANK',
        direction: 'DESC',
      }
      break
    case 'latest-desc':
      output = {
        field: 'DATE',
        direction: 'DESC',
      }
      break
  }
  return output
}
