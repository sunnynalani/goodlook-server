import { InputType, Field } from 'type-graphql'

@InputType()
export class AttributesInput {
  @Field(() => Boolean, { nullable: true })
  bike_parking?: Boolean

  @Field(() => Boolean, { nullable: true })
  accepts_bitcoin?: Boolean

  @Field(() => Boolean, { nullable: true })
  accepts_credit_cards?: Boolean

  @Field(() => Boolean, { nullable: true })
  garage_parking?: Boolean

  @Field(() => Boolean, { nullable: true })
  street_parking?: Boolean

  @Field(() => Boolean, { nullable: true })
  dogs_allowed?: Boolean

  @Field(() => Boolean, { nullable: true })
  wheelchair_accessible?: Boolean

  @Field(() => Boolean, { nullable: true })
  valet_parking?: Boolean

  @Field(() => Boolean, { nullable: true })
  parking_lot?: Boolean

  @Field(() => Boolean, { nullable: true })
  licensed: Boolean

  @Field(() => Boolean, { nullable: true })
  flexible_timing: Boolean
}
