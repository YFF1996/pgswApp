<template>
  <div
    v-if="upyunUrl"
    class="subject-list-wrapper"
  >
    <div class="subject-list-ul">
      <div
        v-if="lists.length"
        v-for="(item, index) in lists"
        @click="onTogglePlayingFn(item)"
        :class="item.playing ? 'active' : ''"
        :key="index"
        class="item"
      >
        <div class="subject-rank">
          <div v-if="item.free_audition === 1" class="rank active">试听</div>
          <div v-else class="rank">{{ index + 1 }}</div>
          <image class="pause" :src="upyunUrl + '/wxXcxImg/images/audio-pause-icon.gif'" />
        </div>
        <div class="subject-content">
          <div class="list-top">
            <div class="title">{{ item.title }}</div>
            <div class="date">{{ item.ctime }}</div>
          </div>
          <div class="info">
            <div class="play-num">
              <image :src="upyunUrl + '/wxXcxImg/images/duration-icon.png'" />
              <div class="num">{{ item.duration }}</div>
              <image :src="upyunUrl + '/wxXcxImg/images/triangle-play-icon.png'" />
              <div class="num">{{ item.play_hits }}</div>
              <image :src="upyunUrl + '/wxXcxImg/images/comment-icon.png'" />
              <div class="num">{{ item.comment_total }}</div>
              <div v-if="item.act_record" class="num num-end active">已学完</div>
              <div v-else class="num num-end">未完成</div>
            </div>
            <div class="collect-btn" @click.stop="onCollectionFn(item, item.is_collection)">
              <image
                :class="{ 'active' : item.is_collection === 1 }"
                v-if="item.is_collection === 1"
                :src="upyunUrl + '/wxXcxImg/images/index-collect-active.png'"
              />
              <image v-else :src="upyunUrl + '/wxXcxImg/images/triangle-collect.png'" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { upyunUrl } from '../../api/config'

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
    ...mapMutations({
    }),
    ...mapActions([
      'allCollection'
    ]),
    // 播放-暂停
    onTogglePlayingFn (item) {
      const oJson = {
        vid: item.vid || item.id,
        type: 'subjectType',
        page: item.page,
        keywords: '',
        authorId: ''
      }
      this.onSkipPageFn(`/pages/subject/subjectMusic/musicDetails/index?oJson=${JSON.stringify(oJson)}`)
    },
    // 音频收藏
    onCollectionFn (item, status) {
      const data = {
        collectionType: 'subjectType',
        id: item.vid,
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
    showToastFn (title) {
      uni.showToast({
        title,
        icon: 'none',
        duration: 2000
      })
    }
  },
  props: {
    lists: {
      type: Array,
      default: []
    }
  }
}
</script>

<style lang="stylus" scoped>
  .subject-list-wrapper
    position: relative
    width: 100%
    height: auto
    padding-bottom: 50px
    flex: 1
    .subject-list-ul
      width: 100%
      height: auto
      padding: 15px 0 0 15px
      box-sizing: border-box
      .item
        width: 100%
        height: auto
        padding-bottom: 12px
        margin-bottom: 18px
        display: flex
        border-bottom: 1px solid #f5f5f5
        box-sizing: border-box
        .subject-rank
          width: 30px
          padding-top: 10px
          text-align: center
          .rank
            font-size: 13px
            color: #999
          .active
            color: #5CD18B
          .pause
            width: 30px
            height: 30px
            display: none
        .subject-content
          flex: 1
          height: auto
          padding: 0 15px 0 10px
          .list-top
            width: 100%
            height: auto
            display: flex
          .title
            width: 100%
            min-height: 20px
            font-size: 15px
            font-weight: bold
            line-height: 20px
            display: -webkit-box
            -webkit-box-orient: vertical
            -webkit-line-clamp: 2
            overflow: hidden
            color: #000
          .date
            width: 100px
            padding-left: 20px
            font-size: 12px
            line-height: 20px
            color: #b2b2b2
          .info
            display: flex
            align-items: center
            justify-content: space-between
            margin-top: 12px
            .play-num
              display: flex
              align-items: center
              image
                display: block
                width: 12px
                height: 12px
              .num
                padding: 0 25px 0 8px
                font-size: 12px
                line-height: 12px
                color: #b2b2b2
              .num-end
                padding: 0
              .active
                color: #5CD18B
            .collect-btn
              width: auto
              height: auto
              image
                width: 15px
                height: 15px
                animation: scaleB .3s linear forwards
              .active
                animation: scaleA .5s linear forwards
      .item:last-child
        margin-bottom: 0
        border: none
      .active
        .subject-rank
          .rank
            display: none
          .pause
            display: block
        .subject-content
          .title
            color: #ec6b38
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
