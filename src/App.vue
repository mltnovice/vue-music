<template>
  <div id="app">
    <cm-header></cm-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import CmHeader from 'components/cm-header/cm-header'
import Tab from 'components/tab/tab'
import Player from 'components/player/player'
import { getPurl } from '@/api/singer'

export default {
  name: 'app',
  created () {
    getPurl().then((res) => {
      console.log(res)
    })
  },
  components: {
    CmHeader,
    Tab,
    Player
  }
}
</script>

<style lang="stylus">
@import 'common/stylus/variable.styl'
#app
  color: $color-theme
  height: 100%
</style>
