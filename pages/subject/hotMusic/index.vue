<template>
  <div class="hot-video-wrapper">
    <div class="bg-color"></div>
    <video-list :lists="hotColumnList" :type="'hotColumnType'" :authorId="''" />
    <loading-more :lists="hotColumnList" :listsLength="10" />
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
      page: 1,
      catid: 0
    }
  },
  onLoad (options) {
    this.catid = options.catid
    this.page = 1
    this.getHotColumnListFn(true)
  },
  computed: {
    ...mapState([
      'userInfo',
      'hotColumnList',
      'indexCurrentVideoItem'
    ])
  },
  // 下拉刷新
  onPullDownRefresh () {
    this.page = 1
    this.getHotColumnListFn(true)
  },
  // 上拉加载
  onReachBottom () {
    if (this.hotColumnList.length) {
      this.page = this.hotColumnList[this.hotColumnList.length - 1].page + 1
      this.getHotColumnListFn(false)
    }
  },
  methods: {
    ...mapMutations({
      setHotColumnList: 'SET_HOT_COLUMN_LIST'
    }),
    ...mapActions([
      'getHotColumnList'
    ]),
    // 获取热门栏目
    getHotColumnListFn (isLoading) {
      const data = {
        that: this,
        catid: this.catid,
        page: this.page,
        more: true
      }
      if (isLoading) {
        wx.showLoading({ title: 'Loading' })
        this.setHotColumnList([])
      }
      wx.showNavigationBarLoading()
      this.getHotColumnList(data).then(() => {
        if (isLoading) wx.hideLoading()
        wx.stopPullDownRefresh()
        wx.hideNavigationBarLoading()
      })
    }
  },
  onUnload () {
    this.setHotColumnList([])
  },
  components: {
    VideoList,
    SuspendPlay,
    LoadingMore
  }
}
</script>

<style lang="stylus" scoped>
  .hot-video-wrapper
    width: 100%
    height: auto
    .bg-color
      position: fixed
      top: 0
      left: 0
      right: 0
      botttom: 0
      width: 100%
      height: 100%
      background: #f8f8f8
      z-index: -1
</style>
