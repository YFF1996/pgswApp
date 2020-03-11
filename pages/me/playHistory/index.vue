<template>
  <div class="play-annal-wrapper">
    <div class="bg-color"></div>
    <video-list :lists="playHistoryList" :type="'historyType'" :authorId="''" />
    <!-- 上拉加载更多loading -->
    <loading-more :lists="playHistoryList" :listsLength="15" />
    <!-- mini play nav -->
    <suspend-play />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import VideoList from '../../../components/videoListTemplate'
import SuspendPlay from '../../../components/suspendPlayTemplate'
import LoadingMore from '../../../components/loadingMoreTemplate'

export default {
  data () {
    return {
      page: 1
    }
  },
  onLoad () {
    this.page = 1
    this.setPlayHistoryList([])
    this.getPlayAnnalListFn(true)
  },
  // 下拉刷新
  onPullDownRefresh () {
    this.page = 1
    this.getPlayAnnalListFn(true)
  },
  // 上拉加载
  onReachBottom () {
    this.page = this.playHistoryList[this.playHistoryList.length - 1].page + 1
    this.getPlayAnnalListFn(false)
  },
  computed: {
    ...mapState([
      'userInfo',
      'playHistoryList'
    ])
  },
  methods: {
    ...mapMutations({
      setPlayHistoryList: 'SET_PLAY_HISTORY_LIST'
    }),
    ...mapActions([
      'getPlayAnnalList'
    ]),
    // 获取播放记录列表
    getPlayAnnalListFn (isLoading) {
      let data = { page: this.page }
      if (isLoading) {
        this.setPlayHistoryList([])
        uni.showLoading({ title: 'Loading' })
      }
      this.getPlayAnnalList(data).then(() => {
        if (isLoading) uni.hideLoading()
        uni.stopPullDownRefresh()
      })
    }
  },
  components: {
    VideoList,
    SuspendPlay,
    LoadingMore
  }
}
</script>

<style lang="stylus" scoped>
  .play-annal-wrapper
    width: 100%
    height: auto
</style>
