import { Resolver, Mutation, Arg, Query } from 'type-graphql'
import { Client, Provider, Review } from '../entities'
import { getConnection } from 'typeorm'
import {
  ReviewInput,
  ReviewResponse,
  ReviewsResponse,
} from '../entities/Review'
import { SuccessResponse } from '../entities/types'
import {
  filterQuery,
  GraphQLFilterType,
  GraphQLSortType,
  sortQuery,
} from '../utils/'

const updateClient = async (client: Client) => {
  await getConnection()
    .createQueryBuilder()
    .update(Client)
    .set({ review_count: client!.review_count + 1 })
    .where('id = :id', { id: client.id })
    .execute()
}

const updateProvider = async (
  provider: Provider,
  rating: number,
  previous_rating = 0,
  isUpdate = false
) => {
  await getConnection()
    .createQueryBuilder()
    .update(Provider)
    .set({
      average_rating: isUpdate
        ? updateAverageRating(
            provider.reviews,
            provider.average_rating,
            previous_rating,
            rating
          )
        : addAverageRating(provider.reviews, rating),
    })
    .where('id = :id', { id: provider.id })
    .execute()
}

const updateAverageRating = (
  reviews: Review[],
  previous_average_rating: number,
  previous_rating: number,
  new_rating: number
) => {
  return (
    (reviews.length * previous_average_rating - previous_rating + new_rating) /
    reviews.length
  )
}

const addAverageRating = (reviews: Review[], new_rating: number) => {
  let total = 0
  reviews.forEach((review) => {
    total += review.rating
  })
  return (new_rating + total) / (reviews.length + 1)
}

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
            field: 'Error',
            message: err,
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
  async reviews(
    @Arg('filters', () => GraphQLFilterType, { nullable: true })
    filters: typeof GraphQLFilterType,
    @Arg('sort', () => GraphQLSortType, { nullable: true })
    sort: typeof GraphQLSortType
  ): Promise<ReviewsResponse> {
    let reviews
    try {
      const result = await getConnection()
        .getRepository(Review)
        .createQueryBuilder()
        .leftJoinAndSelect('Review.client', 'client')
        .leftJoinAndSelect('Review.provider', 'provider')
      let augmentedQuery = filterQuery(result, filters)
      augmentedQuery = sortQuery(augmentedQuery, sort, 'Review')
      const augmentedResult = await augmentedQuery.getMany()
      reviews = augmentedResult
    } catch (err) {
      return {
        errors: [
          {
            field: 'Error',
            message: err,
          },
        ],
      }
    }
    return { reviews }
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
            field: 'Error',
            message: err,
          },
        ],
      }
    }
    return { reviews }
  }

  @Query(() => ReviewsResponse)
  async clientReviews(
    @Arg('clientId') clientId: number
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
          },
          relations: ['client', 'provider'],
        })
      reviews = result
    } catch (err) {
      return {
        errors: [
          {
            field: 'Error',
            message: err,
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
    const review = await Review.findOne({
      where: { id: reviewId },
      relations: ['client', 'provider'],
    })
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
      updateProvider(review.provider, input.rating, review.rating, true)
    } catch (err) {
      return {
        errors: [
          {
            field: 'Error',
            message: err,
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
    //This is silly, but need to do this
    //so I can update the rating columns...
    //maybe there is a better way to trigger this
    //https://typeorm.io/#/listeners-and-subscribers/what-is-a-subscriber
    //it exists, but i dont think this works for
    //referencing other tables besides itself
    const client = await Client.findOne({
      where: { id: clientId },
      relations: ['reviews'],
    })
    const provider = await Provider.findOne({
      where: { id: providerId },
      relations: ['reviews'],
    })
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
    if (aggregateErrors.length) return { errors: aggregateErrors }
    try {
      await Review.create({
        client: client,
        provider: provider,
        ...input,
      }).save()
      updateClient(client!)
      updateProvider(provider!, input.rating, 0, false)
      return { success: true }
    } catch (err) {
      return {
        errors: [
          {
            field: 'Error',
            message: err,
          },
        ],
        success: false,
      }
    }
  }
}

export default ReviewResolver
