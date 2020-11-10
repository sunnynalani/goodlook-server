import { SelectQueryBuilder, Brackets, WhereExpression } from 'typeorm'
import { GraphQLScalarType, Kind } from 'graphql'
import { InputType, Field } from 'type-graphql'

//ref
//https://stackoverflow.com/questions/54192483/typeorm-dynamic-query-builder-from-structured-object/54200659#54200659

export const FiltersType = new GraphQLScalarType({
  name: 'FiltersType',
  description: 'FiltersType',
  serialize(value: filter): filter {
    if (value === null && typeof value !== 'object') {
      throw new Error('Filters can only serialize filters')
    }
    return value // value sent to the client
  },
  parseValue(value: filter): filter {
    // check the type of received value
    if (typeof value !== 'object') {
      throw new Error('ObjectIdScalar can only parse string values')
    }
    return value // value from the client input variables
  },
})

interface filter {
  [key: string]: any
}

@InputType()
export class Filters {
  @Field(() => FiltersType, { nullable: true })
  filters?: filter
}

export enum Operator {
  AND = 'AND',
  OR = 'OR',
}

export const prefix = new Map([
  ['in', 'IN'],
  ['not_in', 'NOT IN'],
  ['is', '='],
  ['not', '!='],
  ['eq', '='],
  ['ne', '<>'],
  ['lt', '<'],
  ['lte', '<='],
  ['gt', '>'],
  ['gte', '>='],
  ['like', '~~'],
  ['not_like', '!~~'],
  ['match', '~'],
  ['match_ci', '~*'],
  ['not_match', '!~'],
  ['not_match_ci', '!~*'],
])

export const filterQuery = <T>(query: SelectQueryBuilder<T>, filter: any) => {
  if (!filter) {
    return query
  } else {
    return filterFactory(query, filter) as SelectQueryBuilder<T>
  }
}

const filterFactory = (
  query: WhereExpression,
  filter: any,
  parentOperator = Operator.AND
) => {
  Object.keys(filter).forEach((exp) => {
    if (Operator.AND === exp) {
      query = query.andWhere(bracketFactory(query, Operator.AND))
    } else if (Operator.OR === exp) {
      query = query.orWhere(bracketFactory(query, Operator.OR))
    } else {
      const queryPrefix = Object.keys(filter)[0]
      const queryValue = filter[exp]
      if (Operator.AND === parentOperator) {
        query = query.andWhere(`${exp} ${prefix.get(queryPrefix)} :value`, {
          value: queryValue,
        })
      } else if (Operator.OR === exp) {
        query = query.orWhere(`${exp} ${prefix.get(queryPrefix)} :value`, {
          value: queryValue,
        })
      }
    }
  })
  return query
}

const bracketFactory = (query: any, operator: Operator) => {
  return new Brackets((qb) =>
    query[operator].map((filter: any) => {
      filterFactory(qb, filter, operator)
    })
  )
}
