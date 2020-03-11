<template>
  <div
    v-if="lists.length && upyunUrl"
    @click="onSkipPageFn(`/pages/subject/hotMusic/index?catid=${catid}`)"
    class="hot-wrapper"
  >
    <image :src="upyunUrl + '/wxXcxImg/images/hot-video-bg.png'" class="hot-bg" />
    <div class="hot-box">
      <div class="cover-box">
        <div class="icon">
          <image :src="upyunUrl + '/wxXcxImg/images/hot-play-icon.png'" />
        </div>
        <div
          v-for="(item, index) in lists"
          v-if="index < 3"
          :key="index"
          :class="'cover' + index"
          class="cover"
        >
          <image mode="aspectFill" :src="item.cover" />
        </div>
      </div>
      <div class="title-box">
        <div class="title">栏目热门音频</div>
        <div class="hint">碎片时间，听你喜欢</div>
      </div>
      <div class="skip">
        <image :src="upyunUrl + '/wxXcxImg/images/hot-return-icon.png'" />
      </div>
    </div>
  </div>
</template>

<script>
import { upyunUrl } from '../../api/config'

export default {
  data () {
    return {
      upyunUrl
    }
  },
  methods: {
    onSkipPageFn (url) {
      uni.navigateTo({
        url
      })
    }
  },
  props: {
    lists: {
      type: Array,
      default: []
    },
    catid: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="stylus" scoped>
  .hot-wrapper
    position: relative
    padding: 0 15px
    margin-top: 25px
    width: 100%
    height: 64px
    box-sizing: border-box
    background: #fff
    .hot-bg
      width: 100%
      height: 64px
      image
        width: 100%
        height: 100%
    .hot-box
      position: absolute
      top: 11px
      width: 100%
      height: auto
      display: flex
      align-items: center
      justify-content: space-around
      .cover-box
        .icon
          position: absolute
          top: -5px
          left: 29px
          width: 30px
          height: 30px
          z-index: 20
          image
            display: block
            width: 100%
            height: 100%
        .cover
          position: absolute
          left: 13px
          top: -20px
          width: 62px
          height: 62px
          border-radius: 3px
          box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.23)
          background-color: #fff
          z-index: 10
          image
            width: 100%
            height: 100%
            border-radius: 3px
          &.cover1
            left: 41px
            top: -8px
            width: 50px
            height: 50px
            z-index: 9
          &.cover2
            left: 61px
            top: -1px
            width: 42px
            height: 42px
            z-index: 8
      .title-box
        margin-left: -10px
        color: #fff
        .title
          margin-bottom: 7px
          font-size: 13px
          font-weight: bold
        .hint
          font-size: 11px
      .skip
        width: 20px
        height: 20px
        image
          display: block
          width: 100%
          height: 100%
</style>
