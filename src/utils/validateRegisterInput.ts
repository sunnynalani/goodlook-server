import { UsernamePasswordInput } from '../entities/types/UsernamePasswordInput'

export const validateRegisterInputs = (input: UsernamePasswordInput) => {
  const aggeragateErrors = []
  if (!input.email.includes('@')) {
    aggeragateErrors.push({
      field: 'email',
      message: 'invalid email',
    })
  }

  if (input.username.includes('@')) {
    aggeragateErrors.push({
      field: 'username',
      message: 'username can not have symbols',
    })
  }

  if (input.username.length <= 2) {
    aggeragateErrors.push({
      field: 'username',
      message: 'length must be greater than 2',
    })
  }

  if (input.password.length <= 2) {
    aggeragateErrors.push({
      field: 'password',
      message: 'length must be greater than 2',
    })
  }

  return aggeragateErrors.length ? aggeragateErrors : null
}
