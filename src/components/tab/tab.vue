<template>
  <div class="tab">
    <router-link
      v-for="(tab, index) in tabs"
      :key="index"
      tag="div"
      class="tab-item"
      :to=tab.src
    >
      <span class="tab-link">{{tab.desc}}</span>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'tab',
  data () {
    return {
      tabs: [{
        desc: '推荐', src: '/recommend'
      }, {
        desc: '歌手', src: '/singer'
      }, {
        desc: '排行', src: '/rank'
      }, {
        desc: '搜索', src: '/search'
      }]
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable.styl'
.tab
  position: relative
  z-index: 99
  background: $color-background
  display: flex
  height: 44px
  justify-content: space-around
  align-items: center
  font-size: $font-size-medium
  .tab-item
    flex: 1
    text-align: center
    .tab-link
      padding: 5px 0
      color: $color-text-l
  .router-link-active
    .tab-link
      color: $color-theme
      border-bottom: 2px solid $color-theme
</style>
