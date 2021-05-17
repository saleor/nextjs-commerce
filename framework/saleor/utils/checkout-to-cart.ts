import { Cart } from '../types'

import {
  CheckoutLinesAdd,
  CheckoutLinesUpdate,
  CheckoutCreate,
  CheckoutError,
  Checkout,
  Maybe,
} from '../schema'

import { normalizeCart } from './normalize'
import throwUserErrors from './throw-user-errors'
import getCheckoutId from './get-checkout-id'

export type CheckoutQuery = {
  checkout: Checkout
  errors?: Array<CheckoutError>
}

export type CheckoutPayload =
  | CheckoutLinesAdd
  | CheckoutLinesUpdate
  | CheckoutCreate
  | CheckoutQuery

const emptyCart = {
  id: getCheckoutId().checkoutId,
  lineItems: [],
  lineItemsSubtotalPrice: 0,
  createdAt: new Date().toDateString(),
  currency: { code: 'USD' },
  subtotalPrice: 0,
  taxesIncluded: false,
  totalPrice: 0,
}

const checkoutToCart = (checkoutPayload?: Maybe<CheckoutPayload>): Cart => {
  const checkout = checkoutPayload?.checkout
  throwUserErrors(checkoutPayload?.errors)

  // when last item is deleted mutations returns null checkout
  return checkoutPayload?.checkout
    ? normalizeCart(checkoutPayload?.checkout)
    : emptyCart
}

export default checkoutToCart
