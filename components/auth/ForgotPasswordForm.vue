<template>
  <v-card rounded>
    <v-card-title>Reset Password</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="reset">
        <v-text-field
          v-model="state.email"
          outlined
          :error-messages="state.errors.email"
          type="email"
          label="E-mail"
        ></v-text-field>
        <v-alert v-if="state.emailSent" type="success"
          >Email sent successfully</v-alert
        >
        <v-btn type="submit">Reset</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, reactive, useContext } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'ForgotPasswordForm',
  setup() {
    const { $axios } = useContext()
    const state = reactive({
      email: '',
      emailSent: false,
      errors: [],
    })
    const reset = async () => {
      try {
        await $axios.$get('sanctum/csrf-cookie')
        await $axios.$post('api/forgot-password', { email: state.email })
        state.emailSent = true
      } catch (e) {
        state.errors = e.response.data.errors
        state.emailSent = false
      }
    }
    return {
      reset,
      state,
    }
  },
})
</script>

<style scoped></style>
