<template>
  <div
    v-if="lists.length"
    class="banner-wrapper"
  >
    <swiper
      v-if="lists.length > 1"
      @change="onChangeFn"
      duration="200"
      autoplay='true'
      circular='true'
      class="banner-box"
    >
      <swiper-item
        v-for="(item, index) in lists"
        :key="index"
        @click="onSkipLecturerDetailFn(item)"
      >
        <image mode="aspectFill" :src="item.thumb" />
      </swiper-item>
    </swiper>
    <div
      v-else
      @click="onSkipLecturerDetailFn(lists[0])"
      class="banner-box"
    >
      <image mode="aspectFill" :src="lists[0].thumb" />
    </div>
    <div
      v-if="lists.length > 1"
      class="dot-wrapper"
    >
      <div class="dot-ul">
        <div
          v-for="(item, index) in lists"
          :class="{'active' : currentIndex === index}"
          :key="index"
          class="item"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      currentIndex: 0
    }
  },
  computed: {
    ...mapState([
      'userInfo'
    ])
  },
  methods: {
    onChangeFn (e) {
      this.currentIndex = e.mp.detail.current
    },
    onSkipLecturerDetailFn (item) {
      // type: (1小程序内容) => content_type: (1文章, 2音频, 3专题)
      // type: (2外部url)
      // type: (3图文内容)
      // type: (4抽奖页面)
      // type: (5送书活动)
      // type: (6换书页面)
      switch (item.type) {
        case '1':
          switch (item.content_type) {
            case '1':
              uni.navigateTo({ url: `/pages/articleDetail/index?id=${item.content_id}` }) // 文章页面
              break
            case '2':
              break
            case '3':
              uni.navigateTo({ url: `/pages/subject/subjectMusic/index?sid=${item.content_id}` }) // 专题页面
              break
            default:
              return false
          }
          break
        case '2':
          break
        case '3':
          uni.navigateTo({ url: `/pages/mission/lecturerDetail/index?id=${item.id}` }) // 图文内容页面
          break
        case '4':
          if (this.userInfo) {
            uni.navigateTo({ url: `/pages/mission/draw/index?openid=${this.userInfo.openid}` }) // 抽奖页面
          } else {
            uni.navigateTo({
              url: `/pages/login/index`
            })
          }
          break
        case '5':
          uni.navigateTo({ url: `/pages/mission/sendBook/index` }) // 送书活动页面
          break
        case '6':
          if (this.userInfo) {
            uni.navigateTo({ url: `/pages/mission/tradeBook/index` }) // 兑换书页面
          } else {
            uni.navigateTo({
              url: `/pages/login/index`
            })
          }
          break
        default:
          return false
      }
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
  .banner-wrapper
    position: relative
    width: 100%
    height: auto
    padding: 15px 15px 0
    box-sizing: border-box
    .banner-box
      width: 100%
      height: 150px
      overflow: hidden
      border-radius: 4px
      background-color: #f6f6f6
      image
        width: 100%
        height: 100%
        border-radius: 4px
    .dot-wrapper
      position: absolute
      bottom: 0
      left: 0
      width: 100%
      height: 30px
      .dot-ul
        width: 100%
        height: 100%
        display: flex
        align-items: center
        justify-content: center
        .item
          width: 8px
          height: 8px
          border-radius: 4px
          margin: 0 3px
          background-color: rgba(255, 255, 255, 0.5)
        .active
          width: 15px
          background-color: #ff6464
</style>
