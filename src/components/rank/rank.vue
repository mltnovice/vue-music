<template>
  <div class="rank" ref="rank">
    <scroll class="list-top" :data="topList" ref="listTop">
      <div>
        <div v-if="topList.length">
          <div
            class="item"
            v-for="item in topList"
            :key="item.id"
            @click="selectItem(item)"
          >
            <div class="icon">
              <img v-lazy="item.picUrl" alt="" width="100" height="100">
            </div>
            <ul class="list-song">
              <li class="song" v-for="(song, index) in item.songList" :key="index">
                <span>{{index + 1}} {{song.songname}}-{{song.singername}}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="loading-container" v-show="!topList.length">
        <loading></loading>
      </div>
    </scroll>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import { getTopList } from '@/api/rank'
import { ERR_OK } from '@/api/config'
import { playListMixin } from '@/common/js/mixin'
import { mapMutations } from 'vuex'
import Scroll from '@/base/scroll/scroll'
import Loading from '@/base/loading/loading'

export default {
  name: 'rank',
  mixins: [playListMixin],
  data () {
    return {
      topList: []
    }
  },
  created () {
    this._getTopList()
  },
  methods: {
    selectItem (disc) {
      this.$router.push({
        path: `/rank/${disc.id}`
      })
      this.setRankDisc(disc)
    },
    handlePlayList (playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.rank.style.bottom = bottom
      this.$refs.listTop.refresh()
    },
    _getTopList () {
      getTopList().then((res) => {
        if (res.code === ERR_OK) {
          console.log(res.data.topList)
          this.topList = res.data.topList
        }
      })
    },
    ...mapMutations({
      setRankDisc: 'SET_RANK_DISC'
    })
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable.styl'
@import '../../common/stylus/mixin.styl'
.rank
  position: fixed
  top: 108px
  left 0
  bottom: 0
  width: 100%
  z-index: 99
  overflow: hidden
  .list-top
    position: relative
    display: flex
    flex-direction: column
    height: 100%
    .item
      display: flex
      padding: 0 20px
      margin-bottom: 20px
      .icon
        width: 100px
        height: 100px
      .list-song
        height: 100px
        padding: 20px
        margin-left: 1px
        flex: 1
        box-sizing: border-box
        display: flex
        flex-direction: column
        justify-content: space-between
        color: $color-text-d
        font-size: $font-size-small
        no-wrap()
        background: $color-highlight-background
        .song
          no-wrap()
  .loading-container
    position: absolute
    width: 100%
    top: 50%
    transform: translateY(-50%)
</style>
