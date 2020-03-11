<template>
  <div v-if="upyunUrl" class="goods-wrapper">
    <div class="bg-color"></div>
    <div class="banner-box">
      <div v-if="channelPath === 'me'" class="hint">每个阶段的课程只能领取一次，可免费领取三门课程，请慎重选择</div>
      <div class="slogan">
        <h1>{{ oJson.title }}</h1>
        <h2>{{ oJson.intro }}</h2>
      </div>
    </div>
    <div class="line-bg">
      <div class="line"></div>
    </div>
    <quality-list :oJson="oJson" :channelName="this.obj.channelPath" @subjectGoodsListChild="getSubjectGoodsListFn" />
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import { upyunUrl } from '../../../api/config'
import QualityList from '../../../components/subjectQualityListTemplate'

export default {
  data () {
    return {
      upyunUrl,
      obj: '',
      oJson: ''
    }
  },
  onLoad (options) {
    this.obj = JSON.parse(options.oJson)
    uni.setNavigationBarTitle({
      title: this.obj.title
    })
    this.getSubjectGoodsListFn()
  },
  // 下拉刷新
  onPullDownRefresh () {
    this.getSubjectGoodsListFn()
  },
  methods: {
    ...mapMutations({
    }),
    ...mapActions([
      'getSubjectGoodsList'
    ]),
    // 获取精品课程列表
    getSubjectGoodsListFn () {
      const data = {
        that: this,
        collection_id: this.obj.id,
        category_id: ''
      }
      uni.showLoading({ title: 'Loading' })
      this.getSubjectGoodsList(data).then((res) => {
        this.oJson = res[0]
        uni.stopPullDownRefresh()
        uni.hideLoading()
      })
    }
  },
  components: {
    QualityList
  }
}
</script>

<style lang="stylus" scoped>
  .goods-wrapper
    width: 100%
    height: auto
    .banner-box
      width: 100%
      height: 186px
      background: linear-gradient(90deg,rgba(255,78,78,1),rgba(255,144,95,1))
      .hint
        padding-left: 13px
        height: 30px
        line-height: 30px
        font-size: 11px
        color: #fff
        background: linear-gradient(90deg,rgba(255,60,56,1),rgba(255,101,65,1))
      .slogan
        padding: 24px 15px 0 15px
        width: 100%
        height: auto
        box-sizing: border-box
        h1
          padding-bottom: 14px
          font-size: 24px
          font-weight: bold
          color: #fff
        h2
          font-size: 14px
          color: #fff
    .line-bg
      position: relative
      width: 100%
      height: 50px
      background: linear-gradient(90deg, rgba(255, 78, 78, 1), rgba(255, 144, 95, 1))
      .line
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 50px
        background: linear-gradient(0deg, rgba(246, 245, 245, 0.95), rgba(246, 245, 245, 0))
</style>

