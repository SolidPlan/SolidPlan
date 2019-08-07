export default function ({ $axios, app }) {
  $axios.onRequest((config) => {
    config.headers['Content-Type'] = 'application/json'
  })
}
