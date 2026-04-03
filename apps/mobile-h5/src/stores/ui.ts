import { ref, watch } from 'vue';
import { defineStore } from 'pinia';

const THEME_KEY = 'easy-stay:theme-dark';

const applyTheme = (isDark: boolean) => {
  document.body.classList.toggle('theme-dark', isDark);
};

export const useUiStore = defineStore('mobile-ui', () => {
  const isDarkMode = ref(localStorage.getItem(THEME_KEY) === 'true');
  const userProfile = ref({
    username: '易宿会员',
    avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=EasyStay'
  });

  watch(
    isDarkMode,
    (value) => {
      localStorage.setItem(THEME_KEY, String(value));
      applyTheme(value);
    },
    { immediate: true }
  );

  const toggleDarkMode = (value?: boolean) => {
    isDarkMode.value = typeof value === 'boolean' ? value : !isDarkMode.value;
  };

  return {
    isDarkMode,
    userProfile,
    toggleDarkMode
  };
});
