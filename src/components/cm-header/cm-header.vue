<template>
  <div class="cm-header">
    <i class="cm-header-icon"></i>
    <h1 class="cm-header-title">Chicken Music</h1>
  </div>
</template>

<script>
export default {
  name: 'cm-header'
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/mixin.styl'
@import '../../common/stylus/variable.styl'
.cm-header
  position: relative
  z-index: 99
  background: $color-background
  height: 44px
  line-height: 44px
  text-align: center
  color: $color-theme
  .cm-header-icon
    display: inline-block
    height: 32px
    width: 32px
    vertical-align: middle
    bg-image('logo')
    background-size: 100% 100%
  .cm-header-title
    display: inline-block
    margin-left: 10px
    vertical-align: middle
    font-size: $font-size-large
    color: $color-theme
</style>
