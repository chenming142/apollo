<template>
  <div id="app">
    <MainAsideList></MainAsideList>
  </div>
</template>

<script>
import MainAsideList from './components/main-aside-list.vue'

export default {
  name: "App",
  components: {
    MainAsideList
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
