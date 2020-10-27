import { InputType, Field } from 'type-graphql'
import { GenderType } from '../types'

@InputType()
export class ClientInput {
  @Field(() => Date, { nullable: true })
  createdAt? = new Date()

  @Field(() => Date, { nullable: true })
  updatedAt? = new Date()

  @Field(() => String, { nullable: true })
  firstName?: string

  @Field(() => String, { nullable: true })
  lastName?: string

  @Field(() => GenderType, { nullable: true })
  gender?: GenderType
}
