<template>
  <div v-if="upyunUrl && lists.length" class="special-wrapper">
    <ul>
      <li
        v-for="(item, index) in lists"
        @click="onSkipPageFn(item)"
        :key="index"
      >
        <div class="cover-box">
          <img mode="aspectFill" :src="item.cover" />
          <div v-if="item.is_boutique" class="label-box">精品</div>
          <div class="video-play-num">
            <div v-if="item.v_type === 0">音频</div>
            <div v-if="item.v_type === 1">视频</div>
          </div>
        </div>
        <div class="text">
          <h2 class="title">{{ item.title }}</h2>
          <div class="bottom"><div v-if="item.author">讲师：{{ item.author.nick_name }}</div><div class="circle-icon"></div>{{ item.paly }}人播放</div>
        </div>
      </li>
    </ul>
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
    onSkipPageFn (item) {
      let url = ''
      switch (item.v_type) {
        case 0:
          url = `/pages/subject/subjectMusic/index?sid=${item.id}`
          break
        case 1:
          item['special_id'] = item.id
          url = `/pages/subject/subjectVideo/index?oJson=${encodeURIComponent(JSON.stringify(item))}`
          break
      }
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
  .special-wrapper
    width: 100%
    height: 100%
    ul
      padding: 20px 15px
      width: 100%
      height: auto
      box-sizing: border-box
      li
        width: 100%
        height: auto
        padding-bottom: 15px
        margin-bottom: 15px
        display: flex
        border-bottom: 1px solid #f5f5f5
        .cover-box
          position: relative
          width: 80px
          height: 80px
          border-radius: 4px
          background-color: #e6e6e6
          overflow: hidden
          img
            width: 100%
            height: 100%
            border-radius: 4px
          .label-box
            position: absolute
            top: 0
            right: 0
            width: 36px
            height: 16px
            line-height: 16px
            font-size: 10px
            text-align: center
            font-weight: bold
            color: #fff
            background: #ff6464
            border-radius: 2px
          .video-play-num
            position: absolute
            bottom: 0
            width: 100%
            height: 30px
            padding: 9px 5px 2px
            display: flex
            align-items: center
            justify-content: flex-end
            font-size: 11px
            color: #fff
            background: -webkit-linear-gradient(top,rgba(255, 255, 255, 0)10%, rgba(0, 0, 0, .5)80%)
            box-sizing: border-box
            border-radius: 0 0 4px 4px
        .text
          flex: 1
          padding-left: 15px
          height: auto
          .title
            width: 100%
            height: 60px
            margin-top: -3px
            line-height: 20px
            font-size: 14px
            display: -webkit-box
            -webkit-box-orient: vertical
            -webkit-line-clamp: 3
            overflow: hidden
            color: #3b3b55
          .bottom
            width: 100%
            height: auto
            padding-top: 8px
            line-height: 12px
            display: flex
            align-items: center
            font-size: 12px
            color: #9798a6
            .circle-icon
              margin: 0 6px
              width: 3px
              height: 3px
              background: #9798a6
              border-radius: 50%
        &:last-child
          margin-bottom: 0
</style>
