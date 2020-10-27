import { registerEnumType } from 'type-graphql'

//i'm not to sure...
export enum UserType {
  CLIENT,
  PROVIDER,
}

registerEnumType(UserType, {
  name: 'UserType',
  description: 'Type of User',
})
