<template>
  <confirm-pass-modal
    :on-confirm="confirm"
    :confirming="confirming"
    :password="password"
  ></confirm-pass-modal>
</template>

<script>
import { defineComponent, ssrRef, useContext } from '@nuxtjs/composition-api'
import ConfirmPassModal from '~/components/auth/ConfirmPassModal'

export default defineComponent({
  name: 'ConfirmPass',
  components: { ConfirmPassModal },
  props: {
    confirming: {
      type: Boolean,
      required: true,
    },
    onFail: {
      type: Function,
      required: true,
    },
    onSuccess: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const password = ssrRef('')
    const { $axios } = useContext()
    const confirm = () => {
      $axios
        .$post('/user/confirm-password', { password })
        .then(() => {
          props.onSuccess()
        })
        .catch(({ error, status }) => {
          console.log(error, status)
          props.onFail()
        })
    }
    return {
      confirm,
      password,
    }
  },
})
</script>

<style scoped></style>
