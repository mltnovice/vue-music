<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(dos, index) in dots" :key="index" :class="[currentPageIndex === index ? 'active' : '']"></span>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import { addClass } from '@/common/js/dom'

export default {
  name: 'slider',
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 2000
    }
  },
  data () {
    return {
      dots: {},
      currentPageIndex: 0
    }
  },
  mounted () {
    setTimeout(() => {
      this._setSliderWidth()
      this._initDots()
      this._initSlider()
      if (this.autoPlay) {
        this._play()
      }
    }, 20)
    window.addEventListener('resize', () => {
      if (!this.slider) {
        return
      }
      this._setSliderWidth(true)
      this.slider.refresh()
    })
  },
  methods: {
    _setSliderWidth (isResize) {
      this.children = this.$refs.sliderGroup.children
      let width = 0
      let sliderWidth = this.$refs.slider.clientWidth
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        addClass(child, 'slider-item')
        child.style.width = sliderWidth + 'px'
        width += sliderWidth
      }
      if (this.loop && !isResize) {
        width += 2 * sliderWidth
      }
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    _initSlider () {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        },
        click: true
      })
      this.slider.on('scrollEnd', () => {
        this.currentPageIndex = this.slider.getCurrentPage().pageX
        if (this.autoPlay) {
          clearTimeout(this.timer)
          this._play()
        }
      })
    },
    _initDots () {
      this.dots = new Array(this.children.length)
    },
    _play () {
      this.timer = setTimeout(() => {
        this.slider.next(400)
      }, this.interval)
    }
  },
  destroyed () {
    clearTimeout(this.timer)
  }
}
</script>

<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl"
.slider
  position: relative
  min-height: 1px
  .slider-group
    position: relative
    overflow: hidden
    white-space: nowrap
    .slider-item
      float: left
      box-sizing: border-box
      overflow: hidden
      text-align: center
      img
        display: block
        width: 100%
  .dots
    position: absolute
    right: 0
    left: 0
    bottom: 12px
    transform: translateZ(1px)
    text-align: center
    .dot
      display: inline-block
      width: 8px
      height: 8px
      margin: 0 4px
      background: $color-text-l
      border-radius: 8px
    .active
      width: 20px
</style>
