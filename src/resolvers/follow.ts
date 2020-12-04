import { Resolver, Mutation, Arg, Query } from 'type-graphql'
import { Client, Follow } from '../entities'
import { SuccessResponse } from '../entities/types'

@Resolver(Follow)
export class FollowResolver {
  @Mutation(() => SuccessResponse)
  async follow(
    @Arg('followId') followId: number,
    @Arg('followedId') followedId: number
  ): Promise<SuccessResponse> {
    const following = await Client.findOne(followId)
    const followers = await Client.findOne(followedId)
    const aggregateErrors = []
    if (!following) {
      aggregateErrors.push({
        field: 'followId',
        message: 'clientId does not exist',
      })
    }
    if (!followers) {
      aggregateErrors.push({
        field: 'followedId',
        message: 'clientId does not exist',
      })
    }
    if (aggregateErrors.length > 0) return { errors: aggregateErrors }
    await Follow.create({ followId, followedId }).save()
    return { success: true }
  }

  @Query(() => [Client])
  async following(@Arg('followId') followId: number): Promise<Client[]> {
    const followers: Client[] = []
    await Follow.find({
      where: {
        followId: followId,
      },
      relations: ['followers'],
    }).then((follows) => {
      follows.forEach(async (follow) => followers.push(await follow.followers))
    })
    return followers
  }

  @Query(() => [Client])
  async followers(@Arg('followedId') followedId: number): Promise<Client[]> {
    const following: Client[] = []
    await Follow.find({
      where: {
        followedId: followedId,
      },
      relations: ['following'],
    }).then((follows) => {
      follows.forEach(async (follow) => following.push(await follow.following))
    })
    return following
  }

  @Mutation(() => SuccessResponse)
  async unfollow(
    @Arg('followId') followId: number,
    @Arg('followedId') followedId: number
  ): Promise<SuccessResponse> {
    Follow.delete({ followId: followId, followedId: followedId })
    return { success: true }
  }
}
