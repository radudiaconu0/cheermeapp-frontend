<template>
  <v-card rounded :loading="state.loading" :disabled="state.loading">
    <v-card-title>Login</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="login">
        <v-text-field
          v-model="loginData.email"
          outlined
          :error-messages="state.errors.email"
          type="email"
          label="E-mail"
        ></v-text-field>
        <v-text-field
          v-model="loginData.password"
          outlined
          :error-messages="state.errors.password"
          label="Password"
          type="password"
        ></v-text-field>
        <v-checkbox
          v-model="loginData.remember"
          label="Remameber me"
        ></v-checkbox>
        <v-btn type="submit">Authenticate</v-btn>
        <v-btn to="/forgot-password">Reset Password</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, reactive, useContext } from '@nuxtjs/composition-api'

interface LoginForm {
  email: string
  password: string
  remember: boolean
}

export default defineComponent({
  name: 'LoginForm',
  setup() {
    const { $auth } = useContext()
    const state = reactive({
      errors: [],
      loading: false,
      two_factor: false,
    })
    const loginData = reactive<LoginForm>({
      email: '',
      password: '',
      remember: false,
    })
    const login = async () => {
      state.errors = []
      state.loading = true
      try {
        const response = await $auth.loginWith('laravelSanctum', {
          data: loginData,
        })
        if (response) {
          state.two_factor = response.data.two_factor
          state.loading = false
        }
      } catch (e) {
        state.errors = e.response.data.errors
        state.loading = false
      }
    }
    return {
      login,
      loginData,
      state,
    }
  },
})
</script>

<style scoped></style>
