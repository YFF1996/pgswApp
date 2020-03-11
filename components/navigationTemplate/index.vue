<template>
  <div class="navigation-wrapper">
    <scroll-view
      scroll-x="true"
      scroll-with-animation="true"
      :scroll-left="navigationScrollLeft"
      class="scroll-view"
    >
      <div
        v-if="lists.length"
        v-for="(item, index) in lists"
        :class="navigationIndex === 0 && navigationIndex !== index ? 'front-item' : navigationIndex !== 0 && navigationIndex === index ? 'item-active' : navigationIndex === 0 && navigationIndex === index ? 'front-item item-active' : ''"
        :key="index"
        @click="onChangeFn(index)"
        class="item navigation-scroll-item"
      >
        <div class="name">{{ item.name }}</div>
        <div class="tag"></div>
      </div>
    </scroll-view>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapState([
      'navigationIndex',
      'navigationScrollLeft',
      'navigationItemWidth'
    ])
  },
  methods: {
    ...mapMutations({
      setNavigationIndex: 'SET_NAVIGATION_INDEX',
      setNavigationScrollLeft: 'SET_NAVIGATION_SCROLL_LEFT',
      setNavigationItemWidth: 'SET_NAVIGATION_ITEM_WIDTH',
      setDuration: 'SET_DURATION'
    }),
    // 切换navigation
    onChangeFn (index) {
      this.setDuration(0)
      setTimeout(() => {
        this.setNavigationIndex(index)
      }, 20)
    }
  },
  watch: {
    lists (lists) {
      if (lists.length) {
        setTimeout(() => {
          let query = uni.createSelectorQuery().in(this)
          query.select('.navigation-scroll-item').boundingClientRect((data) => {
            this.setNavigationItemWidth(data.width)
          }).exec()
        }, 500)
      }
    },
    navigationIndex (index) {
      this.setNavigationScrollLeft(index * this.navigationItemWidth - 143)
    }
  },
  props: {
    lists: {
      type: Array,
      default: []
    },
    status: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="stylus" scoped>
  .navigation-wrapper
    position: fixed
    left: 0
    top: 0
    width: 100%
    height: 54px
    z-index: 999
    .scroll-view
      width: 100%
      height: 100%
      display: flex
      white-space: nowrap
      .item
        position: relative
        padding: 0 15px
        line-height: 54px
        display: inline-block
        .name
          font-size: 15px
          color: #999
        .tag
          position: absolute
          left: 35%
          bottom: 10px
          width: 30%
          height: 3px
          border-radius: 2px
          background-color: transparent
      .front-item
        .name
          color: #fff
      .item.item-active
        .name
          font-size: 17px
          color: #000
          font-weight: bold
        .tag
          background-color: #ff6464
      .front-item.item-active
        .name
          font-size: 16px
          color: #fff
          font-weight: bold
        .tag
          background-color: #fff
    ::-webkit-scrollbar
      width: 0
      height: 0
      color: transparent
</style>
