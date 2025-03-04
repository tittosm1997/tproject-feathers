import { uploads } from './uploads/uploads.js'
import { usertype } from './usertype/usertype.js'
import { profiles } from './profiles/profiles.js'
import { country } from './country/country.js'
import { users } from './users/users.js'
import 'dotenv/config'

export const services = app => {
  app.configure(uploads)

  app.configure(usertype)

  app.configure(profiles)

  app.configure(country)

  app.configure(users)

  // All services will be registered here
}
