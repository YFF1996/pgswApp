<template>
  <div v-if="upyunUrl" class="all-search-wrapper">
    <div class="bg-color"></div>
    <input-seek
      @watchInputChild="watchInputFn"
      @enterChild="onEnterFn"
      @emptyDataChild="onEmptyDataFn"
      :inputText="keywords"
    />
    <div class="tab-wrapper">
      <div
        :class="currentIndex === 0 ? 'item active' : 'item'"
        @click="onSwitchItemFn(0)"
      >
        音频
        <i class="line"></i>
      </div>
      <div
        :class="currentIndex === 1 ? 'item active' : 'item'"
        @click="onSwitchItemFn(1)"
      >
        专题
        <i class="line"></i>
      </div>
    </div>
    <div class="search-history" v-if="isHistory">
      <div class="search-box" v-if="historyLists.length">
        <div class="search-top">
          <h2>历史搜索</h2>
          <div class="del-btn" @click="onEmptyHistoryFn()">
            <img :src="upyunUrl + '/wxXcxImg/images/del-icon.png'" />
          </div>
        </div>
        <ul>
          <li
            v-for="(item, index) in historyLists"
            :key="index"
            @click="onLabelItemFn(item)"
          >
            {{ item }}
          </li>
        </ul>
      </div>
      <div class="search-box">
        <div class="search-top">
          <h2>热门搜索</h2>
        </div>
        <ul>
          <li
            v-if="seekRecommendLabelList.length"
            v-for="(item, index) in seekRecommendLabelList"
            :key="index"
            @click="onLabelItemFn(item.keywords)"
          >
            {{ item.keywords }}
          </li>
        </ul>
      </div>
    </div>
    <div class="content-box">
      <subject-list v-if="currentIndex" :lists="subjectSearchLists" />
      <video-list v-else :lists="allSearchLists" :type="'allSearchType'" :authorId="''" />
      <!-- 上拉加载更多loading -->
      <loading-more :lists="currentIndex ? subjectSearchLists : allSearchLists" :listsLength="10" />
    </div>
    <!-- mini play nav -->
    <suspend-play />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import InputSeek from '../../../components/inputSeekTemplate'
import VideoList from '../../../components/videoListTemplate'
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
      isHistory: true,
      historyLists: []
    }
  },
  onLoad () {
    this.currentIndex = 0
    this.isHistory = true
    this.getRecommendLabeFn()
    const historyLists = uni.getStorageSync('historyLists')
    if (historyLists) this.historyLists = historyLists
  },
  // 下拉刷新
  onPullDownRefresh () {
    if (this.currentIndex === 0) {
      this.page = 1
    } else {
      this.otherPage = 1
    }
    this.setAllSearchLists([])
    this.setSubjectSearchLists([])
    this.onLoadListFn(this.currentIndex, true)
  },
  // 上拉加载
  onReachBottom () {
    if (this.currentIndex === 0) {
      this.page = this.allSearchLists[this.allSearchLists.length - 1].page + 1
    } else {
      this.otherPage += 1
    }
    this.onLoadListFn(this.currentIndex, false)
  },
  computed: {
    ...mapState([
      'userInfo',
      'allSearchLists',
      'subjectSearchLists',
      'seekRecommendLabelList'
    ])
  },
  methods: {
    ...mapMutations({
      setAllSearchLists: 'SET_ALL_SEARCH_LISTS',
      setSubjectSearchLists: 'SET_SUBJECT_SEARCH_LISTS'
    }),
    ...mapActions([
      'getAllSearch',
      'getSubjectSearch',
      'getSeekRecommendLabe'
    ]),
    getRecommendLabeFn () {
      this.getSeekRecommendLabe({ that: this })
    },
    // Input输入框变化时-热门推荐搜索
    watchInputFn (keywords) {
      this.keywords = keywords
      if (!this.keywords) this.isHistory = true
    },
    // 点击推荐标签
    onLabelItemFn (keywords) {
      this.keywords = keywords
      this.onEnterFn()
    },
    // 回车搜索
    onEnterFn () {
      if (this.currentIndex === 0) {
        this.page = 1
      } else {
        this.otherPage = 1
      }
      this.keywords ? this.isHistory = false : this.isHistory = true
      this.onLoadListFn(this.currentIndex, true)
      this.setHistoryFn()
    },
    // 保存搜索历史记录
    setHistoryFn () {
      const lists = this.historyLists
      if (lists.length) {
        for (let i = 0; i < lists.length; i++) {
          if (lists[i] === this.keywords) {
            break
          } else {
            if (i + 1 >= lists.length) this.setSearchHistoryFn()
          }
        }
      } else {
        this.setSearchHistoryFn()
      }
    },
    // set搜索历史记录
    setSearchHistoryFn () {
      this.historyLists.push(this.keywords)
      uni.setStorageSync('historyLists', this.historyLists)
    },
    // 清空历史记录
    onEmptyHistoryFn () {
      const that = this
      uni.showModal({
        content: '确定清空搜索历史?',
        confirmColor: '#e1564f',
        success (res) {
          if (res.confirm) {
            that.historyLists = []
            uni.removeStorageSync('historyLists')
          }
        }
      })
    },
    // 获取音频搜索结果列表
    getAllSearchFn (isLoading) {
      let data = {
        that: this,
        page: this.page,
        keywords: this.keywords
      }
      if (isLoading) {
        this.setAllSearchLists([])
        uni.showLoading({ title: 'Loading' })
      }
      uni.showNavigationBarLoading()
      this.getAllSearch(data).then(() => {
        if (isLoading) uni.hideLoading()
        uni.stopPullDownRefresh()
        uni.hideNavigationBarLoading()
      })
    },
    // 获取专题搜索结果列表
    getSubjectSearchFn (isLoading) {
      let data = {
        that: this,
        page: this.otherPage,
        keywords: this.keywords
      }
      if (isLoading) {
        this.setSubjectSearchLists([])
        uni.showLoading({ title: 'Loading' })
      }
      uni.showNavigationBarLoading()
      this.getSubjectSearch(data).then(() => {
        if (isLoading) uni.hideLoading()
        uni.stopPullDownRefresh()
        uni.hideNavigationBarLoading()
      })
    },
    // 一件清空keywords
    onEmptyDataFn () {
      this.page = 1
      this.keywords = ''
      this.currentIndex = 0
      this.isHistory = true
    },
    // 切换item类型
    onSwitchItemFn (index) {
      if (this.currentIndex === 0) {
        this.page = 1
      } else {
        this.otherPage = 1
      }
      this.currentIndex = index
      this.onLoadListFn(this.currentIndex, true)
    },
    // 加载list数据
    onLoadListFn (index, is) {
      switch (index) {
        case 0:
          this.getAllSearchFn(is)
          break
        case 1:
          this.getSubjectSearchFn(is)
          break
        default:
          return false
      }
    }
  },
  onUnload () {
    this.page = 1
    this.keywords = ''
  },
  components: {
    InputSeek,
    VideoList,
    SubjectList,
    SuspendPlay,
    LoadingMore
  }
}
</script>

<style lang="stylus" scoped>
  .all-search-wrapper
    width: 100%
    height: auto
    .tab-wrapper
      position: fixed
      left: 0
      top: 60px
      width: 100%
      height: auto
      background-color: #fff
      padding: 0 70px
      display: flex
      justify-content: space-between
      box-sizing: border-box
      z-index: 96
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
    .search-history
      position: fixed
      left: 0
      top: 60px
      right: 0
      bottom: 0
      padding: 15px 25px
      box-sizing: border-box
      background-color: #fff
      z-index: 999
      .search-box
        width: 100%
        height: auto
        padding-bottom: 30px
        .search-top
          width: 100%
          height: 30px
          display: flex
          align-items: center
          justify-content: space-between
          h2
            flex: 1
            font-size: 14px
            font-weight: bold
            color: #000
          .del-btn
            width: 20px
            height: 20px
            img
              width: 100%
              height: 100%
        ul
          width: 100%
          height: auto
          padding-top: 12px
          display: flex
          flex-wrap: wrap
          li
            width: auto
            padding: 8px 16px
            margin: 0 14px 12px 0
            border-radius: 20px
            font-size: 12px
            overflow: hidden
            color: #333
            background-color: #f6f6f6
</style>
