import { useMemo } from 'react'
import useCommerceCart, { FetchCartInput, UseCart } from '@commerce/cart/use-cart'

import { Cart } from '../types'
import { SWRHook } from '@commerce/utils/types'
import { checkoutCreate, checkoutToCart, getCheckoutId } from '../utils'
import * as query from '../utils/queries'

export default useCommerceCart as UseCart<typeof handler>

export const handler: SWRHook<Cart | null, {}, FetchCartInput, { isEmpty?: boolean }> = {
  fetchOptions: {
    query: query.CheckoutOne,
  },
  async fetcher({ input: { cartId: checkoutId }, options, fetch }) {
    let checkout

    if (checkoutId) {
      const checkoutId = getCheckoutId().checkoutToken
      const data = await fetch({
        ...options,
        variables: { checkoutId },
      })

      checkout = data
    }

    if (checkout?.completedAt || !checkoutId) {
      checkout = await checkoutCreate(fetch)
    }

    return checkoutToCart(checkout)
  },
  useHook:
    ({ useData }) =>
    (input) => {
      const response = useData({
        swrOptions: { revalidateOnFocus: false, ...input?.swrOptions },
      })
      return useMemo(
        () =>
          Object.create(response, {
            isEmpty: {
              get() {
                return (response.data?.lineItems.length ?? 0) <= 0
              },
              enumerable: true,
            },
          }),
        [response]
      )
    },
}
