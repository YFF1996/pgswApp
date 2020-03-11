<template>
  <div v-if="upyunUrl && oJson" class="lecture-wrapper">
    <div class="lecture-top">
      <div class="info-box">
        <div class="avatar">
          <img mode="aspectFill" :src="oJson.headimgurl" />
        </div>
        <div class="text-box">
          <h1>{{ oJson.nick_name }}</h1>
          <!--最多显示5个标签-->
          <ul v-if="oJson.tags.length">
            <li v-for="(item, index) in oJson.tags" :key="index">
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>
        <div
          v-if="oJson.message_status === 2 && userInfo.user_id !== oJson.uid && oJson.is_concern &&oJson.uid"
          @click="onSkipPageFn(`lecturerDialogue/index?oJson=`, true)"
          class="btn-box-border"
        >私信</div>
        <div
          v-if="userInfo.user_id !== oJson.uid && oJson.is_concern"
          @click="onConcernAuthorFn(oJson.id)"
          class="btn-box"
        >
          <span>已关注</span>
        </div>
        <div
          v-if="userInfo.user_id !== oJson.uid && !oJson.is_concern"
          @click="onConcernAuthorFn(oJson.id)"
          class="btn-box btn-box-active"
        >
          <span class="add">+</span>

          <span>关注TA</span>
        </div>
        <div
          v-if="userInfo.user_id !== oJson.uid && !popupState && !oJson.is_concern"
          class="hint-popup"
        >
          <div class="triangle-box">
            <div class="triangle"></div>
          </div>
          <div class="hint">
            <spann>关注功能新上线，喜欢就关注吧</spann>
            <i @click="onCloseFn()">
              <img :src="upyunUrl + '/wxXcxImg/images/pic-close.png'" />
            </i>
          </div>
        </div>
      </div>
      <ul class="data-box">
        <li>{{ oJson.fans }}<span>粉丝</span></li>
        <li>{{ oJson.like }}<span>点赞</span></li>
        <li>{{ oJson.hits }}<span>播放</span></li>
      </ul>
      <div class="intro-box">
        <div class="desc" :class="{'desc-hide' : lineState }">
          个人简介：{{ oJson.intro || '暂无' }}
          <div class="mask"></div>
        </div>
        <div class="more" v-if="lineState" @click="onShowHideContentFn(false)">
          <span>更多</span>
          <i>
            <img :src="upyunUrl + '/wxXcxImg/images/right-more-icon.png'" />
          </i>
        </div>
      </div>
    </div>
    <div class="lecture-content">
      <div
        v-if="oJson.window_status === 2 || oJson.consult_status === 2"
        class="business-box"
      >
        <div class="title-box">
          <h2>商业中心</h2>
        </div>
        <ul>
          <li
            v-if="oJson.window_status === 2"
            @click="onSkipPageFn(`/pages/subject/lectureHome/lecturerGoods/index?oJson=`, false)"
          >
            <i>
              <img :src="upyunUrl + '/wxXcxImg/images/business-icon01.png'" />
            </i>
            <h3>商品橱窗</h3>
          </li>
          <li
            v-if="oJson.consult_status === 2"
            @click="onSkipPageFn(`/pages/subject/lectureHome/lecturerConsulting/index?oJson=`, false)"
          >
            <i>
              <img :src="upyunUrl + '/wxXcxImg/images/business-icon02.png'" />
            </i>
            <h3>一对一咨询</h3>
          </li>
        </ul>
      </div>
      <div class="list-box">
        <div class="nav-wrapper">
          <ul>
            <li
              :class="{ 'active' : currentIndex === 0 }"
              @click="onSwitchItemFn(0)"
            >
              讲师专题
              <i class="line"></i>
            </li>
            <li
              v-if="oJson.voice_total"
              :class="{ 'active' : currentIndex === 1 }"
              @click="onSwitchItemFn(1)"
            >
              讲师音频
              <i class="line"></i>
            </li>
            <li
              v-if="oJson.content"
              :class="{ 'active' : currentIndex === 2 }"
              @click="onSwitchItemFn(2)"
            >
              讲师介绍
              <i class="line"></i>
            </li>
          </ul>
        </div>
        <special-list v-if="currentIndex === 0" :list="lectureSubjectList" />
        <video-list v-if="currentIndex === 1 && oJson.voice_total" :lists="lectureMusicList" :type="'lectureType'" :authorId="id" />
        <div v-if="currentIndex === 2 && oJson.content" class="intro editor-box">
          <parse v-if="oJson.content" :html="oJson.content" />
          <div v-else class="not-data-wrapper">
            <img :src="upyunUrl + '/wxXcxImg/images/no-data-icon.png'" />
            <div class="title">暂无介绍</div>
          </div>
        </div>
        <!-- 上拉加载更多loading -->
        <loading-more v-if="currentIndex === 0" :lists="lectureSubjectList" :listsLength="16" />
        <loading-more v-if="currentIndex === 1" :lists="lectureMusicList" :listsLength="16" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { upyunUrl } from '../../../api/config'
import VideoList from '../../../components/videoListTemplate'
import SpecialList from '../../../components/specialListTemplate'
import LoadingMore from '../../../components/loadingMoreTemplate'
import Parse from '../../../components/jyf-parser/jyf-parser'

export default {
  data () {
    return {
      upyunUrl,
      oJson: '',
      id: 0,
      uid: 0,
      page: 1,
      otherPage: 1,
      currentIndex: 0,
      lineState: true,
      popupState: true
    }
  },
  onLoad (options) {
    this.id = options.id
    if (options.uid) this.uid = options.uid
    this.page = 1
    this.currentIndex = 0
    this.lineState = true
    this.popupState = uni.getStorageSync('popupState')
    this.onLoadListFn()
    this.getLectureInfoFn()
  },
  // 下拉刷新
  onPullDownRefresh () {
    this.getLectureInfoFn()
    this.onLoadListFn()
  },
  // 上拉加载
  onReachBottom () {
    if (this.currentIndex === 0 && this.lectureSubjectList.length) {
      this.otherPage += 1
      this.getLectureSubjectListFn(false)
    } else if (this.currentIndex === 1 && this.lectureMusicList.length) {
      this.page = this.lectureMusicList[this.lectureMusicList.length - 1].page + 1
      this.getLectureMusicListFn(false)
    }
  },
  computed: {
    ...mapState([
      'userInfo',
      'lectureSubjectList',
      'lectureMusicList'
    ])
  },
  methods: {
    ...mapMutations({
      setLectureSubjectList: 'SET_LECTURE_SUBJECT_LIST',
      setLectureMusicList: 'SET_LECTURE_MUSIC_LIST'
    }),
    ...mapActions([
      'getLectureInfo',
      'concernAuthor',
      'getLectureSubjectList',
      'getLectureMusicList'
    ]),
    // 获取讲师基本信息
    getLectureInfoFn () {
      let data = {
        that: this,
        id: this.id,
        uid: this.uid
      }
      this.getLectureInfo(data).then((res) => {
        res['fans'] = res.fans >= 10000 ? Math.round((res.fans / 10000) * 100) / 100 + '万' : res.fans
        res['like'] = res.like >= 10000 ? Math.round((res.like / 10000) * 100) / 100 + '万' : res.like
        res['hits'] = res.hits >= 10000 ? Math.round((res.hits / 10000) * 100) / 100 + '万' : res.hits
        if (res.intro && this.strlen(res.intro) >= 40) {
          this.lineState = true
        } else {
          this.lineState = false
        }
        this.oJson = res
      })
    },
    // 显示-隐藏文稿content
    onShowHideContentFn (status) {
      this.lineState = status
    },
    // 关注讲师
    onConcernAuthorFn (id) {
      if (this.userInfo) {
        uni.showLoading({ title: 'Loading' })
        this.concernAuthor({ that: this, au_id: id }).then((res) => {
          this.oJson.is_concern = res.data.is_attention
          uni.hideLoading()
        })
      } else {
        uni.navigateTo({
          url: `/pages/login/index`
        })
      }
    },
    // 获取讲师专题列表
    getLectureSubjectListFn (isLoading) {
      const data = {
        that: this,
        id: this.id,
        uid: this.uid,
        page: this.otherPage
      }
      if (isLoading) {
        uni.showLoading({ title: 'Loading' })
        this.setLectureSubjectList([])
      }
      uni.showNavigationBarLoading()
      this.getLectureSubjectList(data).then(() => {
        if (isLoading) uni.hideLoading()
        uni.stopPullDownRefresh()
        uni.hideNavigationBarLoading()
      })
    },
    // 获取讲师音频列表
    getLectureMusicListFn (isLoading) {
      let data = {
        that: this,
        uid: this.uid,
        page: this.page,
        authorId: this.id
      }
      if (isLoading) {
        uni.showLoading({ title: 'Loading' })
        this.setLectureMusicList([])
      }
      uni.showNavigationBarLoading()
      this.getLectureMusicList(data).then(() => {
        if (isLoading) uni.hideLoading()
        uni.stopPullDownRefresh()
        uni.hideNavigationBarLoading()
      })
    },
    // 选择类型
    onSwitchItemFn (index) {
      this.currentIndex = index
      this.onLoadListFn()
    },
    // 加载list数据
    onLoadListFn () {
      this.page = 1
      this.otherPage = 1

      switch (this.currentIndex) {
        case 0:
          this.getLectureSubjectListFn(true)
          break
        case 1:
          this.getLectureMusicListFn(true)
          break
        default:
          return false
      }
    },
    // 关闭提示浮窗
    onCloseFn () {
      this.popupState = true
      uni.setStorageSync('popupState', true)
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
    },
    // 跳转页面
    onSkipPageFn (url, state) {
      if (state) {
        if (this.userInfo) {
          uni.navigateTo({
            url: url + encodeURIComponent(JSON.stringify(this.oJson))
          })
        } else {
          uni.navigateTo({
            url: `/pages/login/index`
          })
        }
      } else {
        uni.navigateTo({
          url: url + encodeURIComponent(JSON.stringify(this.oJson))
        })
      }
    }
  },
  onUnload () {
    this.oJson = ''
  },
  components: {
    SpecialList,
    VideoList,
    LoadingMore,
    Parse
  }
}
</script>

<style lang="stylus" scoped>
  .lecture-wrapper
    width: 100%
    height: 100%
    background-color: #f8f8f8
    .lecture-top
      margin-bottom: 15px
      padding: 26px 15px 22px
      width: 100%
      height: auto
      box-sizing: border-box
      background-color: #fff
      .info-box
        position: relative
        display: flex
        align-items: center
        justify-content: space-around
        .avatar
          width: 70px
          height: 70px
          border-radius: 50%
          img
            width: 100%
            height: 100%
            border-radius: 50%
        .text-box
          flex: 1
          padding-left: 12px
          h1
            margin-bottom: 9px
            font-size: 18px
            font-weight: bolder
            color: #000
          ul
            flex-wrap: wrap
            display: flex
            align-items: center
            li
              margin: 5px 10px 0 0
              span
                display: block
                padding: 4px 10px
                min-width: 42px
                font-size: 11px
                text-align: center
                color: #808080
                box-sizing: border-box
                border-radius: 20px
                background-color: #f0f0f0
        .btn-box-border
          width: auto
          height: 20px
          padding: 0 10px
          margin-right: 10px
          border-radius: 20px
          line-height: 20px
          font-size: 12px
          border: 1px solid #f94b49
          text-align: center
          color: #f94b49
        .btn-box
          width: 86px
          height: 30px
          display: flex
          align-items: center
          justify-content: center
          font-size: 14px
          border-radius: 20px
          color: #fff
          background-color: #dcdcdc
          .add
            margin-top: -3px
            padding-right: 6px
            font-size: 24px
        .btn-box-active
          background-color: rgba(249, 75, 73, 1)
        .hint-popup
          position: absolute
          right: 0
          top: 50px
          width: 100%
          height: auto
          z-index: 100
          background-color: transparent
          .hint
            position: absolute
            top: 10px
            right: 0
            padding-left: 10px
            display: flex
            justify-content: space-between
            width: 200px
            height: 25px
            line-height: 25px
            font-size: 12px
            color: #ff4040
            border-radius: 3px
            background-color: rgba(255,222,222,1)
            z-index: 80
            i
              padding: 5px
              img
                display block
                width: 10px
                height: 10px
          .triangle-box
            position: absolute
            top: 0
            right: 35px
            z-index: 60
            .triangle
              border-left: 5px solid transparent
              border-right: 5px solid transparent
              border-bottom: 10px solid rgba(255,222,222,0.6)
      .data-box
        margin: 18px 0
        display: flex
        align-items: center
        li
          padding-right: 48px
          font-size: 18px
          font-weight: bolder
          color: #333
          span
            padding-left: 2px
            font-size: 12px
            font-weight: normal
            color: #666
          &:last-child
            padding-right: 0
      .intro-box
        position: relative
        width: 100%
        height: auto
        .desc
          position: relative
          height: auto
          line-height: 17px
          flex: 1
          font-size: 12px
          color: #999
          word-break: break-all
          &.desc-hide
            padding-right: 30px
            height: 16px
            display: -webkit-box
            -webkit-box-orient: vertical
            -webkit-line-clamp: 1
            overflow: hidden
            .mask
              position: absolute
              top: 0
              right: 20px
              padding-left: 10px
              width: 35px
              height: 20px
              font-size: 12px
              color: #fff
              &::after
                position: absolute
                left: 0
                height: 100%
                width: 100%
                content: ""
                background: linear-gradient(to top, rgba(255,255,255, 0.8) 30%, rgba(255,255,255, 0.8) 70%)
                pointer-events: none
        .more
          position: absolute
          top: -5px
          right: -5px
          padding: 5px
          display: flex
          align-items: center
          box-sizing: border-box
          span
            font-size: 12px
            color: #666
          i
            width: 14px
            height: 14px
            img
              display: block
              width: 100%
              height: 100%
    .lecture-content
      width: 100%
      height: auto
      .business-box
        margin-bottom: 12px
        padding: 10px 10px 15px 15px
        width: 100%
        height: auto
        box-sizing: border-box
        border-radius: 5px
        background-color: #fff
        .title-box
          width: 100%
          height: auto
          display: flex
          align-items: center
          justify-content: space-around
          h2
            flex: 1
            font-size: 14px
            font-weight: bold
            color: #333
          .more
            padding: 5px
            display: flex
            align-items: center
            box-sizing: border-box
            span
              font-size: 12px
              color: #666
            i
              width: 14px
              height: 14px
              img
                display: block
                width: 100%
                height: 100%
        ul
          margin-top: 12px
          width: 100%
          height: auto
          display: flex
          align-items: center
          li
            width: auto
            height: auto
            padding: 0 10px
            i
              margin: 0 auto
              width: 42px
              height: 42px
              img
                display: block
                width: 100%
                height: 100%
            h3
              margin-top: 4px
              text-align: center
              font-size: 12px
              color: #333
      .banner
        position: relative
        margin-bottom: 12px
        padding: 0 15px
        box-sizing: border-box
        width: 100%
        height: 60px
        border-radius: 5px
        .cover
          display: block
          width: 100%
          height: 100%
          border-radius: 5px
        i
          position: absolute
          top: -5px
          right: 10px
          width: 16px
          height: 16px
          img
            display: block
            width: 100%
            height: 100%
      .list-box
        padding: 10px 0 15px
        width: 100%
        height: auto
        box-sizing: border-box
        border-radius: 5px
        background-color: #fff
        .nav-wrapper
          margin-bottom: 15px
          width: 100%
          height: auto
          ul
            width: 100%
            height: auto
            display: flex
            align-items: center
            justify-content: space-around
            li
              position: relative
              padding: 5px 12px 8px
              width: auto
              height: 30px
              font-size: 15px
              color: #999
              box-sizing: border-box
              &.active
                font-size: 16px
                font-weight: bold
                color: #f94b49
                .line
                  position: absolute
                  top: 30px
                  left: 33%
                  width: 20px
                  height: 2px
                  background-color: #f94b49
                  border-radius: 20px
        .intro
          color: #333
          font-size: 14px
          .not-data-wrapper
            padding-top: 30px
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
</style>
