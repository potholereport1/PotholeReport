<template>
  <div id="app">
    <navbar></navbar>
    <router-view></router-view>
  </div>
</template>

<script>
  import navbar from './components/Navbar'

  export default {
    name: 'app',
    components: {
      navbar
    }
  }
</script>

<style>
  @import './assets/bootstrap.min.css';

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 100vh;
    min-height: 100vh;
    text-align: center;
    position: relative;
    color: #2c3e50;
    line-height: 100%;
  }
</style>
