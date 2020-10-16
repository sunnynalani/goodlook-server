import { 
  Resolver, 
  Mutation, 
  FieldResolver, 
  Arg, 
  Ctx, 
  Query,
  Root,
} from 'type-graphql'
import { UsernamePasswordInput } from '../types/UsernamePasswordInput'
import { validateRegisterInputs } from '../utils/'
import { MyContext } from '../types'
import { Client, User } from '../entities'
import argon2 from 'argon2'
import { COOKIE_NAME } from '../constants'
import { getConnection } from 'typeorm'
import { UserResponse } from '../types'

@Resolver(Client)
export class ClientResolver {

  @Query(() => UserResponse)
  async

}