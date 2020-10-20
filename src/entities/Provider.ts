import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm'
import { ObjectType, Field, ID } from 'type-graphql'

@ObjectType({
  description: 'The provider model'
})
@Entity()
export class Provider extends BaseEntity {

  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number

  @Field(() => Date)
  @CreateDateColumn()
  createdAt = new Date()

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt = new Date()

  @Field(() => String)
  @Column({ unique: true, nullable: true })
  email!: string

  @Field(() => String)
  @Column({ unique: true })
  username!: string

  //hash password using argon2
  @Column()
  password!: string

  @Field(() => String)
  @Column()
  name!: String

}