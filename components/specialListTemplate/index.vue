<template>
  <div class="special-wrapper" v-if="upyunUrl">
    <ul v-if="list.length">
      <li
        v-for="(item, index) in list"
        @click="onSkipPageFn(`/pages/subject/subjectMusic/index?sid=${item.id}`)"
        :key="index"
      >
        <div class="cover-box">
          <img mode="aspectFill" :src="item.cover" />
          <div v-if="item.is_boutique" class="label-box">精品</div>
        </div>
        <div class="text">
          <h2 class="title">{{ item.title }}</h2>
          <p v-if="item.intro">{{ item.intro }}</p>
          <div class="bottom">
            <div class="item">
              <img :src="upyunUrl + '/wxXcxImg/images/redio-num-icon.png'" />
              <div class="num">{{ item.play }}</div>
            </div>
            <div class="item">
              <img :src="upyunUrl + '/wxXcxImg/images/book-icon.png'" />
              <div class="num">{{ item.activity_num }}个知识</div>
            </div>
          </div>
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
    height: 100%
    ul
      padding: 0 15px
      box-sizing: border-box
      width: 100%
      height: auto
      li
        padding-bottom: 15px
        margin-bottom: 13px
        display: flex
        width: 100%
        height: auto
        border-bottom: 1px solid #f5f5f5
        .cover-box
          position: relative
          width: 72px
          height: 72px
          border-radius: 4px
          background-color: #f6f6f6
          overflow: hidden
          img
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
          height: 72px
          flex: 1
          padding-left: 15px
          .title
            margin-top: -3px
            height: 19px
            line-height: 19px
            font-size: 14px
            display: -webkit-box
            -webkit-box-orient: vertical
            -webkit-line-clamp: 1
            overflow: hidden
            color: #333
          p
            margin-top: 5px
            height: 16px
            line-height: 16px
            font-size: 12px
            display: -webkit-box
            -webkit-box-orient: vertical
            -webkit-line-clamp: 1
            overflow: hidden
            color: #999
          .bottom
            position: absolute
            bottom: -3px
            width: 100%
            height: auto
            display: flex
            .item
              padding-right: 26px
              display: flex
              align-items: center
              img
                width: 14px
                height: 14px
              .num
                padding-left: 6px
                font-size: 12px
                color: #999
        &:last-child
          border: none
</style>
