// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema';
import { dataValidator, queryValidator } from '../../validators.js';

// Main data model schema
export const countrySchema = {
  $id: 'Country',
  type: 'object',
  additionalProperties: false,
  required: ['id'],
  properties: {
    id: { type: 'number' },
    name: { type: 'string' },
    createdAt:{ type: 'string' },
    updatedAt: { type: 'string' }
  }
};
export const countryValidator = getValidator(countrySchema, dataValidator);
export const countryResolver = resolve({});

export const countryExternalResolver = resolve({});

// Schema for creating new data
export const countryDataSchema = {
  $id: 'CountryData',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...countrySchema.properties
  }
};
export const countryDataValidator = getValidator(countryDataSchema, dataValidator);
export const countryDataResolver = resolve({});

// Schema for updating existing data
export const countryPatchSchema = {
  $id: 'CountryPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...countrySchema.properties
  }
};
export const countryPatchValidator = getValidator(countryPatchSchema, dataValidator);
export const countryPatchResolver = resolve({});

// Schema for allowed query properties
export const countryQuerySchema = {
  $id: 'CountryQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(countrySchema.properties)
  }
};
export const countryQueryValidator = getValidator(countryQuerySchema, queryValidator);
export const countryQueryResolver = resolve({});
