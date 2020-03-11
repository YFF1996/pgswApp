<template>
  <div class="advertising-wrapper">
    <div
      @click="onAdSkipPageFn()"
      class="banner"
    >
      <div
        @click.stop="onCloseAdvertisingFn()"
        class="close-icon"
      >
        <image :src="upyunUrl + '/wxXcxImg/images/close-advertising-icon.png'" />
      </div>
      <image mode="aspectFill" :src="obj.cover" />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { upyunUrl } from '../../api/config'

export default {
  data () {
    return {
      upyunUrl
    }
  },
  computed: {
    ...mapState([
      'userInfo',
      'subjectGoodsLabelList'
    ])
  },
  methods: {
    ...mapMutations({
      setNavigationIndex: 'SET_NAVIGATION_INDEX',
      setExcellentCourseIndex: 'SET_EXCELLENT_COURSE_INDEX'
    }),
    ...mapActions([
      'getAdvertisingSumInfo',
      'getSubjectGoodsLabel'
    ]),
    // 讲师广告-点击计算金额
    onAdSkipPageFn () {
      const obj = this.obj
      if (obj.self_ad === 0) { // 0 平台广告
        const data = {
          that: this,
          au_id: obj.advertising_author_id,
          advertising_id: obj.id,
          special_id: this.special_id,
          location: 1
        }
        if (this.userInfo) {
          this.onSkipAdvertisingPageFn()
          this.getAdvertisingSumInfo(data)
        } else {
          this.onSkipPageFn(`/pages/login/index`)
        }
      } else {
        this.onSkipAdvertisingPageFn()
      }
    },
    // 跳转广告
    onSkipAdvertisingPageFn () {
      let obj = this.obj
      const oJson = {
        vid: obj.content_id,
        keywords: '',
        authorId: '',
        type: '',
        page: 1
      }
      if (obj.jump_type === 1) { // 跳转指定内容
        if (obj.content_type === 0) { // 未选择
        } else if (obj.content_type === 1) { // 文章
          this.onSkipPageFn(`/pages/articleDetail/index?id=${obj.content_id}`)
        } else if (obj.content_type === 2) { // 音频详情
          this.onSkipPageFn(`/pages/subject/subjectMusic/musicDetails/index?oJson=${JSON.stringify(oJson)}`)
        } else if (obj.content_type === 3 && obj.v_type === 0) { // 音频专题
          this.onSkipPageFn(`/pages/subject/subjectMusic/index?sid=${obj.content_id}`)
        } else if (obj.content_type === 3 && obj.v_type === 1) { // 视频专题
          obj['id'] = obj.content_id
          obj['special_id'] = obj.content_id
          this.onSkipPageFn(`/pages/videoDetails/index?oJson=${encodeURIComponent(JSON.stringify(obj))}`)
        } else if (obj.content_type === 4) { // 视频详情
          obj['id'] = obj.content_id
          this.onSkipPageFn(`/pages/oneVideoDetails/index?oJson=${encodeURIComponent(JSON.stringify(obj))}`)
        }
      } else if (obj.jump_type === 2) { // 跳转广告介绍详情
        this.onSkipPageFn(`/pages/advertisingDetails/index?oJson=${encodeURIComponent(JSON.stringify(obj))}`)
      } else if (obj.jump_type === 3) { // 跳转页面路径
        const options = this.urlToObj(obj.path)
        if (options.customObj) {
          const oJson = JSON.parse(options.customObj)
          if (oJson.type === 1) {
            if (oJson.site === 1) this.setNavigationIndex(oJson.index)
            if (oJson.site === 2 && this.subjectGoodsLabelList.length) this.setExcellentCourseIndex(oJson.index)
            if (oJson.site === 2 && !this.subjectGoodsLabelList.length) {
              this.getSubjectGoodsLabel({ that: this }).then(() => {
                this.setExcellentCourseIndex(oJson.index)
                this.onSwitchTabFn(obj.path)
              })
              return false
            }
            this.onSwitchTabFn(obj.path)
          }
        } else {
          this.onSkipPageFn(obj.path)
        }
      }
    },
    urlToObj (str) {
      let obj = {}
      if (str.indexOf('?') !== -1) {
        const arr1 = str.split('?')
        const arr2 = arr1[1].split('&')
        for (let i = 0; i < arr2.length; i++) {
          const res = arr2[i].split('=')
          obj[res[0]] = res[1]
        }
      }
      return obj
    },
    // 关闭广告
    onCloseAdvertisingFn () {
      this.$emit('watchCloseAdvertisingChild')
    },
    // 跳转页面
    onSkipPageFn (url) {
      uni.navigateTo({
        url
      })
    },
    // 跳转一级页面
    onSwitchTabFn (url) {
      uni.switchTab({
        url
      })
    }
  },
  props: {
    obj: {
      type: Object,
      default: {}
    }
  }
}
</script>

<style lang="stylus" scoped>
  .advertising-wrapper
    width: 100%
    height: auto
    padding: 15px
    box-sizing: border-box
    .banner
      position: relative
      width: 100%
      height: 50px
      font-size: 12px
      text-align: center
      line-height: 50px
      color: #999
      background-color: #efefef
      border-radius: 4px
      .close-icon
        position: absolute
        right: -8px
        top: -8px
        width: 20px
        height: 20px
        image
          width: 100%
          height: 100%
      image
        display: block
        width: 100%
        height: 100%
        border-radius: 4px
</style>
