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
import { User, Client, Provider } from '../entities'
import argon2 from 'argon2'
import { COOKIE_NAME } from '../constants'
import { getConnection } from 'typeorm'

@Resolver(User)
export class UserResolver {

  @Query(() => User, {nullable: true})
  async self(@Ctx() { req }: MyContext) {
    if (!req.session.userId) return null
    return await User.findOne(parseInt(req.session.userId))
  }

  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() { req }: MyContext) {
    if (req.session.userId === user.id) {
      return user.email
    }
    return ''
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('input') input: UsernamePasswordInput,
    @Arg('userType') userType: UserType,
    @Ctx() { req }: MyContext
    ): Promise<UserResponse> {
    const errors = validateRegisterInputs(input)
    if (errors) return { errors }
    let user
    const hashedPassword = await argon2.hash(input.password)
    try {
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          username: input.username,
          password: hashedPassword,
          email: input.email
        })
        .returning('*')
        .execute()
      user = result.raw[0]
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
    req.session.userId = user.id
    return { user }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('usernameOrEmail') usernameOrEmail: string,
    @Arg('password') password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const isEmail = usernameOrEmail.includes('@')
    const user = await User.findOne(
      isEmail ?
      { where: { email: usernameOrEmail }} :
      { where: { username: usernameOrEmail }}
    )
    if (!user && isEmail) {
      return {
        errors: [
          { 
            field: 'email',
            message: 'email does not exist',
          }
        ]
      }
    }
  
    if (!user && !isEmail) {
      return {
        errors: [
          {
            field: 'username',
            message: 'username does not exist',
          }
        ]
      }
    }
  
    const validPassword = await argon2.verify(user!.password, password)
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
    req.session.userId = user!.id
    return { user }
  }

  @Mutation(() => UserResponse)
  async forgotUsername(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Arg('newUsername') newUsername: string,
  ): Promise<UserResponse> {
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
    const user = await User.findOne({ where: { email: email }})
    if (!user) {
      return {
        errors: [
          {
            field: 'email',
            message: 'email does not exist'
          }
        ]
      }
    }
    const validPassword = await argon2.verify(user!.password, password)
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
    await User.update(
      { id: user.id },
      { username: newUsername}
    )
    return { user }
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg('usernameOrEmail') usernameOrEmail: string,
    @Arg('oldPassword') oldPassword: string,
    @Arg('repeatNewPassword') repeatNewPassword: string,
    @Arg('newPassword') newPassword: string,
  ) {
    const isEmail = usernameOrEmail.includes('@')
    const user = await User.findOne( 
      isEmail ?
      { where: { email: usernameOrEmail }} :
      { where: { username: usernameOrEmail }}
    )
    if (!user) return false  
    const validPassword = await argon2.verify(user!.password, oldPassword)
    if (!validPassword) return false
    if (newPassword !== repeatNewPassword) return false
    const response = await User.update(
      { id: user!.id },
      { password: newPassword},
    )
    if (!response) return false // need to test...
    return true
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
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