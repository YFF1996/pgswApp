<template>
  <div
    class="integral-rate"
    v-if="userInfo && upyunUrl"
    @touchend="touchend"
    @touchmove="touchmove"
    @touchstart="touchstart"
    :style="{left: write[0] + 'px', top: write[1] + 'px'}"
  >
    <img :src="upyunUrl + '/wxXcxImg/images/integral-rate.gif'" />
    <div class="integral-rate-box" :style="{height: TodayListenMusicNum * 10 + 'px'}"></div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { upyunUrl } from '../../api/config'

export default {
  data () {
    return {
      upyunUrl,
      writesize: [0, 0], // X Y 定位
      write: [20, 70] // 定位参数
    }
  },
  computed: {
    ...mapState([
      'userInfo',
      'TodayListenMusicNum'
    ])
  },
  methods: {
    ...mapMutations({
      setNavigationVertical: 'SET_NAVIGATION_VERTICAL'
    }),
    getSysdata () {
      var that = this
      uni.getSystemInfo({
        success () {
          // 获取元素宽高
          uni.createSelectorQuery().in(this).select('.integral-rate').boundingClientRect((res) => {
            if (res) {
              that.writesize = [res.width, res.height]
            } else {
              that.getSysdata()
            }
          }).exec()
        },
        fail (e) {
          console.log(e)
        }
      })
    },
    touchend () {
      this.setNavigationVertical(true)
    },
    touchmove (e) {
      this.write = [e.touches[0].pageX - this.writesize[0] / 2, e.touches[0].pageY - this.writesize[1] / 2]
    },
    touchstart () {
      this.setNavigationVertical(false)
    }
  },
  watch: {
    userInfo () {
      this.getSysdata()
    }
  }
}
</script>

<style lang="stylus" scoped>
  .integral-rate
    position: absolute
    bottom: 190px
    right: 15px
    width: 50px
    height: 50px
    border-radius: 50%
    border: 1px solid #e1564f
    display: flex
    flex-wrap: wrap
    align-content: flex-end
    overflow: hidden
    z-index: 1000
    background-color: #fff
    box-sizing: border-box
    img
      display: block
      width: 100%
      height: 5px
    .integral-rate-box
      width: 100%
      height: auto
      transition: 0.3s
      background-color: #e1564f
</style>
