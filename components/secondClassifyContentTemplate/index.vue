<template>
  <div class="classify-wrapper">
    <div class="title">热门课程</div>
    <div
      v-if="classifycontentList.length && upyunUrl"
      v-for="(item, index) in classifycontentList"
      class="advertising-list"
      :key="index"
    >
      <special-box :list="item.lists.slice(0, 6)" />
      <div v-if="item.banner" class="special-banner">
        <image
          v-if="item.banner.thumb"
          :src="item.banner.thumb"
          mode="aspectFill"
          @click="onSkipLecturerDetailFn(item.banner)"
        />
      </div>
      <special-list :list="item.lists.slice(6, 11)" />
    </div>
    <!-- 上拉加载更多loading -->
    <loading-more :lists="classifycontentList" :listsLength="1" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SpecialBox from '../specialBoxTemplate'
import SpecialList from '../specialClassifyListTemplate'
import LoadingMore from '../loadingMoreTemplate'
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
    ...mapActions([
    ]),
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
              uni.navigateTo({ url: `/pages/articleDetail/index?id=${item.content_id}` }) // 文章
              break
            case '2':
              break
            case '3':
              uni.navigateTo({ url: `/pages/subject/subjectMusic/index?sid=${item.content_id}` }) // 专题
              break
            default:
              return false
          }
          break
        case '2':
          break
        case '3':
          uni.navigateTo({ url: `/pages/mission/lecturerDetail/index?id=${item.id}` }) // 图文内容
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
    classifycontentList: {
      type: Array,
      default: []
    }
  },
  components: {
    SpecialBox,
    SpecialList,
    LoadingMore
  }
}
</script>

<style lang="stylus" scoped>
  .classify-wrapper
    width: 100%
    height: 100%
    .title
      padding: 0 0 13px 15px
      box-sizing: border-box
      font-size: 15px
      font-weight: bold
      color: #000
    .advertising-list
      width: 100%
      height: auto
      .special-banner
        width: 100%
        height: auto
        padding: 0 15px 15px
        box-sizing: border-box
        image
          width: 100%
          height: 150px
          border-radius: 4px
</style>
