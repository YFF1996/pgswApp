<template>
  <div
    v-if="upyunUrl && lists.length"
    class="recommend-wrapper"
  >
    <div class="title">精品推荐</div>
    <div class="recommend-ul">
      <div
        v-for="(item, index) in lists"
        :key="index"
        @click="onSkipPageFn(`/pages/subject/subjectQuality/index?oJson=${JSON.stringify({id: item.id, title: item.jobCategory.name, channelPath: 'course'})}`)"
        class="item"
      >
        <div class="cover-box">
          <image mode="aspectFill" :src="item.cover" />
        </div>
        <div class="info-box">
          <div class="info-title">{{ item.title }}</div>
          <div class="hint">{{ item.intro }}</div>
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
    // 跳转页面
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
    }
  }
}
</script>

<style lang="stylus" scoped>
  .recommend-wrapper
    width: 100%
    height: auto
    padding: 0 15px
    box-sizing: border-box
    .title
      margin-bottom: 13px
      font-size: 15px
      font-weight: bold
      color: #000
    .recommend-ul
      width: 100%
      height: auto
      overflow: hidden
      .item
        margin-bottom: 20px
        width: 100%
        height: auto
        background: #fff
        border-radius: 4px
        .cover-box
          width: 100%
          height: 145px
          background-color: #ccc
          border-radius: 4px 4px 0 0
          image
            width: 100%
            height: 100%
            border-radius: 4px 4px 0 0
        .info-box
          width: 100%
          height: auto
          padding: 12px 15px 15px
          box-sizing: border-box
          .info-title
            padding-bottom: 9px
            min-height: 21px
            line-height: 21px
            font-size: 16px
            font-weight: bold
            display: -webkit-box
            -webkit-box-orient: vertical
            -webkit-line-clamp: 2
            overflow: hidden
            box-sizing: border-box
            color: #333
          .hint
            height: 16px
            line-height: 16px
            font-size: 12px
            display: -webkit-box
            -webkit-box-orient: vertical
            -webkit-line-clamp: 1
            overflow: hidden
            box-sizing: border-box
            color: #b3b3b3
</style>
