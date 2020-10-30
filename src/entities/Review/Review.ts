import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
} from 'typeorm'
import { IsInt, Length, IsDate, Min, Max } from 'class-validator'
import { ObjectType, Field, ID, Int } from 'type-graphql'
import { Provider } from '../Provider'
import { Client } from '../Client'

@ObjectType({
  description: 'The review model',
})
@Entity()
export class Review extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number

  @Field(() => Client, { nullable: true })
  @ManyToOne(() => Client, (client) => client.reviews)
  client: Client

  @Field(() => Provider, { nullable: true })
  @ManyToOne(() => Provider, (provider) => provider.reviews)
  provider: Provider

  @Field(() => Date, { nullable: true })
  @IsDate()
  @CreateDateColumn()
  createdAt = new Date()

  @Field(() => Date, { nullable: true })
  @IsDate()
  @UpdateDateColumn()
  updatedAt = new Date()

  @Field(() => Int, { nullable: true })
  @IsInt()
  @Min(0)
  @Max(5)
  @Column({ type: 'integer', nullable: true, default: null })
  rating: Number

  @Field(() => String, { nullable: true })
  @Length(0, 300)
  @Column({ type: 'text', nullable: true, default: null })
  text: String
}
