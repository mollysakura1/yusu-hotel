import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useUiStore } from './stores/ui';
import 'uno.css';
import '@unocss/reset/tailwind.css';
import './styles.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia).use(router);
useUiStore(pinia);
app.mount('#app');
