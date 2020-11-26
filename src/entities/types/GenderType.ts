import { registerEnumType } from 'type-graphql'

//i'm not to sure...
export enum GenderType {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

registerEnumType(GenderType, {
  name: 'GenderType',
  description: 'Gender of User',
})
