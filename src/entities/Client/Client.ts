import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany,
  ManyToOne,
} from 'typeorm'
import { GenderType } from '../types'
import { ObjectType, Field, ID, Int } from 'type-graphql'
import { Length, IsDate, IsEmail } from 'class-validator'
import { Review } from '../Review'
import { Provider } from '../Provider'

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

  //hash password using argon2
  @Length(8, 20)
  @Column()
  password!: string

  @Field(() => String, { nullable: true })
  @Length(0, 20)
  @Column({ nullable: true, default: null })
  first_name: String

  @Field(() => String, { nullable: true })
  @Length(0, 20)
  @Column({ nullable: true, default: null })
  last_name!: String

  @Field(() => [Review], { nullable: true })
  @OneToMany(() => Review, (review) => review.client, {
    cascade: true,
    eager: true,
  })
  reviews: Review[]

  @Field(() => [Client], { nullable: true })
  @OneToMany(() => Client, (client) => client.following)
  followers: Client[]

  @Field(() => [Client], { nullable: true })
  @ManyToOne(() => Client, (client) => client.followers)
  following: Client[]

  @Field(() => [Provider], { nullable: true })
  @OneToMany(() => Provider, (provider) => provider.favorited_by)
  favorites: Provider[]

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @Column({ default: 0 })
  review_count: number

  @Field(() => GenderType, { nullable: true })
  @Column({ nullable: true, default: GenderType.OTHER })
  gender: GenderType
}
