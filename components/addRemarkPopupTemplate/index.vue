<template>
  <div
    v-if="addRemarkStatus"
    @click="onHideRemarkFn()"
    class="remark-wrapper"
  >
    <div class="remark-content">
      <div class="btn">取消</div>
      <div @click="onSkipAddRemarkFn()" class="btn active">添加收藏备注</div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  data () {
    return {
    }
  },
  computed: {
    ...mapState([
      'addRemarkStatus'
    ])
  },
  methods: {
    ...mapMutations({
      setAddRemarkStatus: 'SET_ADD_REMARK_STATUS'
    }),
    // 跳转到收藏备注
    onSkipAddRemarkFn () {
      uni.navigateTo({
        url: `/pages/addRemark/index?id=${this.id}`
      })
    },
    // 隐藏添加备注
    onHideRemarkFn () {
      this.setAddRemarkStatus(false)
    }
  },
  onUnload () {
    this.setAddRemarkStatus(false)
  },
  props: {
    id: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="stylus" scoped>
  .remark-wrapper
    position: fixed
    left: 0
    top: 0
    right: 0
    bottom: 0
    width: 100%
    height: 100%
    z-index: 999
    background-color: rgba(0, 0, 0, 0.4)
    .remark-content
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      height: auto
      padding: 25px 42px
      border-radius: 12px 12px 0 0
      display: flex
      justify-content: space-between
      box-sizing: border-box
      background-color: #fff
      .btn
        padding: 0 25px
        line-height 40px
        border-radius: 20px
        font-size: 14px
        color: #545467
        background-color: #E8EBED
      .active
        color: #fff
        background-color: #545467
</style>
