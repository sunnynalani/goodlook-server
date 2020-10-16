import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm'
import { Client, Provider } from './index'
import { ObjectType, Field } from 'type-graphql'

//i'm not to sure...
enum UserType {
  CLIENT,
  PROVIDER,
}

@ObjectType()
@Entity()
export class User extends BaseEntity {

  @Field()
  @PrimaryGeneratedColumn()
  id!: number

  @Field(() => String)
  @CreateDateColumn()
  createdAt = new Date()

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt = new Date()

  @Field(() => UserType)
  @Column()
  userType!: UserType

  @OneToOne(type => Client)
  @JoinColumn


  @Field(() => String)
  @Column({ unique: true, nullable: true })
  email!: string

  @Field(() => String)
  @Column({ unique: true })
  username!: string

  //hash password using argon2
  @Column()
  password!: string

}