<template>
  <div
    v-if="upyunUrl"
    class="video-list-wrapper"
  >
    <ul>
      <li
        v-if="lists.length"
        v-for="(item, index) in lists"
        @click="onSkipDetailsPageFn(item)"
        :key="index"
      >
        <div class="video-wrapper">
          <div class="video-img">
            <image mode="aspectFill" :src="item.thumb || item.cover" />
            <div v-if="item.is_boutique" class="label-box">精品</div>
          </div>
          <i>
            <image v-if="item.playing" :src="upyunUrl + '/wxXcxImg/images/pause-icon.png'" />
            <image v-else :src="upyunUrl + '/wxXcxImg/images/play-icon.png'" />
          </i>
          <div class="video-play-num">
            <div class="play-num-box">
              <span class="play-icon">
                <image :src="upyunUrl + '/wxXcxImg/images/play-circle-icon.png'" />
              </span>
              <span class="play-num">{{ item.played_hits }}</span>
            </div>
            <div v-if="item.v_type === 0">音频</div>
            <div v-if="item.v_type === 1">视频</div>
          </div>
        </div>
        <div class="video-content">
          <h2>{{ item.title }}</h2>
          <h3 v-if="item.listType === 'collectType'">备注：{{ item.remark || '暂无信息...'}}</h3>
          <h3 v-if="item.listType !== 'collectType'">{{ item.voice_text }}</h3>
          <div class="operating-wrapper">
            <div class="operating-item" @click.stop="onLikeFn(item, item.is_like)">
              <i>
                <image
                  v-if="item.is_like === 1"
                  :class="{ 'active' : item.is_like === 1 }"
                  :src="upyunUrl + '/wxXcxImg/images/thumbs-active-icon.png'"
                />
                <image v-else :src="upyunUrl + '/wxXcxImg/images/thumbs-icon.png'" />
              </i>
              <span>{{ item.like_hits }}</span>
            </div>
            <div class="operating-item" @click.stop="onCollectionFn(item, item.is_collection)">
              <i>
                <image
                  v-if="item.is_collection === 1"
                  :class="{ 'active' : item.is_collection === 1 }"
                  :src="upyunUrl + '/wxXcxImg/images/heart-active-icon.png'"
                />
                <image v-else :src="upyunUrl + '/wxXcxImg/images/heart-icon.png'" />
              </i>
              <span>{{ item.collection_hits }}</span>
            </div>
            <div class="operating-item" @click.stop="onSkipThoughtFn(item)">
              <i>
                <image :src="upyunUrl + '/wxXcxImg/images/shared-icon.png'" />
              </i>
              <span>{{ item.share_hits }}</span>
            </div>
          </div>
          <div v-if="item.is_hide || item.del" class="shelves-icon">
            <img :src="upyunUrl + '/wxXcxImg/images/shelves-icon.png'" />
          </div>
        </div>
      </li>
    </ul>
    <!-- 更多操作 -->
    <more-operate :oItem="oItem" ref="child" />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import MoreOperate from '../moreOperateTempage'
import { upyunUrl } from '../../api/config'

export default {
  data () {
    return {
      upyunUrl,
      oItem: ''
    }
  },
  computed: {
    ...mapState([
      'userInfo'
    ])
  },
  methods: {
    ...mapMutations({
    }),
    ...mapActions([
      'allThumbsUp',
      'allCollection'
    ]),
    // 播放暂停音频,跳转视频页面
    onSkipDetailsPageFn (item) {
      let url = ''
      const oJson = {
        keywords: item.keywords || '',
        vid: item.vid || item.id,
        authorId: this.authorId,
        page: item.page,
        type: this.type
      }
      if (item.is_hide || item.del) {
        this.showToastFn('该课程已下架,无法查看')
        return false
      }
      switch (item.v_type) {
        case 0:
          url = `/pages/subject/subjectMusic/musicDetails/index?oJson=${JSON.stringify(oJson)}`
          break
        case 1:
          if (item.vid) item['id'] = item.vid
          url = `/pages/subject/subjectVideo/videoDetails/index?oJson=${encodeURIComponent(JSON.stringify(item))}`
          break
      }
      uni.navigateTo({
        url
      })
    },
    // 音频点赞
    onLikeFn (item, status) {
      const data = {
        id: item.vid || item.id,
        likeType: this.type,
        that: this,
        type: 0,
        status
      }
      if (item.is_hide || item.del) {
        this.showToastFn('该课程已下架,无法查看')
        return false
      }
      if (this.userInfo) {
        this.allThumbsUp(data)
      } else {
        this.onSkipPageFn(`/pages/login/index`)
      }
    },
    // 音频收藏
    onCollectionFn (item, status) {
      const data = {
        collectionType: this.type,
        id: item.vid || item.id,
        that: this,
        type: 0,
        status
      }
      if (item.is_hide || item.del) {
        this.showToastFn('该课程已下架,无法查看')
        return false
      }
      if (this.userInfo) {
        this.allCollection(data)
      } else {
        this.onSkipPageFn(`/pages/login/index`)
      }
    },
    // 跳转到分享页
    onSkipThoughtFn (item) {
      if (item.is_hide || item.del) {
        this.showToastFn('该课程已下架,无法查看')
        return false
      }
      switch (item.v_type) {
        case 0:
          item['skipPath'] = 'musicDetails'
          break
        case 1:
          item['skipPath'] = 'videoDetails'
          item['special_id'] = item.vid || item.id
          break
      }
      this.oItem = item
      this.$refs.child.onUniPopupStateFn(true)
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
  components: {
    MoreOperate
  },
  props: {
    lists: {
      type: Array,
      default: []
    },
    type: {
      type: String,
      default: ''
    },
    authorId: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="stylus" scoped>
  .video-list-wrapper
    width: 100%
    height: 100%
    ul
      width: 100%
      height: auto
      padding: 18px 15px
      box-sizing: border-box
      li
        padding: 12px
        margin-bottom: 12px
        box-sizing: border-box
        display: flex
        justify-content: flex-start
        background-color: #fff
        border-radius: 4px
        .video-wrapper
          position: relative
          width: 100px
          height: 100px
          overflow: hidden
          border-radius: 4px
          .video-img
            position: relative
            width: 100px
            height: 100px
            border-radius: 4px
            overflow: hidden
            image
              width: 100%
              height: 100%
              border-radius: 4px
            .label-box
              position: absolute
              top: 0
              left: 0
              width: 44px
              height: 17px
              line-height: 17px
              font-size: 10px
              text-align: center
              color: #fff
              background: linear-gradient(241deg, rgba(79, 178, 255, 1), rgba(83, 147, 255, 1))
              border-radius: 4px 0 15px 0
          i
            position: absolute
            left: 50%
            top: 50%
            width: 40px
            height: 40px
            margin-left: -20px
            margin-top: -20px
            image
              width: 100%
              height: 100%
        .video-play-num
          position: absolute
          bottom: 0
          width: 100%
          height: 30px
          padding: 8px 5px 2px
          border-radius: 0 0 6px 6px
          display: flex
          align-items: center
          justify-content: space-between
          font-size: 11px
          color: #fffefe
          background: -webkit-linear-gradient(top,rgba(255, 255, 255, 0)10%, rgba(0, 0, 0, .45)80%)
          box-sizing: border-box
          .play-num-box
            display: flex
            align-items: center
            .play-icon
              width: 12px
              height: 12px
              image
                display: block
                width: 100%
                height: 100%
            .play-num
              padding-left: 5px
              height: 16px
              line-height: 16px
              text-align: left
        .video-content
          position: relative
          margin-left: 15px
          flex: 1
          height: 100px
          h2
            margin-bottom: 9px
            min-height: 20px
            line-height: 21px
            font-size: 15px
            display: -webkit-box
            -webkit-box-orient: vertical
            -webkit-line-clamp: 2
            overflow: hidden
            color: #333
          h3
            height: 16px
            width: 100%
            font-size: 12px
            display: -webkit-box
            -webkit-box-orient: vertical
            -webkit-line-clamp: 1
            overflow: hidden
            color: #999
          .operating-wrapper
            position: absolute
            bottom: 0
            width: 100%
            height: auto
            display: flex
            justify-content: space-between
            .operating-item
              width: auto
              height: auto
              display: flex
              align-items: center
              i
                position: relative
                width: 15px
                height: 15px
                image
                  display: block
                  width: 100%
                  height: 100%
                  animation: scaleB .3s linear forwards
                .active
                  animation: scaleA .5s linear forwards
              span
                padding: 0 8px 0 6px
                font-size: 12px
                color: #ccc
          .shelves-icon
            position: absolute
            bottom: 40px
            right: 0
            width: 58px
            height: 58px
            img
              display: block
              width: 100%
              height: 100%
        &:last-child
          margin-bottom: 0
          border: none
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
