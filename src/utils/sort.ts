import { SelectQueryBuilder } from 'typeorm'
import { GraphQLScalarType, Kind, ValueNode } from 'graphql'

export const GraphQLSortType = new GraphQLScalarType({
  name: 'GraphQLSortType',
  description: 'GraphQLSortType',
  serialize: (v) => v,
  parseValue: (v) => v,
  parseLiteral: (ast) => sortLiteral(ast),
})

const sortLiteral = (ast: ValueNode): any => {
  switch (ast.kind) {
    case Kind.OBJECT:
      const values = Object.create(null)
      ast.fields.forEach((objNode) => {
        const key = objNode.name.value
        const value = objNode.value
        values[key] = sortLiteral(value)
      })
      return values
    case Kind.STRING:
      return ast.value
    default:
      return null
  }
}

export enum OrderBy {
  DESC = 'DESC',
  ASC = 'ASC',
}

/**
 * dynamic sorting...
 * self explanatory
 *
 * example:
 * sort: { value: 'ASC' } or { value: 'DESC' }
 */

export const sortQuery = <T>(
  query: SelectQueryBuilder<T>,
  sort: any,
  entityType: string
) => {
  if (!sort) {
    return query
  } else {
    const pair = Object.entries(sort).map(([k, v]) => ({ k, v }))
    if (pair[0].v === OrderBy.ASC || pair[0].v === OrderBy.DESC)
      return query.orderBy(`${entityType}.${pair[0].k}`, pair[0].v)
    return query
  }
}
