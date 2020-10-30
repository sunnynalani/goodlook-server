import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BaseEntity,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm'
import { ObjectType, Field, ID } from 'type-graphql'
import { IsInt, Length, IsDate, IsEmail } from 'class-validator'
import { ProviderAttributes } from '../ProviderAttributes'
import { Review } from '../Review'

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
  @Column({ nullable: true, default: null })
  longitude: number

  @Field(() => Number, { nullable: true })
  @Column({ nullable: true, default: null })
  latitude: number

  @Field(() => [Review], { nullable: true })
  @OneToMany(() => Review, (review) => review.client, { nullable: true })
  reviews: Review[]

  @Field(() => [String], { nullable: true })
  @Column('text', { nullable: true, array: true, default: {} })
  categories: String[]

  @Field(() => [String], { nullable: true })
  @Column('text', { nullable: true, array: true, default: {} })
  tags: String[]

  @Field(() => ProviderAttributes, { nullable: true })
  @OneToOne(() => ProviderAttributes)
  @JoinColumn()
  attributes: ProviderAttributes
}
