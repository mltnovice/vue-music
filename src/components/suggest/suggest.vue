<template>
  <scroll
    class="suggest"
    :data="results"
    :pullup="pullup"
    @scrollToEnd="searchMore"
    ref="suggest"
  >
    <ul class="list-suggest">
      <li
        class="item-suggest"
        v-for="(ret, index) in results"
        :key="index"
        @click="selectItem(ret)"
      >
        <i class="icon" :class="iconCls(ret)"></i>
        <span class="name">{{getDisplayName(ret)}}</span>
      </li>
      <loading v-show="hasMore"></loading>
    </ul>
    <div class="no-result-wrapper" v-if="!hasMore && !results.length">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script>
import Scroll from '@/base/scroll/scroll'
import Loading from '@/base/loading/loading'
import Singer from '@/common/js/singer'
import NoResult from '@/base/no-result/no-result'
import { search } from '@/api/search'
import { ERR_OK } from '@/api/config'
import { createSong } from '@/common/js/song'
import { mapMutations, mapActions } from 'vuex'

const TYPE_SINGER = 'singer'
const PERPAGE = 20

export default {
  name: 'suggest',
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      page: 1,
      results: [],
      pullup: true,
      hasMore: true
    }
  },
  methods: {
    _search () {
      this.page = 1
      this.hasMore = true
      this.$refs.suggest.scrollTo(0, 0)
      search(this.query, this.page, this.showSinger, PERPAGE).then((res) => {
        if (res.code === ERR_OK) {
          this.results = this._getResult(res.data)
          this._checkMore(res.data)
        }
      })
    },
    _getResult (data) {
      let ret = []
      if (data.zhida && data.zhida.singerid) {
        ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } })
      }
      if (data.song) {
        ret = ret.concat(this._normalizedSong(data.song.list))
      }
      return ret
    },
    iconCls (item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    getDisplayName (item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name} - ${item.singer}`
      }
    },
    _normalizedSong (list) {
      let ret = []
      list.forEach((musicData) => {
        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    searchMore () {
      if (!this.hasMore) {
        return
      }
      this.page++
      search(this.query, this.page, this.showSinger, PERPAGE).then((res) => {
        if (res.code === ERR_OK) {
          this.results = this.results.concat(this._getResult(res.data))
          this._checkMore(res.data)
        }
      })
    },
    _checkMore (data) {
      const song = data.song
      if (!song.list.length || (song.curnum + song.curpage * PERPAGE) > song.totalnum) {
        this.hasMore = false
      }
    },
    selectItem (item) {
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        this.$router.push({
          path: `/search/${singer.id}`
        })
        this.setSinger(singer)
      } else {
        this.insertSong(item)
      }
      this.$emit('select')
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ])
  },

  watch: {
    query () {
      this._search()
    }
  },
  components: {
    Scroll,
    Loading,
    NoResult
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable.styl'
@import '../../common/stylus/mixin.styl'
.suggest
  position: absolute
  top: 0
  bottom: 0
  width: 100%
  padding: 0 10px
  box-sizing: border-box
  overflow: hidden
  .item-suggest
    display: flex
    align-items: center
    padding-bottom: 20px
    .icon
      display: inline-block
      width: 14px
      height: 14px
      font-size: $font-size-medium
      color: $color-text-d
      no-wrap()
    .name
      flex: 1
      padding: 0 16px
      outline: none
      color: $color-text-d
      font-size: $font-size-medium
      no-wrap()
  .no-result-wrapper
    position: absolute
    left: 0
    right: 0
    top: 50%
    transform: translateY(-50%)
</style>
