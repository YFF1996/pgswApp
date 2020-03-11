<template>
  <div class="bound-wrapper" v-if="upyunUrl">
    <ul>
      <li>
        <h3>薪资</h3>
        <div class="right">
          <input v-model="textVal" type="text" placeholder="请填写" />
        </div>
      </li>
    </ul>
    <div class="btn-box">
      <div class="btn" @click="onSaveFn()">确定</div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { upyunUrl } from '../../../api/config'

export default {
  data () {
    return {
      upyunUrl,
      textVal: '',
      oJson: '',
      initialStatus: false
    }
  },
  onLoad (options) {
    this.oJson = JSON.parse(decodeURIComponent(options.oJson))
    this.textVal = this.oJson
    this.initialStatus = false
  },
  onShow () {
    if (!this.oJson) this.emptyDataFn()
  },
  computed: {
    ...mapState([
      'userInfo'
    ])
  },
  methods: {
    ...mapActions([
      'isMyDataInfo'
    ]),
    // 保存
    onSaveFn () {
      if (this.initialStatus) return false
      const data = {
        that: this,
        field: 'salary',
        infoVal: this.textVal
      }
      if (!this.textVal) {
        this.showToastFn('薪资不能为空!')
        return false
      }
      uni.showLoading({ title: 'Loading' })
      this.initialStatus = true
      this.isMyDataInfo(data).then(() => {
        if (this.oJson) {
          this.showToastFn('修改成功')
        } else {
          this.showToastFn('添加成功')
        }
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
        uni.hideLoading()
      })
    },
    // 清空数据
    emptyDataFn () {
      this.textVal = ''
    },
    showToastFn (title) {
      uni.showToast({
        title,
        icon: 'none',
        duration: 1500
      })
    }
  },
  watch: {
    oJson (str) {
      if (str) {
        this.textVal = str
      } else {
        this.emptyDataFn()
      }
    }
  },
  onUnload () {
    this.emptyDataFn()
  }
}
</script>

<style lang="stylus" scoped>
  .bound-wrapper
    position: fixed
    left: 0
    top: 0
    right: 0
    bottom: 0
    width: 100%
    height: auto
    background-color: #f8f8f8
    ul
      margin: 7px 0 40px
      li
        width: 100%
        height: 70px
        padding: 0 15px
        margin-bottom: 1px
        display: flex
        box-sizing: border-box
        background-color: #fff
        h3
          width: 64px
          height: 100%
          padding-right: 28px
          line-height: 70px
          font-size: 16px
          color: #333
        .right
          flex: 1
          display: flex
          align-items: center
          input
            flex: 1
            height: 100%
            padding-right: 5px
            font-size: 14px
            text-align: right
            color: #333
          .select-box
            display: flex
            align-items: center
            flex-direction: column
            .select
              width: 25px
              height: 25px
              display: flex
              align-items: center
              justify-content: center
              border: 1px solid #eee
              border-radius: 50%
              &.active
                border: 1px solid #ff4040
              .circle
                width: 15px
                height: 15px
                background: #ff4040
                border-radius: 50%
    .btn-box
      padding: 0 15px
      box-sizing: border-box
      .btn
        width: 100%
        height: 50px
        line-height: 50px
        font-size: 16px
        text-align: center
        color: #fff
        border-radius: 25px
        background-color: #ff4040
</style>
