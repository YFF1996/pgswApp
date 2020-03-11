<template>
  <div
    v-if="upyunUrl && oJson"
    class="subject-wrapper"
  >
    <div class="subject-content">
      <div class="subject-bg">
        <image :src="oJson.cover" />
      </div>
      <div class="subject-info-top">
        <div
          @click="onCollectionFn(oJson.is_collection)"
          class="share-icon"
        >
          <image
            v-if="oJson.is_collection === 1"
            :src="upyunUrl + '/wxXcxImg/images/index-collect-active.png'"
            :class="{ 'active' : oJson.is_collection === 1 }"
          />
          <image v-else :src="upyunUrl + '/wxXcxImg/images/xq-collect-icon.png'" />
        </div>
        <div
          @click.stop="onMoreOperateFn()"
          class="share-icon"
        >
          <image :src="upyunUrl + '/wxXcxImg/images/share-goods-icon.png'" />
        </div>
      </div>
      <div class="subject-box">
        <div class="avatar">
          <image mode="aspectFill" :src="oJson.cover" />
        </div>
        <div class="info">
          <div class="title">{{ oJson.title }}</div>
          <div class="teacher-info">
            <div
              v-if="oJson.authorInfo"
              @click="onSkipPageFn(`/pages/subject/lectureHome/index?id=${oJson.au_id}`)"
              class="author-info"
            >
              <image mode="aspectFill" :src="oJson.authorInfo.headimgurl" />
              <div class="name">{{ oJson.authorInfo.nick_name }}</div>
            </div>
            <div v-else class="author-info"></div>
            <div
              v-if="oJson.price <= 0 && oJson.can_exchange !== 1"
              @click="onSubscriptionSubjectFn(oJson.is_sub)"
              class="collect-wrapper"
            >
              <div v-if="oJson.is_sub" class="text subscribe-end">已订阅</div>
              <div v-else class="text">+订阅</div>
            </div>
          </div>
          <div class="bottom">
            <div class="listen-data">
              <div class="hear-icon">
                <image :src="upyunUrl + '/wxXcxImg/images/ear-icon.png'" />
              </div>
              <div class="text">
                <div class="num">{{ oJson.sum_play }}</div>
              </div>
            </div>
            <div class="listen-data">
              <div class="knowledge-icon">
                <image :src="upyunUrl + '/wxXcxImg/images/knowledge-icon.png'" />
              </div>
              <div class="text">
                <div class="num">{{ oJson.sum_voice }}</div>个知识点
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="subject-tab-wrapper">
      <div class="tab-box">
        <div class="tab-box-ul">
          <div
            v-for="(item, index) in tabNavList"
            v-if="(index !== 0 || index === 0 && oJson.detail_intro) && (index !== 2 || index === 2 && oJson.similar_total)"
            @click="onTabNavFn(index)"
            :class="{'active' : tabNavIndex === index}"
            :key="index"
            class="item"
          >{{ item.title }}</div>
        </div>
      </div>
    </div>
    <!-- 专题介绍 -->
    <subject-intro v-if="tabNavIndex === 0 && oJson" :str="oJson.detail_intro" />
    <!-- 专题列表 -->
    <child-list
      v-if="tabNavIndex === 1"
      :lists="subjectDetailList"
    />
    <!-- 相似课 -->
    <similar-course v-if="tabNavIndex === 2" :lists="similarityCourseList" />
    <!-- 评论 -->
    <comment-list v-if="tabNavIndex === 3" :lists="commentList" :special_id="special_id" />
    <!-- 上拉加载更多 -->
    <loading-more v-if="tabNavIndex === 1" :lists="subjectDetailList" :listsLength="16" />
    <loading-more v-if="tabNavIndex === 2" :lists="similarityCourseList" :listsLength="16" />
    <!-- 专题状态栏 -->
    <subject-state-bar
      v-if="(tabNavIndex !== 3 && oJson.price > 0) || (tabNavIndex !== 3 && oJson.can_exchange)"
      @getSubjectInfoChild="getSubjectInfoFn"
      :obj="oJson"
      ref="mychild"
    />
    <!-- 抢学费的浮窗 -->
    <movable-area class="float-box-wrpper">
      <movable-view
        x="-10"
        y="450"
        direction="all"
        @click="onSkipMainPageFn('/pages/robTuition/index')"
        class="float-box"
      >
        <div class="text">抢学费</div>
      </movable-view>
    </movable-area>
    <!-- 更多操作 -->
    <more-operate :oItem="oJson" ref="child" />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import SubjectIntro from '../../../components/subjectIntroduceTemplate/index'
import ChildList from '../../../components/subjectChildListTemplate/index'
import SimilarCourse from '../../../components/similarCourseListTemplate/index'
import CommentList from '../../../components/commentListTemplate/index'
import LoadingMore from '../../../components/loadingMoreTemplate/index'
import SubjectStateBar from '../../../components/subjectStateBarTemplate/index'
import MoreOperate from '../../../components/moreOperateTempage'
import { upyunUrl } from '../../../api/config'

export default {
  data () {
    return {
      upyunUrl,
      special_id: 0,
      oJson: '',
      page: 1,
      tabNavList: [
        {
          title: '介绍'
        },
        {
          title: '目录'
        },
        {
          title: '相似课'
        },
        {
          title: '评论'
        }
      ],
      tabNavIndex: 1
    }
  },
  onLoad (options) {
    this.special_id = options.sid
    this.tabNavIndex = 1
    this.getDataTableFn()
  },
  onShow () {
    this.getSubjectInfoFn(false)
  },
  // 下拉刷新
  onPullDownRefresh () {
    this.getSubjectInfoFn(false)
    this.getDataTableFn()
  },
  // 上拉加载
  onReachBottom () {
    if (this.tabNavIndex === 1) {
      this.page = this.subjectDetailList[this.subjectDetailList.length - 1].page + 1
      this.getSubjectListFn(false)
    } else if (this.tabNavIndex === 2) {
      this.page += 1
      this.getSimilarityCourseListFn(false)
    } else if (this.tabNavIndex === 3 && this.commentList.length) {
      this.page += 1
      this.getCommentListFn(false)
    }
  },
  computed: {
    ...mapState([
      'userInfo',
      'subjectDetailList',
      'similarityCourseList',
      'commentList'
    ])
  },
  methods: {
    ...mapMutations({
      setShareId: 'SET_SHARE_ID',
      setTitleState: 'SET_TITLE_STATE',
      setCommentList: 'SET_COMMENT_LIST',
      setSubjectDetailList: 'SET_SUBJECT_DETAIL_LIST',
      setExchangeInviteState: 'SET_EXCHANGE_INVITE_STATE',
      setSimilarityCourseList: 'SET_SIMILARITY_COURSE_LIST',
      setReturnMoneyPopUpState: 'SET_RETURN_MONEY_POP_UP_STATE'
    }),
    ...mapActions([
      'getUserInfo',
      'getSubjectInfo',
      'getSubjectList',
      'getSimilarityCourseList',
      'getCommentList',
      'allCollection',
      'subscriptionSubject'
    ]),
    // 切换tab导航栏
    onTabNavFn (index) {
      this.tabNavIndex = index
      if (index) this.getDataTableFn()
    },
    // 购买专题
    onPaySubjectFn () {
      this.$refs.mychild.getPayInfoFn()
    },
    // 收藏专题
    onCollectionFn (status) {
      const data = {
        id: this.special_id,
        that: this,
        type: 1
      }
      if (this.userInfo) {
        uni.showLoading({ title: 'Loading' })
        this.allCollection(data).then(() => {
          this.oJson['is_collection'] = status === 1 ? 0 : 1
          uni.hideLoading()
        })
      } else {
        this.onSkipPageFn(`/pages/login/index`)
      }
    },
    // 更多操作状态栏
    onMoreOperateFn () {
      this.oJson['skipPath'] = 'subjectMusic'
      this.oJson['special_id'] = this.special_id
      this.$refs.child.onUniPopupStateFn(true)
    },
    // 订阅专题
    onSubscriptionSubjectFn (status) {
      let data = {
        that: this,
        id: this.special_id
      }
      if (this.userInfo) {
        uni.showLoading({ title: 'Loading' })
        this.subscriptionSubject(data).then(() => {
          this.oJson.is_sub = status === 0 ? 1 : 0
          uni.hideLoading()
        })
      } else {
        uni.navigateTo({
          url: `/pages/login/index`
        })
      }
    },
    // 获取专题详情
    getSubjectInfoFn (isLoading) {
      const data = {
        that: this,
        orderid: '', // DATA
        special_id: this.special_id
      }
      this.setTitleState(true)
      if (isLoading) uni.showLoading({ title: 'Loading' })
      this.getSubjectInfo(data).then((res) => {
        res.data.sum_play = res.data.sum_play >= 10000 ? Math.round((res.data.sum_play / 10000) * 100) / 100 + '万' : res.data.sum_play
        res.data.price = parseFloat(res.data.price)
        this.oJson = res.data
        if (isLoading || this.oJson.is_inviteing) {
          this.setExchangeInviteState(false)
          uni.hideLoading()
        }
        uni.stopPullDownRefresh()
      })
    },
    // 获取专题列表
    getSubjectListFn (isLoading) {
      const data = {
        that: this,
        id: this.special_id,
        page: this.page
      }
      if (isLoading) {
        uni.showLoading({ title: 'Loading' })
        this.setSubjectDetailList([])
      }
      this.getSubjectList(data).then(() => {
        if (isLoading) uni.hideLoading()
        uni.stopPullDownRefresh()
      })
    },
    // 获取相似课程
    getSimilarityCourseListFn (isLoading) {
      const data = {
        that: this,
        id: this.special_id,
        page: this.page
      }
      if (isLoading) {
        uni.showLoading({ title: 'Loading' })
        this.setSimilarityCourseList([])
      }
      this.getSimilarityCourseList(data).then(() => {
        if (isLoading) uni.hideLoading()
        uni.stopPullDownRefresh()
      })
    },
    // 获取评论list
    getCommentListFn (isLoading) {
      const data = {
        that: this,
        c_id: this.special_id,
        page: this.page,
        type: 0
      }
      if (isLoading) {
        this.setCommentList([])
        uni.showLoading({ title: 'Loading' })
      }
      uni.showNavigationBarLoading()
      this.getCommentList(data).then(() => {
        if (isLoading) uni.hideLoading()
        uni.stopPullDownRefresh()
        uni.hideNavigationBarLoading()
      })
    },
    // 请求数据列表
    getDataTableFn () {
      this.page = 1
      switch (this.tabNavIndex) {
        case 1:
          this.getSubjectListFn(true)
          break
        case 2:
          this.getSimilarityCourseListFn(true)
          break
        case 3:
          this.getCommentListFn(true)
          break
        default:
          return false
      }
    },
    // 跳转页面
    onSkipPageFn (url) {
      uni.navigateTo({
        url
      })
    },
    // 跳转抢学费
    onSkipMainPageFn (url) {
      uni.switchTab({
        url
      })
    },
    showToastFn (title) {
      uni.showToast({
        title,
        icon: 'none',
        duration: 2000
      })
    }
  },
  onUnload () {
    this.oJson = ''
    this.setTitleState(false)
    this.setExchangeInviteState(false)
    this.setReturnMoneyPopUpState(false)
  },
  components: {
    SubjectIntro,
    ChildList,
    SimilarCourse,
    CommentList,
    LoadingMore,
    SubjectStateBar,
    MoreOperate
  }
}
</script>

<style lang="stylus" scoped>
  .subject-wrapper
    width: 100%
    height: auto
    display: flex
    flex-direction: column
    .subject-content
      position: relative
      width: 100%
      height: 150px
      overflow: hidden
      .subject-bg
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        z-index: -1
        background-color: rgba(0, 0, 0, 0.5)
        image
          width: 100%
          height: 100%
          opacity: 0.6
          filter: blur(20px)
      .subject-info-top
        width: 100%
        height: 45px
        padding: 0 15px
        display: flex
        align-items: center
        justify-content: flex-end
        box-sizing: border-box
        .share-icon
          width: 16px
          height: 16px
          padding: 5px
          margin-left: 10px
          image
            width: 100%
            height: 100%
            animation: scaleB .3s linear forwards
          .active
            animation: scaleA .5s linear forwards
      .subject-box
        width: 100%
        padding: 0 15px
        display: flex
        box-sizing: border-box
        .avatar
          width: 90px
          height: 90px
          overflow: hidden
          border-radius: 5px
          image
            width: 100%
            height: 100%
        .info
          position: relative
          height: 90px
          flex: 1
          margin-left: 20px
          .title
            margin-top: -3px
            width: 100%
            min-height: 20px
            line-height: 20px
            font-size: 16px
            font-weight: bold
            display: -webkit-box
            -webkit-box-orient: vertical
            -webkit-line-clamp: 2
            overflow: hidden
            color: #fefefe
          .teacher-info
            margin-top: 5px
            width: 100%
            height: auto
            padding: 5px 0
            display: flex
            align-items: center
            justify-content: space-between
            .author-info
              width: auto
              height: auto
              display: flex
              image
                display: block
                width: 16px
                height: 16px
                border-radius: 50%
              .name
                padding-left: 8px
                font-size: 12px
                color: #ebebeb
                line-height: 16px
            .collect-wrapper
              width: auto
              height: auto
              border-radius: 10px
              display: flex
              align-items: center
              .text
                padding: 0 12px
                line-height: 20px
                font-size: 11px
                color: #333
                background-color: #fff
                border-radius: 10px
                &.subscribe-end
                  color: #ebebeb
                  background-color: rgba(49,49,49,0.4)
          .bottom
            position: absolute
            bottom: -2px
            width: 100%
            height: 22px
            line-height: 22px
            display: flex
            align-items: center
            justify-content: space-between
            box-sizing: border-box
            .listen-data
              display: flex
              align-items: center
              .hear-icon
                width: 15px
                height: 12px
                image
                  display: block
                  width: 100%
                  height: 100%
              .knowledge-icon
                width: 15px
                height: 15px
                image
                  display: block
                  width: 100%
                  height: 100%
              .text
                padding-left: 7px
                box-sizing: border-box
                font-size: 12px
                display: flex
                color: #fefefe
                .num
                  font-size: 15px
                  font-weight: 600
    .subject-tab-wrapper
      width: 100%
      height: auto
      .tab-box
        position: relative
        padding-top: 10px
        width: 100%
        height: auto
        border-bottom: 1px solid #F2F2F2
        .tab-box-ul
          width: 100%
          height: auto
          padding: 0 35px
          display: flex
          justify-content: space-between
          box-sizing: border-box
          .item
            width: auto
            height: auto
            line-height: 40px
            font-size: 14px
            border-bottom: 2px solid transparent
            color: #999
          .active
            font-size: 16px
            font-weight: bold
            border-color: #FF4040
            color: #333
    .float-box-wrpper
      position: fixed
      right: 50px
      top: 0
      bottom: 55px
      width: 1px
      height: auto
      z-index: 80
      .float-box
        width: 50px
        height: 50px
        padding: 2px
        border-radius: 50%
        box-shadow: -1px 2px 9px 0px rgba(255,64,64,0.86)
        background-color: rgba(255, 255, 255, 0.88)
        box-sizing: border-box
        .text
          width: 100%
          height: 100%
          font-size: 12px
          font-weight: bold
          text-align: center
          color: #fff
          display: flex
          align-items: center
          justify-content: center
          border-radius: 50%
          background: linear-gradient(-4deg,rgba(255,64,64,1),rgba(255,99,38,1))
</style>
