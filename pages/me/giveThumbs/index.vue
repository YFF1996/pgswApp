<template>
  <div class="thumbs-wrapper">
    <div class="bg-color"></div>
    <video-list :lists="giveThumbsMusicList" :type="'giveThumbsType'" :authorId="''" />
    <!-- 上拉加载更多loading -->
    <loading-more :lists="giveThumbsMusicList" :listsLength="15" />
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
  onShareAppMessage () {
    const data = {
      shareid: this.userInfo ? this.userInfo.user_id : '',
      channel: ''
    }
    return {
      title: '瓶盖思维',
      path: `/pages/index/main?json=${JSON.stringify(data)}`
    }
  },
  onLoad () {
    this.page = 1
    this.setGiveThumbsMusicList([])
    this.giveThumbsMusicListFn(true)
  },
  // 下拉刷新
  onPullDownRefresh () {
    this.page = 1
    this.giveThumbsMusicListFn(true)
  },
  // 上拉加载
  onReachBottom () {
    this.page = this.giveThumbsMusicList[this.giveThumbsMusicList.length - 1].page + 1
    this.giveThumbsMusicListFn(false)
  },
  computed: {
    ...mapState([
      'userInfo',
      'giveThumbsMusicList'
    ])
  },
  methods: {
    ...mapMutations({
      setGiveThumbsMusicList: 'SET_GIVE_THUMBS_MUSIC_LIST'
    }),
    ...mapActions([
      'getGiveThumbsMusicList'
    ]),
    // 获取点赞音频列表
    giveThumbsMusicListFn (isLoading) {
      let data = {
        that: this,
        page: this.page,
        type: 0
      }
      if (isLoading) {
        this.setGiveThumbsMusicList([])
        uni.showLoading({ title: 'Loading' })
      }
      uni.showNavigationBarLoading()
      this.getGiveThumbsMusicList(data).then(() => {
        if (isLoading) uni.hideLoading()
        uni.stopPullDownRefresh()
        uni.hideNavigationBarLoading()
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
  .thumbs-wrapper
    width: 100%
    height: auto
</style>
