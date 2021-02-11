<template>
  <v-dialog v-model="isConfirming">
    <v-card>
      <v-card-actions>
        <v-text-field
          v-model="password"
          label="Confirm Password"
        ></v-text-field>
        <v-btn @click="closeModal">Cancel</v-btn>
        <v-btn @click="onConfirm">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { computed, defineComponent, ssrRef } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'ConfirmPassModal',
  props: {
    confirming: {
      type: Boolean,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    onConfirm: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const show = computed(() => props.confirming)
    const isConfirming = ssrRef(props.confirming)
    const closeModal = () => {
      isConfirming.value = false
    }
    return {
      show,
      closeModal,
      isConfirming,
    }
  },
})
</script>

<style scoped></style>
