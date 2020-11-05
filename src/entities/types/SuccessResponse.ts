import { Field, ObjectType } from 'type-graphql'
import { FieldError } from '../types/FieldError'

@ObjectType()
export class SuccessResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => Boolean)
  success?: Boolean
}
