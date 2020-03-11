<template>
  <div v-if="upyunUrl" class="my-course-wrapper">
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
    </div>
    <my-course-list :list="myCourseList" />
    <loading-more :lists="myCourseList" :listsLength="16" />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { upyunUrl } from '../../../api/config'
import InputSeek from '../../../components/inputSeekTemplate'
import myCourseList from '../../../components/myCourseListTemplate'
import LoadingMore from '../../../components/loadingMoreTemplate'

export default {
  data () {
    return {
      upyunUrl,
      keywords: '',
      page: 1
    }
  },
  onLoad () {
    this.page = 1
    this.getMyCourseListFn(true)
  },
  computed: {
    ...mapState([
      'userInfo',
      'myCourseList'
    ])
  },
  // 下拉刷新
  onPullDownRefresh () {
    this.page = 1
    this.getMyCourseListFn(true)
  },
  // 上拉加载
  onReachBottom () {
    this.page += 1
    this.getMyCourseListFn(false)
  },
  methods: {
    ...mapMutations({
      setMyCourseList: 'SET_MY_COURSE_LIST'
    }),
    ...mapActions([
      'getIsReview',
      'getMyCourseList'
    ]),
    // 获取我的课程列表
    getMyCourseListFn (loadingStatus) {
      const data = {
        that: this,
        keywords: this.keywords,
        page: this.page
      }
      if (loadingStatus) {
        uni.showLoading({ title: 'Loading' })
        this.setMyCourseList([])
      }
      uni.showNavigationBarLoading()
      this.getMyCourseList(data).then(() => {
        if (loadingStatus) uni.hideLoading()
        uni.stopPullDownRefresh()
        uni.hideNavigationBarLoading()
      })
    },
    // 回车搜索
    onEnterFn () {
      this.page = 1
      this.getMyCourseListFn(true)
    },
    // 一件清空关闭list页面
    onEmptyDataFn () {
      this.page = 1
      this.keywords = ''
      this.getMyCourseListFn(true)
    }
  },
  components: {
    InputSeek,
    myCourseList,
    LoadingMore
  }
}
</script>

<style lang="stylus" scoped>
  .my-course-wrapper
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
        padding: 15px 20px
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
</style>
