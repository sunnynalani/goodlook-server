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
import { ObjectType, Field, ID } from 'type-graphql'
import { ProviderAttributes } from '../ProviderAttributes'

@ObjectType({
  description: 'The provider model',
})
@Entity()
export class Provider extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number

  @Field(() => Date, { nullable: true })
  @CreateDateColumn()
  createdAt = new Date()

  @Field(() => Date, { nullable: true })
  @UpdateDateColumn()
  updatedAt = new Date()

  @Field(() => String)
  @Column({ unique: true, nullable: true })
  email!: String

  @Field(() => String)
  @Column({ unique: true })
  username!: String

  @Column()
  password!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true, default: null })
  name!: String

  @Field(() => String, { nullable: true })
  @Column({ nullable: true, default: null })
  country: String

  @Field(() => String, { nullable: true })
  @Column({ nullable: true, default: null })
  state: String

  @Field(() => String, { nullable: true })
  @Column({ nullable: true, default: null })
  city: String

  @Field(() => String, { nullable: true })
  @Column({ nullable: true, default: null })
  street: String

  @Field(() => Number, { nullable: true })
  @Column({ nullable: true, default: null })
  zipcode: number

  @Field(() => Number, { nullable: true })
  @Column({ nullable: true, default: null })
  longitude: number

  @Field(() => Number, { nullable: true })
  @Column({ nullable: true, default: null })
  latitude: number

  @Field(() => [String], { nullable: true })
  @Column('text', { nullable: true, array: true, default: {} })
  categories: String[]

  @Field(() => [String], { nullable: true })
  @Column('text', { nullable: true, array: true, default: {} })
  tags: String[]

  @Field(() => ProviderAttributes, { nullable: true })
  @OneToOne(() => ProviderAttributes)
  @JoinColumn()
  attributes: ProviderAttributes
}
