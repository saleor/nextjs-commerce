import { API_CHANNEL } from '@framework/const'

const getSortVariables = (sort?: string) => {
  const channel = API_CHANNEL

  let output
  switch (sort) {
    case 'price-asc':
      output = {
        field: 'MINIMAL_PRICE',
        direction: 'ASC',
        channel,
      }
      break
    case 'price-desc':
      output = {
        field: 'MINIMAL_PRICE',
        direction: 'DESC',
        channel,
      }
      break
    case 'trending-desc':
      output = {
        field: 'DATE',
        direction: 'DESC',
        channel,
      }
      break

    case 'latest-asc':
      output = {
        field: 'DATE',
        direction: 'ASC',
        channel,
      }
      break

    case 'latest-desc':
    default:
      output = {
        field: 'DATE',
        direction: 'DESC',
        channel,
      }
  }

  return output
}

export default getSortVariables
