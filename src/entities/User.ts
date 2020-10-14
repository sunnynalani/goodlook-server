import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import { ObjectType, Field } from 'type-graphql'

@ObjectType()
@Entity()
export class User {

  @Field()
  @PrimaryKey()
  id!: number

  @Field(() => String)
  @Property({ type: 'date' })
  createdAt = new Date()

  @Field(() => String)
  @Property({ type: 'date', onUpdate: () => new Date() })
  updatedAt = new Date()

  @Field(() => String)
  @Property({ type: 'text', unique: true })
  username!: string

  //hash password using argon2
  @Property({ type: 'text' })
  password!: string

}