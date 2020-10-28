import { InputType, Field } from 'type-graphql'
import { GenderType } from '../types'

@InputType()
export class ClientInput {
  @Field(() => String, { nullable: true })
  firstName?: String

  @Field(() => String, { nullable: true })
  lastName?: String

  @Field(() => GenderType, { nullable: true })
  gender?: GenderType
}
