<template>
  <div
    v-if="upyunUrl"
    class="job-wrapper"
  >
    <div class="white-fixed"></div>
    <scroll-view
      :scroll-y="true"
      :upper-threshold="0"
      @scrolltoupper="onScrolltoupperFn"
      @scrolltolower="onScrolltolowerFn"
      class="scroll-view"
    >
      <div class="white-bg">
        <div class="seek-wrapper">
          <div
            @click="onSkipPageFn('/pages/subject/searchPage/index')"
            class="input-bar"
          >
            <div class="search">
              <image :src="upyunUrl + '/wxXcxImg/images/search-icon.png'" />
            </div>
            <div class="text">搜您想听搜您所用</div>
          </div>
        </div>
        <!-- 轮播图 -->
        <banner :lists="bannerList" />
        <!-- 二级分类 -->
        <div
          v-if="secondTypeLabelList.length"
          class="secondary-box"
        >
          <secondary-navigation
            :lists="secondTypeLabelList"
            :state="descState"
            @secondaryNavChild="onSecondaryNavFn"
          />
        </div>
        <!-- 热门专题 -->
        <column-news
          :lists="hotColumnList"
          :catid="secondaryCatid"
        />
      </div>
      <div class="line-bg">
        <div class="line"></div>
      </div>
      <!--主推课-->
      <main-recommend :lists="classifySubjectGoodsList" />
      <!-- 专题列表 -->
      <classify-content :classifycontentList="classifycontentList" />
    </scroll-view>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Banner from '../bannerTemplate'
import SecondaryNavigation from '../secondaryNavigationTemplate'
import ColumnNews from '../columnHotAudioTemplate'
import MainRecommend from '../mainRecommendCourseTemplate'
import ClassifyContent from '../secondClassifyContentTemplate'
import { upyunUrl } from '../../api/config'

export default {
  data () {
    return {
      upyunUrl,
      bannerList: [],
      hotColumnList: [],
      secondTypeLabelList: [],
      classifycontentList: [],
      classifySubjectGoodsList: [],
      classifycontentId: '',
      secondaryCatid: '',
      firstEnter: true,
      currentIndex: 0,
      page: 1,
      descState: false
    }
  },
  computed: {
    ...mapState([
      'navigationIndex',
      'indexTypeLabelList'
    ])
  },
  methods: {
    ...mapActions([
      'getClassifyBanner',
      'getSecondTypeLabel',
      'getHotColumnList',
      'getClassifycontent',
      'getClassifySubjectGoodsList'
    ]),
    // 获取轮播图
    getClassifyBannerFn () {
      const data = {
        that: this,
        catid: this.catid
      }
      this.getClassifyBanner(data).then((lists) => {
        this.bannerList = lists
      })
    },
    // 获取分类标签
    getSecondTypeLabelFn () {
      const data = {
        that: this,
        catid: this.catid
      }
      this.getSecondTypeLabel(data).then((lists) => {
        this.secondTypeLabelList = lists
      })
    },
    // 点击二级分类
    onSecondaryNavFn (data) {
      this.page = 1
      this.currentIndex = data.secondaryIndex
      this.classifycontentId = data.ids
      this.classifycontentList = []
      this.getHotColumnListFn(data.ids)
      this.getClassifycontentFn(true)
      this.getClassifySubjectGoodsListFn()
      this.descState = true
    },
    // 获取热门栏目
    getHotColumnListFn (ids) {
      this.secondaryCatid = ids
      const data = {
        that: this,
        catid: this.secondaryCatid || '',
        page: 1,
        more: false
      }
      this.hotColumnList = []
      this.getHotColumnList(data).then((res) => {
        this.hotColumnList = res.data
      })
    },
    // 获取分类content
    getClassifycontentFn (isLoading) {
      const data = {
        that: this,
        catid: this.classifycontentId || this.catid,
        page: this.page
      }
      uni.showNavigationBarLoading()
      if (isLoading) this.classifycontentList = []
      this.getClassifycontent(data).then((res) => {
        if (res.data.lists.length) {
          res.data.lists.forEach((item) => {
            item.play_hits = item.play_hits >= 10000 ? Math.round((item.play_hits / 10000) * 100) / 100 + '万' : item.play_hits
          })
          this.classifycontentList.push(res.data)
        }
        uni.hideNavigationBarLoading()
      })
    },
    // 获取首页分类精品课列表
    getClassifySubjectGoodsListFn () {
      const data = {
        that: this,
        catid: this.currentIndex === 0 ? this.catid : this.classifycontentId,
        type: this.currentIndex === 0 ? 1 : 0
      }
      this.getClassifySubjectGoodsList(data).then((res) => {
        this.classifySubjectGoodsList = res
      })
    },
    // 下拉刷新
    onScrolltoupperFn () {
      this.page = 1
      this.getClassifyBannerFn()
      this.getSecondTypeLabelFn()
      this.getHotColumnListFn(this.secondaryCatid)
      this.getClassifycontentFn(true)
      this.getClassifySubjectGoodsListFn()
    },
    // 上拉加载更多
    onScrolltolowerFn () {
      this.page += 1
      this.getClassifycontentFn(false)
    },
    onSkipPageFn (url) {
      uni.navigateTo({
        url
      })
    }
  },
  props: {
    catid: {
      type: String,
      default: ''
    },
    index: {
      type: Number,
      default: 0
    }
  },
  components: {
    Banner,
    SecondaryNavigation,
    ColumnNews,
    ClassifyContent,
    MainRecommend
  },
  watch: {
    navigationIndex (index) {
      this.indexTypeLabelList.forEach((item, i) => {
        if (this.firstEnter && item.type === 3 && index === i) {
          this.firstEnter = false
          this.getClassifyBannerFn()
          this.getSecondTypeLabelFn()
          this.getHotColumnListFn()
          this.getClassifycontentFn(true)
          this.getClassifySubjectGoodsListFn()
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
  .job-wrapper
    position: fixed
    left: 0
    top: 0
    right: 0
    bottom: 50px
    width: 100%
    height: 100%
    padding-top: 54px
    background-color: #f8f8f8
    box-sizing: border-box
    .white-fixed
      position: fixed
      left: 0
      top: 0
      width: 100%
      height: 59px
      background-color: #fff
      z-index: -1
    .scroll-view
      width: 100%
      height: 100%
      .white-bg
        width: 100%
        height: auto
        background-color: #fff
        .seek-wrapper
          width: 100%
          height: auto
          padding: 0 15px
          box-sizing: border-box
          .input-bar
            width: 100%
            height: 100%
            line-height: 34px
            border-radius: 17px
            display: flex
            align-items: top
            justify-content: center
            background-color: #f6f6f6
            .search
              margin-top: 2px
              width: 13px
              height: 14px
              image
                width: 100%
                height: 100%
            .text
              padding-left: 10px
              text-align: center
              font-size: 13px
              color: #999
        .secondary-box
          width: 100%
          height: auto
          position: relative
          padding: 0 15px
          box-sizing: border-box
      .line-bg
        position: relative
        width: 100%
        height: 20px
        background: #f8f8f8
        .line
          position: absolute
          top: 0
          left: 0
          width: 100%
          height: 20px
          background: linear-gradient(180deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))
    ::-webkit-scrollbar
      width: 0
      height: 0
      color: transparent
</style>
