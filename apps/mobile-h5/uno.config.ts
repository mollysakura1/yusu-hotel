import { defineConfig, presetAttributify, presetIcons, presetUno } from 'unocss';

export default defineConfig({
  presets: [presetUno(), presetAttributify(), presetIcons()],
  theme: {
    colors: {
      brand: {
        50: '#edf6ff',
        100: '#d7ecff',
        300: '#74b5ff',
        500: '#1677ff',
        600: '#0a5ad9'
      },
      price: '#ff6a00'
    },
    boxShadow: {
      card: '0 8px 24px rgba(26, 79, 160, 0.10)'
    }
  }
});
