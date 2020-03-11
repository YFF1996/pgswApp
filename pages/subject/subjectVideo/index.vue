<template>
  <div v-if="upyunUrl && oJson" class="details-wrapper">
    <div class="details-content">
      <div class="video-box">
        <video
          v-if="oJson.url"
          id="video"
          class="video"
          :src='oJson.url'
          :autoplay='true'
          @click="onPlayVideoFn(oJson.url)"
          @timeupdate="bindtimeupdateFn"
        >
          <div class="label">瓶盖思维</div>
        </video>
        <div
          v-if="!oJson.url && oJson.thumb"
          @click="onPlayVideoFn(oJson.url)"
          class="video-cover"
        >
          <image
            :src='oJson.thumb'
            mode="aspectFill"
            class="cover-img"
          />
          <image :src="upyunUrl + '/wxXcxImg/images/video-play-icon.png'" class="play-icon" />
          <div class="video-bottom">
            <div class="cnt-box">
              <div class="duration-text">{{ oJson.duration }}</div>
            </div>
          </div>
        </div>
      </div>
      <div
        @click="onSkipPageFn(`/pages/subject/subjectVideo/videoDetails/index?oJson=${encodeURIComponent(JSON.stringify(options))}`)"
        class="details-bottom"
      >
        <div class="left">
          <div class="play-num">{{ oJson.play_num }}人播放</div>
          <div class="right-cnt">
            <div
              v-if="subjectInfo.price <= 0 && subjectInfo.can_exchange !== 1"
              @click.stop="onSubscriptionSubjectFn(subjectInfo.is_sub)"
              class="subscribe"
            >
              <div v-if="subjectInfo.is_sub" class="btn btn-end">已订阅</div>
              <div v-else class="btn">+订阅</div>
            </div>
            <div class="handle-box" @click.stop>
              <div
                @click="onCollectionFn(subjectInfo.is_collection)"
                class="btn-box"
              >
                <div class="icon">
                  <image v-if="subjectInfo.is_collection === 0" :src="upyunUrl + '/wxXcxImg/images/collects-icon.png'" />
                  <image v-if="subjectInfo.is_collection === 1" :src="upyunUrl + '/wxXcxImg/images/collects-acive-icon.png'" />
                </div>
                <div class="num">{{ subjectInfo.collection_hits }}</div>
              </div>
              <div
                @click.stop="onMoreOperateFn()"
                class="btn-box"
              >
                <div class="icon">
                  <image :src="upyunUrl + '/wxXcxImg/images/shares-icon.png'" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="subjectInfo.authorInfo && subjectInfo.authorInfo.au_id"
          @click.stop
          class="info-box"
        >
          <div
            class="lecturer-box"
            @click="onSkipPageFn(`/pages/subject/lectureHome/index?id=${subjectInfo.authorInfo.id}`)"
          >
            <div class="lecturer">
              <div class="avatar">
                <image mode="aspectFill" :src="subjectInfo.authorInfo.headimgurl" />
              </div>
              <div class="info">
                <div class="name">{{ subjectInfo.authorInfo.nick_name }}</div>
                <div class="hint">{{ subjectInfo.authorInfo.fans }}人关注<div class="circle-icon"></div>{{ subjectInfo.authorInfo.contemt_num }}条内容</div>
              </div>
            </div>
            <div
              v-if="userInfo.user_id !== subjectInfo.authorInfo.uid && subjectInfo.authorInfo.is_attention === 0"
              @click.stop="onConcernAuthorFn(subjectInfo.authorInfo.au_id, subjectInfo.authorInfo.is_attention)"
              class="focus-btn"
            >+关注</div>
            <div
              v-if="userInfo.user_id !== subjectInfo.authorInfo.uid && subjectInfo.authorInfo.is_attention === 1"
              @click.stop="onConcernAuthorFn(subjectInfo.authorInfo.au_id, subjectInfo.authorInfo.is_attention)"
              class="active focus-btn"
            >已关注</div>
          </div>
        </div>
        <div class="title">{{ subjectInfo.title }}</div>
      </div>
    </div>
    <div class="video-tab-wrapper">
      <!-- 广告图片 -->
      <advertising
        v-if="advertisingInfo && advertisingState"
        :obj="advertisingInfo"
        @watchCloseAdvertisingChild="onCloseAdvertisingFn"
      />
      <div class="tab-box">
        <ul>
          <li
            v-for="(item, index) in tabNavList"
            v-if="(index !== 0 || index === 0 && subjectInfo.detail_intro)"
            :class="{'active' : tabNavIndex === index}"
            :key="index" @click="onTabNavFn(index)"
          >{{ item.title }}</li>
        </ul>
      </div>
    </div>
    <!-- 专题介绍 -->
    <div
      v-if="tabNavIndex === 0"
      class="editor-box"
    >
      <div class="text">
        <parser v-if="subjectInfo.detail_intro" :html="subjectInfo.detail_intro" />
        <div v-else class="not-data-wrapper">
          <img :src="upyunUrl + '/wxXcxImg/images/no-data-icon.png'" />
          <div class="title">暂无介绍</div>
        </div>
      </div>
    </div>
    <!-- 相似推荐视频列表 -->
    <div
      v-if="tabNavIndex === 1"
      class="course-cnt"
    >
      <video-course-list
        :lists="specialVideoList"
        :obj="options"
        @getVideoDetailsChild="getVideoDetailsFn"
      />
      <div v-if="similarList.length" class="title">为你推荐</div>
      <video-set-list v-if="similarList.length" :lists="similarList" />
      <!-- 单视频评论 -->
      <comment-list :lists="commentList" :vid="oJson.id" :hideSate="false" />
    </div>
    <!-- 专题评论 -->
    <comment-list
      v-if="tabNavIndex === 2"
      :lists="commentList"
      :special_id="options.special_id"
    />
    <!-- 购买兑换状态状态栏 -->
    <subject-state-bar
      v-if="(tabNavIndex === 1 && subjectInfo.price > 0) || (tabNavIndex === 1 && subjectInfo.can_exchange)"
      :obj="subjectInfo"
      @getSubjectInfoChild="getSubjectInfoFn"
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
    <more-operate :oItem="options" ref="child" />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import Advertising from '../../../components/advertisingTemplate/index'
import VideoCourseList from '../../../components/videoCourseListTemplate/index'
import VideoSetList from '../../../components/videoSetListTemplate/index'
import CommentList from '../../../components/commentListTemplate/index'
import SubjectStateBar from '../../../components/subjectStateBarTemplate/index'
import Parser from '../../../components/jyf-parser/jyf-parser'
import MoreOperate from '../../../components/moreOperateTempage'
import { queryString } from '../../../utils/getQueryString'
import { upyunUrl } from '../../../api/config'

export default {
  data () {
    return {
      upyunUrl,
      options: {},
      subjectInfo: '',
      oJson: '',
      page: 1,
      playState: false,
      startPlay: false,
      tabNavList: [
        {
          title: '介绍'
        },
        {
          title: '课程内容'
        },
        {
          title: '评论'
        }
      ],
      tabNavIndex: 0,
      specialVideoList: [],
      similarList: [],
      advertisingState: true,
      advertisingInfo: ''
    }
  },
  onLoad (options) {
    this.oJson = ''
    this.subjectInfo = ''
    if (options.scene) { // 腾讯二维码
      let scene = decodeURIComponent(options.scene)
      this.options['id'] = queryString(scene, 'v')
      this.options['special_id'] = queryString(scene, 'c')
      this.setShareId(queryString(scene, 's'))
    } else { // 普通进来
      this.options = JSON.parse(decodeURIComponent(options.oJson))
    }
    if (this.options.special_id && this.options.special_id === this.options.id) {
      this.getSpecialVideoListFn(true)
      this.getSimilarListFn()
    } else if (this.options.special_id && this.options.special_id !== this.options.id) {
      this.getVideoDetailsFn(this.options.id)
      this.getSpecialVideoListFn()
      this.getSimilarListFn()
    }
  },
  onShow () {
    this.tabNavIndex = 1
    this.getSubjectInfoFn(true)
  },
  // 上拉加载
  onReachBottom () {
    if (this.commentList.length) {
      this.page += 1
      if (this.tabNavIndex === 1) {
        this.getCommentListFn(false, this.options.id, 1)
      } else if (this.tabNavIndex === 2) {
        this.getCommentListFn(false, this.options.special_id, 0)
      }
    }
  },
  computed: {
    ...mapState([
      'userInfo',
      'commentList',
      'isReview',
      'isIos'
    ])
  },
  methods: {
    ...mapMutations({
      setIsIos: 'SET_IS_IOS',
      setShareId: 'SET_SHARE_ID',
      setTitleState: 'SET_TITLE_STATE',
      setCommentList: 'SET_COMMENT_LIST'
    }),
    ...mapActions([
      'getSubjectInfo',
      'getVideoDetails',
      'subscriptionSubject',
      'allCollection',
      'concernAuthor',
      'getSpecialVideoList',
      'getSimilarList',
      'getCommentList',
      'setActivityActRecord',
      'myAudioPause',
      'getAdvertisingInfo'
    ]),
    // 获取专题详情
    getSubjectInfoFn (isLoading) {
      const data = {
        that: this,
        special_id: this.options.special_id
      }
      this.setTitleState(true)
      if (isLoading) uni.showLoading({ title: 'Loading' })
      this.getSubjectInfo(data).then((res) => {
        this.subjectInfo = res.data
        if (isLoading)uni.hideLoading()
        this.getAdvertisingFn(this.subjectInfo.authorInfo.au_id)
      })
    },
    // 获取视频详情
    getVideoDetailsFn (id) {
      this.options.id = id
      const data = {
        that: this,
        id: this.options.id
      }
      this.setTitleState(false)
      uni.showLoading({ title: 'Loading' })
      this.getVideoDetails(data).then((res) => {
        res['id'] = this.options.id
        this.myAudioPause()
        this.oJson = res
        uni.hideLoading()
      })
      this.page = 1
      this.getCommentListFn(true, this.options.id, 1)
    },
    // 播放视频
    onPlayVideoFn (url) {
      const videoContext = uni.createVideoContext('video')
      if (url) {
        if (this.playState) {
          videoContext.pause()
          this.playState = false
        } else {
          videoContext.play()
          this.playState = true
          this.startPlay = true
        }
      } else {
        this.showToastFn('此视频需要购买后，才能播放哦!')
      }
    },
    // 停止播放视频
    onPauseVideoFn () {
      uni.createVideoContext('video').pause()
    },
    // 监听播放进度
    bindtimeupdateFn (e) {
      const duration = parseInt(e.mp.detail.duration)
      const currentTime = parseInt(e.mp.detail.currentTime)
      if (currentTime > duration * 0.9 && this.startPlay) {
        this.startPlay = false
        this.setActivityActRecord({ item: this.oJson, isFinish: 1 })
      }
    },
    // 视频收藏
    onCollectionFn (status) {
      const data = {
        that: this,
        id: this.options.special_id,
        type: 1
      }
      if (this.userInfo) {
        this.subjectInfo['is_collection'] = status === 1 ? 0 : 1
        this.subjectInfo['collection_hits'] = status === 1 ? this.subjectInfo.collection_hits - 1 : this.subjectInfo.collection_hits + 1
        this.allCollection(data)
      } else {
        this.onSkipPageFn(`/pages/login/index`)
      }
    },
    // 订阅专题
    onSubscriptionSubjectFn (status) {
      let data = {
        that: this,
        id: this.options.special_id
      }
      if (this.userInfo) {
        this.subjectInfo.is_sub = status === 0 ? 1 : 0
        this.subscriptionSubject(data)
      } else {
        uni.navigateTo({
          url: `/pages/login/index`
        })
      }
    },
    // 关注讲师
    onConcernAuthorFn (id, state) {
      if (this.userInfo) {
        if (state === 0) {
          this.subjectInfo.authorInfo.is_attention = 1
          this.subjectInfo.authorInfo.fans = this.subjectInfo.authorInfo.fans + 1
        } else {
          this.subjectInfo.authorInfo.is_attention = 0
          this.subjectInfo.authorInfo.fans = this.subjectInfo.authorInfo.fans - 1
        }
        this.concernAuthor({ that: this, au_id: id })
      } else {
        this.onSkipPageFn(`/pages/login/index`)
      }
    },
    // 更多操作状态栏
    onMoreOperateFn () {
      this.options['title'] = this.oJson.title
      this.options['thumb'] = this.oJson.thumb
      this.options['skipPath'] = 'subjectMusic'
      this.$refs.child.onUniPopupStateFn(true)
    },
    // 获取广告图片
    getAdvertisingFn (id) {
      const data = {
        that: this,
        au_id: id,
        id: this.options.special_id,
        location: 1
      }
      this.getAdvertisingInfo(data).then((res) => {
        this.advertisingInfo = res
      })
    },
    // 关闭广告
    onCloseAdvertisingFn () {
      this.advertisingState = false
    },
    // 切换tab导航栏
    onTabNavFn (index) {
      this.tabNavIndex = index
      if (this.tabNavIndex === 1) {
        this.page = 1
        this.getCommentListFn(true, this.options.id, 1)
      } else if (this.tabNavIndex === 2) {
        this.page = 1
        this.getCommentListFn(true, this.options.special_id, 0)
      }
    },
    // 获取专题内容视频列表
    getSpecialVideoListFn (mark) {
      const data = {
        that: this,
        id: this.options.special_id
      }
      if (mark) uni.showLoading({ title: 'Loading' })
      this.getSpecialVideoList(data).then((res) => {
        this.specialVideoList = res.data
        if (mark) this.getVideoDetailsFn(res.data[0].vid)
      })
    },
    // 获取专题为你推荐列表
    getSimilarListFn () {
      const data = {
        that: this,
        id: this.options.special_id
      }
      this.getSimilarList(data).then((res) => {
        this.similarList = res.data
      })
    },
    // 获取评论list
    getCommentListFn (isLoading, id, type) {
      const data = {
        that: this,
        page: this.page,
        c_id: id,
        type
      }
      if (isLoading) this.setCommentList([])
      this.getCommentList(data)
    },
    // 跳转页面
    onSkipPageFn (url) {
      this.onPauseVideoFn()
      uni.navigateTo({
        url
      })
    },
    // 跳转抢学费
    onSkipMainPageFn (url) {
      this.onPauseVideoFn()
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
    this.setTitleState(false)
    this.advertisingState = true
  },
  components: {
    Advertising,
    VideoCourseList,
    VideoSetList,
    CommentList,
    SubjectStateBar,
    Parser,
    MoreOperate
  }
}
</script>

<style lang="stylus" scoped>
  .details-wrapper
    width: 100%
    height: auto
    padding-bottom: 55px
    display: flex
    flex-direction: column
    .details-content
      position: relative
      width: 100%
      height: auto
      .video-box
        position: relative
        width: 100%
        height: auto
        .video
          position: relative
          width: 100%
          height: 180px
          margin: 0 auto
          display: block
          .label
            position: absolute
            right: 10px
            top: 15px
            width: 50px
            height: 20px
            line-height: 20px
            text-align: center
            font-size: 10px
            color: #fffefe
            background: -webkit-linear-gradient(top,rgba(255, 255, 255, 0)10%, rgba(0, 0, 0, .45)80%)
            border-radius: 2px
        .video-cover
          width: 100%
          height: 180px
          .cover-img
            width: 100%
            height: 100%
          .play-icon
            position: absolute
            left: 50%
            top: 50%
            width: 30px
            height: 34px
            margin-left: -15px
            margin-top: -17px
            z-index: 5
          .video-bottom
            position:absolute
            left: 0
            bottom: 0
            width: 100%
            height: 54px
            padding: 0 10px
            box-sizing: border-box
            font-size: 11px
            color: #fff
            background: linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,0.35) 100%)
            .cnt-box
              margin-top: 34px
              display: flex
              align-items: center
              justify-content: flex-end
      .details-bottom
        padding: 15px 15px 20px
        box-sizing: border-box
        border-bottom: 5px solid #f8f8f8
        .left
          display: flex
          align-items: center
          justify-content: space-between
          .play-num
            font-size: 12px
            color: #9798A6
          .right-cnt
            display: flex
            align-items: center
            .subscribe
              width: auto
              height: auto
              border-radius: 10px
              display: flex
              align-items: center
              .btn
                padding: 0 12px
                line-height: 20px
                font-size: 11px
                color: #333
                border: 1px solid rgba(49,49,49,0.4)
                border-radius: 10px
                &.btn-end
                  color: #ebebeb
                  background-color: rgba(49,49,49,0.4)
            .handle-box
              padding-left: 15px
              display: flex
              align-items: center
              .btn-box
                padding-left: 15px
                display: flex
                align-items: center
                .icon
                  width: 22px
                  height: 22px
                  image
                    display: block
                    width: 100%
                    height: 100%
                .num
                  padding-left: 5px
                  font-size: 12px
                  color: #9798a6
        .info-box
          width: 100%
          height: auto
          padding-top: 18px
          display: flex
          align-items: center
          justify-content: space-between
          .lecturer-box
            width: 100%
            display: flex
            align-items: center
            justify-content: space-between
            .lecturer
              flex: 1
              display: flex
              align-items: center
              .avatar
                width: 40px
                height: 40px
                border-radius: 50%
                image
                  display: block
                  width: 100%
                  height: 100%
                  border-radius: 50%
              .name
                padding-left: 10px
                font-size: 14px
                color: #545467
              .hint
                margin-top: 8px
                padding-left: 10px
                display: flex
                align-items: center
                font-size: 12px
                color: #9798a6
                .circle-icon
                  margin: 0 5px
                  width: 4px
                  height: 4px
                  background: #9798a6
                  border-radius: 50%
            .focus-btn
              margin-left: 30px
              width: 44px
              height: 23px
              line-height: 23px
              font-size: 12px
              text-align: center
              color: #ff6464
              border: 1px solid #ff6464
              border-radius: 4px
              &.active
                color: #9798a6
                border: 1px solid #9798a6
        .title
          margin-top: 15px
          font-size: 16px
          line-height: 24px
          color: #33344c
    .video-tab-wrapper
      width: 100%
      height: auto
      .tab-box
        position: relative
        padding-top: 10px
        width: 100%
        height: auto
        ul
          width: 100%
          height: auto
          padding: 0 35px
          display: flex
          justify-content: space-between
          box-sizing: border-box
          li
            width: auto
            height: auto
            line-height: 38px
            font-size: 14px
            border-bottom: 2px solid transparent
            color: #999
          .active
            font-size: 16px
            font-weight: bold
            border-color: #FF6464
            color: #333
    .editor-box
      margin-bottom: 50px
      position: relative
      width: 100%
      flex: 1
      .not-data-wrapper
        padding: 30px 0
        height: auto
        img
          margin: 0 auto
          display: block
          width: 200px
          height: 116px
        .title
          padding-top: 10px
          font-size: 13px
          line-height: 20px
          text-align: center
          color: #b9b9b9
    .course-cnt
      width: 100%
      height: auto
      .title
        padding: 15px 15px 0
        box-sizing: border-box
        font-size: 18px
        font-weight: bold
        color: #3b3b55
    .float-box-wrpper
      position: fixed
      right: 50px
      top: 0
      bottom: 55px
      width: 1px
      height: auto
      z-index: 50
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

