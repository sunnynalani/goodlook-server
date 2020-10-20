import { Field, ObjectType } from "type-graphql"
import { Client } from ".."
import { FieldError } from "./FieldError"

@ObjectType()
export class ClientResponse {
  @Field(() => [FieldError], {nullable: true})
  errors?: FieldError[]

  @Field(() => Client, {nullable: true})
  client?: Client
}

@ObjectType()
export class ClientsResponse {
  @Field(() => [FieldError], {nullable: true})
  errors?: FieldError[]

  @Field(() => [Client], {nullable: true})
  clients?: Client[]
}
