import Vue from "vue";
import App from "./App.vue";

import "bootswatch/dist/materia/bootstrap.css";
import "js-dataverse";

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
