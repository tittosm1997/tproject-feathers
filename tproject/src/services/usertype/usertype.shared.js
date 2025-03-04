export const usertypePath = 'usertype'

export const usertypeMethods = ['find', 'get', 'create', 'patch', 'remove']

export const usertypeClient = client => {
  const connection = client.get('connection')

  client.use(usertypePath, connection.service(usertypePath), {
    methods: usertypeMethods
  })
}
