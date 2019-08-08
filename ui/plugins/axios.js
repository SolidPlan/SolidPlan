export default function ({ $axios }) {
  $axios.onRequest((config) => {
    config.headers['Content-Type'] = 'application/json'
  })
}
