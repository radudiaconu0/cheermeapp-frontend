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
  useRoute,
} from '@nuxtjs/composition-api'

export default defineComponent({
  layout: 'auth',
  middleware: 'auth',
  setup() {
    const { $auth } = useContext()
    const route = useRoute()
    const loading = ssrRef(true)
    const error = reactive({
      isError: false,
      message: null,
    })
    const params = reactive({
      hash: route.value.params.hash,
      id: route.value.params.hash,
      expires: route.value.params.hash,
      signature: route.value.params.signature,
    })
    onMounted(async () => {
      try {
        await $auth.emailVerify('laravelSanctum', params.id, params.hash, {
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
