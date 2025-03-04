export const countryPath = 'country'

export const countryMethods = ['find', 'get', 'create', 'patch', 'remove']

export const countryClient = client => {
  const connection = client.get('connection')

  client.use(countryPath, connection.service(countryPath), {
    methods: countryMethods
  })
}
