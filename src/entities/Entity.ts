/**
import { InterfaceType, Field, ID } from 'type-graphql'
import {
  BaseEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'


 * I'll experiment later...
 * No interface for client and provider for now...


@InterfaceType()
export abstract class Entity {
  @Field(() => ID)
  id!: number

  @Field(() => Date)
  createdAt = new Date()

  @Field(() => Date)
  updatedAt = new Date()
}
 */
