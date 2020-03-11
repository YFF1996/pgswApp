<template>
  <div v-if="upyunUrl" class="seek-wrapper">
    <div class="seek-content">
      <div class="input-bar">
        <i class="search"><img :src="upyunUrl + '/wxXcxImg/images/search-icon.png'" /></i>
        <input type="text" placeholder="搜您想听搜您所用"
          @input="watchInput()"
          @confirm="onEnterFn()"
          v-model="inputText"
          :focus="true"
          placeholder-style="color: #999;"
        />
        <div class="closed-btn" @click.stop="onEmptyDataFn()">
          <img
            v-if="inputText"
            :src="upyunUrl + '/wxXcxImg/images/closed-icon.png'"
          />
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
    // input值变化时
    watchInput () {
      this.$emit('watchInputChild', this.inputText)
    },
    // 回车键触发
    onEnterFn () {
      this.$emit('enterChild')
    },
    // 一件清空input内容
    onEmptyDataFn () {
      this.$emit('emptyDataChild')
    }
  },
  onUnload () {
    this.inputText = ''
  },
  props: {
    inputText: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="stylus" scoped>
  .seek-wrapper
    position: fixed
    left: 0
    top: 0
    width: 100%
    height: auto
    padding: 15px 20px
    z-index: 10
    box-sizing: border-box
    background-color: #fff
    .seek-content
      width: 100%
      height: 100%
      border-radius: 6px
      .input-bar
        padding-left: 15px
        width: 100%
        height: 34px
        line-height: 34px
        border-radius: 17px
        display: flex
        align-items: center
        box-sizing: border-box
        background-color: #f6f6f6
        .search
          margin-top: 2px
          width: 13px
          height: 14px
          img
            display: block
            width: 100%
            height: 100%
        input
          padding: 0 10px
          flex: 1
          height: 100%
          font-size: 14px
          color: #333
          z-index: 20
          box-sizing: border-box
        .closed-btn
          width: 37px
          height: 100%
          display: flex
          align-items: center
          justify-content: center
          z-index: 30
          img
            width: 18px
            height: 18px
</style>
