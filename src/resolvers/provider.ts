import { 
  Resolver, 
  Mutation, 
  Arg, 
  Ctx, 
  Query,
} from 'type-graphql'
import { UsernamePasswordInput } from '../entities/types/UsernamePasswordInput'
import { validateRegisterInputs } from '../utils/'
import { MyContext } from '../types'
import { Provider } from '../entities'
import argon2 from 'argon2'
import { COOKIE_NAME } from '../constants'
import { getConnection } from 'typeorm'
import { ProviderResponse, ProvidersResponse } from './../entities/types/'

@Resolver(Provider)
export class ProviderResolver {

  @Query(() => Provider, {nullable: true})
  async selfProvider(@Ctx() { req }: MyContext) {
    if (!req.session.providerId) return null
    return await Provider.findOne(parseInt(req.session.providerId))
  }

  @Query(() => ProviderResponse)
  async provider(@Arg('providerId') providerId: number) {
    let provider
    provider = Provider.findOne(providerId)
    if (!provider) {
      return {
        errors: [
          {
            field: 'id',
            message: 'this id does not exist'
          }
        ]
      }
    }
    return { provider }
  }

  @Query(() => ProvidersResponse)
  async providers(): Promise<ProvidersResponse> {
    let providers
    try {
      const result = await getConnection()
        .createQueryBuilder()
        //.orderBy('user.id', dto.order) todo sort
        //.skip(rowsPerPage) todo pagination
        //.take()
        .getMany()
      providers = result
    } catch (err) {
      return {
        errors: [
          {
            field: 'NaN',
            message: 'query failed'
          }
        ]
      }
    }
    return { providers }
  }

  @Mutation(() => ProviderResponse)
  async registerProvider(
    @Arg('input') input: UsernamePasswordInput,
    @Ctx() { req }: MyContext
    ): Promise<ProviderResponse> {
    const errors = validateRegisterInputs(input)
    if (errors) return { errors }
    let provider
    const hashedPassword = await argon2.hash(input.password)
    try {
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Provider)
        .values({
          username: input.username,
          password: hashedPassword,
          email: input.email
        })
        .returning('*')
        .execute()
        provider = result.raw[0]
    } catch (err) {
      if (err.code === '23505') { //duplicate username...
        return {
          errors: [
            {
              field: 'username',
              message: 'this username already exists'
            },
          ]
        }
      }
    }
    req.session.providerId = provider.id
    return { provider }
  }

  @Mutation(() => ProviderResponse)
  async loginProvider(
    @Arg('usernameOrEmail') usernameOrEmail: string,
    @Arg('password') password: string,
    @Ctx() { req }: MyContext
  ): Promise<ProviderResponse> {
    const isEmail = usernameOrEmail.includes('@')
    const provider = await Provider.findOne(
      isEmail ?
      { where: { email: usernameOrEmail }} :
      { where: { username: usernameOrEmail }}
    )
    if (!provider && isEmail) {
      return {
        errors: [
          { 
            field: 'email',
            message: 'email does not exist',
          }
        ]
      }
    }
  
    if (!provider && !isEmail) {
      return {
        errors: [
          {
            field: 'username',
            message: 'username does not exist',
          }
        ]
      }
    }
  
    const validPassword = await argon2.verify(provider!.password, password)
    if (!validPassword) {
      return {
        errors: [
          {
            field: 'password',
            message: 'incorrect password'
          }
        ]
      }
    }
    req.session.providerId = provider!.id
    return { provider }
  }

  @Mutation(() => ProviderResponse)
  async forgotProviderUsername(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Arg('newUsername') newUsername: string,
  ): Promise<ProviderResponse> {
    const isEmail = email.includes('@')
    if (!isEmail) {
      return { 
        errors: [
            { 
              field: 'email',
              message: 'invalid email',
            },
          ]
        }
    }
    const provider = await Provider.findOne({ where: { email: email }})
    if (!provider) {
      return {
        errors: [
          {
            field: 'email',
            message: 'email does not exist'
          }
        ]
      }
    }
    const validPassword = await argon2.verify(provider!.password, password)
    if (!validPassword) {
      return {
        errors: [
          {
            field: 'password',
            message: 'incorrect password'
          }
        ]
      }
    }
    await Provider.update(
      { id: provider.id },
      { username: newUsername}
    )
    return { provider }
  }

  @Mutation(() => Boolean)
  async forgotProviderPassword(
    @Arg('usernameOrEmail') usernameOrEmail: string,
    @Arg('oldPassword') oldPassword: string,
    @Arg('repeatNewPassword') repeatNewPassword: string,
    @Arg('newPassword') newPassword: string,
  ) {
    const isEmail = usernameOrEmail.includes('@')
    const provider = await Provider.findOne( 
      isEmail ?
      { where: { email: usernameOrEmail }} :
      { where: { username: usernameOrEmail }}
    )
    if (!provider) return false  
    const validPassword = await argon2.verify(provider!.password, oldPassword)
    if (!validPassword) return false
    if (newPassword !== repeatNewPassword) return false
    const response = await Provider.update(
      { id: provider!.id },
      { password: newPassword},
    )
    if (!response) return false // need to test...
    return true
  }

  @Mutation(() => Boolean)
  logoutProvider(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME)
        if (err) {
          console.log(err)
          resolve(false)
          return;
        }
        resolve(true)
      })
    );
  }

}