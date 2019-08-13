<template>
  <v-container grid-list-xl>
    <v-layout justify-center align-center row wrap>
      <v-flex xs8>
        <v-card>
          <v-card-title>
            <h3>Profile</h3>
          </v-card-title>
          <v-card-text>
            <v-alert type="success" :value="success">
              Profile successfully updated
            </v-alert>
            <v-form ref="form">
              <v-text-field v-model="user.firstName" label="First name" :rules="nameRules" />
              <v-text-field v-model="user.lastName" label="Last name" />
              <v-text-field
                v-model="user.email"
                label="Email"
                persistent-hint
                hint="Note: If you change your email address, you will be logged out and have to log back in"
                :rules="emailRules"
              />
              <v-text-field v-model="user.password" label="Change Password" type="password" />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" @click="update">
              Update
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      success: false,
      nameRules: [
        value => !!value || 'Name is Required.'
      ],
      emailRules: [
        value => !!value || 'E-mail is Required.',
        (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid E-mail.'
        }
      ],
      user: JSON.parse(JSON.stringify(this.$auth.$state.user))
    }
  },
  methods: {
    async update () {
      if (this.$refs.form.validate()) {
        await this.$axios.$put(`/api/users/${this.user.id}`, this.user)
        if (this.$auth.$state.user.email !== this.user.email) {
          this.$auth.logout()
        } else {
          await this.$auth.fetchUser()
          this.user.password = null
          this.success = true
        }
      }
    }
  }
}
</script>
