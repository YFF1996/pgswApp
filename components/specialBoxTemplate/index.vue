<template>
  <div
    v-if="upyunUrl"
    class="special-wrapper"
  >
    <div class="special-ul">
      <div
        v-for="(item, index) in list"
        @click="onSkipPageFn(`/pages/subject/subjectMusic/index?sid=${item.id}`)"
        :key="index"
        class="item"
      >
        <div class="item-box">
          <div class="cover-box">
            <image mode="aspectFill" :src="item.cover" />
            <div v-if="item.is_boutique" class="label-box">精品</div>
            <div class="video-play-num">
              <div class="play-icon">
                <image :src="upyunUrl + '/wxXcxImg/images/main-play-icon.png'" />
              </div>
              <div class="play-num">{{ item.play_hits }}</div>
            </div>
          </div>
          <div class="title">{{ item.title }}</div>
        </div>
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
    // 跳转专题列表
    onSkipPageFn (url) {
      uni.navigateTo({
        url
      })
    }
  },
  props: {
    list: {
      type: Array,
      default: []
    }
  }
}
</script>

<style lang="stylus" scoped>
  .special-wrapper
    width: 100%
    height: auto
    padding-left: 15px
    box-sizing: border-box
    .special-ul
      width: 100%
      height: auto
      display: flex
      flex-wrap: wrap
      overflow: hidden
      .item
        width: 33.3%
        height: auto
        padding: 0 15px 15px 0
        box-sizing: border-box
        .item-box
          width: 100%
          height: 160px
          overflow: hidden
          border-radius: 4px
          background: #fff
          .cover-box
            position: relative
            width: 100%
            height: 105px
            border-radius: 4px 4px 0 0
            background-color: #ccc
            image
              display: block
              width: 100%
              height: 100%
              border-radius: 4px 4px 0 0
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
              background: linear-gradient(241deg,rgba(79,178,255,1),rgba(83,147,255,1))
              border-radius: 4px 0px 15px 0px
            .video-play-num
              position: absolute
              bottom: 0
              width: 100%
              height: 30px
              padding: 9px 5px 2px
              display: flex
              align-items: center
              background: -webkit-linear-gradient(top,rgba(255, 255, 255, 0)10%, rgba(0, 0, 0, .5)80%)
              box-sizing: border-box
              .play-icon
                width: 13px
                height: 13px
                image
                  display: block
                  width: 100%
                  height: 100%
              .play-num
                padding-left: 5px
                height: 16px
                line-height: 16px
                font-size: 11px
                color: #fff
          .title
            width: 100%
            min-height: 17px
            padding: 7px 4px 0 7px
            box-sizing: border-box
            line-height: 20px
            font-size: 12px
            display: -webkit-box
            -webkit-box-orient: vertical
            -webkit-line-clamp: 2
            overflow: hidden
            color: #333
</style>
