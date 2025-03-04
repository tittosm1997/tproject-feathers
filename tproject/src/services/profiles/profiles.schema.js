// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema';
import { dataValidator, queryValidator } from '../../validators.js';

// Main data model schema
export const profilesSchema = {
  $id: 'Profiles',
  type: 'object',
  additionalProperties: false,
  required: ['id'],
  properties: {
    id: { type: 'number' },
    userId:{ type: 'number' },
    dob:{ type: 'string' },
    profileImage:{ type: 'string' },
    gender:{ type: 'string' },
    countryId:{ type: 'number' },
    createdAt:{ type: 'string' },
    updatedAt: { type: 'string' }
  }
};
export const profilesValidator = getValidator(profilesSchema, dataValidator);
export const profilesResolver = resolve({});

export const profilesExternalResolver = resolve({});

// Schema for creating new data
export const profilesDataSchema = {
  $id: 'ProfilesData',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...profilesSchema.properties
  }
};
export const profilesDataValidator = getValidator(profilesDataSchema, dataValidator);
export const profilesDataResolver = resolve({});

// Schema for updating existing data
export const profilesPatchSchema = {
  $id: 'ProfilesPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...profilesSchema.properties
  }
};
export const profilesPatchValidator = getValidator(profilesPatchSchema, dataValidator);
export const profilesPatchResolver = resolve({});

// Schema for allowed query properties
export const profilesQuerySchema = {
  $id: 'ProfilesQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(profilesSchema.properties)
  }
};
export const profilesQueryValidator = getValidator(profilesQuerySchema, queryValidator);
export const profilesQueryResolver = resolve({});
