<template>
  <uni-popup ref="popup">
    <div class="more-operate-wrapper">
      <ul>
        <li v-if="oItem.is_like !== undefined" @click.stop="onLikeFn()">
          <div class="icon">
            <image v-if="oItem.is_like === 0" :src="upyunUrl + '/wxXcxImg/images/thumb-icon.png'"/>
            <image v-if="oItem.is_like === 1" :src="upyunUrl + '/wxXcxImg/images/thumb-active-icon.png'"/>
          </div>
          <div class="text">点赞</div>
        </li>
        <li v-if="oItem.is_collection !== undefined" @click.stop="onCollectionFn()">
          <div class="icon">
            <image v-if="oItem.is_collection === 0" :src="upyunUrl + '/wxXcxImg/images/collection-icon.png'"/>
            <image v-if="oItem.is_collection === 1" :src="upyunUrl + '/wxXcxImg/images/collection-active-icon.png'"/>
          </div>
          <div class="text">收藏</div>
        </li>
        <li @click="onShareFn('page')">
          <div class="icon">
            <image :src="upyunUrl + '/wxXcxImg/images/wx-share-icon.png'"/>
          </div>
          <div class="text">微信好友</div>
        </li>
        <li @click="onShareFn('space')">
          <div class="icon">
            <image :src="upyunUrl + '/wxXcxImg/images/share-friend-icon.png'"/>
          </div>
          <div class="text">微信朋友圈</div>
        </li>
      </ul>
      <div class="cancel-btn" @click="onUniPopupStateFn(false)">取消</div>
    </div>
  </uni-popup>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import uniPopup from '../uni-popup/uni-popup'
import { ghId, upyunUrl } from '../../api/config'

export default {
  data () {
    return {
      upyunUrl
    }
  },
  computed: {
    ...mapState([
      'userInfo'
    ])
  },
  methods: {
    ...mapActions([
      'allThumbsUp',
      'allCollection'
    ]),
    onUniPopupStateFn (state) {
      if (state) {
        this.$refs.popup.open()
      } else {
        this.$refs.popup.close()
      }
    },
    // 视频点赞
    onLikeFn () {
      const data = {
        id: this.oItem.id,
        type: 0
      }
      if (this.userInfo) {
        this.oItem['is_like'] = this.oItem.is_like === 1 ? 0 : 1
        this.allThumbsUp(data)
      } else {
        this.onSkipPageFn(`/pages/login/index`)
      }
    },
    // 视频收藏
    onCollectionFn () {
      const data = {
        id: this.oItem.id,
        type: 0
      }
      if (this.userInfo) {
        this.oItem['is_collection'] = this.oItem.is_collection === 1 ? 0 : 1
        this.allCollection(data)
      } else {
        this.onSkipPageFn(`/pages/login/index`)
      }
    },
    // 分享内容
    onShareFn (type) {
      let path = null
      switch (this.oItem.skipPath) {
        case 'musicDetails':
          const oJson = {
            vid: this.oItem.vid,
            keywords: '',
            authorId: '',
            type: '',
            page: 1
          }
          path = `/pages/index/musicDetails/main?oJson=${JSON.stringify(oJson)}`
          break
        case 'videoDetails':
          path = `/pages/oneVideoDetails/main?oJson=${encodeURIComponent(JSON.stringify(this.oItem))}`
          break
        case 'subjectVideo':
          path = `/pages/videoDetails/main?oJson=${encodeURIComponent(JSON.stringify(this.oItem))}`
          break
        case 'subjectMusic':
          path = `/pages/subjectDetailsPage/main?sid=${this.oItem.special_id}&shareid=${this.userInfo.user_id}`
          break
        case 'tuitionLandingPage':
          path = `/pages/robTuition/tuitionLandingPage/main?shareid=${this.userInfo.user_id}&orderid=${this.oItem.order_id || this.oItem.id}`
          break
      }
      if (type === 'page') {
        uni.share({
          type: 5,
          provider: 'weixin',
          scene: 'WXSceneSession',
          title: this.oItem.title,
          imageUrl: this.oItem.thumb || this.oItem.cover,
          miniProgram: {
            path,
            type: 0,
            id: ghId,
            webUrl: 'https://www.gxtizi.com/index.html'
          }
        })
      } else if (type === 'space') {
        uni.share({
          type: 0,
          provider: 'weixin',
          title: this.oItem.title,
          scene: 'WXSenceTimeline',
          href: 'https://www.gxtizi.com/index.html',
          imageUrl: this.oItem.thumb || this.oItem.cover,
          summary: '我正在使用瓶盖思维学习，赶紧跟我一起来成长吧！'
        })
      }
    },
    // 跳转页面
    onSkipPageFn (url) {
      uni.navigateTo({
        url
      })
    }
  },
  components: {
    uniPopup
  },
  props: {
    oItem: {
      type: Object,
      default: {}
    }
  }
}
</script>

<style lang="stylus" scoped>
  .more-operate-wrapper
    position: fixed
    right: 0
    bottom: 0
    width: 100%
    height: auto
    border-radius: 12px 12px 0 0
    z-index: 1100
    background-color: #fff
    ul
      width: 100%
      height: auto
      padding: 20px 0
      box-sizing: border-box
      display: flex
      align-items: center
      justify-content: space-around
      border-radius: 12px 12px 0 0
      li
        .icon
          margin: 0 auto
          width: 50px
          height: 50px
          image
            display: block
            width: 100%
            height: 100%
        .text
          padding-top: 5px
          font-size: 12px
          text-align: center
          color: #9798a6
    .cancel-btn
      padding: 13px 0
      box-sizing: border-box
      font-size: 17px
      text-align: center
      border-top: 1px solid #efefef
      color: #343546
</style>
