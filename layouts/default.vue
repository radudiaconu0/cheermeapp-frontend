<template>
  <v-app dark>
    <v-main>
      <v-container fluid fill-height>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer app padless fixed>
      <v-col class="text-center" cols="12">
        {{ new Date().getFullYear() }} — <strong>CheerMeApp</strong>
      </v-col>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({})
</script>
