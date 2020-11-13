import { Field, ObjectType } from 'type-graphql'
import { FieldError } from '../types/FieldError'
import { FavoriteConnection } from './FavoriteConnection'

@ObjectType()
export class FavoriteResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => [FavoriteConnection], { nullable: true })
  favorites?: FavoriteConnection[]
}
