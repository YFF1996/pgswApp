<template>
  <div
    class="screen-wrapper"
    v-if="screenBottleStatus"
  >
    <div class="screen-content">
      <h3>筛选</h3>
      <div class="screen-box">
        <h4>瓶盖区间 </h4>
        <ul>
          <li>
            <input @input="editInput" type="number" v-model="startVal" cursor-spacing="10" />
          </li>
          <li>
            <i class="line"></i>
          </li>
          <li>
            <input @input="editInput" type="number" v-model="endVal" cursor-spacing="10" />
          </li>
        </ul>
      </div>
      <div class="change-box">
        <h4>我能换的</h4>
        <div class="change-btn">
          <div :class="{ 'active' : currentIndex === 1 }" class="btn" @click.stop="onChangeStatusFn(1)">只看我能换的</div>
          <div :class="{ 'active' : currentIndex === 0 }" class="btn" @click.stop="onChangeStatusFn(0)">不限</div>
        </div>
      </div>
      <div class="ensure-btn">
        <div class="btn" @click="onHideRemarkFn()">取消</div>
        <div class="btn activate" @click="onConfirmFn()">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  data () {
    return {
      startVal: 0,
      endVal: 0,
      currentIndex: 0
    }
  },
  computed: {
    ...mapState([
      'screenBottleStatus'
    ])
  },
  methods: {
    ...mapActions([
      'getConversionBookList'
    ]),
    ...mapMutations({
      setScreenBottleStatus: 'SET_SCREEN_BOTTLE_STATUS'
    }),
    // input输入值变化时
    editInput () {
      this.currentIndex = ''
    },
    // 按钮切换
    onChangeStatusFn (index) {
      this.currentIndex = index
      this.startVal = ''
      this.endVal = ''
    },
    // 按钮确定提交
    onConfirmFn () {
      const data = {
        can_exc: this.currentIndex,
        lower: this.startVal,
        upper: this.endVal
      }
      this.$emit('watchInputChild', data)
      this.setScreenBottleStatus(false)
    },
    // 关闭弹窗
    onHideRemarkFn () {
      this.setScreenBottleStatus(false)
      this.startVal = ''
      this.endVal = ''
      this.currentIndex = 0
    },
    showToastFn (title) {
      uni.showToast({
        title,
        icon: 'none',
        duration: 2000
      })
    }
  },

  onUnload () {
    this.setScreenBottleStatus(false)
  }
}
</script>

<style lang="stylus" scoped>
  .screen-wrapper
    position: fixed
    left: 0
    top: 0
    right: 0
    bottom: 0
    width: 100%
    height: 100%
    z-index: 999
    background-color: rgba(0, 0, 0, 0.4)
    .screen-content
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      height: auto
      padding: 15px 15px 18px
      border-radius: 12px 12px 0 0
      box-sizing: border-box
      background-color: #fff
      h3
        font-size:16px
        line-height: 16px
        text-align: center
        color: #333
      h4
        font-size: 16px
        line-height: 16px
        color: #333
      .screen-box
        margin: 17px 0 20px
        ul
          margin-top: 20px
          width: 100%
          height: auto
          display: flex
          align-items: center
          justify-content: center
          li
            input
              width: 115px
              height: 31px
              border: 1px solid #afafaf
              text-align: center
              border-radius: 4px
            .line
              margin : 0 17px
              width: 9px
              height: 1px
              background-color: #afafaf
      .change-box
        margin-bottom: 29px
        .change-btn
          margin-top: 13px
          display: flex
          .btn
            margin-left: 9px
            padding: 8px 15px
            box-sizing: border-box
            font-size: 12px
            text-align: center
            color: #b2b2b2
            border: 1px solid #b2b2b2
            border-radius: 25px
            &.active
              color: #e8655e
              border: 1px solid rgba(233,102,95,1)
              background-color: rgba(233,102,95,0.2)
      .ensure-btn
        padding: 0 12px
        display: flex
        justify-content: space-around
        box-sizing: border-box
        .btn
          width: 130px
          height: 44px
          line-height: 44px
          font-size: 14px
          text-align: center
          color: #e1564f
          border-radius: 25px
          background-color: #fdc5c3
          &.activate
            color: #fff
            background-color: #e1564f
</style>
