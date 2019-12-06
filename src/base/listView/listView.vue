<template>
  <scroll
    class="list-view"
    :data="data"
    ref="listView"
    :probeType="3"
    :listenScroll="listenScroll"
    @scroll="scroll"
  >
    <ul>
      <li
        v-for="(group, index) in data"
        :key="index"
        ref="listGroup"
      >
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li
            class="list-group-item"
            v-for="(singer, index) in group.items"
            :key="index"
            @click="selectSinger(singer)"
          >
            <img class="singer-avatar" v-lazy="singer.avatar" :alt="singer.name">
            <span class="singer-name">{{singer.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut">
      <ul>
        <li
          class="shortcut"
          v-for="(short, index) in shortcutList"
          :key="index"
          :data-index="index"
          @touchstart="onShortcutTouchStart"
          @touchmove.stop.prevent="onShortcutTouchMove"
          :class="{active: currentIndex === index}"
        >
          {{short}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" ref="fixed">
      <h1 class="fixed-title" v-show="scrollY <= 0">{{fixedTittle}}</h1>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
import Scroll from '@/base/scroll/scroll'
import Loading from '@/base/loading/loading'
import { getData } from '@/common/js/dom'

const ANCHOR_HEIGHT = 18
const TITLE_HEIGHT = 30

export default {
  name: 'listView',
  props: {
    data: {
      type: Array,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      listHeight: 0,
      scrollY: -1,
      currentIndex: 0,
      diff: 0
    }
  },
  created () {
    this.touch = {}
    this.listenScroll = true
  },
  computed: {
    shortcutList () {
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
    },
    fixedTittle () {
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  methods: {
    selectSinger (singer) {
      this.$emit('select', singer)
    },
    onShortcutTouchStart (el) {
      let anchorIndex = getData(el.target, 'index')
      let firstTouch = el.touches[0]
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove (el) {
      let firstTouch = el.touches[0]
      this.touch.y2 = firstTouch.pageY
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta
      if (anchorIndex >= 0 && anchorIndex < this.listHeight.length - 1) {
        this._scrollTo(anchorIndex)
      }
    },
    scroll (pos) {
      this.scrollY = pos.y
    },
    refresh () {
      this.$refs.listView.refresh()
    },
    _scrollTo (anchorIndex) {
      this.scrollY = -this.listHeight[anchorIndex]
      this.$refs.listView.scrollToElement(this.$refs.listGroup[anchorIndex])
    },
    _calculateHeight () {
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  },
  watch: {
    data () {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY (newY) {
      const listHeight = this.listHeight
      // newY >= 0,则列表已拉动到顶，固定为'热门'标签
      if (newY >= 0) {
        this.currentIndex = 0
        return
      }
      // 列表在中间滚动
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          this.diff = height2 + newY
          return
        }
      }
      // 列表滚动到最底部，固定标签为最后一个标签,listHeight多push了一个0，所以为-2
      this.currentIndex = listHeight.length - 2
    },
    diff (newVal) {
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      // 缓存fixedTOP值减少dom操作
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`
    }
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable.styl'
.list-view
  height: 100%
  position: relative
  color: $color-text-l
  .list-group-title
    height: 30px
    line-height: 30px
    padding-left: 20px
    margin-bottom: 20px
    font-size: $font-size-small
    background: $color-highlight-background
  .list-group-item
    display: flex
    justify-content: space-between
    padding: 0 30px 30px 30px
    .singer-avatar
      width: 50px
      height: 50px
      border-radius: 50%
    .singer-name
      flex: 1
      display: flex
      padding-left: 20px
      align-items: center
      font-size: $font-size-medium
  .list-shortcut
    padding: 20px 0
    position: absolute
    top: 50%
    right: 0
    transform: translateY(-50%)
    display: flex
    align-items: center
    text-align: center
    background: $color-background-d
    border-radius: 20px
    .shortcut
      padding: 3px 10px
      font-size: $font-size-small
    .active
      color: $color-theme
  .list-fixed
    position: absolute
    top: 0
    left: 0
    width: 100%
    .fixed-title
      height: 30px
      line-height: 30px
      padding-left: 20px
      margin-bottom: 20px
      font-size: $font-size-small
      background: $color-highlight-background
  .loading-container
    position: absolute
    width: 100%
    top: 50%
    transform: translateY(50%)
</style>
