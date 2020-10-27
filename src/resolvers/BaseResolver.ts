// import { BaseResponse } from '../entities/types'
// import { MyContext } from '../types'
// import { validateRegisterInputs } from '../utils'
// import { Arg, ClassType, Ctx, Mutation, Query, Resolver } from "type-graphql"
// import { getConnection } from "typeorm"
// import argon2 from 'argon2'
// import { _Entity } from '../entities'
// import { UsernamePasswordInput } from '../entities/types'

// function createBaseResolver<T extends ClassType>(
//   suffix: string,
//   returnType: T,
//   entity: any,
// ) {

//   @Resolver()
//   class BaseResolver {

//     @Query(() => String, { name: `type${suffix}` })
//     _type(): string {
//       console.log(entity)
//       return suffix
//     }

//     @Mutation(() => BaseResponse, { name: `register${suffix}` })
//     async register(
//       @Arg('input') input: UsernamePasswordInput,
//       @Ctx() { req }: MyContext
//     ): Promise<BaseResponse<T>> {
//       const errors = validateRegisterInputs(input)
//       if (errors) return { errors }
//       let obj
//       const hashedPassword = await argon2.hash(input.password)
//       try {
//         const result = await getConnection()
//           .createQueryBuilder()
//           .insert()
//           .into(entity)
//           .values({
//             username: input.username,
//             password: hashedPassword,
//             email: input.email,
//           })
//           .returning('*')
//           .execute()
//         obj = result.raw[0]
//       } catch (err) {
//         if (err.code === '23505') {
//           //duplicate username...
//           return {
//             errors: [
//               {
//                 field: 'username',
//                 message: 'this username already exists',
//               },
//             ],
//           }
//         }
//       }
//       req.session.clientId = obj.id
//       return { response: obj }
//     }

//     @Query(() => returnType, { name: `get${suffix}` })
//     async get(
//       @Arg(`${suffix.toLowerCase()}Id`) id: number
//     ) {
//       return await entity.findOne(id)
//     }
//   }

//   return BaseResolver
// }

// export default createBaseResolver
