import { registerEnumType } from 'type-graphql'

export enum CategoryType {
  NAIL = 'nail',
  LASHES = 'lashes',
  HAIR = 'hair',
  BROWS = 'brows',
  WAX = 'wax',
  MAKEUP = 'makeup',
  OTHER = 'other',
}

registerEnumType(CategoryType, {
  name: 'CategoryType',
  description: 'Category of Provider',
})
