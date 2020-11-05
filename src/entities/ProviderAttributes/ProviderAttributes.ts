import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { IsDate } from 'class-validator'
import { ObjectType, Field, ID } from 'type-graphql'

@ObjectType({ description: 'attributes of the provider' })
@Entity()
export class ProviderAttributes extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number

  @Field(() => Date, { nullable: true })
  @IsDate()
  @CreateDateColumn()
  createdAt = new Date()

  @Field(() => Date, { nullable: true })
  @IsDate()
  @UpdateDateColumn()
  updatedAt = new Date()

  @Field(() => Boolean, { nullable: true })
  @Column({ default: false })
  bikeParking: Boolean

  @Field(() => Boolean, { nullable: true })
  @Column({ default: false })
  acceptsBitcoin: Boolean

  @Field(() => Boolean, { nullable: true })
  @Column({ default: false })
  acceptsCreditCards: Boolean

  @Field(() => Boolean, { nullable: true })
  @Column({ default: false })
  garageParking: Boolean

  @Field(() => Boolean, { nullable: true })
  @Column({ default: false })
  streetParking: Boolean

  @Field(() => Boolean, { nullable: true })
  @Column({ default: false })
  dogsAllowed: Boolean

  @Field(() => Boolean, { nullable: true })
  @Column({ default: false })
  wheelchairAccessible: Boolean

  @Field(() => Boolean, { nullable: true })
  @Column({ default: false })
  valetParking: Boolean

  @Field(() => Boolean, { nullable: true })
  @Column({ default: false })
  parkingLot: Boolean
}
