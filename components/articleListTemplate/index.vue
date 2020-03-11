<template>
  <div class="news-list-ul" v-if="upyunUrl">
    <ul>
      <div
        class="news-list"
        v-if="lists.length"
        v-for="(item, index) in lists" :key="index"
        @click="onSkiptArticleDetailFn(item.nid)"
      >
        <div class="img">
          <img mode="aspectFill" :src="item.thumb" />
        </div>
        <div class="text-right">
          <h2>{{ item.title }}</h2>
          <div class="text-time">
            <p>{{ item.inputtime }}</p>
            <p>来源: {{ item.origin || '瓶盖思维' }}</p>
          </div>
        </div>
      </div>
    </ul>
    <!-- 上拉加载更多loading -->
    <div class="bottom-bar" v-if="lists.length && lists.length >= 10">
      <div class="loading-icon" v-if="loadingState">
        <img :src="upyunUrl + '/wxXcxImg/images/loading-icon.gif'" />
      </div>
      <div class="loading-text-bar" v-if="!loadingState && !isNewsDataState">
        <div class="line"></div>
        <h2>上拉加载更多</h2>
        <div class="line"></div>
      </div>
      <div class="loading-text-bar" v-if="!loadingState && isNewsDataState">
        <div class="line"></div>
        <h2>我是有底线的</h2>
        <div class="line"></div>
      </div>
    </div>
    <!-- 暂无数据 -->
    <div class="no-data-wrapper" v-if="isNewsDataState && !lists.length">
      <img :src="upyunUrl + '/wxXcxImg/images/no-data-icon.png'" />
      <h2>这里什么都没有</h2>
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
      'isNewsDataState'
    ])
  },
  methods: {
    // 跳转故事详情
    onSkiptArticleDetailFn (id) {
      uni.navigateTo({
        url: `/pages/articleDetail/index?id=${id}`
      })
    }
  },
  props: ['lists']
}
</script>

<style lang="stylus" scoped>
  .news-list-ul
    padding: 18px 15px
    width: 100%
    height: 100%
    box-sizing: border-box
    ul
      width: 100%
      height: auto
      .news-list
        padding: 12px
        margin-bottom: 12px
        box-sizing: border-box
        display: flex
        box-sizing: border-box
        background-color: #fff
        border-radius: 4px
        .img
          width: 90px
          height: 90px
          border-radius: 4px
          overflow: hidden
          img
            width: 100%
            height: 100%
            border-radius: 4px
        .text-right
          position: relative
          flex: 1
          height: auto
          margin-left: 15px
          box-sizing: border-box
          h2
            margin-bottom: 9px
            min-height: 20px
            line-height: 21px
            font-size: 15px
            display: -webkit-box
            -webkit-box-orient: vertical
            -webkit-line-clamp: 2
            overflow: hidden
            color: #333
          .text-time
            position: absolute
            bottom: 0
            width:100%
            height: auto
            padding-right: 15px
            display: flex
            align-items: center
            justify-content: space-between
            box-sizing: border-box
            p
              width: auto
              height: auto
              font-size: 12px
              color: #999
    .no-data-wrapper
      width: 100%
      height: auto
      padding-top: 65px
      img
        display: block
        width: 245px
        height: 140px
        margin: 0 auto
      h2
        font-size: 14px
        line-height: 80px
        text-align: center
        color: #666
    .bottom-bar
      width: 100%
      height: 40px
      padding: 15px 0
      .loading-icon
        width: 40px
        height: 100%
        margin: 0 auto
        img
          width: 100%
          height: 100%
          display: block
      .loading-text-bar
        width: 100%
        height: 100%
        padding: 0 20px
        display: flex
        align-items: center
        box-sizing: border-box
        .line
          flex: 1
          height: 1px
          background-color: #ccc
        h2
          font-size: 14px
          padding: 0 10px
          color: #999
</style>
