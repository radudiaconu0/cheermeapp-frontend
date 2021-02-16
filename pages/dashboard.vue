<template>
  <v-card>
    <v-card-title>Account Settings</v-card-title>
    <v-card-text>
      <div v-if="$auth.user.has2FA"></div>
    </v-card-text>
  </v-card>
</template>

<script>
import { computed, defineComponent } from '@nuxtjs/composition-api'
import useAuthUser from '~/composables/useAuthUser'

export default defineComponent({
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
