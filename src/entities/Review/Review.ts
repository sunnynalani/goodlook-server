import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BaseEntity,
  JoinColumn,
  OneToOne,
} from 'typeorm'
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
  @OneToOne(() => Client)
  @JoinColumn()
  client: Client

  @Field(() => Provider, { nullable: true })
  @OneToOne(() => Provider)
  @JoinColumn()
  provider: Provider

  @Field(() => Date, { nullable: true })
  @CreateDateColumn()
  createdAt = new Date()

  @Field(() => Date, { nullable: true })
  @UpdateDateColumn()
  updatedAt = new Date()

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true, default: null })
  rating: Number

  @Field(() => String, { nullable: true })
  @Column({ nullable: true, default: null })
  text: String
}
