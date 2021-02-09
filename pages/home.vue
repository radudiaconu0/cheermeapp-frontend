<template>
  <div>
    <h1>Home</h1>
    <v-btn outlined @click.prevent="logout">Logout</v-btn>
  </div>
</template>

<script lang="ts">
import { defineComponent, useContext } from '@nuxtjs/composition-api'

export default defineComponent({
  middleware: 'auth',
  setup() {
    const { $auth } = useContext()
    const logout = async () => {
      await $auth.logout()
    }
    return {
      logout,
    }
  },
})
</script>

<style scoped></style>
