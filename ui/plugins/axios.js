export default function ({ app, $axios, redirect }) {
  $axios.onRequest((config) => {
    config.headers['Content-Type'] = 'application/ld+json'
  })

  $axios.onError((error) => {
    if (error.response && error.response.data.code === 401 && error.response.data.message === 'Expired JWT Token') {
      app.$auth.logout()
      redirect('/login')
    }
  })
}
