import colors from 'vuetify/es5/util/colors'

const isDev = process.env.NODE_ENV !== "production"

export default {
  mode: 'spa',
  modern: !isDev,
  srcDir: 'ui/',
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: {
    name: 'chasing-dots',
    color: '#FF5638',
    background: 'white',
    height: '4px'
  },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/axios.js'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  devModules: [
    '@nuxtjs/vuetify',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/auth',
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    debug: isDev,
    proxy: true
  },
  proxy: {
    '/api/': process.env.API_PROXY_URL
  },
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {url: '/api/login', method: 'post'},
          logout: false,
          user: {url: '/api/me', method: 'get', propertyName: false}
        },
        tokenRequired: true,
        tokenType: 'Bearer'
      },
    },
    watchLoggedIn: true,
    redirect: {
      login: '/login',
      logout: '/login',
      home: '/'
    },
    plugins: [
      '~/plugins/init.js'
    ]
  },
  router: {
    middleware: ['auth']
  },
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.lighten3,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        },
        light: {
          primary: '#4caf50',
          secondary: '#4caf50',
          tertiary: '#495057',
          accent: '#82B1FF',
          error: '#f55a4e',
          info: '#00d3ee',
          success: '#5cb860',
          warning: '#ffa21a'
        }
      }
    }
  },
  /*
  ** Build configuration
  */
  buildModules: ['@nuxt/typescript-build'],
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
