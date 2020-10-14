import { Resolver, Mutation, Arg, Ctx, InputType, Field, ObjectType, Query } from 'type-graphql'
import { MyContext } from '../types'
import { User } from '../entities'
import argon2 from 'argon2'

//todo: create enum type to specify client or provider in field
@InputType()
class UsernamePasswordInput {
  @Field()
  username: string

  @Field()
  password: string
}

@ObjectType()
class FieldError {
  @Field()
  field: string

  @Field()
  message: string
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], {nullable: true})
  errors?: FieldError[]

  @Field(() => User, {nullable: true})
  user?: User
}

@Resolver()
export class UserResolver {

  @Query(() => User, {nullable: true})
  async self(@Ctx() { em, req }: MyContext) {
    if (!req.session.userId) return null
    const user = await em.findOne(User, { id: req.session.userId })
    return user
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('input') input: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ) {
    const aggeragateErrors = []
    if (input.username.length <= 2) {
      aggeragateErrors.push({
        field: 'username',
        message: 'username must be at least 3 characters'
      })
    }
    if (input.password.length <= 2) {
      aggeragateErrors.push({
        field: 'password',
        message: 'password must be at least 3 characters'
      })
    }
    const checkValid = await em.findOne(User, { username: input.username})
    if (checkValid) {
      aggeragateErrors.push({
        field: 'username',
        message: 'username already exists'
      })
    }
    if (aggeragateErrors.length !== 0) return { errors: aggeragateErrors }
    const hashedPassword = await argon2.hash(input.password)
    const user = em.create(User, { 
      username: input.username, 
      password: hashedPassword 
    })
    await em.persistAndFlush(user)
    return { user }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('input') input: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ) {
    const user = await em.findOne(User, { username: input.username })
    if (!user) {
      return {
        errors: [
          { 
            field: 'username',
            message: 'username does not exist'
          }
        ]
      }
    }
    const validPassword = await argon2.verify(user.password, input.password)
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
    req.session.userId = user.id
    return { user }
  }

}