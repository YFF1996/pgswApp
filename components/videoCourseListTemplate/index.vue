<template>
  <div v-if="lists.length" class="list-wrapper">
    <scroll-view
      class="scroll-view"
      scroll-x="true"
    >
      <div
        class="item list-scroll-item"
        v-for="(item, index) in lists"
        @click="onGetVideoDetailsFn(item)"
        :key="index"
      >
        <div
          class="item-list"
          :class="item.vid === obj.id && item.act_record ? 'item-active item-list-active' : item.vid === obj.id ? 'item-active' : item.act_record ? 'item-list-active' : ''"
        >
          <div v-if="item.free_audition === 1" class="label">试看</div>
          <div class="title">{{ item.title }}</div>
          <div class="bottom">
            <div
              v-if="item.act_record"
              class="act-record-text"
            >已学完</div>
            <div v-else class="act-record-text hide">医学</div>
            <div class="duration-text">{{ item.duration }}</div>
          </div>
        </div>
      </div>
    </scroll-view>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {
    onGetVideoDetailsFn (item) {
      this.$emit('getVideoDetailsChild', item.vid)
    }
  },
  props: {
    lists: {
      type: Array,
      default: []
    },
    obj: {
      type: Object,
      default: {}
    }
  }
}
</script>

<style lang="stylus" scoped>
  .list-wrapper
    width: 100%
    height: auto
    .scroll-view
      padding: 15px 0 30px
      box-sizing: border-box
      width: 100%
      height: 100%
      display: flex
      white-space: nowrap
      border-bottom: 5px solid #f6f6f6
      .item
        display: inline-block
        padding: 15px 8px 0
        box-sizing: border-box
        .item-list
          position: relative
          width: 125px
          height: 90px
          padding: 10px
          border-radius: 4px
          background: #f2f2f2
          box-sizing: border-box
          border: 1px solid transparent
          .label
            position: absolute
            right: 0
            top: -10px
            width: 28px
            height: 16px
            line-height: 16px
            font-size: 10px
            text-align: center
            color: #fff
            background: #ff6464
            border-radius: 3px 3px 3px 0px
          .title
            padding-right: 5px
            height: 37px
            line-height: 20px
            font-size: 14px
            color: #33344C
            white-space: normal
            display: -webkit-box
            -webkit-box-orient: vertical
            -webkit-line-clamp: 2
            overflow: hidden
          .bottom
            margin-top: 19px
            width: 100%
            display: flex
            justify-content: space-between
            font-size: 12px
            color: #9798a6
          .act-record-text
            color: #fff
          .hide
            display: none
          .duration-text
            color: #9798A6
        .item-list-active
          background: #e1e1e1
        .item-active
          border: 1px solid #ffd5d5
    ::-webkit-scrollbar
      width: 0
      height: 0
      color: transparent
</style>
