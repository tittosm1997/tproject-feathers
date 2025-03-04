// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema';
import { dataValidator, queryValidator } from '../../validators.js';

// Main data model schema
export const uploadsSchema = {
  $id: 'Uploads',
  type: 'object',
  additionalProperties: false,
  required: ['id', 'text'],
  properties: {
    id: { type: 'number' },
    text: { type: 'string' }
  }
};
export const uploadsValidator = getValidator(uploadsSchema, dataValidator);
export const uploadsResolver = resolve({});

export const uploadsExternalResolver = resolve({});

// Schema for creating new data
export const uploadsDataSchema = {
  $id: 'UploadsData',
  type: 'object',
  additionalProperties: false,
  required: ['text'],
  properties: {
    ...uploadsSchema.properties
  }
};
export const uploadsDataValidator = getValidator(uploadsDataSchema, dataValidator);
export const uploadsDataResolver = resolve({});

// Schema for updating existing data
export const uploadsPatchSchema = {
  $id: 'UploadsPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...uploadsSchema.properties
  }
};
export const uploadsPatchValidator = getValidator(uploadsPatchSchema, dataValidator);
export const uploadsPatchResolver = resolve({});

// Schema for allowed query properties
export const uploadsQuerySchema = {
  $id: 'UploadsQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(uploadsSchema.properties)
  }
};
export const uploadsQueryValidator = getValidator(uploadsQuerySchema, queryValidator);
export const uploadsQueryResolver = resolve({});
