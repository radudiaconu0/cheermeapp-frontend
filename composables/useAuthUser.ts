import { useContext, computed } from '@nuxtjs/composition-api'

export default function useAuthUser() {
  const { $auth } = useContext()
  return computed(() => $auth.user)
}
