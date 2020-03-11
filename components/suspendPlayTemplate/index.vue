<template>
  <div
    v-if="upyunUrl && miniShowCloseStatus && allCurrentMusicItem"
    class="suspend-wrapper"
  >
    <div
      v-show="!miniShowHideStatus"
      :class="!miniShowHideStatus ? 'show-active' : 'hide-active'"
      @click="onMiniStatusFn(true)"
      class="suspend-show"
    >
      <div class="cover-box">
        <image class="cover" :src="allCurrentMusicItem.thumb || allCurrentMusicItem.cover" mode="aspectFill" />
        <div v-if="allPlaying" class="handle-icon play-icon">
          <image :src="upyunUrl + '/wxXcxImg/images/suspend-show-icon.gif'" />
        </div>
        <image v-else class="handle-icon pause-icon" :src="upyunUrl + '/wxXcxImg/images/mini-pause-icon.png'" />
      </div>
    </div>
    <div
      v-show="miniShowHideStatus"
      :class="miniShowHideStatus ? 'left-active' : 'right-active'"
      class="suspend-play-wrapper"
    >
      <div
        class="suspend-left"
        @click="onSkipPageFn()"
      >
        <div class="play">
          <image :src="allCurrentMusicItem.thumb || allCurrentMusicItem.cover" mode="aspectFill" />
        </div>
        <div class="title">{{ allCurrentMusicItem.title }}</div>
      </div>
      <div class="suspend-right">
        <div class="suspend-toggle-playing" @click.stop="onTogglePlayingFn(allCurrentMusicItem)">
          <image
            v-if="allCurrentMusicItem.id && allPlaying"
            :src="upyunUrl + '/wxXcxImg/images/mini-play-icon.png'"
            class="play-icon"
          />
          <image v-else :src="upyunUrl + '/wxXcxImg/images/mini-paused-icon.png'" />
        </div>
        <div class="suspend-menu" @click="onSetMiniListStatusFn(true)">
          <image :src="upyunUrl + '/wxXcxImg/images/mini-list-icon.png'" />
        </div>
        <div class="suspend-hide" @click="onMiniStatusFn(false)">
          <image :src="upyunUrl + '/wxXcxImg/images/mini-fold-icon.png'" />
        </div>
        <div class="suspend-close" v-if="!allPlaying" @click.stop="onCloseMiniPlayBoxFn()">
          <image :src="upyunUrl + '/wxXcxImg/images/mini-close-icon.png'" />
        </div>
      </div>
    </div>
    <mini-play @miniListStatusChild="onSetMiniListStatusFn" :status="miniPlayListStatus" />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import MiniPlay from '../miniPlayListTemplate'
import { upyunUrl } from '../../api/config'

export default {
  data () {
    return {
      upyunUrl
    }
  },
  computed: {
    ...mapState([
      'allCurrentMusicItem',
      'allMusicList',
      'allPlaying',
      'miniShowCloseStatus',
      'miniShowHideStatus',
      'miniPlayListStatus'
    ])
  },
  methods: {
    ...mapMutations({
      setIsSwitchMusic: 'SET_IS_SWITCH_MUSIC_STATE',
      setMiniShowCloseStatus: 'SET_MIMI_SHOW_CLOSE_STATUS',
      setMiniShowHideStatus: 'SET_MIMI_SHOW_HIDE_STATUS',
      setMiniPlayListStatus: 'SET_MINI_PLAY_LIST_STATUS'
    }),
    ...mapActions([
      'setMusicStatus'
    ]),
    // 音频暂停/播放
    onTogglePlayingFn (item) {
      this.setIsSwitchMusic(false)
      this.setMusicStatus({ that: this, item, list: this.allMusicList })
    },
    // 显示-隐藏mini播放栏
    onMiniStatusFn (status) {
      this.setMiniShowHideStatus(status)
    },
    // 关闭mini播放列表并停止播放
    onCloseMiniPlayBoxFn () {
      this.setMiniShowCloseStatus(false)
    },
    // 显示-隐藏mini播放列表
    onSetMiniListStatusFn (status) {
      this.setMiniPlayListStatus(status)
    },
    // 跳转页面
    onSkipPageFn () {
      if (this.allCurrentMusicItem.listType === 'newsMusic') return false
      const oJson = {
        vid: this.allCurrentMusicItem.vid || this.allCurrentMusicItem.id,
        keywords: this.allCurrentMusicItem.keywords || '',
        authorId: this.allCurrentMusicItem.authorId || '',
        type: this.allCurrentMusicItem.listType,
        page: this.allCurrentMusicItem.page
      }
      uni.navigateTo({
        url: `/pages/subject/subjectMusic/musicDetails/index?oJson=${JSON.stringify(oJson)}`
      })
    }
  },
  onUnload () {
    this.setMiniPlayListStatus(false)
  },
  components: {
    MiniPlay
  }
}
</script>

<style lang="stylus" scoped>
  .suspend-wrapper
    position: fixed
    left: 0
    bottom: 0
    width: 100%
    height: auto
    z-index: 990
    .suspend-play-wrapper
      width: 100%
      height: 58px
      padding: 0 7px 0 10px
      display: flex
      align-items: center
      box-sizing: border-box
      background: rgba(255,255,255,0.9)
      box-shadow: 0 -2px 3px 0 rgba(0, 0, 0, 0.08)
      &.left-active
        animation: fadeInLeft 0.3s alternate forwards
      &.right-active
        display: block
        animation: fadeOutLeft 0.3s alternate forwards
      .suspend-left
        flex: 1
        height: 100%
        display: flex
        align-items: center
        .play
          margin-top: -25px
          width: 54px
          height: 54px
          background: rgba(255, 255, 255, 0.9)
          display: flex
          justify-content: center
          align-items: center
          border-radius: 50%
          box-shadow: 0 -2px 3px 0 rgba(0, 0, 0, 0.08)
          image
            display: block
            width: 44px
            height: 44px
            border-radius: 50%
        .title
          flex: 1
          height: 100%
          padding: 0 7px
          line-height: 58px
          font-size: 13px
          display: -webkit-box
          -webkit-box-orient: vertical
          -webkit-line-clamp: 1
          overflow: hidden
          color: #000
      .suspend-right
        width: auto
        height: 100%
        display: flex
        justify-content: space-between
        align-items: center
        .suspend-toggle-playing, .suspend-menu, .suspend-hide, .suspend-close
          padding: 5px
          box-sizing: border-box
          image
            display: block
            width: 21px
            height: 21px
    .suspend-show
      position: absolute
      top: 0
      left: 10px
      width: 48px
      height: 48px
      display: flex
      justify-content: center
      align-items: center
      background-color: rgba(255,255,255,0.66)
      box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.24)
      border-radius: 50%
      .cover-box
        position: relative
        width: 44px
        height: 44px
        border-radius: 50%
        .cover
          display: block
          width: 100%
          height: 100%
          border-radius: 50%
        .handle-icon
          position: absolute
          top: 50%
          left: 50%
          margin-left: -10px
          margin-top: -10px
          width: 20px
          height: 20px
          border-radius: 50%
          &.play-icon
            display: flex
            justify-content: center
            align-items: center
            background-color: rgba(0,0,0,0.6)
            image
              display: block
              width: 9px
              height: 9px
          &.pause-icon
            display: block
            width: 20px
            height: 20px
            border-radius: 50%
      &.hide-active
        animation: fadeOut 1s alternate forwards
      &.show-active
        opacity: 0
        animation: fadeIn 3s alternate forwards
    @-webkit-keyframes fadeInLeft
      0%
        opacity: 0
        transform: translate3d(-100%, 0, 0)
      100%
        opacity: 1
        transform: translate3d(0, 0, 0)
    @-webkit-keyframes fadeOutLeft
      0%
        opacity: 1
      100%
        opacity: 0
        transform: translate3d(-100%, 0, 0)
    @-webkit-keyframes fadeOut
      0%
        opacity: 1
      100%
        opacity: 0
    @-webkit-keyframes fadeIn
      0%
        opacity: 0
      100%
        opacity: 1
</style>
