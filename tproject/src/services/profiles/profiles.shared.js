export const profilesPath = 'profiles'

export const profilesMethods = ['find', 'get', 'create', 'patch', 'remove']

export const profilesClient = client => {
  const connection = client.get('connection')

  client.use(profilesPath, connection.service(profilesPath), {
    methods: profilesMethods
  })
}
