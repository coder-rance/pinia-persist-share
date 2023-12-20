### Install

`npm install pinia-persist-share`

### Description
Sync your Pinia state across browser tabs.Only Supports vue3, easy as shit!

### Usage

```javascript
// main.js
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import PiniaPersistShare from "pinia-persist-share";

const app = createApp(App);
const pinia = createPinia();

pinia.use(PiniaPersistShare);
app.use(pinia);

app.mount("#app");
```

```javascript
// src/store/status.js
import { ref } from "vue";
import { defineStore } from "pinia";

export const useStatusStore = defineStore(
  "status",
  () => {
    const now = ref(Date.now());

    const setNow = (payload) => {
      now.value = payload;
    };

    return {
      now,
      setNow,
    };
  },
  {
    persistShare: {
      enabled: true, // enable plugin for this store
    },
  }
);
```
