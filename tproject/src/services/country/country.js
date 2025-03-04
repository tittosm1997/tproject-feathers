// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema';
import {
  countryDataValidator,
  countryPatchValidator,
  countryQueryValidator,
  countryResolver,
  countryExternalResolver,
  countryDataResolver,
  countryPatchResolver,
  countryQueryResolver
} from './country.schema.js';
import { CountryService, getOptions } from './country.class.js';
import { countryPath, countryMethods } from './country.shared.js';

export * from './country.class.js';
export * from './country.schema.js';

// A configure function that registers the service and its hooks via `app.configure`
export const country = (app) => {
  // Register our service on the Feathers application
  app.use(countryPath, new CountryService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: countryMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  });
  // Initialize hooks
  app.service(countryPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(countryExternalResolver), schemaHooks.resolveResult(countryResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(countryQueryValidator), schemaHooks.resolveQuery(countryQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(countryDataValidator), schemaHooks.resolveData(countryDataResolver)],
      patch: [schemaHooks.validateData(countryPatchValidator), schemaHooks.resolveData(countryPatchResolver)],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  });
};
