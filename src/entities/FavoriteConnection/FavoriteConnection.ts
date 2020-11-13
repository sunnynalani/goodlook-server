import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Field, ObjectType } from 'type-graphql'
import { Provider } from '../Provider'
import { Client } from '../Client'

@ObjectType({
  description: 'The client model',
})
@Entity()
export class FavoriteConnection extends BaseEntity {
  @PrimaryGeneratedColumn()
  clientId!: number

  @PrimaryGeneratedColumn()
  providerId!: number

  @Field(() => Client, { nullable: true })
  @ManyToOne(() => Client, (client) => client.favorite_providers, {
    primary: true,
  })
  @JoinColumn({ name: 'clientId' })
  client: Promise<Client>

  @Field(() => Provider, { nullable: true })
  @ManyToOne(() => Provider, (provider) => provider.favorited_clients, {
    primary: true,
  })
  @JoinColumn({ name: 'providerId' })
  provider: Promise<Provider>
}
