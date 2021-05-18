import { useCallback } from 'react'
import type { MutationHook } from '@commerce/utils/types'
import { CommerceError } from '@commerce/utils/errors'
import useSignup, { UseSignup } from '@commerce/auth/use-signup'
import useCustomer from '../customer/use-customer'
import {
  AccountRegisterInput,
  Mutation,
  MutationAccountRegisterArgs,
} from '../schema'

import { customerCreateMutation } from '../utils/mutations'
import { handleAutomaticLogin, throwUserErrors } from '../utils'

export default useSignup as UseSignup<typeof handler>

export const handler: MutationHook<null, {}, any, AccountRegisterInput> = {
  fetchOptions: {
    query: customerCreateMutation,
  },
  async fetcher({ input: { email, password }, options, fetch }) {
    if (!(email && password)) {
      throw new CommerceError({
        message:
          'A first name, last name, email and password are required to signup',
      })
    }

    const { customerCreate } = await fetch<
      Mutation,
      MutationAccountRegisterArgs
    >({
      ...options,
      variables: {
        input: {
          email,
          password,
        },
      },
    })

    throwUserErrors(customerCreate?.errors)
    await handleAutomaticLogin(fetch, { email, password })

    return null
  },
  useHook:
    ({ fetch }) =>
    () => {
      const { revalidate } = useCustomer()

      return useCallback(
        async function signup(input) {
          const data = await fetch({ input })
          await revalidate()
          return data
        },
        [fetch, revalidate]
      )
    },
}
