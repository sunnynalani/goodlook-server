import { Field, ObjectType } from 'type-graphql'
import { Review } from '..'
import { FieldError } from '../types/FieldError'

@ObjectType()
export class ReviewResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => Review, { nullable: true })
  review?: Review
}

@ObjectType()
export class ReviewsResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => [Review], { nullable: true })
  reviews?: Review[]
}
