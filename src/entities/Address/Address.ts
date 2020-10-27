import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { ObjectType, Field, ID } from 'type-graphql'
import { Provider } from '..'

@ObjectType({ description: 'Address of the user' })
@Entity()
export class Address extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number

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
