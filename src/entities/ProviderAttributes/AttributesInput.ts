import { InputType, Field } from 'type-graphql'

@InputType()
export class AttributesInput {
  @Field(() => Boolean, { nullable: true })
  bikeParking?: Boolean

  @Field(() => Boolean, { nullable: true })
  acceptsBitcoin?: Boolean

  @Field(() => Boolean, { nullable: true })
  acceptsCreditCards?: Boolean

  @Field(() => Boolean, { nullable: true })
  garageParking?: Boolean

  @Field(() => Boolean, { nullable: true })
  streetParking?: Boolean

  @Field(() => Boolean, { nullable: true })
  dogsAllowed?: Boolean

  @Field(() => Boolean, { nullable: true })
  wheelchairAccessible?: Boolean

  @Field(() => Boolean, { nullable: true })
  valetParking?: Boolean

  @Field(() => Boolean, { nullable: true })
  parkingLot?: Boolean
}
