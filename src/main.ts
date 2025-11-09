import { createApp, defineAsyncComponent } from 'vue';
import App from './App.vue';

const comps = {
  Ainput: defineAsyncComponent(() => import('./assets/Ainput.vue')),
  Ainput2: defineAsyncComponent(() => import('./assets/Ainput2.vue')),
  Ainput3: defineAsyncComponent(() => import('./assets/Ainput3.vue')),
};
const app = createApp(App);
for (const [key, component] of Object.entries(comps)) {
  app.component(key, component);
}
app.mount('#app');
