import {
  BaseEntity, 
  Column, 
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { ObjectType, Field } from 'type-graphql'

@ObjectType({ description: 'Address of the user' })
export class Address extends BaseEntity {

  @Field(() => Number, { description: 'User of this address' })
  @Column()
  userId!: number

  @Field(() => String)
  @CreateDateColumn()
  createdAt = new Date()

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt = new Date()

  @Field(() => String, { nullable: true })
  @Column()
  country: String

  @Field(() => String, { nullable: true })
  @Column()
  state: String

  @Field(() => String, { nullable: true })
  @Column()
  city: String

  @Field(() => String, { nullable: true })
  @Column()
  street: String

  @Field(() => Number, { nullable: true })
  @Column()
  zipcode: number
}