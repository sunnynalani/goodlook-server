import { InterfaceType, Field, ID } from 'type-graphql'
import { 
  BaseEntity, 
  CreateDateColumn, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn 
} from 'typeorm'

/**
 * I'll experiment later...
 * No interface for client and provider for now...
 */

@InterfaceType()
export abstract class Entity extends BaseEntity {

  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number

  @Field(() => Date)
  @CreateDateColumn()
  createdAt = new Date()

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt = new Date()

}