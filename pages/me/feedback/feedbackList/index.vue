<template>
  <div class="history-wrapper">
    <div class="bg-color"></div>
    <ul v-if="feedbackHistoryList.length">
      <li
        v-for="(item, index) in feedbackHistoryList"
        @click="onSkipPageFn(`/pages/me/feedback/feedbackList/feedbackDetails/index?id=${item.id}`)"
        :key="index"
      >
        <div class="time-box">
          <div class="text">
            提交时间：{{ item.ctime }}
          </div>
          <div v-if="item.unread_num" class="num">{{ item.unread_num }}</div>
        </div>
        <div class="content-box">
          <div class="title">问题描述：</div>
          <div class="info">{{ item.content }}</div>
        </div>
        <div v-if="item.is_end" class="accept">已结束</div>
        <div v-if="item.is_accept && !item.is_end" class="accept accept-active">已采纳</div>
      </li>
    </ul>
    <!-- 上拉加载更多loading -->
    <loading-more :lists="feedbackHistoryList" :listsLength="10" />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import LoadingMore from '../../../../components/loadingMoreTemplate'

export default {
  data () {
    return {
      page: 1
    }
  },
  onShow () {
    this.page = 1
    this.getFeedbackHistoryListFn(true)
  },
  // 下拉刷新
  onPullDownRefresh () {
    this.page = 1
    this.getFeedbackHistoryListFn(true)
  },
  // 上拉加载
  onReachBottom () {
    this.page += 1
    this.getFeedbackHistoryListFn(false)
  },
  computed: {
    ...mapState([
      'userInfo',
      'feedbackHistoryList'
    ])
  },
  methods: {
    ...mapMutations({
      setFeedbackHistoryList: 'SET_FEEDBACK_HISTORY_LIST'
    }),
    ...mapActions([
      'getFeedbackHistoryList'
    ]),
    // 跳转反馈详情页面
    onSkipPageFn (url) {
      uni.navigateTo({
        url
      })
    },
    // 反馈列表
    getFeedbackHistoryListFn (isLoading) {
      let data = {
        that: this,
        page: this.page
      }
      if (isLoading) {
        this.setFeedbackHistoryList([])
        uni.showLoading({ title: 'Loading' })
      }
      uni.showNavigationBarLoading()
      this.getFeedbackHistoryList(data).then(() => {
        uni.stopPullDownRefresh()
        uni.hideNavigationBarLoading()
        if (isLoading) uni.hideLoading()
      })
    }
  },
  components: {
    LoadingMore
  }
}
</script>

<style lang="stylus" scoped>
  .history-wrapper
    width: 100%
    height: auto
    ul
      padding: 15px 15px 1px
      box-sizing: border-box
      width: 100%
      height: auto
      font-size: 14px
      color: #666
      background: #f8f8f8
      li
        padding: 0 15px 10px 15px
        margin-bottom: 15px
        box-sizing: border-box
        border-radius: 10px
        background: #fff
        .time-box
          display: flex
          justify-content: space-between
          .text
            margin-top: 20px
          .num
            margin: 8px -8px 0 0
            width: 15px
            height: 15px
            border-radius: 50%
            font-size: 10px
            text-align: center
            color: #fff
            background: #fe0000
        .content-box
          display: flex
          margin-top: 15px
          padding-bottom: 15px
          box-sizing: border-box
          .info
            flex: 1
        .accept
          border-top: 1px solid #efefef
          padding-top: 8px
          padding-right: 5px
          font-size: 12px
          text-align: right
          color: #999
        .accept-active
          color: #ff6464
</style>
