<template>
  <div v-if="upyunUrl" class="special-wrapper">
    <div
      v-if="list.length"
      class="special-list-ul"
    >
      <div
        v-for="(item, index) in list"
        @click="onSkipPageFn(`/pages/subject/subjectMusic/index?sid=${item.id}`)"
        :key="index"
        class="item"
      >
        <div class="cover-box">
          <image mode="aspectFill" :src="item.cover" />
          <div v-if="item.is_boutique" class="label-box">精品</div>
        </div>
        <div class="text">
          <div class="title">{{ item.title }}</div>
          <div v-if="item.intro" class="intro">{{ item.intro }}</div>
          <div class="bottom">
            <div class="item-icon">
              <image :src="upyunUrl + '/wxXcxImg/images/triangle-play-icon.png'" />
              <div class="num">{{ item.play_hits }}</div>
            </div>
            <div class="item-icon">
              <image :src="upyunUrl + '/wxXcxImg/images/knowledge-gray-icon.png'" />
              <div class="num">{{ item.zs_count }}个知识</div>
            </div>
          </div>
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
    padding: 0 15px
    width: 100%
    height: 100%
    box-sizing: border-box
    .special-list-ul
      padding-bottom: 10px
      width: 100%
      height: auto
      .item
        padding: 18px 20px 21px 17px
        box-sizing: border-box
        margin-bottom: 10px
        display: flex
        width: 100%
        height: auto
        background-color: #fff
        border-radius: 5px
        .cover-box
          position: relative
          width: 100px
          height: 100px
          border-radius: 4px
          background-color: #f6f6f6
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
            font-weight: bold
            color: #fff
            background: linear-gradient(241deg,rgba(79,178,255,1),rgba(83,147,255,1))
            border-radius: 4px 0px 15px 0px
        .text
          position: relative
          height: 100px
          flex: 1
          padding-left: 15px
          .title
            min-height: 21px
            line-height: 23px
            font-size: 16px
            font-weight: bold
            display: -webkit-box
            -webkit-box-orient: vertical
            -webkit-line-clamp: 2
            overflow: hidden
            color: #000
          .intro
            margin-top: 5px
            padding: 0 4px 0 6px
            height: 25px
            line-height: 25px
            font-size: 11px
            display: -webkit-box
            -webkit-box-orient: vertical
            -webkit-line-clamp: 1
            overflow: hidden
            color: #999
            box-sizing: border-box
          .bottom
            position: absolute
            bottom: 0
            width: 100%
            height: auto
            display: flex
            .item-icon
              padding-right: 26px
              display: flex
              align-items: center
              image
                width: 14px
                height: 14px
              .num
                padding-left: 5px
                font-size: 11px
                color: #999
                .word
                  font-size: 12px
</style>
