<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="4">
      <LoginForm></LoginForm>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import LoginForm from '~/components/auth/LoginForm.vue'

export default defineComponent({
  auth: 'guest',
  components: { LoginForm },
})
</script>

<style scoped></style>
