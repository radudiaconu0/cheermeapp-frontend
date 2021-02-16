<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="4">
      <v-card rounded>
        <v-card-title>Reset Password</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="resetPassword">
            <v-text-field
              v-model="formInput.email"
              outlined
              type="email"
              label="E-mail"
            ></v-text-field>
            <v-text-field
              v-model="formInput.password"
              outlined
              type="password"
              label="Password"
            ></v-text-field>
            <v-text-field
              v-model="formInput.password_confirmation"
              outlined
              type="password"
              label="Confirm password"
            ></v-text-field>
            <v-btn type="submit">Reset Password</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  useContext,
  useRoute,
  useRouter,
} from '@nuxtjs/composition-api'

export default defineComponent({
  auth: 'guest',
  setup() {
    const { $auth } = useContext()
    const route = useRoute()
    const router = useRouter()
    const state = reactive({
      token: route.value.params.token,
      email: route.value.query.email,
      errors: [],
    })
    const formInput = reactive({
      email: '',
      password: '',
      password_confirmation: '',
    })
    const resetPassword = async () => {
      try {
        await $auth.resetPassword('laravelSanctum', {
          data: {
            ...formInput,
            token: state.token,
          },
        })
        await router.push('/login')
      } catch (e) {
        state.errors = e.response.data.errors
      }
    }
    return {
      state,
      formInput,
      resetPassword,
    }
  },
})
</script>

<style scoped></style>
