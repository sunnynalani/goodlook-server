import { InputType, Field } from 'type-graphql'

@InputType()
export class ProviderInput {
  @Field(() => Date)
  createdAt = new Date()

  @Field(() => Date)
  updatedAt = new Date()

  @Field(() => String)
  name!: String
}
