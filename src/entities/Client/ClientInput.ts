import { InputType, Field } from 'type-graphql'
import { GenderType } from '../types'

@InputType()
export class ClientInput {
  @Field(() => String, { nullable: true })
  first_name?: String

  @Field(() => String, { nullable: true })
  last_name?: String

  @Field(() => GenderType, { nullable: true })
  gender?: GenderType
}
