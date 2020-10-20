import { Field, ObjectType } from "type-graphql"
import { Provider } from ".."
import { FieldError } from "./FieldError"

@ObjectType()
export class ProviderResponse {
  @Field(() => [FieldError], {nullable: true})
  errors?: FieldError[]

  @Field(() => Provider, {nullable: true})
  provider?: Provider
}

@ObjectType()
export class ProvidersResponse {
  @Field(() => [FieldError], {nullable: true})
  errors?: FieldError[]

  @Field(() => [Provider], {nullable: true})
  providers?: Provider[]
}

