<template>
  <register-form></register-form>
</template>
<script lang="ts">
import RegisterForm from '../components/auth/RegisterForm.vue'

export default {
  auth: 'guest',
  components: { RegisterForm },
}
</script>
