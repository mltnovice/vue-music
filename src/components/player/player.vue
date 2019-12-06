<template>
  <div class="player" v-show="playList.length > 0">
    <transition
      name="normal"
      @before-enter="beforeOpen"
      @enter="opening"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img class="bg-img" :src="currentSong.image" alt="">
        </div>
        <div class="top" ref="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title">{{currentSong.name}}</h1>
          <h2 class="subtitle">{{currentSong.singer}}</h2>
        </div>
        <div class="middle" ref="middle">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper">
              <div class="cd" :class="cdCls">
                <img class="cd-img" :src="currentSong.image" alt="">
              </div>
            </div>
          </div>
        </div>
        <div class="bottom" ref="bottom">
          <div class="progress-wrapper">
            <span class="progress-rate">{{format(currentTime)}}</span>
            <progress-bar
              class="progress-bar"
              :percent="percent"
              @percentChange="onPercentChange"
            ></progress-bar>
            <span class="song-length">{{format(duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon">
              <i @click="togglePlaying" :class="playIcon"></i>
            </div>
            <div class="icon">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon">
              <i class="icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="img-wrapper-box">
          <div class="img-wrapper" :class="cdCls">
            <img class="mini-player-img" :src="currentSong.image" alt="">
          </div>
        </div>
        <div class="song-info">
          <h2 class="title">{{currentSong.name}}</h2>
          <p class="singer">{{currentSong.singer}}</p>
        </div>
        <div class="control">
          <progress-circle class="icon" :radius="30" :percent="percent">
            <i @click.stop="togglePlaying" class="icon-mini" :class="playIcon"></i>
          </progress-circle>
          <div class="icon" @click.stop="openPlayList">
            <i class="icon-playlist"></i>
          </div>
        </div>
      </div>
    </transition>
    <audio
      :src="songUrl"
      ref="audio"
      @timeupdate="updateTime"
      @loadedmetadata="ready"
      @ended="end"
    ></audio>
    <play-list v-show="openPlayListFlag" @close="closePlayList"></play-list>
  </div>
</template>

<script>
import ProgressBar from '@/base/progress-bar/progress-bar'
import ProgressCircle from '@/base/progress-circle/progress-circle'
import PlayList from '@/components/playlist/playlist'
import { playMode } from '@/common/js/config'
import { mapGetters, mapMutations } from 'vuex'
import { prefixStyle } from '@/common/js/dom'
import { shuffle } from '@/common/js/util'

const transform = prefixStyle('transform')
const NORMALCDRADIUS = document.body.clientWidth * 0.8 / 2
const NORMALCDTOP = 80
const MINICDLEFT = 40
const MINICDTOP = 30

export default {
  name: 'player',
  data () {
    return {
      songChange: true,
      currentTime: 0,
      duration: 0,
      openPlayListFlag: false
    }
  },
  methods: {
    open () {
      this.setFullScreen(true)
    },
    back () {
      this.setFullScreen(false)
    },
    beforeOpen (el) {
      const x = -(window.innerWidth / 2 - MINICDLEFT)
      const y = window.innerHeight - NORMALCDRADIUS - NORMALCDTOP - MINICDTOP
      el.style.opacity = '0'
      this.$refs.middle.style[transform] = `translate3d(${x}px, ${y}px, 0)`
      this.$refs.middleL.style[transform] = `scale(0)`
      this.$refs.top.style[transform] = 'translate3d(0, -100px, 0)'
      this.$refs.bottom.style[transform] = 'translate3d(0, 100px, 0)'
    },
    opening (el, done) {
      this._reflow = document.body.offsetHeight
      el.style.opacity = '1'
      this.$refs.middleL.style[transform] = `scale(1)`
      this.$refs.middle.style[transform] = this.$refs.top.style[transform] = this.$refs.bottom.style[transform] = `translate3d(0, 0, 0)`
      el.addEventListener('transitionend', done)
    },
    leave (el, done) {
      this._reflow = document.body.offsetHeight
      const x = -(window.innerWidth / 2 - MINICDLEFT)
      const y = window.innerHeight - NORMALCDRADIUS - NORMALCDTOP - MINICDTOP
      el.style.opacity = '0'
      this.$refs.middle.style[transform] = `translate3d(${x}px, ${y}px, 0)`
      this.$refs.middleL.style[transform] = `scale(0)`
      this.$refs.top.style[transform] = 'translate3d(0, -100px, 0)'
      this.$refs.bottom.style[transform] = 'translate3d(0, 100px, 0)'
      el.addEventListener('transitionend', done)
    },
    afterLeave (el) {
      el.style.opacity = '1'
      this.$refs.middle.style[transform] = this.$refs.top.style[transform] = this.$refs.bottom[transform] = `translate3d(0, 0, 0)`
      this.$refs.middleL.style[transform] = `scale(1)`
    },
    togglePlaying () {
      this.setPlayingState(!this.playing)
    },
    end () {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    loop () {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
    },
    next () {
      let index = this.currentIndex + 1
      if (index === this.playList.length) {
        index = 0
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlaying()
      }
    },
    prev () {
      let index = this.currentIndex - 1
      if (index === -1) {
        index = this.playList.length - 1
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlaying()
      }
    },
    onPercentChange (percent) {
      this.$refs.audio.currentTime = this.duration * percent
      if (!this.playing) {
        this.togglePlaying()
      }
    },
    changeMode () {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this._resetCurrentIndex(list)
      this.setPlayList(list)
    },
    _resetCurrentIndex (list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    ready (el) {
      this.duration = el.target.duration
    },
    updateTime (el) {
      this.currentTime = el.target.currentTime
    },
    format (interval) {
      interval = interval | 0
      const minute = interval / 60 | 0
      const second = this._pad(interval % 60)
      return `${minute}:${second}`
    },
    // 补0
    _pad (num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    },
    openPlayList () {
      this.openPlayListFlag = true
    },
    closePlayList () {
      this.openPlayListFlag = false
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    })
  },
  computed: {
    songUrl () {
      return this.songChange ? 'http://aqqmusic.tc.qq.com/amobile.music.tc.qq.com/C400001X66lF1M9eL9.m4a?guid=9841821448&vkey=744CE3130B8B9E1B40B6EDABF5600739519779E590B8635F17DADA120607A7CDCBCAC43FCA1E1794025904484757E8462F4B934F3E19C253&uin=0&fromtag=38' : 'http://aqqmusic.tc.qq.com/amobile.music.tc.qq.com/C400000H6C8p2BV70X.m4a?guid=9841821448&vkey=7A5E7FFBA36959B0F6AD973F5ADB8B3AE4B5F017FDA25E9D3E89A7A44C2F94168F2FB3632F237141DDA92EAE9825385C6BD1ABB61C74FE24&uin=0&fromtag=38'
    },
    playIcon () {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    cdCls () {
      return this.playing ? 'play' : 'play pause'
    },
    percent () {
      return this.currentTime / this.duration
    },
    iconMode () {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'fullScreen',
      'playList',
      'currentSong',
      'playing',
      'currentIndex',
      'mode',
      'sequenceList'
    ])
  },
  watch: {
    songUrl () {
      this.$nextTick(() => {
        this.$refs.audio.play()
      })
    },
    currentSong (newSong, oldSong) {
      if (newSong.id === oldSong.id) {
        return
      }
      this.songChange = !this.songChange
    },
    playing (newPlaying) {
      this.$nextTick(() => {
        const audio = this.$refs.audio
        newPlaying ? audio.play() : audio.pause()
      })
    }
  },
  components: {
    ProgressBar,
    ProgressCircle,
    PlayList
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable.styl'
@import '../../common/stylus/mixin.styl'
.normal-player
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%
  z-index: 150
  background: $color-background
  .background
    position: absolute
    top: 0
    le: 0
    height: 100%
    width: 100%
    z-index: -1
    opacity: .6
    filter: blur(20px)
    .bg-img
      height: 100%
      width: 100%
  .top
    position: relative
    display: flex
    flex-direction: column
    width: 100%
    color: $color-text
    text-align: center
    .back
      position: absolute
      top: 0
      width: 40px
      height: 40px
      margin-left: 10px
      line-height: 40px
      text-align: center
      transform: rotate(-90deg)
      font-size: $font-size-large-x
      color: $color-theme
      z-index: 12
    .title
      line-height: 40px
      font-size: $font-size-large
    .subtitle
      font-size: $font-size-medium
  .middle
    position: fixed
    top: 80px
    bottom: 170px
    width: 100%
    .middle-l
      display: inline-block
      padding-bottom: 80%
      height: 0
      width: 100%
      position: relative
      .cd-wrapper
        position: absolute
        left: 10%
        right: 10%
        width: 80%
        height: 100%
        .cd
          width: 100%
          height: 100%
          border-radius: 50%
          &.play
            animation: rotate 20s linear infinite
          &.pause
            animation-play-state: paused
          .cd-img
            display: inline-block
            width: 100%
            height: 100%
            box-sizing: border-box
            border-radius: 50%
            border: 10px solid hsla(0,0%,100%,.1)
  .bottom
    position: absolute
    bottom: 50px
    width: 100%
    .progress-wrapper
      position: absolute
      top: -50px
      padding: 0 5%
      margin: 10px 0
      height: 30px
      width: 100%
      display: flex
      box-sizing: border-box
      align-items: center
      text-align: center
      justify-content: space-between
      .progress-rate, .song-length
        flex: 1
        font-size: $font-size-small
        color: $color-text
      .progress-bar
        flex: 3
    .operators
      display: flex
      padding: 0 5%
      justify-content: space-between
      align-items: center
      .icon
        flex: 1
        text-align: center
        font-size: $font-size-large-xx
        .icon-play, .icon-pause
          font-size: $font-size-large-xxx
/* 动画时间控制 */
.normal-player
  transition: all .4s linear
  .top, .bottom
    transition: all .4s cubic-bezier(.86,.18,.82,1.32)
  .middle
    transition: all .4s linear
    .middle-l
      transition: all .4s linear
.mini-player
  position: fixed
  bottom: 0
  left: 0
  display: flex
  width: 100%
  height: 60px
  box-sizing: border-box
  padding-right: 10px
  align-items: center
  z-index: 150
  background: $color-highlight-background
  &.mini-enter-active, &.mini-leave-active
    transition: all .4s
  &.mini-enter, &.mini-leave-to
    opacity: 0
  .img-wrapper-box
    width: 80px
    text-align: center
    .img-wrapper
      display: inline-block
      width: 40px
      height: 40px
      &.play
        animation: rotate 20s linear infinite
      &.pause
        animation-play-state: paused
      .mini-player-img
        width: 100%
        height: 100%
        border-radius: 50%
  .control
    flex: 1
    display: flex
    color: $color-theme-d
    .icon
      flex: 1
      text-align: center
      .icon-play, .icon-playlist, .icon-pause
        font-size: $font-size-large-xx
      .icon-mini
        position: absolute
        left: 50%
        top: 0
        margin-left: -15px
  .song-info
    flex: 2
    display: flex
    height: 40px
    flex-direction: column
    justify-content: space-around
    no-wrap()
    .title
      color: $color-text
      font-size: $font-size-medium
    .singer
      color: $color-text-d
      font-size: $font-size-small
  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
