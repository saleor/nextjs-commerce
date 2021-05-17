import { Cart } from '../types'

import {
  CheckoutLinesAdd,
  CheckoutLinesUpdate,
  CheckoutCreate,
  CheckoutError,
  Checkout,
  Maybe,
  CheckoutLineDelete,
} from '../schema'

import { normalizeCart } from './normalize'
import throwUserErrors from './throw-user-errors'
import { CommerceError } from '@commerce/utils/errors'

export type CheckoutQuery = {
  checkout: Checkout
  errors?: Array<CheckoutError>
}

export type CheckoutPayload =
  | CheckoutLinesAdd
  | CheckoutLinesUpdate
  | CheckoutLineDelete
  | CheckoutCreate
  | CheckoutQuery

const checkoutToCart = (checkoutPayload?: Maybe<CheckoutPayload>): Cart => {
  const checkout = checkoutPayload?.checkout
  throwUserErrors(checkoutPayload?.errors)

  if (!checkout) {
    throw new CommerceError({
      message: 'Missing checkout object from response',
    })
  }
  // when last item is deleted mutations returns null checkout
  return normalizeCart(checkout)
}

export default checkoutToCart
