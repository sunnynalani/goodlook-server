import { registerEnumType } from "type-graphql"

//i'm not to sure...
export enum GenderType {
  MALE,
  FEMALE,
  OTHER,
}

registerEnumType(GenderType, {
  name: "UserType",
  description: "Type of User",
})