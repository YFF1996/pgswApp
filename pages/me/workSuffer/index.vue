<template>
  <div v-if="upyunUrl" class="bound-wrapper">
    <ul>
      <li>
        <h3>公司名称</h3>
        <div class="right">
          <input v-model="companyVal" type="text" placeholder="请填写" />
        </div>
      </li>
      <li>
        <h3>职位</h3>
        <div class="right">
          <input v-model="officeVal" type="text" placeholder="请填写" />
        </div>
      </li>
      <li>
        <h3>职位状态</h3>
        <div class="right">
          <input v-model="postVal" type="text" placeholder="请填写" />
        </div>
      </li>
      <li>
        <h3>开始时间</h3>
        <div class="right">
          <picker mode="date" :value="dateStart" :end="dateEnd" @change="bindDateChange">
            <div class="picker active" v-if="dateStart">{{ dateStart }}</div>
            <div class="picker" v-else>请选择</div>
          </picker>
        </div>
      </li>
      <li>
        <h3>结束时间</h3>
        <div class="right">
          <picker mode="date" :value="dateEnd" :start="dateStart" @change="bindDateEndChange">
            <div class="picker active" v-if="dateEnd">{{ dateEnd }}</div>
            <div class="picker" v-else>请选择</div>
          </picker>
        </div>
      </li>
    </ul>
    <div class="btn-box">
      <div class="btn" @click="onEmptyFn()">清空</div>
      <div class="btn" @click="onSaveFn()">保存</div>
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
      oJson: '',
      companyVal: '',
      officeVal: '',
      postVal: '',
      initialStatus: false,
      dateStart: '',
      dateEnd: ''
    }
  },
  onLoad (options) {
    const data = JSON.parse(options.data)
    this.oJson = data
    this.initialStatus = false
    this.companyVal = data.company
    this.officeVal = data.office
    this.postVal = data.word_des
    this.dateStart = data.start_time
    this.dateEnd = data.end_time
  },
  onShow () {
    if (!this.oJson) this.onEmptyFn()
  },
  computed: {
    ...mapState([
      'userInfo'
    ])
  },
  methods: {
    ...mapActions([
      'isWorkInfo'
    ]),
    // 选择开始日期
    bindDateChange (e) {
      this.dateStart = e.target.value
    },
    // 选择结束日期
    bindDateEndChange (e) {
      this.dateEnd = e.target.value
    },
    // 清空数据
    onEmptyFn () {
      this.companyVal = ''
      this.officeVal = ''
      this.postVal = ''
      this.dateStart = ''
      this.dateEnd = ''
    },
    // 保存工作经历
    onSaveFn () {
      if (this.initialStatus) return false
      const companyVal = this.companyVal
      const officeVal = this.officeVal
      const postVal = this.postVal
      const dateStart = this.dateStart
      const dateEnd = this.dateEnd
      const data = {
        that: this,
        companyVal,
        officeVal,
        postVal,
        dateStart,
        dateEnd
      }
      if (!companyVal) {
        this.showToastFn('公司名称不能为空!')
        return false
      }
      if (!officeVal) {
        this.showToastFn('职位不能为空!')
        return false
      }
      if (!postVal) {
        this.showToastFn('职位状态不能为空!')
        return false
      }
      if (!dateStart) {
        this.showToastFn('请选择开始时间!')
        return false
      }
      if (!dateEnd) {
        this.showToastFn('请选择结束时间!')
        return false
      }
      uni.showLoading({ title: 'Loading' })
      this.initialStatus = true
      this.isWorkInfo(data).then(() => {
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
    showToastFn (title) {
      uni.showToast({
        title,
        icon: 'none',
        duration: 1500
      })
    }
  },
  onUnload () {
    this.onEmptyFn()
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
      display: flex
      align-items: center
      justify-content: space-around
      .btn
        width: 150px
        height: 45px
        line-height: 45px
        font-size: 16px
        text-align: center
        color: #fff
        border-radius: 25px
        background-color: #ff4040
</style>
