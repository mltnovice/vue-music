<template>
  <transition name="confirm-fade">
    <div class="confirm">
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <p class="confirm-title">{{title}}</p>
          <div class="operate">
            <div class="operate-left" @click="clickLeft">{{btnLeft}}</div>
            <div class="operate-right" @click="clickRight">{{btnRight}}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'confirm',
  props: {
    title: {
      type: String,
      default: ''
    },
    btnLeft: {
      type: String,
      default: '取消'
    },
    btnRight: {
      type: String,
      default: '确定'
    }
  },
  methods: {
    clickLeft () {
      this.$emit('clickLeft')
    },
    clickRight () {
      this.$emit('clickRight')
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable.styl'
.confirm
  position: fixed
  top: 0
  bottom: 0
  left: 0
  right: 0
  background: $color-background-d
  z-index: 999
  &.confirm-fade-enter-active
    animation: confirm-fadein .3s
    .confirm-wrapper
      animation: confirm-zoom .3s
  &.confirm-fade-leave-active
    transition: opacity .3s
  &.confirm-fade-leave-to
    opacity: 0
  .confirm-wrapper
    height: 100%
    .confirm-content
      position: absolute
      top: 50%
      left: 50%
      transform: translate3d(-50%, -50%, 0)
      border-radius: 6px
      font-size: $font-size-medium-x
      background: $color-highlight-background
      .confirm-title
        color: $color-text-l
        padding: 15px 20px
        white-space: nowrap
      .operate
        border-top: 1px solid $color-background-d
        color: $color-text-d
        display: flex
        text-align: center
        .operate-left
          flex: 1
          padding: 12px 20px
          border-right: 1px solid $color-background-d
        .operate-right
          flex: 1
          padding: 12px 20px
@keyframes confirm-fadein
  0%
    opacity: 0
  100%
    opacity: 1
@keyframes confirm-zoom
  0%
    transform: scale(0)
  50%
    transform: scale(1.1)
  100%
    transform: scale(1)
</style>
