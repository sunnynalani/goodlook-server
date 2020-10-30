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
import { IsInt, Length, IsDate, IsEmail } from 'class-validator'
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
  @IsDate()
  @CreateDateColumn()
  createdAt = new Date()

  @Field(() => Date, { nullable: true })
  @IsDate()
  @UpdateDateColumn()
  updatedAt = new Date()

  @Field(() => String)
  @IsEmail()
  @Column({ unique: true, nullable: true })
  email!: String

  @Field(() => String)
  @Length(0, 12)
  @Column({ unique: true })
  username!: String

  //hash password using argon2
  @Length(8, 20)
  @Column()
  password!: string

  @Field(() => String, { nullable: true })
  @Length(0, 20)
  @Column({ nullable: true, default: null })
  firstName: String

  @Field(() => String, { nullable: true })
  @Length(0, 20)
  @Column({ nullable: true, default: null })
  lastName!: String

  @Field(() => [Review], { nullable: true })
  @OneToMany(() => Review, (review) => review.client)
  reviews: Review[]

  @Field(() => Int, { nullable: true })
  @IsInt()
  @Column({ default: 0 })
  reviewCount: Number

  @Field(() => GenderType, { nullable: true })
  @Column({ nullable: true, default: null })
  gender: GenderType
}
