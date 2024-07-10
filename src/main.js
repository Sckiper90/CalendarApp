/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import vuetify from './plugins/vuetify'




createApp(App)
  .use(vuetify)
  .mount('#app');

const app = createApp(App)

registerPlugins(app)

