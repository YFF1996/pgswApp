<template>
  <div v-if="upyunUrl && musicDetails" class="details-wrapper">
    <div class="details-content">
      <div class="details-bg">
        <image :src="musicDetails.thumb || musicDetails.cover" />
      </div>
      <div class="details-info">
        <div
          @click="onMoreOperateFn()"
          class="share-icon"
        >
          <image :src="upyunUrl + '/wxXcxImg/images/share-goods-icon.png'" />
        </div>
        <div class="title">{{ musicDetails.title }}</div>
        <div class="cover">
          <image mode="aspectFill" :src="musicDetails.thumb || musicDetails.cover" />
        </div>
        <div class="progress-bar">
          <movable-area
            class="movable-area"
            id="movable-area"
          >
            <movable-view
              @change="onVoiceSeekMoveFn"
              @touchstart='onSeekTouchStartFn'
              @touchend="onSeekTouchEndFn"
              direction="horizontal"
              class='movable-view'
              :animation="false"
              :x="(areaWidth - viewWidth) * ((currentTime * (100 / totalTime)) / 100) || 0"
            >
              <div class="time-box">
                <div class="time-info">
                  <div class="text current-time">{{ thisCurrentTime === 0 ? '00:00' : thisCurrentTime }}</div>
                  <div class="time-line"></div>
                  <div class="text all-time">{{ thisTotalTime }}</div>
                </div>
              </div>
            </movable-view>
          </movable-area>
          <progress
            stroke-width='2'
            activeColor='#ff4040'
            backgroundColor='#fff'
            :percent='currentTime * (100 / totalTime)'
          />
        </div>
        <div class="handle-box">
          <div
            v-if="musicDetails.special_id"
            @click="onSkipPageFn(`/pages/subject/subjectMusic/index?sid=${musicDetails.special_id}`)"
            class="subject-skip"
          >
            <div class="list-icon">
              <image :src="upyunUrl + '/wxXcxImg/images/list-icon.png'" />
            </div>
            <div class="text">专题列表</div>
          </div>
          <div v-else class="subject-skip"></div>
          <div class="play-box">
            <div
              v-if="musicIndex <= 0"
              class="icon active"
            >
              <image :src="upyunUrl + '/wxXcxImg/images/xq-last-icon.png'" />
            </div>
            <div
              v-else
              @click.stop="onUpNextSongFn(musicIndex - 1)"
              class="icon"
            >
              <image :src="upyunUrl + '/wxXcxImg/images/xq-last-icon.png'" />
            </div>
            <div
              @click.stop="onTogglePlayingFn(musicDetails, musicIndex)"
              class="icon play-icon"
            >
              <image v-if="musicDetails.id && allPlaying" :src="upyunUrl + '/wxXcxImg/images/xq-play-icon.png'" />
              <image v-else :src="upyunUrl + '/wxXcxImg/images/xq-pause-icon.png'" />
            </div>
            <div
              v-if="musicIndex >= allMusicList.length - 1"
              class="icon active"
            >
              <image :src="upyunUrl + '/wxXcxImg/images/xq-next-icon.png'" />
            </div>
            <div
              v-else
              @click.stop="onUpNextSongFn(musicIndex + 1)"
              class="icon"
            >
              <image :src="upyunUrl + '/wxXcxImg/images/xq-next-icon.png'" />
            </div>
          </div>
          <div
            @click="onCollectionFn(musicDetails, musicDetails.is_collection)"
            class="collect-icon"
          >
            <image
              v-if="musicDetails.is_collection === 1"
              :src="upyunUrl + '/wxXcxImg/images/index-collect-active.png'"
              :class="{ 'active' : musicDetails.is_collection === 1 }"
            />
            <image v-else :src="upyunUrl + '/wxXcxImg/images/xq-collect-icon.png'" />
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="musicDetails.author"
      @click="onSkipPageFn(`/pages/subject/lectureHome/index?id=${musicDetails.author.id}`)"
      class="teacher-box"
    >
      <div class="teacher-info">
        <div class="avatar">
          <image mode="aspectFill" :src="musicDetails.author.headimgurl" />
        </div>
        <div class="content">
          <div class="name">{{ musicDetails.author.nick_name }}</div>
          <div class="num">
            <div class="text">{{ musicDetails.author.fans }}</div>人关注
          </div>
        </div>
      </div>
      <div
        v-if="userInfo.user_id !== musicDetails.author.uid && musicDetails.author.is_concern === 0"
        @click.stop="onConcernAuthorFn(musicDetails.author.id, musicDetails.author.is_concern)"
        class="btn-box btn-box-active"
      >
        <div class="icon">+</div>关注
      </div>
      <div
        v-if="userInfo.user_id !== musicDetails.author.uid && musicDetails.author.is_concern === 1"
        @click.stop="onConcernAuthorFn(musicDetails.author.id, musicDetails.author.is_concern)"
        class="btn-box"
      >已关注</div>
    </div>
    <div class="main-content">
      <div class="nav-wrapper">
        <div class="nav-ul">
          <div
            :class="{ 'active' : currentIndex === 0 }"
            @click="onSelectItemFn(0)"
            class="item"
          >文稿</div>
          <div
            :class="{ 'active' : currentIndex === 1 }"
            @click="onSelectItemFn(1)"
            class="item"
          >评论</div>
        </div>
      </div>
      <div class="description-wrapper">
        <!-- 文稿 -->
        <div
          v-if="currentIndex === 0"
          class="textarea-text"
        >
          <div v-if="musicDetails.url">
            <div
              :class="{'textarea-content-hide' : lineState && isLine }"
              class="textarea-content"
            >
              <parser v-if="musicDetails.voice_text" :html="musicDetails.voice_text" />
              <div class="mask"></div>
            </div>
            <div
              v-if="lineState && isLine"
              @click="onShowHideContentFn(false)"
              class="btn"
            >
              <div class="text">展开更多</div>
              <div class="icon">
                <image :src="upyunUrl + '/wxXcxImg/images/unfold-icon.png'" />
              </div>
            </div>
            <div
              v-if="lineState && !isLine"
              @click="onShowHideContentFn(true)"
              class="btn"
            >
              <div class="text">收起</div>
              <div class="up-icon">
                <image :src="upyunUrl + '/wxXcxImg/images/unfold-icon.png'" />
              </div>
            </div>
          </div>
          <div v-if="!musicDetails.url" class="not-data-wrapper">
            <image :src="upyunUrl + '/wxXcxImg/images/not-data-icon.png'" />
            <div class="title">付费内容，获得后即可查看</div>
          </div>
          <div v-if="!musicDetails.voice_text" class="no-data-wrapper">
            <image :src="upyunUrl + '/wxXcxImg/images/no-data-icon.png'" />
            <div class="title">暂无文稿</div>
          </div>
        </div>
        <!-- 评论 -->
        <comment-list v-if="currentIndex === 1" :lists="commentList" :vid="parameterObj.vid" />
      </div>
    </div>
    <!-- 更多操作 -->
    <more-operate :oItem="oItem" ref="child" />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import Parser from '../../../../components/jyf-parser/jyf-parser'
import MoreOperate from '../../../../components/moreOperateTempage'
import { upyunUrl } from '../../../../api/config'
import CommentList from '../../../../components/commentListTemplate/index'

export default {
  data () {
    return {
      upyunUrl,
      parameterObj: '',
      musicIndex: 0,
      thisCurrentTime: 0,
      thisTotalTime: 0,
      page: 1,
      currentIndex: 0,
      areaWidth: 0,
      viewWidth: 0,
      pressState: false,
      firstState: false,
      lineState: true,
      isLine: true,
      oItem: {}
    }
  },
  onLoad (options) {
    const oJson = JSON.parse(options.oJson)
    if (oJson.vid !== this.musicDetails.id) {
      this.parameterObj = oJson
      this.getMusicDetailsFn()
    }
    this.firstState = true
    this.currentIndex = 0
    this.setShareId(this.parameterObj.shareid)
    this.isLine = true
  },
  // 下拉刷新
  onPullDownRefresh () {
    this.getDataTableFn()
  },
  // 上拉加载
  onReachBottom () {
    if (this.currentIndex === 1 && this.commentList.length) {
      this.page += 1
      this.getCommentListFn(false)
    }
  },
  computed: {
    ...mapState([
      'userInfo',
      'musicDetails',
      'allPlaying',
      'allMusicList',
      'currentTime',
      'totalTime',
      'commentList',
      'allCurrentMusicItem'
    ])
  },
  methods: {
    ...mapMutations({
      setTitleState: 'SET_TITLE_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setIsSwitchMusic: 'SET_IS_SWITCH_MUSIC_STATE',
      setCommentList: 'SET_COMMENT_LIST',
      setShareId: 'SET_SHARE_ID'
    }),
    ...mapActions([
      'getMusicDetails',
      'addShareRecord',
      'addShareJifen',
      'setMusicStatus',
      'getCommentList',
      'setSliderChange',
      'myAudioPlay',
      'concernAuthor',
      'allCollection'
    ]),
    // 获取音频位置
    getMusicIndexFn () {
      this.allMusicList.forEach((item, index) => {
        if (item.id === this.allCurrentMusicItem.id) {
          this.musicIndex = index
        }
      })
    },
    // 获取音频详情
    getMusicDetailsFn () {
      const data = {
        that: this,
        id: this.parameterObj.vid,
        page: this.parameterObj.page,
        listType: this.parameterObj.type,
        keywords: this.parameterObj.keywords,
        authorId: this.parameterObj.authorId
      }
      this.setTitleState(true)
      this.getMusicDetails(data).then((res) => {
        this.thisTotalTime = this.timeToMinute(res.data.duration)
        this.getProgressBarWidthFn()
        this.getMusicIndexFn()
      })
    },
    // 获取progressBarWidth
    getProgressBarWidthFn () {
      const that = this
      const query = uni.createSelectorQuery().in(this)
      setTimeout(() => {
        query.select('.progress-bar').boundingClientRect((rect) => {
          that.areaWidth = rect.width
        }).exec()
        query.select('.time-info').boundingClientRect((rect) => {
          that.viewWidth = rect.width
        }).exec()
      }, 1000)
    },
    // 音频暂停/播放
    onTogglePlayingFn (item) {
      if (this.musicDetails.url) {
        this.setIsSwitchMusic(false)
        this.setMusicStatus({ that: this, item, list: this.allMusicList })
      } else {
        uni.showModal({
          title: '温馨提示',
          content: '购买后才能播放!',
          confirmColor: '#e1564f'
        })
      }
    },
    // 上一曲 - 下一曲
    onUpNextSongFn (index) {
      this.musicIndex = index
      if (this.allMusicList[this.musicIndex].listType === 'indexMusic') this.setCurrentIndex(this.musicIndex)
      this.parameterObj['vid'] = this.allMusicList[this.musicIndex].vid || this.allMusicList[this.musicIndex].id
      this.parameterObj['page'] = this.allMusicList[this.musicIndex].page
      this.getMusicDetailsFn()
    },
    // 拖动过程中触发
    onVoiceSeekMoveFn (e) {
      const data = {
        status: true,
        total: this.areaWidth - this.viewWidth,
        num: e.mp.detail.x - 5
      }
      if (this.pressState) this.setSliderChange(data)
    },
    // 按下时
    onSeekTouchStartFn () {
      this.pressState = true
    },
    // 拖动放开结束时触发
    onSeekTouchEndFn () {
      this.pressState = false
      setTimeout(() => {
        this.myAudioPlay()
      }, 500)
    },
    // 关注讲师
    onConcernAuthorFn (id, state) {
      if (this.userInfo) {
        if (state === 0) {
          this.musicDetails.author.is_concern = 1
          this.musicDetails.author.fans = this.musicDetails.author.fans + 1
        } else {
          this.musicDetails.author.is_concern = 0
          this.musicDetails.author.fans = this.musicDetails.author.fans - 1
        }
        this.concernAuthor({ that: this, au_id: id })
      } else {
        uni.navigateTo({
          url: `/pages/loginPage/main`
        })
      }
    },
    // 更多操作状态栏
    onMoreOperateFn () {
      this.oItem = {
        skipPath: 'musicDetails',
        title: this.musicDetails.title,
        vid: this.musicDetails.vid || this.musicDetails.id,
        thumb: this.musicDetails.thumb || this.musicDetails.cover
      }
      this.$refs.child.onUniPopupStateFn(true)
    },
    // 选择类型
    onSelectItemFn (index) {
      this.currentIndex = index
      this.getDataTableFn()
    },
    // 显示-隐藏文稿content
    onShowHideContentFn (status) {
      this.isLine = status
    },
    // 获取评论list
    getCommentListFn (isLoading) {
      const data = {
        that: this,
        page: this.page,
        c_id: this.parameterObj.vid,
        type: 1
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
      switch (this.currentIndex) {
        case 1:
          this.getCommentListFn(true)
          break
        default:
          return false
      }
    },
    // 音频收藏
    onCollectionFn (item, status) {
      const data = {
        collectionType: 'musicDetailsType',
        id: this.parameterObj.vid,
        that: this,
        type: 0,
        status
      }
      if (this.userInfo) {
        this.allCollection(data)
      } else {
        this.onSkipPageFn(`/pages/login/index`)
      }
    },
    // 跳转页面
    onSkipPageFn (url) {
      uni.navigateTo({
        url
      })
    },
    timeToMinute (times) {
      let t = ''
      if (times > -1) {
        const min = Math.floor(times / 60) % 60
        const sec = times % 60
        if (min < 10) {
          t = '0'
        }
        t += min + ':'
        if (sec < 10) {
          t += '0'
        }
        t += sec.toFixed(2)
      }
      t = t.substring(0, t.length - 3)
      return t
    },
    // 计算字符串的长度
    strlen (str) {
      let len = 0
      for (let i = 0; i < str.length; i++) {
        let c = str.charCodeAt(i)
        if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
          len++
        } else {
          len += 2
        }
      }
      return len
    }
  },
  onUnload () {
    this.firstState = false
    this.setTitleState(false)
  },
  components: {
    Parser,
    MoreOperate,
    CommentList
  },
  watch: {
    currentTime (num) {
      this.thisCurrentTime = this.timeToMinute(num)
    },
    allCurrentMusicItem (item) {
      if (this.parameterObj.vid !== item.id && this.firstState) {
        this.parameterObj.vid = item.id
        this.currentIndex = 0
        this.getMusicIndexFn()
        if (this.strlen(item.voice_text) >= 534) {
          this.lineState = true
          this.isLine = true
        } else {
          this.lineState = false
          this.isLine = false
        }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.details-wrapper
  width: 100%
  height: auto
  display: flex
  flex-direction: column
  .details-content
    position: relative
    width: 100%
    height: 330px
    .details-bg
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      background-color: rgba(0, 0, 0, 0.5)
      image
        width: 100%
        height: 100%
        opacity: 0.6
        filter: blur(20px)
    .details-info
      position: absolute
      left: 0
      top: 0
      width: 100%
      height: auto
      padding: 16px 16px 20px
      box-sizing: border-box
      .share-icon
        position: absolute
        right: 18px
        top: 18px
        width: 16px
        height: 16px
        image
          width: 100%
          height: 100%
      .title
        padding: 0 40px
        width: 100%
        height: 46px
        font-size: 15px
        line-height: 23px
        text-align: center
        color: #fff
        display: -webkit-box
        -webkit-box-orient: vertical
        -webkit-line-clamp: 2
        overflow: hidden
        box-sizing: border-box
      .cover
        margin: 16px auto 36px
        width: 135px
        height: 135px
        border-radius: 2px
        image
          width: 100%
          height: 100%
          border-radius: 2px
    .progress-bar
      position: relative
      width: 100%
      height: auto
      display: flex
      flex-direction: column
      .movable-area
        position: relative
        width: 100%
        height: auto
        .movable-view
          position: absolute
          top: -9px
          left: 0
          width: auto
          height: auto
          .time-box
            width: 100%
            height: auto
            display: flex
            justify-content: center
            .time-info
              width: 95px
              height: 20px
              display: flex
              border-radius: 10px
              align-items: center
              justify-content: center
              background-color: #fff
              box-sizing: border-box
              .text
                font-size: 12px
                color: #666
              .time-line
                margin: 0 8px
                width: 1px
                height: 10px
                background-color: #666
    .handle-box
      padding: 0 15px
      margin-top: 23px
      width: 100%
      height: auto
      display: flex
      align-items: center
      justify-content: space-around
      box-sizing: border-box
      .subject-skip
        width: 44px
        height: 38px
        .list-icon
          margin: 0 auto
          width: 20px
          height: 18px
          image
            display: block
            width: 100%
            height: 100%
        .text
          margin-top: 5px
          font-size: 11px
          text-align: center
          color: #fff
      .play-box
        padding: 0 30px
        flex: 1
        display: flex
        align-items: center
        justify-content: space-around
        box-sizing: border-box
        .icon
          width: 16px
          height: 16px
          image
            display: block
            width: 100%
            height: 100%
          &.play-icon
            width: 30px
            height: 30px
        .active
          opacity: 0.2
      .collect-icon
        width: 22px
        height: 20px
        image
          display: block
          width: 100%
          height: 100%
          animation: scaleB .3s linear forwards
        .active
          animation: scaleA .5s linear forwards
  .teacher-box
    padding: 20px 15px 0 20px
    display: flex
    align-items: center
    justify-content: space-around
    box-sizing: border-box
    .teacher-info
      flex: 1
      display: flex
      align-items: center
      .avatar
        width: 48px
        height: 48px
        border-radius: 50%
        image
          width: 100%
          height: 100%
          border-radius: 50%
      .content
        padding-left: 15px
        .name
          font-size: 14px
          color: #333
        .num
          font-size: 12px
          display: flex
          align-items: center
          color: #999
          .text
            padding-right: 5px
            font-size: 15px
            color: #666
    .btn-box
      width: 65px
      height: 26px
      line-height: 26px
      font-size: 14px
      text-align: center
      border-radius: 25px
      display: flex
      align-items: center
      justify-content: center
      color: #fff
      background-color: #999
      .icon
        padding-right: 5px
    .btn-box-active
      box-shadow: 0 1px 4px 0 rgba(255, 64, 64, 0.3)
      background-color: #ff4040
  .main-content
    width: 100%
    height: auto
    .nav-wrapper
      position: relative
      width: 100%
      height: auto
      padding-top: 20px
      .nav-ul
        width: 100%
        height: auto
        display: flex
        align-items: center
        justify-content: space-around
        border-bottom: 1px solid #f2f2f2
        .item
          padding: 6px 0
          font-size: 13px
          color: #999
          font-weight: bold
          &.active
            font-size: 15px
            color: #333
            border-bottom: 2px solid #ff4040
    .description-wrapper
      width: 100%
      height: auto
      .textarea-text
        width: 100%
        height: auto
        padding: 20px
        box-sizing: border-box
        .not-data-wrapper
          width: 100%
          height: auto
          padding-top: 25px
          image
            display: block
            width: 64px
            height: 64px
            margin: 0 auto
          .title
            font-size: 13px
            line-height: 50px
            text-align: center
            color: #666
        .no-data-wrapper
          width: 100%
          height: auto
          padding-top: 50px
          image
            display: block
            width: 245px
            height: 140px
            margin: 0 auto
          .title
            font-size: 14px
            line-height: 80px
            text-align: center
            color: #666
        .textarea-content
          position: relative
          height: auto
          line-height: 24px
          word-break: break-all
          color: #676767
        .textarea-content-hide
          height: 311px
          display: -webkit-box
          -webkit-box-orient: vertical
          -webkit-line-clamp: 13
          overflow: hidden
          .mask
            position: absolute
            bottom: 0
            width: 100%
            height: 48px
            overflow: hidden
            &::after
              position: absolute
              bottom: 0
              height: 100%
              width: 100%
              content: ""
              background: linear-gradient(to top, rgba(255,255,255, 0.8) 10%, rgba(255,255,255, 0) 90%)
              pointer-events: none
        .btn
          padding: 12px 6px 6px
          display: flex
          align-items: center
          justify-content: center
          font-size: 12px
          text-align: center
          color: #999
          box-sizing: border-box
          .text
            padding-right: 4px
          .icon
            width: 8px
            height: 3px
            image
              display: block
              width: 100%
              height: 100%
            &.up-icon
              transform: rotate(-180deg)
@-webkit-keyframes scaleA
  0%
    transform: scale(0)
  40%
    transform: scale(1.2)
  100%
    transform: scale(1)
@-webkit-keyframes scaleB
  0%
    transform: scale(0)
  50%
    transform: scale(0.8)
  100%
    transform: scale(1)
</style>
