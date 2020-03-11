<template>
  <div class="secondary-navigation-wrapper">
    <scroll-view
      scroll-x="true"
      scroll-with-animation="true"
      class="scroll-view"
    >
      <div
        v-if="lists.length"
        v-for="(item, index) in lists"
        @click="onSwiperFn(index, item.parentid, item.catid)"
        :class="{'item-active' : currentIndex === index}"
        :key="index"
        class="item"
      >
        <div class="name">{{ item.catname }}</div>
      </div>
    </scroll-view>
  </div>
</template>

<script>
export default {
  data () {
    return {
      currentIndex: 0
    }
  },
  methods: {
    onSwiperFn (index, parentid, catid) {
      let id = 0
      !parentid ? id = parentid : id = catid
      this.currentIndex = index
      const data = {
        ids: id,
        secondaryIndex: index
      }
      this.$emit('secondaryNavChild', data)
    }
  },
  props: {
    lists: {
      type: Array,
      default: []
    },
    state: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="stylus" scoped>
  .secondary-navigation-wrapper
    width: 100%
    height: 52px
    padding: 0 15px
    box-sizing: border-box
    .scroll-view
      width: 100%
      height: 100%
      display: flex
      white-space: nowrap
      .item
        position: relative
        padding: 0 15px
        line-height: 52px
        display: inline-block
        &.item:first-child
          padding-left: 0
        &.item:last-child
          padding-right: 0
        .name
          position: relative
          font-size: 14px
          color: #666
      .item.item-active
        .name
          font-size: 16px
          font-weight: bold
          color: #ff6464
    ::-webkit-scrollbar
      width: 0
      height: 0
      color: transparent
</style>
