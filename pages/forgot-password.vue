<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="4">
      <ForgotPasswordForm></ForgotPasswordForm>
    </v-col>
  </v-row>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import ForgotPasswordForm from '~/components/auth/ForgotPasswordForm'

export default defineComponent({
  auth: 'guest',
  components: { ForgotPasswordForm },
})
</script>

<style scoped></style>
