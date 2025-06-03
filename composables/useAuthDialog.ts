import { ref } from 'vue';

const open = ref(false);
const mode = ref<'signIn' | 'signUp'>('signIn');

export function useAuthDialog() {
  function setOpen(val: boolean) {
    open.value = val;
  }
  function setMode(val: 'signIn' | 'signUp') {
    mode.value = val;
  }
  return {
    open,
    mode,
    setOpen,
    setMode,
  };
}
