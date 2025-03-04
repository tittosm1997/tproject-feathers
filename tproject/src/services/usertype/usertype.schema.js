// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const usertypeSchema = {
  $id: 'Usertype',
  type: 'object',
  additionalProperties: false,
  required: ['id'],
  properties: {
    id: { type: 'number' },
    userType: { type: 'string' },
    createdAt:{ type: 'string' },
    updatedAt: { type: 'string' }
  }
}
export const usertypeValidator = getValidator(usertypeSchema, dataValidator)
export const usertypeResolver = resolve({})

export const usertypeExternalResolver = resolve({})

// Schema for creating new data
export const usertypeDataSchema = {
  $id: 'UsertypeData',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...usertypeSchema.properties
  }
}
export const usertypeDataValidator = getValidator(usertypeDataSchema, dataValidator)
export const usertypeDataResolver = resolve({})

// Schema for updating existing data
export const usertypePatchSchema = {
  $id: 'UsertypePatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...usertypeSchema.properties
  }
}
export const usertypePatchValidator = getValidator(usertypePatchSchema, dataValidator)
export const usertypePatchResolver = resolve({})

// Schema for allowed query properties
export const usertypeQuerySchema = {
  $id: 'UsertypeQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(usertypeSchema.properties)
  }
}
export const usertypeQueryValidator = getValidator(usertypeQuerySchema, queryValidator)
export const usertypeQueryResolver = resolve({})
