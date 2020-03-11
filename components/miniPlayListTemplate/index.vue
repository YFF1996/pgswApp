<template>
  <div
    v-if="allMusicList.length && status && upyunUrl"
    @click="onSetMiniListStatusFn()"
    class="mini-play-wrapper"
  >
    <div
      class="content"
      :class="{'content-active' : status}"
      @click.stop
    >
      <div class="top-nav">
        <div class="order-play">
          <div class="order-icon">
            <image :src="upyunUrl + '/wxXcxImg/images/loop-play-icon.png'" />
          </div>
          <div class="text" v-if="allCurrentMusicItem.listType === 'indexMusic'">精选推荐({{ allMusicList.length }})</div>
          <div class="text" v-if="allCurrentMusicItem.listType === 'newsMusic'">每日头条({{ allMusicList.length }})</div>
          <div class="text" v-if="allCurrentMusicItem.listType === 'subjectType'">专题音频({{ allMusicList.length }})</div>
          <div class="text" v-if="allCurrentMusicItem.listType === 'hotColumnType'">热门栏目({{ allMusicList.length }})</div>
          <div class="text" v-if="allCurrentMusicItem.listType === 'allSearchType'">搜索音频({{ allMusicList.length }})</div>
          <div class="text" v-if="allCurrentMusicItem.listType === 'collectType'">我的收藏({{ allMusicList.length }})</div>
          <div class="text" v-if="allCurrentMusicItem.listType === 'historyType'">播放历史({{ allMusicList.length }})</div>
          <div class="text" v-if="allCurrentMusicItem.listType === 'giveThumbsType'">我的点赞({{ allMusicList.length }})</div>
          <div class="text" v-if="allCurrentMusicItem.listType === 'lectureType'">讲师音频({{ allMusicList.length }})</div>
          <div class="text" v-if="allCurrentMusicItem.listType === 'shareMusic'">分享音频</div>
        </div>
        <div class="user-operate" v-if="allCurrentMusicItem.listType !== 'newsMusic'">
          <div class="item" @click="onLikeCollectFn('is_like', allCurrentMusicItem.is_like)">
            <image
              :class="{ 'active' : allCurrentMusicItem.is_like === 1 }"
              v-if="allCurrentMusicItem.is_like === 1"
              :src="upyunUrl + '/wxXcxImg/images/like-icon-active.png'"
            />
            <image v-else :src="upyunUrl + '/wxXcxImg/images/like-icon.png'" />
          </div>
          <div class="item" @click="onLikeCollectFn('is_collection', allCurrentMusicItem.is_collection)">
            <image
              :class="{ 'active' : allCurrentMusicItem.is_collection === 1 }"
              v-if="allCurrentMusicItem.is_collection === 1"
              :src="upyunUrl + '/wxXcxImg/images/collect-icon-active.png'"
            />
            <image v-else :src="upyunUrl + '/wxXcxImg/images/collect-icon.png'" />
          </div>
          <div class="item" @click="onSkipThoughtFn()">
            <image :src="upyunUrl + '/wxXcxImg/images/share-icon.png'" />
          </div>
        </div>
      </div>
      <scroll-view
        :scroll-y="true"
        class="scroll-view"
      >
        <div class="scroll-ul">
          <div
            v-for="(item, index) in allMusicList"
            @click="onSkipPageFn(item)"
            :key="index"
            class="item"
          >
            <div class="right">
              <div class="avatar" v-if="item.id === allCurrentMusicItem.id">
                <image :src="item.thumb || item.cover" />
              </div>
              <div class="num" v-else>{{ index + 1 }}</div>
            </div>
            <div class="left">
              <div class="info">
                <div class="text" :class="{'text-active' : item.id === allCurrentMusicItem.id}">{{ item.title }}</div>
                <div class="time">{{ item.inputtime }}</div>
              </div>
              <div class="play-icon">
                <image v-if="item.playing" :src="upyunUrl + '/wxXcxImg/images/news-pause-icon.gif'" />
                <image v-else :src="upyunUrl + '/wxXcxImg/images/news-play-icon.png'" />
              </div>
            </div>
          </div>
        </div>
      </scroll-view>
      <div class="cancel-btn" @click="onSetMiniListStatusFn()">关闭</div>
    </div>
    <add-remark />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import AddRemark from '../addRemarkPopupTemplate'
import { upyunUrl } from '../../api/config'

export default {
  data () {
    return {
      upyunUrl
    }
  },
  computed: {
    ...mapState([
      'userInfo',
      'allMusicList',
      'allCurrentMusicItem',
      'currentIndex'
    ])
  },
  methods: {
    ...mapMutations({
      setIsSwitchMusic: 'SET_IS_SWITCH_MUSIC_STATE',
      setAddRemarkStatus: 'SET_ADD_REMARK_STATUS'
    }),
    ...mapActions([
      'setMusicStatus',
      'likeCollectFn'
    ]),
    onSetMiniListStatusFn () {
      this.$emit('miniListStatusChild', false)
    },
    // 跳转页面
    onSkipPageFn (item) {
      if (this.allCurrentMusicItem.listType === 'newsMusic') return false
      const oJson = {
        vid: item.vid || item.id,
        keywords: item.keywords || '',
        authorId: item.authorId || '',
        type: item.listType,
        page: item.page
      }
      uni.navigateTo({
        url: `/pages/subject/subjectMusic/musicDetails/index?oJson=${JSON.stringify(oJson)}`
      })
    },
    // 点赞与收藏
    onLikeCollectFn (type, state) {
      let data = {
        that: this,
        id: this.allCurrentMusicItem.id,
        type: 'allMusicType',
        operateType: type,
        state
      }
      if (this.userInfo) {
        this.likeCollectFn(data)
      } else {
        uni.navigateTo({
          url: `/pages/login/index`
        })
      }
    },
    // 跳转到分享页
    onSkipThoughtFn () {
      if (this.userInfo) {
        uni.navigateTo({
          url: `/pages/thoughtPage/index?item=${encodeURIComponent(JSON.stringify(this.allCurrentMusicItem))}`
        })
      } else {
        uni.navigateTo({
          url: `/pages/login/index`
        })
      }
    }
  },
  onUnload () {
    this.setAddRemarkStatus(false)
  },
  components: {
    AddRemark
  },
  props: {
    status: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="stylus" scoped>
  .mini-play-wrapper
    position: fixed
    left: 0
    top: 0
    right: 0
    bottom: 0
    width: 100%
    height: 100%
    z-index: 999
    background-color: rgba(0, 0, 0, 0.5)
    .content
      position: absolute
      left: 0
      right: 0
      bottom: 0
      width: 100%
      height: auto
      border-radius: 5px 5px 0 0
      background-color: #fff
      color: #333
      &.content-active
        animation: miniTranslateY 0.3s alternate forwards
      .top-nav
        width: 100%
        height: 50px
        display: flex
        align-items: center
        justify-content: space-between
        padding: 0 15px 0 10px
        border-bottom: 1px solid #efefef
        box-sizing: border-box
        .order-play
          display: flex
          align-items: center
          .order-icon
            width: 35px
            height: 100%
            margin-right: 10px
            display: flex
            align-items: center
            justify-content: center
            image
              width: 14px
              height: 14px
          .text
            font-size: 12px
            color: #333
        .user-operate
          display: flex
          .item
            position: relative
            width: 20px
            height: 20px
            margin-left: 25px
            image
              display: block
              width: 100%
              height: 100%
              animation: scaleB .3s linear forwards
            .active
              animation: scaleA .5s linear forwards
      .scroll-view
        width: 100%
        height: 335px
        .scroll-ul
          width: 100%
          height: auto
          .item
            width: 100%
            height: auto
            padding-left: 10px
            display: flex
            box-sizing: border-box
            .right
              width: 35px
              height: 55px
              margin-right: 10px
              display: flex
              align-items: center
              justify-content: center
              .num
                font-size: 15px
                color: #333
              .avatar
                width: 35px
                height: 35px
                border-radius: 50%
                overflow: hidden
                image
                  width: 100%
                  height: 100%
                  border-radius: 50%
            .left
              flex: 1
              padding-right: 15px
              border-bottom: 1px solid #efefef
              display: flex
              align-items: center
              .info
                flex: 1
                padding-right: 20px
                .text
                  width: 100%
                  height: 32px
                  font-size: 14px
                  line-height: 32px
                  display: -webkit-box
                  -webkit-box-orient: vertical
                  -webkit-line-clamp: 1
                  overflow: hidden
                  color: #333
                  &.text-active
                    color: #ff6464
                .time
                  width: 100%
                  height: auto
                  padding-bottom: 7px
                  font-size: 12px
                  line-height: 16px
                  color: #999
              .play-icon
                width: 20px
                height: 20px
                image
                  display: block
                  width: 100%
                  height: 100%
          .item:last-child
            .left
              border-bottom: none
      .cancel-btn
        width: 100%
        height: auto
        border-top: 1px solid #efefef
        line-height: 50px
        text-align: center
        font-size: 14px
        color: #666
  @-webkit-keyframes miniTranslateY
    0%
      transform: translateY(80px)
    100%
      transform: translateY(0)
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
