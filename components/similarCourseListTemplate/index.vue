<template>
  <div
    v-if="upyunUrl && lists.length"
    class="similar-course-wrapper"
  >
    <div class="similar-course-ul">
      <div
        v-for="(item, index) in lists"
        @click="onSkipPageFn(`/pages/subject/subjectMusic/index?sid=${item.id}`)"
        :key="index"
        class="item"
      >
        <div class="url-pic">
          <image mode="aspectFill" :src="item.cover" />
        </div>
        <div class="text-content">
          <div>{{ item.title }}</div>
          <div class="play-num">
            <image :src="upyunUrl + '/wxXcxImg/images/triangle-play-icon.png'" />
            <div class="num">{{ item.paly }}</div>
            <image :src="upyunUrl + '/wxXcxImg/images/knowledge-gray-icon.png'" />
            <div class="num">共{{ item.content_num }}个知识</div>
            <div class="num num-end">{{ item.grade_label }}</div>
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
  props: {
    lists: {
      type: Array,
      default: []
    }
  },
  methods: {
    onSkipPageFn (url) {
      uni.navigateTo({
        url
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
  .similar-course-wrapper
    width: 100%
    height: auto
    .similar-course-ul
      width: 100%
      height: auto
      padding: 20px 0 0 15px
      box-sizing: border-box
      .item
        width: 100%
        height: auto
        padding-bottom: 18px
        margin-bottom: 18px
        display: flex
        border-bottom: 1px solid #f5f5f5
        .url-pic
          width: 80px
          height: 80px
          margin-right: 10px
          border-radius: 5px
          overflow: hidden
          background-color: #efefef
          image
            width: 100%
            height: 100%
        .text-content
          position: relative
          flex: 1
          height: auto
          padding: 0 15px 15px 0
          .title
            margin-top: -2px
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
          .play-num
            position: absolute
            bottom: 0
            padding-top: 10px
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
      .item:last-child
        margin-bottom: 0
        border-bottom: none
</style>
