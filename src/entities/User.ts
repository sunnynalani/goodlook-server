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
import { Client, Provider, Address } from './index'
import { UserType } from '../types'
import { ObjectType, Field } from 'type-graphql'

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

  @Field(() => UserType, { nullable: true })
  @Column()
  userType!: UserType

  @Field(() => Client)
  @OneToOne(() => Client, client => client.userId, { nullable: true, cascade: true })
  @JoinColumn()
  client: Client

  @Field(() => Provider)
  @OneToOne(() => Provider, provider => provider.userId, { nullable: true, cascade: true })
  @JoinColumn()
  provider: Provider

  @Field(() => Address)
  @OneToOne(() => Address, address => address.userId, { nullable: true, cascade: true })
  @JoinColumn()
  address: Address

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