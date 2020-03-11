<template>
  <div class="bound-wrapper">
    <ul>
      <li>
        <h3>收货人</h3>
        <div class="right">
          <input placeholder-class="picker" type="text" v-model="goodsVal" placeholder="请填写" />
        </div>
      </li>
      <li>
        <h3>手机号</h3>
        <div class="right">
          <input placeholder-class="picker" type="number" v-model="telVal" placeholder="请填写" />
        </div>
      </li>
      <li>
        <h3>所在地区</h3>
        <div class="right">
          <picker mode="region" :value="regionLists" @change="bindRegionChange">
            <div class="picker active" v-if="regionLists.length">{{regionLists[0]}} - {{regionLists[1]}} - {{regionLists[2]}}</div>
            <div class="picker" v-else>选择地区</div>
          </picker>
        </div>
      </li>
      <li>
        <h3>详细地址</h3>
        <div class="right">
          <input placeholder-class="picker" type="text" v-model="siteVal" placeholder="请填写，精确到门牌号" />
        </div>
      </li>
    </ul>
    <div class="btn-box">
      <div class="btn del-btn" @click="onEmptyFn()">清空</div>
      <div class="btn" @click="onSaveFn()">保存</div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data () {
    return {
      oJson: '',
      goodsVal: '',
      telVal: '',
      regionLists: [],
      siteVal: '',
      initialStatus: false
    }
  },
  onLoad (options) {
    const data = JSON.parse(options.data)
    this.oJson = data
    this.initialStatus = false
    this.goodsVal = data.receiver
    this.telVal = data.mobile
    this.regionLists.push(data.province)
    this.regionLists.push(data.city)
    this.regionLists.push(data.area)
    this.siteVal = data.address
  },
  onShow () {
    if (!this.oJson) this.onEmptyFn()
  },
  computed: {
    ...mapState([
      'userInfo',
      'AffirmSiteInfo'
    ])
  },
  methods: {
    ...mapActions([
      'addUpdateAddress',
      'selectAddress'
    ]),
    // 选择地区
    bindRegionChange (e) {
      this.regionLists = e.target.value
    },
    // 清空数据
    onEmptyFn () {
      this.goodsVal = ''
      this.telVal = ''
      this.siteVal = ''
      this.regionLists = []
    },
    // 保存地址
    onSaveFn () {
      if (this.initialStatus) return false
      const myreg = /^1\d{10}$/
      const goodsVal = this.goodsVal
      const telVal = this.telVal
      const regionLists = this.regionLists
      const siteVal = this.siteVal
      const data = {
        that: this,
        goodsVal,
        telVal,
        regionLists,
        siteVal,
        id: this.oJson.id || ''
      }
      if (!goodsVal) {
        this.showToastFn('收货人不能为空!')
        return false
      }
      if (!myreg.test(telVal)) {
        this.showToastFn('手机号格式不正确!')
        return false
      }
      if (!regionLists.length) {
        this.showToastFn('请选择地区!')
        return false
      }
      if (!siteVal) {
        this.showToastFn('详细地址不能为空!')
        return false
      }
      uni.showLoading({ title: 'Loading' })
      this.initialStatus = true
      this.addUpdateAddress(data).then((res) => {
        if (res.ret === 1) {
          if (this.oJson) {
            this.showToastFn('修改成功')
          } else {
            if (!this.AffirmSiteInfo) this.selectAddress({ that: this, id: res.data.id })
            this.showToastFn('添加成功')
          }
          setTimeout(() => {
            uni.navigateBack()
          }, 1500)
        } else {
          this.showToastFn(res.message)
        }
      })
    },
    showToastFn (title) {
      uni.showToast({
        title,
        icon: 'none',
        duration: 1500
      })
    }
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
      margin: 7px 0 50px
      li
        padding: 0 15px
        margin-bottom: 1px
        height: 62px
        line-height: 62px
        display: flex
        align-items: center
        justify-content: space-between
        box-sizing: border-box
        background-color: #fff
        h3
          width: 64px
          font-size: 16px
          color: #333
        .right
          flex: 1
          height: 100%
          font-size: 14px
          text-align: right
          input
            height: 100%
            font-size: 14px
            color: #333
          .picker
            color: #959595
          .active
            color: #333
    .btn-box
      padding: 0 15px
      display: flex
      justify-content: center
      .btn
        width: 150px
        height: 45px
        line-height: 45px
        font-size: 16px
        text-align: center
        color: #fff
        border-radius: 25px
        background-color: #ff4040
        &.del-btn
          margin-right: 35px
</style>
