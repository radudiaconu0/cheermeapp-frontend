<template>
  <v-card rounded :loading="state.loading" :disabled="state.loading">
    <v-card-title>Two factor Authentication</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="verify">
        <v-text-field
          v-model="code"
          outlined
          :error-messages="state.errors.code"
          :label="`Enter ${state.useRecoveryCode ? 'Recovery' : ''} Code`"
        ></v-text-field>
        <v-checkbox
          v-model="state.useRecoveryCode"
          label="use recovery code"
        ></v-checkbox>
        <v-btn type="submit">Verify</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  ssrRef,
  useContext,
} from '@nuxtjs/composition-api'

interface Code {
  // eslint-disable-next-line camelcase
  recovery_code?: string
  code?: string
}

export default defineComponent({
  name: 'TwoFALogin',
  setup() {
    const { $auth } = useContext()
    const state = reactive({
      errors: [],
      code: false,
      useRecoveryCode: false,
      loading: false,
    })
    const code = ssrRef('')
    const verify = async () => {
      state.loading = true
      const data: Code = {}
      try {
        if (state.useRecoveryCode) {
          data.recovery_code = code.value
        } else {
          data.code = code.value
        }

        await $auth.twoFactorChallenge({ data })
      } catch (e) {
        console.log(e)
      } finally {
        state.loading = false
      }
    }
    return {
      state,
      code,
      verify,
    }
  },
})
</script>

<style scoped></style>
