import { InputType, Field } from 'type-graphql'

@InputType()
export class AddressInput {
  @Field(() => String, { nullable: true })
  country?: String

  @Field(() => String, { nullable: true })
  state?: String

  @Field(() => String, { nullable: true })
  city?: String

  @Field(() => String, { nullable: true })
  street?: String

  @Field(() => Number, { nullable: true })
  zipcode?: number
}
