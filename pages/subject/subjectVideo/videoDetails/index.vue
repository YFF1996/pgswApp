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
          @timeupdate="bindtimeupdateFn"
        >
          <div class="label">瓶盖思维</div>
        </video>
        <div
          v-if="!oJson.url && oJson.thumb"
          @click="onPlayVideoFn()"
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
      <div class="details-bottom">
        <div class="left">
          <div class="play-num">{{ oJson.play_num }}人播放</div>
          <div class="handle-box">
            <div
              @click="onLikeFn(oJson.is_like)"
              class="btn-box"
            >
              <div class="icon">
                <image v-if="oJson.is_like === 0" :src="upyunUrl + '/wxXcxImg/images/thumbed-icon.png'" />
                <image v-if="oJson.is_like === 1" :src="upyunUrl + '/wxXcxImg/images/thumbed-active-icon.png'" />
              </div>
              <div class="num">{{ oJson.like_hits }}</div>
            </div>
            <div
              @click="onCollectionFn(oJson.is_collection)"
              class="btn-box"
            >
              <div class="icon">
                <image v-if="oJson.is_collection === 0" :src="upyunUrl + '/wxXcxImg/images/collects-icon.png'" />
                <image v-if="oJson.is_collection === 1" :src="upyunUrl + '/wxXcxImg/images/collects-acive-icon.png'" />
              </div>
              <div class="num">{{ oJson.collection_hits }}</div>
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
        <div
          v-if="oJson.author && oJson.author.au_id"
          class="info-box"
        >
          <div
            class="lecturer-box"
            @click="onSkipPageFn(`/pages/subject/lectureHome/index?id=${oJson.author.id}`)"
          >
            <div class="lecturer">
              <div class="avatar">
                <image mode="aspectFill" :src="oJson.author.headimgurl" />
              </div>
              <div class="info">
                <div class="name">{{ oJson.author.nick_name }}</div>
                <div class="hint">{{ oJson.author.fans }}人关注<div class="circle-icon"></div>{{ oJson.author.content_num }}条内容</div>
              </div>
            </div>
            <div
              v-if="userInfo.user_id !== oJson.author.uid && oJson.author.is_concern === 0"
              @click.stop="onConcernAuthorFn(oJson.author.au_id, oJson.author.is_concern)"
              class="focus-btn"
            >+关注</div>
            <div
              v-if="userInfo.user_id !== oJson.author.uid && oJson.author.is_concern === 1"
              @click.stop="onConcernAuthorFn(oJson.author.au_id, oJson.author.is_concern)"
              class="active focus-btn"
            >已关注</div>
          </div>
        </div>
        <div class="title">{{ oJson.title }}</div>
      </div>
    </div>
    <div class="comment-title">评论</div>
    <!-- 评论 -->
    <comment-list
      :lists="commentList"
      :vid="options.id"
    />
    <!-- 更多操作 -->
    <more-operate :oItem="options" ref="child" />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { upyunUrl } from '../../../../api/config'
import CommentList from '../../../../components/commentListTemplate/index'
import MoreOperate from '../../../../components/moreOperateTempage'
import { queryString } from '../../../../utils/getQueryString'

export default {
  data () {
    return {
      upyunUrl,
      options: {},
      oJson: '',
      page: 1,
      startPlay: true
    }
  },
  onLoad (options) {
    this.page = 1
    if (options.scene) { // 腾讯二维码
      let scene = decodeURIComponent(options.scene)
      this.options['id'] = queryString(scene, 'v')
      this.setShareId(queryString(scene, 's'))
    } else { // 普通进来
      this.options = JSON.parse(decodeURIComponent(options.oJson))
    }
    this.getVideoDetailsFn()
    this.getCommentListFn(true)
  },
  // 上拉加载
  onReachBottom () {
    if (this.commentList.length) {
      this.page += 1
      this.getCommentListFn(false)
    }
  },
  computed: {
    ...mapState([
      'userInfo',
      'commentList'
    ])
  },
  methods: {
    ...mapMutations({
      setShareId: 'SET_SHARE_ID',
      setTitleState: 'SET_TITLE_STATE',
      setCommentList: 'SET_COMMENT_LIST'
    }),
    ...mapActions([
      'getVideoDetails',
      'allThumbsUp',
      'allCollection',
      'concernAuthor',
      'getCommentList',
      'setActivityActRecord',
      'myAudioPause'
    ]),
    // 获取视频详情
    getVideoDetailsFn () {
      const data = {
        that: this,
        id: this.options.id
      }
      this.setTitleState(true)
      uni.showLoading({ title: 'Loading' })
      this.getVideoDetails(data).then((res) => {
        res['id'] = this.options.id
        res['special_id'] = ''
        this.myAudioPause()
        this.oJson = res
        uni.hideLoading()
      })
    },
    // 播放视频
    onPlayVideoFn () {
      this.showToastFn('此视频需要购买后，才能播放哦!')
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
    // 视频点赞
    onLikeFn (status) {
      const data = {
        that: this,
        id: this.options.id,
        type: 0
      }
      if (this.userInfo) {
        this.oJson['is_like'] = status === 1 ? 0 : 1
        this.oJson['like_hits'] = status === 1 ? this.oJson.like_hits - 1 : this.oJson.like_hits + 1
        this.allThumbsUp(data)
      } else {
        this.onSkipPageFn(`/pages/login/index`)
      }
    },
    // 视频收藏
    onCollectionFn (status) {
      const data = {
        that: this,
        id: this.options.id,
        type: 0
      }
      if (this.userInfo) {
        this.oJson['is_collection'] = status === 1 ? 0 : 1
        this.oJson['collection_hits'] = status === 1 ? this.oJson.collection_hits - 1 : this.oJson.collection_hits + 1
        this.allCollection(data)
      } else {
        this.onSkipPageFn(`/pages/login/index`)
      }
    },
    // 关注讲师
    onConcernAuthorFn (id, state) {
      if (this.userInfo) {
        if (state === 0) {
          this.oJson.author.is_concern = 1
          this.oJson.author.fans = this.oJson.author.fans + 1
        } else {
          this.oJson.author.is_concern = 0
          this.oJson.author.fans = this.oJson.author.fans - 1
        }
        this.concernAuthor({ that: this, au_id: id })
        this.oJson.mark = !this.oJson.mark
      } else {
        this.onSkipPageFn(`/pages/login/index`)
      }
    },
    // 更多操作状态栏
    onMoreOperateFn () {
      this.options['title'] = this.oJson.title
      this.options['thumb'] = this.oJson.thumb
      this.options['skipPath'] = 'videoDetails'
      this.$refs.child.onUniPopupStateFn(true)
    },
    // 获取评论list
    getCommentListFn (isLoading) {
      const data = {
        that: this,
        page: this.page,
        c_id: this.options.id,
        type: 1
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
    this.startPlay = true
    this.setTitleState(false)
  },
  components: {
    CommentList,
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
          .handle-box
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
    .comment-title
      padding: 15px 0 0 15px
      box-sizing: border-box
      font-size: 18px
      font-weight: bold
      color: #3b3b55
</style>

