<template>
  <div class="no-result">
    <div class="no-result-icon"></div>
    <p class="no-result-text">{{title}}</p>
  </div>
</template>

<script>
export default {
  name: 'no-result',
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "../../common/stylus/mixin.styl"
@import "../../common/stylus/variable.styl"
.no-result
  width: 100%
  text-align: center
  .no-result-icon
    display: inline-block
    width: 100px
    height: 100px
    bg-image('no-result')
    background-size: 100%
  .no-result-text
    margin-top: 30px
    font-size: $font-size-medium
    color: $color-text-d
</style>
