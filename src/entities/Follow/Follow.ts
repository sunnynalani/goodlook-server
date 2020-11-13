import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Field, ObjectType } from 'type-graphql'
import { Client } from '../Client'

@ObjectType({
  description: 'The client model',
})
@Entity()
export class Follow extends BaseEntity {
  @PrimaryGeneratedColumn()
  followId!: number

  @PrimaryGeneratedColumn()
  followedId!: number

  @Field(() => Client, { nullable: true })
  @ManyToOne(() => Client, (client) => client.following, {
    primary: true,
  })
  @JoinColumn({ name: 'followId' })
  following: Promise<Client>

  @Field(() => Client, { nullable: true })
  @ManyToOne(() => Client, (client) => client.followers, {
    primary: true,
  })
  @JoinColumn({ name: 'followedId' })
  followers: Promise<Client>
}
