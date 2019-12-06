<template>
  <div class="search">
    <search-box ref="searchBox" @query="onQueryChange"></search-box>
    <div class="shortcut" ref="shortcut">
      <scroll class="shortcut-wrapper" :data="shortcut" ref="scroll">
        <div>
          <div class="search-hot">
            <div class="search-hot-title">热门搜索</div>
            <div class="hot-key-wrapper">
              <span class="hot-key" v-for="hotKey in hotKeys" :key="hotKey.n" @click="addQuery(hotKey.k)">{{hotKey.k}}</span>
            </div>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <div class="search-history-title">
              <h3 class="search-history-title-text">搜索历史</h3>
              <i class="icon-clear" @click.stop="clearSearch"></i>
            </div>
            <search-list
              :searches="searchHistory"
              @select="addQuery"
              @deleteOne="deleteSearchHistory"
            ></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div class="suggest-wrapper" v-show="query">
      <suggest :query="query" @select="saveSearchHistory(query)"></suggest>
    </div>
    <confirm
      title="是否清空所有搜索历史"
      btn-left="取消"
      btn-right="清空"
      @clickLeft="cancelClearSearch"
      @clickRight="clearSearchCommit"
      v-show="showConfirm"
    ></confirm>
    <router-view></router-view>
  </div>
</template>

<script>
import SearchBox from '@/base/search-box/search-box'
import Suggest from '@/components/suggest/suggest'
import SearchList from '@/base/search-list/search-list'
import Confirm from '@/base/confirm/confirm'
import Scroll from '@/base/scroll/scroll'
import { getHotKey } from '@/api/search'
import { ERR_OK } from '@/api/config'
import { mapActions, mapGetters } from 'vuex'
import { playListMixin } from '@/common/js/mixin'

export default {
  name: 'search',
  mixins: [playListMixin],
  data () {
    return {
      hotKeys: [],
      query: '',
      showConfirm: false
    }
  },
  created () {
    this._getHotKey()
  },
  methods: {
    handlePlayList (playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.shortcut.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    _getHotKey () {
      getHotKey().then((res) => {
        if (res.code === ERR_OK) {
          this.hotKeys = res.data.hotkey.slice(0, 10)
        }
      })
    },
    addQuery (_query) {
      this.$refs.searchBox.setQuery(_query)
    },
    onQueryChange (_query) {
      this.query = _query
    },
    clearSearch () {
      this.showConfirm = true
    },
    clearSearchCommit () {
      this.showConfirm = false
      this.clearSearchHistory()
    },
    cancelClearSearch () {
      this.showConfirm = false
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory',
      'clearSearchHistory'
    ])
  },
  computed: {
    shortcut () {
      return this.hotKeys.concat(this.searchHistory)
    },
    ...mapGetters([
      'searchHistory'
    ])
  },
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Confirm,
    Scroll
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable.styl'
.search
  position: fixed
  top: 88px
  left: 0
  bottom: 0
  width: 100%
  padding: 20px
  box-sizing: border-box
  z-index: 99
  .shortcut
    position: absolute
    left: 20px
    right: 20px
    top: 90px
    bottom: 0
    font-size: $font-size-medium
    overflow: hidden
    .shortcut-wrapper
      position: relative
      height: 100%
      .search-hot-title
        color: $color-text-l
        margin-bottom: 20px
      .hot-key-wrapper
        display: flex
        flex-wrap: wrap
        .hot-key
          padding: 5px 10px
          margin-right: 20px
          margin-bottom: 10px
          color: $color-text-d
          border-radius: 6px
          background: $color-highlight-background
      .search-history
        margin-top: 20px
        color: $color-text-l
        .search-history-title
          height: 40px
          display: flex
          justify-content: space-between
          align-items: center
  .suggest-wrapper
    position: absolute
    left: 20px
    right: 20px
    top: 90px
    bottom: 0
    background: $color-background
    z-index: 10
</style>
