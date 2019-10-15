<template>
  <transition :name="`pop-${direction === 'forward' ? 'in' : 'out'}`">
    <keep-alive v-if="$route.meta.keepAlive">
      <router-view></router-view>
    </keep-alive>
    <router-view v-else></router-view>
  </transition>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      direction: state => state.general && state.general.direction
    })
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.pop-out-enter-active,
.pop-out-leave-active,
.pop-in-enter-active,
.pop-in-leave-active {
  will-change: transform;
  transition: all .25s;
  height: 100%;
  top: 0;
  position: absolute;
  backface-visibility: hidden;
  perspective: 1000;
}

.pop-out-enter {
  transform: translate3d(-100%, 0, 0);
}

.pop-out-leave-active {
  transform: translate3d(100%, 0, 0);
}

.pop-in-enter {
  transform: translate3d(100%, 0, 0);
}

.pop-in-leave-active {
  transform: translate3d(-100%, 0, 0);
}
</style>