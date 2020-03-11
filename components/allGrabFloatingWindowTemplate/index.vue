<template>
  <div
    v-if="allGrabList.length"
    class="all-grab-floating-window"
  >
    <ul :style="{marginTop: - scrollIndex * oHeight + 'px', transition: 'all ' + transitionTime + 's'}">
      <li class="list" v-for="(item, index) in allGrabList" :key="index">
        <div class="avatar">
          <img mode="aspectFill" :src="item.cover" />
        </div>
        <div v-if="item.type === 2" class="text" @click="onSkipPageFn (`/pages/subject/subjectMusic/index?sid=${item.id}`)">
          <span>{{ item.title }}</span>
          可抢学费啦
        </div>
        <div v-else class="text">
          <span class="name">{{ item.title }}</span>{{ item.ctime }}到账{{ item.money }}元
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'

let timeStop = null

export default {
  data () {
    return {
      scrollIndex: 0,
      oHeight: 0,
      transitionTime: 0.6
    }
  },
  created () {
    this.computedUlTopFn()
  },
  onShow () {
    this.computedUlTopFn()
  },
  onReady () {
    this.computedWrapperHeightFn()
  },
  computed: {
    ...mapState([
      'allGrabList'
    ])
  },
  methods: {
    computedUlTopFn () {
      clearInterval(timeStop)
      timeStop = setInterval(() => {
        this.scrollIndex++
        if (this.scrollIndex >= this.allGrabList.length) {
          this.scrollIndex = 0
          this.transitionTime = 0
        } else {
          this.transitionTime = 0.6
        }
      }, 2500)
    },
    computedWrapperHeightFn () {
      const that = this
      const query = uni.createSelectorQuery().in(this)
      setTimeout(() => {
        query.select('.all-grab-floating-window').boundingClientRect((rect) => {
          if (rect) {
            that.oHeight = rect.height
          } else {
            that.computedWrapperHeightFn()
          }
        }).exec()
      }, 3000)
    },
    // 跳转页面
    onSkipPageFn (url) {
      uni.navigateTo({ url })
    }
  },
  onHide () {
    clearInterval(timeStop)
  }
}
</script>

<style lang="stylus" scoped>
.all-grab-floating-window
  height: 30px
  overflow: hidden
  border-radius: 0 20px 20px 0
  z-index: 999
  ul
    width: auto
    height: auto
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26)
    background-color: rgba(0, 0, 0, 0.5)
    li
      width: auto
      height: 30px
      padding: 0 10px
      display: flex
      align-items: center
      box-sizing: border-box
    .avatar
      width: 18px
      height: 18px
      border-radius: 50%
      img
        width: 100%
        height: 100%
        border-radius: 50%
    .text
      flex: 1
      display: flex
      padding-left: 8px
      font-size: 11px
      color: #fff
      span
        min-width: 10px
        max-width: 130px
        display: -webkit-box
        -webkit-box-orient: vertical
        -webkit-line-clamp: 1
        overflow: hidden
        &.name
          padding-right: 3px
</style>
