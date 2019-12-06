<template>
  <div class="singer" ref="singer">
    <list-view :data="singerList" @select="selectSinger" ref="listView"></list-view>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import { getSingerList } from '@/api/singer'
import ListView from '@/base/listView/listView'
import { mapMutations } from 'vuex'
import { playListMixin } from '@/common/js/mixin'
import Singer from '@/common/js/singer'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = '10'
export default {
  name: 'singer',
  mixins: [playListMixin],
  data () {
    return {
      singerList: []
    }
  },
  mounted () {
    this._getSingerList()
  },
  methods: {
    handlePlayList (playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.singer.style.bottom = bottom
      this.$refs.listView.refresh()
    },
    selectSinger (singer) {
      // console.log(singer)
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      this.setSinger(singer)
    },
    _getSingerList () {
      getSingerList().then((res) => {
        this.singerList = this._normalizeSinger(res.data.list)
        // console.log(this.singerList)
      })
    },
    _normalizeSinger (list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        let singer = new Singer({ id: item.Fsinger_mid, name: item.Fsinger_name })
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(singer)
        }
        const key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(singer)
      })
      // console.log(map)
      // 获取有序列表
      let hot = []
      let ret = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  },
  components: {
    ListView
  },
  destroyed () {
    console.log('left')
  }
}
</script>

<style lang="stylus" scoped>
.singer
  position: fixed
  top: 88px
  bottom: 0
  width: 100%
  z-index: 99
  overflow hidden
</style>
