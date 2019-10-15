<template>
  <div class="index-home">
    <home-header></home-header>
    <div class="index-home__content">
      <h3 style="color: #999;">Vue-mobile-app-template</h3>
      <br>
      <span>Custom Content</span>
    </div>
  </div>
</template>

<script>
import homeHeader from './header'

export default {
  components: {
    homeHeader
  }
}
</script>

<style>
.index-home{
  height: 100vh;
}
.index-home__content{
  padding-top: 300px;
  text-align: center;
}
</style>
