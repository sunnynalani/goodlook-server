import { InputType, Field } from 'type-graphql'

@InputType()
export class ReviewInput {
  @Field(() => Number, { nullable: true })
  rating: Number

  @Field(() => String, { nullable: true })
  text: String
}
