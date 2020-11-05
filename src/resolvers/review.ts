import { Resolver, Mutation, Arg, Query } from 'type-graphql'
import { Client, Review } from '../entities'
import { getConnection } from 'typeorm'
import {
  ReviewInput,
  ReviewResponse,
  ReviewsResponse,
} from '../entities/Review'
import { SuccessResponse } from '../entities/types'

@Resolver(Review)
export class ReviewResolver {
  //All queries with review only supports 1 level select
  //Basically you can't grab the nth level deep fields in review
  //e.g can not grab provider.address
  //
  //To change this add extra relations shown in this issue
  //https://github.com/typeorm/typeorm/issues/1270

  //Check
  //https://github.com/typeorm/typeorm/issues/2707
  //May not work
  @Query(() => ReviewsResponse, { nullable: true })
  async specificReviews(
    @Arg('clientId') clientId: number,
    @Arg('providerId') providerId: number
  ): Promise<ReviewsResponse> {
    let reviews
    try {
      const result = await getConnection()
        .getRepository(Review)
        .find({
          where: {
            client: {
              id: clientId,
            },
            provider: {
              id: providerId,
            },
          },
          relations: ['client', 'provider'],
        })
      reviews = result
    } catch (err) {
      return {
        errors: [
          {
            field: 'NaN',
            message: 'query failed',
          },
        ],
      }
    }
    return { reviews }
  }

  @Query(() => ReviewResponse)
  async review(@Arg('reviewId') reviewId: number) {
    let review
    //provider = Provider.findOne(providerId)
    review = await getConnection()
      .getRepository(Review)
      .findOne({
        where: {
          id: reviewId,
        },
        relations: ['client', 'provider'],
      })
    if (!review) {
      return {
        errors: [
          {
            field: 'id',
            message: 'this id does not exist',
          },
        ],
      }
    }
    return { review }
  }

  @Query(() => ReviewsResponse)
  async providerReviews(
    @Arg('providerId') providerId: number
  ): Promise<ReviewsResponse> {
    let reviews
    try {
      const result = await getConnection()
        .getRepository(Review)
        .find({
          where: {
            provider: {
              id: providerId,
            },
          },
          relations: ['client', 'provider'],
        })
      reviews = result
    } catch (err) {
      return {
        errors: [
          {
            field: 'NaN',
            message: 'query failed',
          },
        ],
      }
    }
    return { reviews }
  }

  @Mutation(() => SuccessResponse, { nullable: true })
  async updateReview(
    @Arg('reviewId') reviewId: number,
    @Arg('input') input: ReviewInput
  ): Promise<SuccessResponse> {
    const review = await Review.findOne(reviewId)
    if (!review) {
      return {
        errors: [
          {
            field: 'reviewId',
            message: 'review of this id does not exist',
          },
        ],
        success: false,
      }
    }
    try {
      await Review.update(reviewId, { ...input })
    } catch (err) {
      return {
        errors: [
          {
            field: 'NaN',
            message: 'query failed',
          },
        ],
        success: false,
      }
    }
    return { success: true }
  }

  @Mutation(() => SuccessResponse)
  async createReview(
    @Arg('clientId') clientId: number,
    @Arg('providerId') providerId: number,
    @Arg('input') input: ReviewInput
  ): Promise<SuccessResponse> {
    const client = await Client.findOne(clientId)
    const provider = await Client.findOne(providerId)
    const aggregateErrors = []
    if (!client) {
      aggregateErrors.push({
        field: 'clientId',
        message: 'client does not exist',
      })
    }
    if (!provider) {
      aggregateErrors.push({
        field: 'providerId',
        message: 'provider does not exist',
      })
    }
    if (input.rating < 0 && input.rating > 5) {
      aggregateErrors.push({
        field: 'rating',
        message: 'invalid range for rating',
      })
    }
    if (input.text.length >= 300) {
      aggregateErrors.push({
        field: 'text',
        message: 'invalid range for text',
      })
    }
    if (aggregateErrors.length) return { errors: aggregateErrors }
    await Review.create({
      client: client,
      provider: provider,
      ...input,
    }).save()
    return { success: true }
  }
}

export default ReviewResolver
