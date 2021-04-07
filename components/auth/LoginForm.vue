<template>
  <div class="login">
    <TwoFALogin v-if="$store.state.auth.twoFA"></TwoFALogin>
    <v-card v-else rounded :loading="state.loading" :disabled="state.loading">
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
            label="Remember me"
          ></v-checkbox>
          <v-btn type="submit">Authenticate</v-btn>
          <v-btn to="/forgot-password">Reset Password</v-btn>
          <v-btn to="register">Register</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, useContext } from '@nuxtjs/composition-api'
import TwoFALogin from './TwoFALogin.vue'

interface LoginForm {
  email: string
  password: string
  remember: boolean
}
interface LoginErrors {
  email: string[]
  password: string[]
}
export default defineComponent({
  name: 'LoginForm',
  components: { TwoFALogin },
  setup() {
    const { $auth } = useContext()
    const state = reactive({
      errors: {} as LoginErrors,
      loading: false,
    })
    const loginData = reactive<LoginForm>({
      email: '',
      password: '',
      remember: false,
    })
    const login = async () => {
      state.loading = true

      try {
        await $auth.loginWith('laravelSanctum', {
          data: loginData,
        })
      } catch (e) {
        state.errors = e.response.data.errors
      } finally {
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
