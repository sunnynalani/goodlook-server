import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { ObjectType, Field } from 'type-graphql'

@ObjectType()
@Entity()
export class Provider extends BaseEntity {

  @PrimaryGeneratedColumn()
  @Field(() => Number)
  id!: number

  @Field(() => String)
  @CreateDateColumn()
  createdAt = new Date()

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt = new Date()

  @Field(() => String)
  @Column()
  providerName!: String

}