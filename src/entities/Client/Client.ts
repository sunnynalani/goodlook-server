import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany,
} from 'typeorm'
import { GenderType } from '../types'
import { ObjectType, Field, ID, Int } from 'type-graphql'
import { Review } from '../Review'

@ObjectType({
  description: 'The client model',
})
@Entity()
export class Client extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number

  @Field(() => Date, { nullable: true })
  @CreateDateColumn()
  createdAt = new Date()

  @Field(() => Date, { nullable: true })
  @UpdateDateColumn()
  updatedAt = new Date()

  @Field(() => String)
  @Column({ unique: true, nullable: true })
  email!: String

  @Field(() => String)
  @Column({ unique: true })
  username!: String

  //hash password using argon2
  @Column()
  password!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true, default: null })
  firstName: String

  @Field(() => String, { nullable: true })
  @Column({ nullable: true, default: null })
  lastName!: String

  @Field(() => [Review], { nullable: true })
  @OneToMany(() => Review, (review) => review.client)
  reviews: Review[]

  @Field(() => Int, { nullable: true })
  @Column({ default: 0 })
  reviewCount: Number

  @Field(() => GenderType, { nullable: true })
  @Column({ nullable: true, default: null })
  gender: GenderType
}
