import Vue from "vue";
import App from "./App.vue";

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import store from './store';

import "./test";

import * as filters from './filters';
// register global utility filters.
Object.keys( filters ).forEach( key => {
  Vue.filter( key, filters[ key ] )
} );

Vue.use( ElementUI, { size: 'small', zIndex: 3000 } );

Vue.config.productionTip = false;

new Vue( {
  store,
  render: h => h( App )
} ).$mount( "#app" );