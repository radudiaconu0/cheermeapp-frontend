<template>
  <div>
    <h1>Home</h1>
    <v-btn outlined @click.prevent="logout">Logout</v-btn>
    <v-btn outlined @click.prevent="resendEmail">Enable TwoFA</v-btn>
  </div>
</template>

<script lang="ts">
import { defineComponent, useContext } from '@nuxtjs/composition-api'

export default defineComponent({
  layout: 'auth',
  middleware: 'auth',
  setup() {
    const { $auth, $axios } = useContext()
    const logout = async () => {
      await $auth.logout()
    }
    const resendEmail = async () => {
      try {
        await $axios.$post('/api/user/two-factor-authentication')
        await $axios.$get('/api/user/two-factor-qr-code')
        await $axios.$get('/api/user/two-factor-recovery-codes')
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
      }
    }
    return {
      logout,
      resendEmail,
    }
  },
})
</script>

<style scoped></style>
