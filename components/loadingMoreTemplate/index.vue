<template>
  <div v-if="upyunUrl" class="loading-more-wrapper">
    <div
      v-if="lists.length && lists.length >= listsLength"
      class="bottom-bar"
    >
      <div
        v-if="loadingState"
        class="loading-icon"
      >
        <image :src="upyunUrl + '/wxXcxImg/images/loading-icon.gif'" />
      </div>
      <div
        v-if="!loadingState && !isDataState"
        class="loading-text-bar"
      >
        <div class="line"></div>
        <div class="text">上拉加载更多</div>
        <div class="line"></div>
      </div>
      <div
        v-if="!loadingState && isDataState"
        class="loading-text-bar"
      >
        <div class="line"></div>
        <div class="text">我是有底线的</div>
        <div class="line"></div>
      </div>
    </div>
    <div
      v-if="isDataState && !lists.length"
      class="no-data-wrapper"
    >
      <image :src="upyunUrl + '/wxXcxImg/images/no-data-icon.png'" />
      <div class="text">这里什么都没有</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { upyunUrl } from '../../api/config'

export default {
  data () {
    return {
      upyunUrl
    }
  },
  computed: {
    ...mapState([
      'loadingState',
      'isDataState'
    ])
  },
  props: {
    lists: {
      type: Array,
      default: []
    },
    listsLength: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style lang="stylus" scoped>
  .loading-more-wrapper
    width: 100%
    height: auto
    .bottom-bar
      width: 100%
      height: 40px
      .loading-icon
        width: 40px
        height: 100%
        margin: 0 auto
        image
          width: 100%
          height: 100%
          display: block
      .loading-text-bar
        width: 100%
        height: 100%
        padding: 0 50px
        display: flex
        align-items: center
        box-sizing: border-box
        .line
          flex: 1
          height: 1px
          background-color: #ebebeb
        .text
          font-size: 12px
          padding: 0 13px
          color: #c5c5c5
    .no-data-wrapper
      width: 100%
      height: auto
      padding-top: 50px
      image
        display: block
        width: 245px
        height: 140px
        margin: 0 auto
      .text
        font-size: 14px
        line-height: 80px
        text-align: center
        color: #999
</style>
