import { ValidationError } from '@commerce/utils/errors'

export const throwUserErrors = (errors?: any[]) => {
  if (errors && errors.length) {
    throw new ValidationError({
      errors,
    })
  }
}

export default throwUserErrors
