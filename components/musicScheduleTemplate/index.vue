<template>
  <div class="music-schedule-wrapper">
    <div
      v-if="isSpeedState"
      class="schedule-num"
    >
      <div class="text active">{{ thisCurrentTime }}</div>
      <div class="line">/</div>
      <div class="text">{{ thisTotalTime }}</div>
    </div>
    <slider
      class='slider'
      @changing="sliderChangingFn"
      @change="sliderChangeFn"
      block-size="12"
      activeColor='#ff4040'
      block-color="#ff4040"
      backgroundColor="#fff"
      :value="isReplaceCurrentTime ? currentTime * (100 / totalTime) : thisSliderValue"
    />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  data () {
    return {
      thisCurrentTime: 0,
      thisTotalTime: 0,
      thisSliderValue: 0,
      isReplaceCurrentTime: true
    }
  },
  computed: {
    ...mapState([
      'currentTime',
      'totalTime',
      'isSpeedState'
    ])
  },
  methods: {
    ...mapMutations({
      setIsSpeedState: 'SET_IS_SPEED_STATE'
    }),
    ...mapActions([
      'setSliderChange',
      'myAudioPlay'
    ]),
    // 拖动过程中触发
    sliderChangingFn (e) {
      const num = e.mp.detail.value
      const data = {
        status: false,
        num
      }
      this.setSliderChange(data)
      this.setIsSpeedState(true)
      this.thisSliderValue = num
      this.isReplaceCurrentTime = false
    },
    // 完成一次拖动后触发
    sliderChangeFn () {
      this.setIsSpeedState(false)
      setTimeout(() => {
        this.myAudioPlay()
        this.isReplaceCurrentTime = true
      }, 500)
    },
    timeToMinute (times) {
      let t = ''
      if (times > -1) {
        const min = Math.floor(times / 60) % 60
        const sec = times % 60
        if (min < 10) {
          t = '0'
        }
        t += min + ':'
        if (sec < 10) {
          t += '0'
        }
        t += sec.toFixed(2)
      }
      t = t.substring(0, t.length - 3)
      return t
    }
  },
  watch: {
    currentTime (num) {
      this.thisCurrentTime = this.timeToMinute(num)
    },
    totalTime (num) {
      this.thisTotalTime = this.timeToMinute(num)
    }
  }
}
</script>

<style lang="stylus" scoped>
  .music-schedule-wrapper
    position: fixed
    left: 0
    bottom: 0
    width: 100%
    height: auto
    padding: 20px 20px 10px 20px
    box-sizing: border-box
    .schedule-num
      position: absolute
      left: 0
      top: -35px
      width: 100%
      height: auto
      display: flex
      justify-content: center
      .text
        font-size: 18px
        color: rgba(255, 255, 255, 0.8)
      .text.active
        color: #fff
      .line
        padding: 0 5px
        line-height: 24px
        font-size: 14px
        color: #fff
    .slider
      width: 100%
      height: 100%
      margin: 0
</style>
