import { SelectQueryBuilder, Brackets } from 'typeorm'
import { GraphQLScalarType, Kind, ValueNode } from 'graphql'

export const GraphQLFilterType = new GraphQLScalarType({
  name: 'GraphQLFilterType',
  description: 'GraphQLFilterType',
  serialize: (v) => v,
  parseValue: (v) => v,
  parseLiteral: (ast) => filterLiteral(ast),
})

const filterLiteral = (ast: ValueNode): any => {
  switch (ast.kind) {
    case Kind.BOOLEAN:
      return ast.value
    case Kind.FLOAT:
      return parseFloat(ast.value)
    case Kind.LIST:
      return ast.values.map((value) => filterLiteral(value))
    case Kind.INT:
      return parseInt(ast.value)
    case Kind.OBJECT:
      const values = Object.create(null)
      ast.fields.forEach((objNode) => {
        const key = objNode.name.value
        const value = objNode.value
        values[key] = filterLiteral(value)
      })
      return values
    case Kind.STRING:
      return ast.value
    default:
      return null
  }
}

export enum Operator {
  AND = 'AND',
  OR = 'OR',
}

/**
 * the like operator requires a '%' after it to work
 */

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

export const filterQuery = <T>(query: SelectQueryBuilder<T>, filters: any) => {
  if (!filters) {
    return query
  } else {
    return filterFactory(query, filters) as SelectQueryBuilder<T>
  }
}

const filterFactory = (
  query: any,
  filters: any,
  parentOperator = Operator.AND
) => {
  Object.keys(filters).forEach((exp) => {
    if (Operator.AND === exp) {
      query = query.andWhere(bracketFactory(filters, Operator.AND))
    } else if (Operator.OR === exp) {
      query = query.orWhere(bracketFactory(filters, Operator.OR))
    } else {
      const queryPrefix = Object.keys(filters[exp])[0]
      const queryValue = Object.values(filters[exp])[0]
      if (Operator.AND === parentOperator) {
        query = query
          .andWhere(`${exp} ${prefix.get(queryPrefix)} :${queryValue}`, {
            value: queryValue,
          })
          .setParameter(`${queryValue}`, queryValue)
      } else if (Operator.OR === parentOperator) {
        query = query
          .orWhere(`${exp} ${prefix.get(queryPrefix)} :${queryValue}`, {
            value: queryValue,
          })
          .setParameter(`${queryValue}`, queryValue)
      }
    }
  })
  return query
}

const bracketFactory = (filters: any, operator: Operator) => {
  return new Brackets((qb) =>
    filters[operator].map((filter: any) => {
      filterFactory(qb, filter, operator)
    })
  )
}
