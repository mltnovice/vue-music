<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div
        class="progress-btn-wrapper"
        ref="progressBtn"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { prefixStyle } from '@/common/js/dom'
const transform = prefixStyle('transform')

export default {
  name: 'progress-bar',
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created () {
    this.touch = {}
  },
  methods: {
    progressTouchStart (el) {
      this.touch.initiated = true
      this.touch.startX = el.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove (el) {
      if (!this.touch.initiated) {
        return
      }
      const deltaX = el.touches[0].pageX - this.touch.startX
      const offsetWidth = Math.min(this.$refs.progressBar.clientWidth, Math.max(0, this.touch.left + deltaX))
      this._offset(offsetWidth)
    },
    progressTouchEnd () {
      this.touch.initiated = false
      this._triggerProgress()
    },
    progressClick (el) {
      this._offset(el.offsetX)
      this._triggerProgress()
    },
    _triggerProgress () {
      const barWidth = this.$refs.progressBar.clientWidth
      const percent = this.$refs.progress.clientWidth / barWidth
      this.$emit('percentChange', percent)
    },
    _offset (offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
    }
  },
  watch: {
    percent (newPercent) {
      if (newPercent >= 0 && !this.touch.initiated) {
        const barWidth = this.$refs.progressBar.clientWidth
        const offsetWidth = newPercent * barWidth
        this._offset(offsetWidth)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable.styl'
.progress-bar
  width: 100%
  height: 100%
  position: relative
  display: flex
  align-items: center
  .bar-inner
    height: 4px
    width: 100%
    background: $color-background-d
    .progress
      width: 0
      height: 100%
      background: $color-theme
    .progress-btn-wrapper
      display: inline-block
      width: 30px
      height: 30px
      position: absolute
      top: 0
      left: -15px
      .progress-btn
        position: absolute
        top: 7px
        left: 7px
        width: 16px
        height: 16px
        border: 3px solid $color-text
        box-sizing: border-box
        border-radius: 50%
        background: $color-theme
</style>
