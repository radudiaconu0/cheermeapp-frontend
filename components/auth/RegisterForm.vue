<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="4">
      <v-card rounded>
        <v-card-title>Create an account</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="register">
            <v-row>
              <v-col>
                <v-text-field
                  v-model="formInput.first_name"
                  :error-messages="state.errors.first_name"
                  prepend-inner-icon="mdi-account"
                  outlined
                  type="text"
                  label="First name"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="formInput.last_name"
                  :error-messages="state.errors.last_name"
                  prepend-inner-icon="mdi-account"
                  outlined
                  type="text"
                  label="Last name"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-text-field
              v-model="formInput.email"
              :error-messages="state.errors.email"
              outlined
              prepend-inner-icon="mdi-email"
              type="email"
              label="E-mail"
            ></v-text-field>
            <v-text-field
              v-model="formInput.username"
              :error-messages="state.errors.username"
              prepend-inner-icon="mdi-account"
              outlined
              type="username"
              label="Username"
            ></v-text-field>
            <v-menu
              v-model="state.menu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  v-model="formInput.birthday"
                  :error-messages="state.errors.birthday"
                  label="Birthday"
                  prepend-inner-icon="mdi-cake"
                  readonly
                  outlined
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="formInput.birthday"
                @input="state.menu = false"
              ></v-date-picker>
            </v-menu>
            <v-text-field
              v-model="formInput.password"
              :error-messages="state.errors.password"
              prepend-inner-icon="mdi-lock"
              outlined
              type="password"
              label="Password"
            ></v-text-field>
            <v-text-field
              v-model="formInput.password_confirmation"
              :error-messages="state.errors.password_confirmation"
              prepend-inner-icon="mdi-lock"
              outlined
              type="password"
              label="Confirm password"
            ></v-text-field>
            <v-radio-group
              v-model="formInput.gender"
              :error-messages="state.errors.gender"
              label="Gender"
            >
              <v-row>
                <v-col>
                  <v-radio label="Male" value="M"></v-radio>
                </v-col>
                <v-col>
                  <v-radio label="Female" value="F"></v-radio>
                </v-col>
              </v-row>
            </v-radio-group>
            <v-btn type="submit">Create account</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, reactive, useContext } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'RegisterForm',
  setup(_, { root }) {
    const { $axios } = useContext()
    const state = reactive({
      menu: false,
      errors: [],
    })
    const formInput = reactive({
      email: '',
      first_name: '',
      last_name: '',
      username: '',
      gender: null,
      birthday: '',
      password: '',
      password_confirmation: '',
    })
    const register = async () => {
      try {
        await $axios.$get('sanctum/csrf-cookie')
        await $axios.$post('api/register', {
          ...formInput,
        })
        root.$router.push('/login')
      } catch (e) {
        state.errors = e.response.data.errors
      }
    }
    return {
      state,
      formInput,
      register,
    }
  },
})
</script>

<style scoped></style>
