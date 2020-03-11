<template>
  <div
    v-if="upyunUrl"
    class="special-wrapper"
  >
    <ul>
      <li
        v-if="lists.length"
        v-for="(item, index) in lists"
        :key="index"
        @click="onSkipSubjectDetailFn(item.id)"
      >
        <div class="content-box">
          <div class="cover-box">
            <img mode="aspectFill" :src="item.cover" />
            <div v-if="item.is_boutique" class="label-box">精品</div>
          </div>
          <div class="text">
            <h2 class="title">{{ item.title }}</h2>
            <p v-if="item.intro">{{ item.intro }}</p>
            <div class="bottom">
              <div class="item">
                <img :src="upyunUrl + '/wxXcxImg/images/triangle-play-icon.png'" />
                <div class="num">{{ item.play_hits }}</div>
              </div>
              <div class="item">
                <img :src="upyunUrl + '/wxXcxImg/images/knowledge-icon02.png'" />
                <div class="num">{{ item.zh_num }}个知识</div>
              </div>
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
    onSkipSubjectDetailFn (id) {
      uni.navigateTo({
        url: `/pages/subject/subjectMusic/index?sid=${id}`
      })
    }
  },
  props: ['lists']
}
</script>

<style lang="stylus" scoped>
  .special-wrapper
    width: 100%
    height: auto
    ul
      width: 100%
      height: auto
      padding: 18px 15px
      box-sizing: border-box
      li
        width: 100%
        height: auto
        padding: 12px
        margin-bottom: 12px
        box-sizing: border-box
        background-color: #fff
        border-radius: 4px
        .content-box
          display: flex
          .cover-box
            position: relative
            width: 100px
            height: 100px
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
              color: #fff
              background: linear-gradient(241deg, rgba(79, 178, 255, 1), rgba(83, 147, 255, 1))
              border-radius: 4px 0 15px 0
          .text
            position: relative
            height: 100px
            flex: 1
            padding-left: 15px
            .title
              min-height: 20px
              line-height: 20px
              font-size: 15px
              display: -webkit-box
              -webkit-box-orient: vertical
              -webkit-line-clamp: 2
              overflow: hidden
              color: #333
            p
              margin-top: 10px
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
              bottom: 0
              width: 100%
              height: auto
              display: flex
              .item
                padding-right: 26px
                display: flex
                align-items: center
                img
                  width: 12px
                  height: 12px
                .num
                  padding-left: 6px
                  font-size: 12px
                  color: #999
        &:last-child
          border: none
</style>
