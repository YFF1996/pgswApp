<template>
  <div v-if="upyunUrl" class="music-play-wrapper">
    <div v-if="indexLoadingMusicStatus" class="loading-wrapper"></div>
    <swiper
      v-else
      duration="200"
      vertical="true"
      :current="currentIndex"
      @change="onChangeFn"
      @touchstart="onTouchStartFn"
      class="swiper-wrapper"
    >
      <swiper-item v-for="(item, index) in musicList" :key="index">
        <div class="bg-img">
          <div class="shade"></div>
          <image mode="aspectFill" :src="item.thumb" />
        </div>
        <div
          class="play-box"
          :style="{width: maxWidth + 'px', height: maxWidth + 'px'}"
        >
          <div
            @click="onTogglePlayingFn(item)"
            class="play-content"
          >
            <div class="icon">
              <image v-if="item.id === currentMusicItem.id && playing" :src="upyunUrl + '/wxXcxImg/images/pause-icon.png'" />
              <image v-else :src="upyunUrl + '/wxXcxImg/images/play-icon.png'" />
            </div>
            <div class="video-img" :class="item.id === currentMusicItem.id && playing ? 'play': iPhone6State ? '' : 'play pause'">
              <image :src="item.thumb" mode="aspectFill" />
            </div>
          </div>
        </div>
        <div
          v-if="item.author_info && !isSpeedState"
          @click="onSkipPageFn(`/pages/subject/lectureHome/index?id=${item.author_info.au_id}`)"
          class="teacher-avatar"
        >
          <image mode="aspectFill" :src="item.author_info.headimgurl" />
          <div
            v-if="userInfo.user_id !== item.uid"
            @click.stop="onConcernAuthorFn(item.author_info.au_id, item.author_info.is_attention, index)"
            class="icon"
          >
            <image v-if="item.author_info.is_attention === 0" :src="upyunUrl + '/wxXcxImg/images/focus-icon.png'" />
            <image v-else :src="upyunUrl + '/wxXcxImg/images/focus-active-icon .png'" />
          </div>
        </div>
        <div
          v-if="!isSpeedState"
          class="text-wrapper"
        >
          <!-- 商品橱窗 -->
          <div
            v-if="item.window"
            class="shop-box"
          >
            <div
              class="shop-info"
            >
              <div
                v-if="item.window.state"
                class="float-box"
              >
                <div
                  @click.stop="onCloseWindowFn(index)"
                  class="icon"
                >
                  <image :src="upyunUrl + '/wxXcxImg/images/small-close-icon.png'" />
                </div>
                <div class="cover">
                  <image mode="aspectFill" :src="item.window.cover" />
                </div>
                <div class="info">
                  <div class="name">{{ item.window.name }}</div>
                  <div class="bottom">
                    <div class="money">￥{{ item.window.price }}</div>
                  </div>
                </div>
                <div class="triangle">
                  <div class="triangle-absolute"></div>
                </div>
              </div>
              <div class="shop-cnt">
                <div class="shop-title">
                  <div class="shop-icon">
                    <image :src="upyunUrl + '/wxXcxImg/images/shop-car-icon.png'" />
                  </div>
                  <div class="name">{{ item.window.name }}</div>
                  <div class="icon">
                    <image :src="upyunUrl + '/wxXcxImg/images/hot-return-icon.png'" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="title">
            <div class="title-text">{{ item.title }}</div>
          </div>
          <div
            v-if="item.special_id"
            class="special-wrapper"
          >
            <div
              @click="onSkipPageFn(`/pages/subject/subjectMusic/index?sid=${item.special_id}`)"
              class="special-content"
            >
              <image :src="upyunUrl + '/wxXcxImg/images/zhuan-ti-label.png'" />
              <div class="title">专题</div>
            </div>
          </div>
          <div
            v-if="item.is_voice_text"
            @click="onSkipPageFn(`/pages/contributionPage/index?id=${item.id}`)"
            class="text-btn"
          >
            <div class="title">文稿</div>
            <div class="icon">
              <image :src="upyunUrl + '/wxXcxImg/images/text-right-icon.png'" />
            </div>
          </div>
        </div>
      </swiper-item>
      <swiper-item></swiper-item>
    </swiper>
    <!-- 操作右边栏 -->
    <music-operating v-if="!isSpeedState" @showHideCommentStateChild="onShowHideCommentStateFn" />
    <!-- 播放进度条 -->
    <music-schedule v-if="allCurrentMusicItem.listType === 'indexMusic'" />
    <!-- 评论弹窗 -->
    <index-comment :status="commentPopUpsState" @showHideCommentStateChild="onShowHideCommentStateFn" />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import MusicOperating from '../musicOperatingTemplate'
import MusicSchedule from '../musicScheduleTemplate'
import IndexComment from '../indexCommentTemplate'
import { upyunUrl } from '../../api/config'

export default {
  data () {
    return {
      upyunUrl,
      maxWidth: 0,
      isPlayState: true,
      iPhone6State: false,
      commentPopUpsState: false,
      isSetMusicPlayStatus: false
    }
  },
  mounted () {
    this.getFacilityInfoFn()
  },
  computed: {
    ...mapState([
      'userInfo',
      'currentIndex',
      'indexLoadingMusicStatus',
      'currentMusicItem',
      'allCurrentMusicItem',
      'playing',
      'isSpeedState'
    ])
  },
  methods: {
    ...mapMutations({
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setIsSwitchMusic: 'SET_IS_SWITCH_MUSIC_STATE',
      setIndexLoadingMusicStatus: 'SET_INDEX_LOADING_MUSIC_STATUS'
    }),
    ...mapActions([
      'setMusicStatus',
      'concernAuthor'
    ]),
    // 手指按下时
    onTouchStartFn () {
      this.isSetMusicPlayStatus = true
      this.$emit('touchChild', false)
    },
    // 滑动切换音频
    onChangeFn (e) {
      const index = e.mp.detail.current
      this.setIsSwitchMusic(true)
      this.setCurrentIndex(index)
      this.onShowHideCommentStateFn(false)
      if (this.isSetMusicPlayStatus) {
        if (index < this.musicList.length) {
          this.setMusicPlayStatusFn(this.musicList[index])
        } else {
          this.setIndexLoadingMusicStatus(true)
          setTimeout(() => {
            this.$emit('loadingMoreMusicChild')
          }, 200)
        }
      }
    },
    // 播放-暂停
    onTogglePlayingFn (item) {
      this.setIsSwitchMusic(false)
      this.setMusicPlayStatusFn(item)
    },
    // 修改播放状态
    setMusicPlayStatusFn (item) {
      this.setMusicStatus({ that: this, item, list: this.musicList })
      setTimeout(() => {
        this.isSetMusicPlayStatus = false
      }, 500)
    },
    // 关注讲师
    onConcernAuthorFn (id, state, index) {
      if (this.userInfo) {
        if (state === 0) {
          this.musicList[index].author_info.is_attention = 1
        } else {
          this.musicList[index].author_info.is_attention = 0
        }
        this.concernAuthor({ that: this, au_id: id })
      } else {
        uni.navigateTo({
          url: `/pages/login/index`
        })
      }
    },
    // 获取设备信息
    getFacilityInfoFn () {
      const that = this
      uni.getSystemInfo({
        success (res) {
          let iPhoneModel = res.model
          let arr = iPhoneModel.split('<')
          if (arr[0] === 'iPhone 6' || arr[0] === 'iPhone 6s' || arr[0] === 'iPhone 6 Plus' || arr[0] === 'iPhone 6s Plus') {
            that.iPhone6State = true
          } else {
            that.iPhone6State = false
          }
          that.maxWidth = parseInt(res.windowHeight / 2.14)
        }
      })
    },
    // 控制首页评论弹窗，显示 - 隐藏
    onShowHideCommentStateFn (state) {
      this.commentPopUpsState = state
    },
    // 关闭橱窗
    onCloseWindowFn (index) {
      this.musicList[index].window['state'] = false
    },
    // 跳转页面
    onSkipPageFn (url) {
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
  props: {
    musicList: {
      type: Array,
      default: []
    }
  },
  components: {
    MusicOperating,
    MusicSchedule,
    IndexComment
  }
}
</script>

<style lang="stylus" scoped>
  .music-play-wrapper
    position: relative
    width: 100%
    height: 100%
    .loading-wrapper
      width: 100%
      height: 100%
    .swiper-wrapper
      width: 100%
      height: 100%
      swiper-item
        width: 100%
        height: 100%
        padding-top: 80px
        box-sizing: border-box
        .bg-img
          position: absolute
          left: 0
          top: 0
          right: 0
          bottom: 0
          width: 100%
          height: 100%
          z-index: -1
          opacity: 1
          .shade, image
            position: absolute
            left: 0
            top: 0
            right: 0
            bottom: 0
            width: 100%
            height: 100%
            z-index: -2
            background-color: rgba(0, 0, 0, 0.6)
          image
            filter: blur(10px)
            z-index: -3
        .play-box
          width: 300px
          height: 300px
          padding: 10px
          margin: 0 auto
          border-radius: 50%
          box-sizing: border-box
          background-color: #d9dee1
          .play-content
            position: relative
            width: 100%
            height: 100%
            .video-img
              width: 100%
              height: 100%
              border-radius: 50%
              overflow: hidden
              image
                width: 100%
                height: 100%
                border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
            .icon
              position: absolute
              left: 50%
              top: 50%
              width: 50px
              height: 50px
              margin-left: -25px
              margin-top: -25px
              z-index: 10
              image
                width: 100%
                height: 100%
        .teacher-avatar
          position: absolute
          right: 18px
          bottom: 240px
          width: 36px
          height: 36px
          display: flex
          justify-content: center
          border: 1px solid #fff
          border-radius: 50%
          background-color: #fff
          image
            display: block
            width: 100%
            height: 100%
            border-radius: 50%
          .icon
            position: absolute
            bottom: -11px
            padding: 5px
            box-sizing: border-box
            image
              display: block
              width: 11px
              height: 11px
        .shop-box
          display: flex
          margin-bottom: 10px
          .shop-info
            .float-box
              min-width: 182px
              position: relative
              padding: 7px 20px 7px 7px
              box-sizing: border-box
              display: flex
              background-color: rgba(0,0,0,0.4)
              border-radius: 3px
              .icon
                position: absolute
                top: 0
                right: 0
                padding: 5px
                width: 10px
                height: 10px
                image
                  display: block
                  width: 100%
                  height: 100%
              .cover
                width: 32px
                height: 32px
                image
                  width: 100%
                  height: 100%
              .info
                position: relative
                flex: 1
                margin: -2px 0 0 6px
                .name
                  height: 15px
                  line-height: 15px
                  display: -webkit-box
                  -webkit-box-orient: vertical
                  -webkit-line-clamp: 1
                  overflow: hidden
                  font-size: 12px
                  color: #fff
                .bottom
                  position: absolute
                  bottom: 0
                  width: 100%
                  height: auto
                  display: flex
                  align-items: center
                  .money
                    padding-right: 23px
                    font-size: 12px
                    color: #ffdb31
              .triangle
                position: absolute
                bottom: 0
                left: 13px
                .triangle-absolute
                  position: absolute
                  top: 0
                  left: 0
                  display: block
                  width: 0
                  height: 0
                  border-width: 5px 5px 0
                  border-style: solid
                  border-color: rgba(0,0,0,0.4) transparent transparent
            .shop-cnt
              margin-top: 10px
              display: inline-block
              .shop-title
                width: 100%
                height: auto
                padding: 0 10px 0 12px
                border-radius: 20px
                display: flex
                align-items: center
                justify-content: space-around
                background: rgba(255, 255, 255, 0.15)
                box-sizing: border-box
                .shop-icon
                  width: 12px
                  height: 12px
                  image
                    display: block
                    width: 100%
                    height: 100%
                .name
                  flex: 1
                  height: 25px
                  padding: 0 4px 0 6px
                  line-height: 25px
                  font-size: 12px
                  display: -webkit-box
                  -webkit-box-orient: vertical
                  -webkit-line-clamp: 1
                  overflow: hidden
                  color: #fff
                  box-sizing: border-box
                .icon
                  width: 9px
                  height: 9px
                  image
                    display: block
                    width: 100%
                    height: 100%
        .text-wrapper
          position: absolute
          left: 15px
          right: 100px
          bottom: 50px
          .title
            width: 100%
            height: auto
            display: flex
            .title-text
              flex: 1
              padding-left: 5px
              font-size: 14px
              color: #fff
          .special-wrapper
            display: inline-block
            height: 20px
            padding-left: 5px
            margin-top: 13px
            .special-content
              width: auto
              height: 100%
              padding: 0 10px
              border-radius: 10px
              display: flex
              align-items: center
              background-color: rgba(255, 255, 255, 0.5)
              image
                display: block
                width: 12px
                height: 12px
              .title
                padding-left: 5px
                letter-spacing: 2px
                font-size: 11px
                color: #fff
          .text-btn
            margin-top: 15px
            width: 100%
            height: auto
            padding-left: 15px
            display: flex
            box-sizing: border-box
            .title
              width: auto
              padding-right: 5px
              line-height: 20px
              font-size: 16px
              color: #fff
            .icon
              width: 16px
              height: 16px
              image
                width: 100%
                height: 100%
  @-webkit-keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
