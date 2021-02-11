<template>
  <div>
    <v-btn @click="enable">Enable</v-btn>
    <div v-if="state.confirming">
      <confirm-pass
        :confirming="true"
        :on-success="enable"
        :on-fail="() => alert('something went wrong')"
      ></confirm-pass>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, useContext } from '@nuxtjs/composition-api'
import useAuthUser from '~/composables/useAuthUser'
import ConfirmPass from '~/components/auth/ConfirmPass'

export default defineComponent({
  components: { ConfirmPass },
  setup() {
    const { $auth, $axios } = useContext()
    const user = useAuthUser()
    // const twoFaEnabled = computed(() => user.has2FA)
    const state = reactive({
      qrCode: '',
      confirming: false,
      recoveryCodes: [],
    })
    const enable = async () => {
      try {
        await $axios.$post('api/user/two-factor-authentication')
        const data = $axios.$get('api/user/two-factor-qr-code')
        state.qrCode = data.svg
        state.recoveryCodes = await $axios.$get(
          'api/user/two-factor-recovery-codes'
        )
        user.has2FA = true
        await $auth.setUser(user)
      } catch (e) {
        if (e.response.status === 423) {
          state.confirming = true
        }
      }
    }
    return {
      state,
      enable,
    }
  },
})
</script>

<style scoped></style>
