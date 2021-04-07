export default function (ctx) {
  return {
    broadcaster: 'pusher',
    authModule: true,
    disconnectOnLogout: true,
    forceTLS: false,
    disableStats: true,
    authEndpoint: 'http://cheermeapp.test/api/broadcasting/auth',
    key: 'scvbmzkmvc',
    cluster: 'ap1',
    wsHost: 'cheermeapp.test',
    wsPort: '6001',
    authorizer: (channel) => ({
      authorize: (socketId, authorizerCallback) =>
        ctx.app.$axios
          .$post('/api/broadcasting/auth', {
            channel_name: channel.name,
            socket_id: socketId,
          })
          .then(({ data }) => authorizerCallback(false, data))
          .catch((error) => authorizerCallback(true, error)),
    }),
  }
}
