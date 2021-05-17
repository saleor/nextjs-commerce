import { CommerceError } from '@commerce/utils/errors'
import { Fetcher } from '@commerce/utils/types'
import { API_URL } from './const'
import { getToken, handleFetchResponse } from './utils'

const fetcher: Fetcher = async ({
  url = API_URL,
  method = 'POST',
  variables,
  query,
}) => {
  const token = getToken()

  try {
    return handleFetchResponse(
      await fetch(url!, {
        method,
        body: JSON.stringify({ query, variables }),
        headers: {
          Authorization: `JWT ${token}`,
          'Content-Type': 'application/json',
        },
      })
    )
  } catch (error) {
    console.error(error)
    throw new CommerceError({ message: error?.message || 'Internal Error' })
  }
}

export default fetcher
