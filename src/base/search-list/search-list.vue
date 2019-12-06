<template>
  <div class="search-list" v-if="searches.length">
    <div
      class="history-wrapper"
      v-for="(history, index) in searches"
      :key="index"
      @click="selectItem(history)">
      <span class="history-text">{{history}}</span>
      <i class="icon-delete" @click.stop="deleteOne(history)"></i>
    </div>
  </div>

</template>

<script>
export default {
  name: 'search-list',
  props: {
    searches: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
    selectItem (history) {
      this.$emit('select', history)
    },
    deleteOne (history) {
      this.$emit('deleteOne', history)
    }
  }
}
</script>

<style lang="stylus" scoped>
.history-wrapper
  height: 40px
  display: flex
  justify-content: space-between
  align-items: center
  color: $color-text-d
</style>
