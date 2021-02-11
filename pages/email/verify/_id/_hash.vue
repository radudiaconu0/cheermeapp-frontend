<template>
  <div>
    <div v-if="loading">
      <v-row justify="center" align="center">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </v-row>
    </div>
    <div v-else>
      <v-alert v-if="error.isError" type="error">{{ error.message }}</v-alert>
      <v-alert v-else type="success">E-mail verified successfully</v-alert>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  onMounted,
  reactive,
  ssrRef,
  useContext,
} from '@nuxtjs/composition-api'

export default defineComponent({
  layout: 'auth',
  middleware: 'auth',
  setup(_, { root }) {
    const { $axios } = useContext()
    const loading = ssrRef(true)
    const error = reactive({
      isError: false,
      message: null,
    })
    const params = reactive({
      hash: root.$route.params.hash,
      id: root.$route.params.id,
      expires: root.$route.query.expires,
      signature: root.$route.query.signature,
    })
    onMounted(async () => {
      try {
        await $axios.$get(`/api/email/verify/${params.id}/${params.hash}`, {
          params: {
            expires: params.expires,
            signature: params.signature,
          },
        })
      } catch (e) {
        error.message = e.response.data.message
        error.isError = true
      } finally {
        loading.value = false
      }
    })
    return {
      error,
      loading,
    }
  },
})
</script>

<style scoped></style>
