<template>
  <transition name="toggle">
    <div class="play-list">
      <div class="list-mask" @click.stop="closeList"></div>
      <div class="list-wrapper">
        <div class="list-header">
          <i class="icon" :class="iconMode"  @click="changeMode"></i>
          <div class="play-mode">循环播放</div>
          <i class="icon-clear" @click="clearList"></i>
        </div>
        <scroll class="list-content" :data="playList">
          <ul>
            <li class="item" v-for="song in playList" :key="song.id">
              <i class="icon" :class="isPlaying(song)"></i>
              <p class="song-name">{{song.name}}</p>
              <div class="item-operate">
                <i class="icon-not-favorite"></i>
                <i class="icon-delete" @click="deleteSong(song)"></i>
              </div>
            </li>
          </ul>
        </scroll>
        <div class="list-operate">
          <div class="add">
            <i class="icon-add"></i>
            <span class="add-text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click.stop="closeList">关闭</div>
      </div>
      <confirm
        title="是否清空播放列表"
        btn-left="取消"
        btn-right="清空"
        @clickLeft="cancelClear"
        @cliclRight="clearListCommit"
        v-show="showConfirm"
      ></confirm>
    </div>
  </transition>
</template>

<script>
import Scroll from '@/base/scroll/scroll'
import Confirm from '@/base/confirm/confirm'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { playMode } from '@/common/js/config'
import { shuffle } from '@/common/js/util'

export default {
  name: 'playlist',
  data () {
    return {
      showConfirm: false
    }
  },
  methods: {
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
    closeList () {
      this.$emit('close')
    },
    isPlaying (item) {
      return item.id === this.currentSong.id ? 'icon-play' : ''
    },
    clearList () {
      this.showConfirm = true
    },
    cancelClear () {
      this.showConfirm = false
    },
    clearListCommit () {
      this.showConfirm = false
      this.clearPlayList()
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    }),
    ...mapActions([
      'deleteSong',
      'clearPlayList'
    ])
  },
  computed: {
    iconMode () {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'mode',
      'sequenceList',
      'playList',
      'currentSong'
    ])
  },
  components: {
    Scroll,
    Confirm
  }
}
</script>

<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl"
.play-list
  position: fixed
  top: 0
  bottom: 0
  left: 0
  right: 0
  z-index: 200
  &.toggle-enter-active, &.toggle-leave-active
    transition: all .3s
  &.toggle-enter, &.toggle-leave-to
    opacity: 0
    transform translate3d(0, 63%, 0)
  .list-mask
    position: absolute
    top: 0
    bottom: 0
    left: 0
    right: 0
    background: $color-background-d
  .list-wrapper
    position: absolute
    max-height: 67%
    width: 100%
    padding: 0 30px
    box-sizing border-box
    bottom: 0
    background: $color-highlight-background
    display: flex
    flex-direction column
    .list-header
      display: flex
      align-items: center
      padding: 20px 0
      font-size: $font-size-medium
      color: $color-text-l
      .icon
        margin-left: -10px
        margin-right: 10px
        color: $color-theme-d
        font-size: $font-size-large-xx
      .play-mode
        flex: 1
    .list-content
      ///*position: absolute*/
      ///*top: 70px*/
      /*height: 200px*/
      flex 1
      width: 100%
      overflow: hidden
      .item
        display: flex
        height: 40px
        align-items: center
        justify-content: space-between
        font-size: $font-size-medium
        .icon
          color: $color-theme-d
          width: 14px
          height: 14px
        .song-name
          flex: 1
          text-align: left
          margin-left: 12px
          color: $color-text-d
        .item-operate
          font-size: $font-size-small
          .icon-delete
            margin-left: 12px
    .list-operate
      .add
        display: flex
        align-items: center
        justify-content: center
        width: 50%
        height: 30px
        margin: 20px auto
        border: 1px solid $color-text-l
        border-radius: 30px
        font-size: $font-size-small
        color: $color-text-l
        .icon-add, .add-text
          padding: 0 5px
    .list-close
      height: 40px
      line-height: 40px
      margin: 0 -30px
      text-align: center
      font-size: $font-size-medium-x
      color: $color-text-l
      background: $color-background-d
</style>
