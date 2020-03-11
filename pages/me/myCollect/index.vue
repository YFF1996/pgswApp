<template>
  <div v-if="upyunUrl" class="my-collect-wrapper">
    <div class="bg-color"></div>
    <div class="fixed-top">
      <div class="seek-wrapper">
        <div class="seek-content">
          <div class="input-bar">
            <i class="search"><img :src="upyunUrl + '/wxXcxImg/images/search-icon.png'" /></i>
            <input
              type="text"
              placeholder="搜您想听搜您所用"
              @confirm="onEnterFn()"
              v-model="keywords"
              placeholder-style="color: #999"
            />
            <div class="closed-btn" @click.stop="onEmptyDataFn()">
              <img v-if="keywords" :src="upyunUrl + '/wxXcxImg/images/closed-icon.png'" />
            </div>
          </div>
        </div>
      </div>
      <div class="tab-wrapper">
        <div :class="currentIndex === 0 ? 'item active' : 'item'" @click="onSwitchItemFn(0)">
          音频
          <i class="line"></i>
        </div>
        <div :class="currentIndex === 1 ? 'item active' : 'item'" @click="onSwitchItemFn(1)">
          专题
          <i class="line"></i>
        </div>
        <div :class="currentIndex === 2 ? 'item active' : 'item'" @click="onSwitchItemFn(2)">
          文章
          <i class="line"></i>
        </div>
      </div>
    </div>
    <div class="content-box">
      <video-list v-if="currentIndex === 0" :lists="collectMusicList" :type="'collectType'" :authorId="''" />
      <subject-list v-if="currentIndex === 1"  :lists="collectSubjectList" />
      <article-list v-if="currentIndex === 2" :lists="collectArticleList" />
      <!-- 上拉加载更多loading -->
      <loading-more :lists="loadingMoreList" :listsLength="16" />
    </div>
    <!-- mini play nav -->
    <suspend-play />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import VideoList from '../../../components/videoListTemplate'
import ArticleList from '../../../components/articleListTemplate'
import SubjectList from '../../../components/subjectListTemplate'
import SuspendPlay from '../../../components/suspendPlayTemplate'
import LoadingMore from '../../../components/loadingMoreTemplate'
import { upyunUrl } from '../../../api/config'

export default {
  data () {
    return {
      upyunUrl,
      page: 1,
      otherPage: 1,
      keywords: '',
      currentIndex: 0,
      loadingMoreList: []
    }
  },
  onLoad () {
    this.page = 1
    this.keywords = ''
    this.currentIndex = 0
    this.getCollectListFn(true)
  },
  // 下拉刷新
  onPullDownRefresh () {
    this.page = 1
    this.getCollectListFn(true)
  },
  // 上拉加载
  onReachBottom () {
    if (this.currentIndex === 0) {
      this.page = this.collectMusicList[this.collectMusicList.length - 1].page + 1
    } else {
      this.page += 1
    }
    this.getCollectListFn(false)
  },
  computed: {
    ...mapState([
      'userInfo',
      'collectMusicList',
      'collectArticleList',
      'collectSubjectList'
    ])
  },
  methods: {
    ...mapMutations({
      setCollectMusicList: 'SET_COLLECT_MUSIC_LIST',
      setCollectArticleList: 'SET_COLLECT_ARTICLE_LIST',
      setCollectSubjectList: 'SET_COLLECT_SUBJECT_LIST'
    }),
    ...mapActions([
      'getCollectList'
    ]),
    // 回车搜索
    onEnterFn () {
      this.page = 1
      this.getCollectListFn(true)
    },
    // 一件清空关闭list页面
    onEmptyDataFn () {
      this.page = 1
      this.keywords = ''
      this.getCollectListFn(true)
    },
    // 切换item类型
    onSwitchItemFn (index) {
      this.page = 1
      this.currentIndex = index
      this.getCollectListFn(true)
    },
    // 获取音频 - 文章 - 专题，收藏列表
    getCollectListFn (isLoading) {
      let data = {
        that: this,
        page: this.page,
        keywords: this.keywords,
        type: this.currentIndex
      }
      if (isLoading) {
        if (this.currentIndex === 0) this.setCollectMusicList([])
        if (this.currentIndex === 1) this.setCollectSubjectList([])
        if (this.currentIndex === 2) this.setCollectArticleList([])
        uni.showLoading({ title: 'Loading' })
      }
      uni.showNavigationBarLoading()
      this.getCollectList(data).then((list) => {
        this.loadingMoreList = list
        if (isLoading) uni.hideLoading()
        uni.stopPullDownRefresh()
        uni.hideNavigationBarLoading()
      })
    }
  },
  components: {
    VideoList,
    SubjectList,
    ArticleList,
    SuspendPlay,
    LoadingMore
  }
}
</script>

<style lang="stylus" scoped>
  .my-collect-wrapper
    width: 100%
    height: auto
    .fixed-top
      position: fixed
      left: 0
      top: 0
      width: 100%
      height: auto
      background-color: #fff
      z-index: 99
      .seek-wrapper
        width: 100%
        height: auto
        padding: 0 20px
        margin: 15px  0
        box-sizing: border-box
        .seek-content
          width: 100%
          height: 100%
          border-radius: 6px
          .input-bar
            padding-left: 15px
            width: 100%
            height: 34px
            line-height: 34px
            border-radius: 17px
            display: flex
            align-items: center
            box-sizing: border-box
            background-color: #f6f6f6
            .search
              margin-top: 2px
              width: 13px
              height: 14px
              img
                display: block
                width: 100%
                height: 100%
            input
              padding: 0 10px
              flex: 1
              height: 100%
              font-size: 14px
              color: #333
              z-index: 20
              box-sizing: border-box
            .closed-btn
              width: 37px
              height: 100%
              display: flex
              align-items: center
              justify-content: center
              z-index: 30
              img
                width: 18px
                height: 18px
      .tab-wrapper
        width: 100%
        height: auto
        padding: 0 40px
        display: flex
        justify-content: space-between
        box-sizing: border-box
        .item
          position: relative
          padding: 5px 12px
          width: auto
          height: 30px
          font-size: 15px
          font-weight: bold
          color: #999
          box-sizing: border-box
          &.active
            color: #000
            .line
              position: absolute
              top: 28px
              left: 33%
              width: 20px
              height: 2px
              background: rgba(255,64,64,1)
              box-shadow: 0px 2px 3px 0px rgba(255,64,64,0.2)
              border-radius: 3px
    .content-box
      margin-top: 90px
</style>
