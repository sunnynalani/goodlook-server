import { Entity } from './Entity'
import { InterfaceType, Field } from 'type-graphql'
import { Column } from 'typeorm'

@InterfaceType({ implements: Entity })
export abstract class User extends Entity {
  @Field(() => String)
  @Column({ unique: true, nullable: true })
  email!: string
}
