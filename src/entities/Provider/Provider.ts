import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany,
} from 'typeorm'
import { ObjectType, Field, ID, Int } from 'type-graphql'
import { IsInt, Length, IsDate, IsEmail } from 'class-validator'
import { Review } from '../Review'
import { Client } from '../Client'

@ObjectType({
  description: 'The provider model',
})
@Entity()
export class Provider extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number

  @Field(() => Date, { nullable: true })
  @IsDate()
  @CreateDateColumn()
  created_at = new Date()

  @Field(() => Date, { nullable: true })
  @IsDate()
  @UpdateDateColumn()
  updated_at = new Date()

  @Field(() => String)
  @IsEmail()
  @Column({ unique: true, nullable: true })
  email!: String

  @Field(() => String)
  @Length(0, 12)
  @Column({ unique: true })
  username!: String

  @Length(8, 20)
  @Column()
  password!: string

  @Field(() => String, { nullable: true })
  @Length(0, 20)
  @Column({ nullable: true, default: null })
  name!: String

  @Field(() => String, { nullable: true })
  @Column({ nullable: true, default: null })
  country: String

  @Field(() => String, { nullable: true })
  @Column({ nullable: true, default: null })
  state: String

  @Field(() => String, { nullable: true })
  @Column({ nullable: true, default: null })
  city: String

  @Field(() => String, { nullable: true })
  @Column({ nullable: true, default: null })
  street: String

  @Field(() => Number, { nullable: true })
  @IsInt()
  @Length(5, 5)
  @Column({ nullable: true, default: null })
  zipcode: number

  @Field(() => Number, { nullable: true })
  @Column({ type: 'float', nullable: true, default: null })
  longitude: number

  @Field(() => Number, { nullable: true })
  @Column({ type: 'float', nullable: true, default: null })
  latitude: number

  @Field(() => [Review], { nullable: true })
  @OneToMany(() => Review, (review) => review.provider, {
    cascade: true,
    eager: true,
  })
  reviews: Review[]

  @Field(() => [Client], { nullable: true })
  @OneToMany(() => Client, (client) => client.favorites, {
    cascade: true,
    eager: true,
  })
  favorited_by: Client[]

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @Column({ default: 0 })
  average_rating: number

  @Field(() => [String], { nullable: true })
  @Column('text', { nullable: true, array: true, default: {} })
  categories: String[]

  @Field(() => [String], { nullable: true })
  @Column('text', { nullable: true, array: true, default: {} })
  tags: String[]

  @Field(() => Boolean, { nullable: true })
  @Column({ default: false })
  bike_parking: Boolean

  @Field(() => Boolean, { nullable: true })
  @Column({ default: false })
  accepts_bitcoin: Boolean

  @Field(() => Boolean, { nullable: true })
  @Column({ default: false })
  accepts_credit_cards: Boolean

  @Field(() => Boolean, { nullable: true })
  @Column({ default: false })
  garage_parking: Boolean

  @Field(() => Boolean, { nullable: true })
  @Column({ default: false })
  street_parking: Boolean

  @Field(() => Boolean, { nullable: true })
  @Column({ default: false })
  dogs_allowed: Boolean

  @Field(() => Boolean, { nullable: true })
  @Column({ default: false })
  wheelchair_accessible: Boolean

  @Field(() => Boolean, { nullable: true })
  @Column({ default: false })
  valet_parking: Boolean

  @Field(() => Boolean, { nullable: true })
  @Column({ default: false })
  parking_lot: Boolean

  @Field(() => Boolean, { nullable: true })
  @Column({ default: false })
  licensed: Boolean

  @Field(() => Boolean, { nullable: true })
  @Column({ default: false })
  flexible_timing: Boolean
}
