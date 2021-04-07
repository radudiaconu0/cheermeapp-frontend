<template>
  <div>
    <h1>Home</h1>
    <v-btn outlined @click.prevent="logout">Logout</v-btn>
    <v-btn outlined @click.prevent="resendEmail">Enable TwoFA</v-btn>
    <v-btn outlined @click.prevent="testEvent">Enable TwoFA</v-btn>
  </div>
</template>

<script lang="ts">
import { defineComponent, useContext, onMounted } from '@nuxtjs/composition-api'

export default defineComponent({
  layout: 'auth',
  middleware: 'auth',
  setup() {
    const { $auth, $axios, $echo } = useContext()
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
    const testEvent = async () => {
      await $axios.$post('/api/test-event', {
        message: 'hello',
      })
    }
    onMounted(() => {
      console.log($echo)
      $echo.private('test-event').listen('TestEvent', (e: any) => {
        // eslint-disable-next-line no-console
        console.log(e.message)
      })
    })
    return {
      logout,
      resendEmail,
      testEvent,
    }
  },
})
</script>

<style scoped></style>
