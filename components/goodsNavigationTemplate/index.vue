<template>
  <div
    v-if="lists.length"
    class="navigation-wrapper"
  >
    <scroll-view
      class="scroll-view"
      scroll-x="true"
      scroll-with-animation="true"
      :scroll-left="excellentCourseScrollLeft"
    >
      <div
        class="item excellent-course-scroll-item"
        v-for="(item, index) in lists"
        :class="{'item-active' : excellentCourseIndex === index}"
        :key="index"
        @click="onChangeFn(index)"
      >
        <div class="title">{{ item.name }}</div>
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
      'excellentCourseIndex',
      'excellentCourseItemWidth',
      'excellentCourseScrollLeft'
    ])
  },
  methods: {
    ...mapMutations({
      setExcellentCourseIndex: 'SET_EXCELLENT_COURSE_INDEX',
      setExcellentCourseItemWidth: 'SET_EXCELLENT_COURSE_ITEM_WIDTH',
      setExcellentCourseScrollLeft: 'SET_EXCELLENT_COURSE_SCROLL_LEFT'
    }),
    // 切换navigation
    onChangeFn (index) {
      this.setExcellentCourseIndex(index)
    },
    showToastFn (title) {
      uni.showToast({
        title,
        icon: 'none',
        duration: 2000
      })
    }
  },
  watch: {
    lists (lists) {
      if (lists.length) {
        setTimeout(() => {
          let query = uni.createSelectorQuery().in(this)
          query.select('.excellent-course-scroll-item').boundingClientRect((data) => {
            this.setExcellentCourseItemWidth(data.width)
          }).exec()
        }, 500)
      }
    },
    excellentCourseIndex (index) {
      this.setExcellentCourseScrollLeft(index * this.excellentCourseItemWidth - 115)
    }
  },
  props: {
    lists: {
      type: Array,
      default: []
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
    background-color: #fff
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
        .title
          font-size: 14px
          color: #999
        .tag
          position: absolute
          left: 0
          bottom: 0
          width: 100%
          height: 3px
          border-radius: 2px
          background-color: transparent
      .item.item-active
        .title
          color: #000
          font-weight: bold
        .tag
          background-color: #ff4040
    ::-webkit-scrollbar
      width: 0
      height: 0
      color: transparent
</style>
