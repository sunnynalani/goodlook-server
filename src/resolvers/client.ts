import { Resolver, Mutation, Arg, Ctx, Query } from 'type-graphql'
import { UsernamePasswordInput } from '../entities/types/UsernamePasswordInput'
import {
  filterQuery,
  GraphQLFilterType,
  GraphQLSortType,
  sortQuery,
  validateRegisterInputs,
} from '../utils/'
import { MyContext } from '../types'
import { Client } from '../entities'
import argon2 from 'argon2'
import { COOKIE_NAME } from '../constants'
import { getConnection } from 'typeorm'
import {
  ClientsResponse,
  ClientResponse,
  ClientInput,
} from '../entities/Client'

@Resolver(Client)
export class ClientResolver {
  @Query(() => Client, { nullable: true })
  async meClient(@Ctx() { req }: MyContext) {
    if (!req.session.clientId) return null
    return await getConnection()
      .getRepository(Client)
      .findOne({
        where: {
          id: parseInt(req.session.clientId),
        },
        relations: ['reviews', 'favorite_providers', 'followers', 'following'],
      })
  }

  @Query(() => ClientResponse)
  async client(@Arg('clientId') clientId: number) {
    let client
    client = await getConnection()
      .getRepository(Client)
      .findOne({
        where: {
          id: clientId,
        },
        relations: ['reviews', 'favorite_providers', 'followers', 'following'],
      })
    if (!client) {
      return {
        errors: [
          {
            field: 'id',
            message: 'this id does not exist',
          },
        ],
      }
    }
    return { client }
  }

  @Query(() => ClientsResponse)
  async clients(
    @Arg('filters', () => GraphQLFilterType, { nullable: true })
    filters: typeof GraphQLFilterType,
    @Arg('sort', () => GraphQLSortType, { nullable: true })
    sort: typeof GraphQLSortType
  ): Promise<ClientsResponse> {
    let clients
    try {
      const result = await getConnection()
        .getRepository(Client)
        .createQueryBuilder()
        .leftJoinAndSelect('Client.reviews', 'reviews')
        .leftJoinAndSelect('Client.favorite_providers', 'favorite_providers')
        .leftJoinAndSelect('Client.following', 'following')
        .leftJoinAndSelect('Client.followers', 'followers')
      let augmentedQuery = filterQuery(result, filters)
      augmentedQuery = sortQuery(augmentedQuery, sort, 'Client')
      const augmentedResult = await augmentedQuery.getMany()
      clients = augmentedResult
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
    return { clients }
  }

  @Mutation(() => ClientResponse)
  async registerClient(
    @Arg('input') input: UsernamePasswordInput,
    @Arg('attributeInput') attributesInput: ClientInput,
    @Ctx() { req }: MyContext
  ): Promise<ClientResponse> {
    const errors = validateRegisterInputs(input)
    if (errors) return { errors }
    let client
    const hashedPassword = await argon2.hash(input.password)
    try {
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Client)
        .values({
          username: input.username,
          password: hashedPassword,
          email: input.email,
          first_name: attributesInput.first_name,
          last_name: attributesInput.last_name,
        })
        .returning('*')
        .execute()
      client = result.raw[0]
    } catch (err) {
      if (err.code === '23505') {
        //duplicate username...
        return {
          errors: [
            {
              field: 'username',
              message: 'this username already exists',
            },
          ],
        }
      }
    }
    req.session.clientId = client.id
    return { client }
  }

  @Mutation(() => ClientResponse)
  async loginClient(
    @Arg('usernameOrEmail') usernameOrEmail: string,
    @Arg('password') password: string,
    @Ctx() { req }: MyContext
  ): Promise<ClientResponse> {
    const isEmail = usernameOrEmail.includes('@')
    const client = await Client.findOne(
      isEmail
        ? { where: { email: usernameOrEmail } }
        : { where: { username: usernameOrEmail } }
    )
    if (!client && isEmail) {
      return {
        errors: [
          {
            field: 'email',
            message: 'email does not exist',
          },
        ],
      }
    }

    if (!client && !isEmail) {
      return {
        errors: [
          {
            field: 'username',
            message: 'username does not exist',
          },
        ],
      }
    }
    const validPassword = await argon2.verify(client!.password, password)
    if (!validPassword) {
      return {
        errors: [
          {
            field: 'password',
            message: 'incorrect password',
          },
        ],
      }
    }
    req.session.clientId = client!.id
    return { client }
  }

  @Mutation(() => ClientResponse)
  async updateClient(
    @Arg('clientId') clientId: number,
    @Arg('input') input: ClientInput
  ): Promise<ClientResponse> {
    let client
    try {
      const result = await getConnection()
        .createQueryBuilder()
        .update(Client)
        .set(input)
        .where('id = :id', { id: clientId })
        .returning('*')
        .execute()
      client = result.raw[0]
    } catch (err) {
      if (err.code === '23505') {
        //duplicate username...
        return {
          errors: [
            {
              field: err.code,
              message: 'query failed',
            },
          ],
        }
      }
    }
    return { client }
  }

  @Mutation(() => ClientResponse)
  async forgotClientUsername(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Arg('newUsername') newUsername: string
  ): Promise<ClientResponse> {
    const isEmail = email.includes('@')
    if (!isEmail) {
      return {
        errors: [
          {
            field: 'email',
            message: 'invalid email',
          },
        ],
      }
    }
    const client = await Client.findOne({ where: { email: email } })
    if (!client) {
      return {
        errors: [
          {
            field: 'email',
            message: 'email does not exist',
          },
        ],
      }
    }
    const validPassword = await argon2.verify(client!.password, password)
    if (!validPassword) {
      return {
        errors: [
          {
            field: 'password',
            message: 'incorrect password',
          },
        ],
      }
    }
    await Client.update({ id: client.id }, { username: newUsername })
    return { client }
  }

  @Mutation(() => Boolean)
  async forgotClientPassword(
    @Arg('usernameOrEmail') usernameOrEmail: string,
    @Arg('oldPassword') oldPassword: string,
    @Arg('repeatNewPassword') repeatNewPassword: string,
    @Arg('newPassword') newPassword: string
  ) {
    const isEmail = usernameOrEmail.includes('@')
    const client = await Client.findOne(
      isEmail
        ? { where: { email: usernameOrEmail } }
        : { where: { username: usernameOrEmail } }
    )
    if (!client) return false
    const validPassword = await argon2.verify(client!.password, oldPassword)
    if (!validPassword) return false
    if (newPassword !== repeatNewPassword) return false
    const response = await Client.update(
      { id: client!.id },
      { password: newPassword }
    )
    if (!response) return false // need to test...
    return true
  }

  @Mutation(() => Boolean)
  logoutClient(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME)
        if (err) {
          console.log(err)
          resolve(false)
          return
        }
        resolve(true)
      })
    )
  }
}
