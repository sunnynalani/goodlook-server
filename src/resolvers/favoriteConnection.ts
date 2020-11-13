import { Resolver, Mutation, Arg, Query } from 'type-graphql'
import { Client, FavoriteConnection, Provider } from '../entities'
import { SuccessResponse } from '../entities/types'

@Resolver(FavoriteConnection)
export class FavoriteResolver {
  @Mutation(() => SuccessResponse)
  async addFavorite(
    @Arg('clientId') clientId: number,
    @Arg('providerId') providerId: number
  ): Promise<SuccessResponse> {
    const client = await Client.findOne(clientId)
    const provider = await Provider.findOne(providerId)
    const aggregateErrors = []
    if (!client) {
      aggregateErrors.push({
        field: 'clientId',
        message: 'clientId does not exist',
      })
    }
    if (!provider) {
      aggregateErrors.push({
        field: 'providerId',
        message: 'providerId does not exist',
      })
    }
    if (aggregateErrors.length > 0) return { errors: aggregateErrors }
    await FavoriteConnection.create({ clientId, providerId }).save()
    return { success: true }
  }

  @Query(() => [Provider])
  async favorites(@Arg('clientId') clientId: number): Promise<Provider[]> {
    const providers: Provider[] = []
    await FavoriteConnection.find({
      where: {
        clientId: clientId,
      },
      relations: ['provider'],
    }).then((favorites) => {
      favorites.forEach(async (favorite) =>
        providers.push(await favorite.provider)
      )
    })
    return providers
  }

  @Query(() => [Client])
  async favorited(@Arg('providerId') providerId: number): Promise<Client[]> {
    const clients: Client[] = []
    await FavoriteConnection.find({
      where: {
        providerId: providerId,
      },
      relations: ['client'],
    }).then((favorites) => {
      favorites.forEach(async (favorite) => clients.push(await favorite.client))
    })
    return clients
  }

  @Mutation(() => SuccessResponse)
  async deleteFavorite(
    @Arg('clientId') clientId: number,
    @Arg('providerId') providerId: number
  ): Promise<SuccessResponse> {
    FavoriteConnection.delete({ clientId: clientId, providerId: providerId })
    return { success: true }
  }
}
