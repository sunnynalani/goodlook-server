import { Resolver, Query } from 'type-graphql'

@Resolver()
export class TestResolver {
  @Query(() => String)
  test() {
    return 'tests'
  }
}