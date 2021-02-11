<template>
  <v-card>
    <v-card-title>Account Settings</v-card-title>
    <v-card-text>
      <enable-two-f-a v-if="!twoFaEnabled"></enable-two-f-a>
      <div v-else>
        <h1>Hello</h1>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { computed, defineComponent } from '@nuxtjs/composition-api'
import useAuthUser from '~/composables/useAuthUser'
import EnableTwoFA from '~/components/auth/EnableTwoFA'

export default defineComponent({
  components: { EnableTwoFA },
  layout: 'auth',
  middleware: 'auth',
  setup() {
    const user = useAuthUser()
    const twoFaEnabled = computed(() => user.has2FA)
    const state = {
      qrCode: '',
      recoveryCodes: [],
    }
    return {
      state,
      twoFaEnabled,
    }
  },
})
</script>

<style scoped></style>
