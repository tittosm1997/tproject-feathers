// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  usertypeDataValidator,
  usertypePatchValidator,
  usertypeQueryValidator,
  usertypeResolver,
  usertypeExternalResolver,
  usertypeDataResolver,
  usertypePatchResolver,
  usertypeQueryResolver
} from './usertype.schema.js'
import { UsertypeService, getOptions } from './usertype.class.js'
import { usertypePath, usertypeMethods } from './usertype.shared.js'

export * from './usertype.class.js'
export * from './usertype.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const usertype = app => {
  // Register our service on the Feathers application
  app.use(usertypePath, new UsertypeService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: usertypeMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(usertypePath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(usertypeExternalResolver),
        schemaHooks.resolveResult(usertypeResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(usertypeQueryValidator),
        schemaHooks.resolveQuery(usertypeQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(usertypeDataValidator),
        schemaHooks.resolveData(usertypeDataResolver)
      ],
      patch: [
        schemaHooks.validateData(usertypePatchValidator),
        schemaHooks.resolveData(usertypePatchResolver)
      ],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}
