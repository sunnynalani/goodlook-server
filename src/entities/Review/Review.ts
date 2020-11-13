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
  created_at = new Date()

  @Field(() => Date, { nullable: true })
  @IsDate()
  @UpdateDateColumn()
  updated_at = new Date()

  @Field(() => Int, { nullable: true })
  @IsInt()
  @Min(0)
  @Max(5)
  @Column({ type: 'integer', default: 0 })
  rating: number

  @Field(() => String, { nullable: true })
  @Length(0, 300)
  @Column({ type: 'text', default: '' })
  text: String
}
