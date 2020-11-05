import { InputType, Field, Int } from 'type-graphql'

@InputType()
export class ReviewInput {
  @Field(() => Int, { nullable: true })
  rating: number

  @Field(() => String, { nullable: true })
  text: String
}
