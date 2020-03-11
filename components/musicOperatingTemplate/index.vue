<template>
  <div
    v-if="upyunUrl"
    class="music-operating-wrapper"
  >
    <div
      v-if="currentMusicItem"
      class="music-operating-ul"
    >
      <div
        @click="onLikeFn(currentMusicItem.id, currentMusicItem.is_like, currentMusicItem.listType)"
        class="item"
      >
        <image
          v-if="currentMusicItem.is_like === 1"
          :src="upyunUrl + '/wxXcxImg/images/index-like-active.png'"
          :class="{ 'active' : currentMusicItem.is_like === 1 }"
        />
        <image v-if="currentMusicItem.is_like === 0" :src="upyunUrl + '/wxXcxImg/images/like-white-icon.png'" />
      </div>
      <div
        @click="onCollectionFn(currentMusicItem.id, currentMusicItem.is_collection, currentMusicItem.listType)"
        class="item"
      >
        <image
          v-if="currentMusicItem.is_collection === 1"
          :src="upyunUrl + '/wxXcxImg/images/index-collect-active.png'"
          :class="{ 'active' : currentMusicItem.is_collection === 1 }"
        />
        <image v-if="currentMusicItem.is_collection === 0" :src="upyunUrl + '/wxXcxImg/images/collect-white-icon.png'" />
      </div>
      <div
        @click="onShowHideCommentStateFn()"
        class="item"
      >
        <image :src="upyunUrl + '/wxXcxImg/images/index-comment-icon.png'" />
      </div>
      <div
        @click="onSkipThoughtFn()"
        class="item"
      >
        <image :src="upyunUrl + '/wxXcxImg/images/share-white-icon.png'" />
        <div class="triangle-box" v-if="sharePopupState">
          <div class="hint">将知识分享给好友，才打卡成功哟</div>
          <div class="triangle"></div>
        </div>
      </div>
    </div>
    <!--<add-remark :id="remarkId" />-->
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import AddRemark from '../addRemarkPopupTemplate'
import { upyunUrl } from '../../api/config'

export default {
  data () {
    return {
      upyunUrl,
      remarkId: ''
    }
  },
  onShow () {
    this.setAddRemarkStatus(false)
  },
  computed: {
    ...mapState([
      'userInfo',
      'currentMusicItem',
      'currentIndex',
      'sharePopupState'
    ])
  },
  methods: {
    ...mapMutations({
      setAddRemarkStatus: 'SET_ADD_REMARK_STATUS',
      setSharePopupState: 'SET_SHARE_POPUP_STATE'
    }),
    ...mapActions([
      'allThumbsUp',
      'allCollection'
    ]),
    // 音频点赞
    onLikeFn (id, status, type) {
      const data = {
        likeType: type,
        that: this,
        type: 0,
        status,
        id
      }
      if (this.userInfo) {
        this.allThumbsUp(data)
      } else {
        this.onSkipPageFn(`/pages/login/index`)
      }
    },
    // 音频收藏
    onCollectionFn (id, status, type) {
      const data = {
        collectionType: type,
        that: this,
        type: 0,
        status,
        id
      }
      if (this.userInfo) {
        this.allCollection(data).then((res) => {
          this.remarkId = res.data
        })
        if (!status) this.setAddRemarkStatus(true)
      } else {
        this.onSkipPageFn(`/pages/login/index`)
      }
    },
    // 显示 - 隐藏, 首页评论弹窗
    onShowHideCommentStateFn () {
      if (this.userInfo) {
        this.$emit('showHideCommentStateChild', true)
      } else {
        this.onSkipPageFn(`/pages/login/index`)
      }
    },
    // 跳转到分享页
    onSkipThoughtFn () {
      if (this.userInfo) {
        this.onSkipPageFn(`/pages/thoughtPage/index?item=${encodeURIComponent(JSON.stringify(this.currentMusicItem))}`)
      } else {
        this.onSkipPageFn(`/pages/login/index`)
      }
      this.setSharePopupState(false)
    },
    // 跳转到收藏备注
    onSkipAddRemarkFn () {
      this.onSkipPageFn(`/pages/addRemark/index`)
    },
    // 跳转页面
    onSkipPageFn (url) {
      uni.navigateTo({
        url: url
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
    this.setAddRemarkStatus(false)
  },
  components: {
    AddRemark
  }
}
</script>

<style lang="stylus" scoped>
  .music-operating-wrapper
    position: absolute
    right: 25px
    bottom: 50px
    .music-operating-ul
      width: auto
      height: auto
      .item
        position: relative
        margin-top: 22px
        display: flex
        align-items: center
        image
          display: block
          width: 25px
          height: 25px
          animation: scaleB .3s linear forwards
        .active
          animation: scaleA .5s linear forwards
        .triangle-box
          position: absolute
          top: 0
          right: 24px
          display: flex
          align-items: center
          .triangle
            width: 0
            height: 0
            border-top: 15px solid transparent
            border-left: 13px solid #434343
            border-bottom: 15px solid transparent
          .hint
            width: 190px
            height: 24px
            padding-left: 5px
            line-height: 23px
            font-size: 12px
            text-align: center
            color: #fff
            border-radius: 5px 0 0 5px
            background-color: #434343
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
