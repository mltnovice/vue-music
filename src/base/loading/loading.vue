<template>
  <div class="loading">
    <img width="24" height="24" src="./loading.gif" alt="载入中">
    <p class="desc">{{desc}}</p>
  </div>
</template>

<script>
export default {
  name: 'loading',
  props: {
    desc: {
      type: String,
      default: '正在载入中......'
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable.styl'
.loading
  width 100%
  text-align: center
  .desc
    line-height: 20px
    font-size: $font-size-small
    color: $color-text-l
</style>
