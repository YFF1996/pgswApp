<template>
  <div v-if="upyunUrl && oJson" class="income-wrapper">
    <div class="cash-box">
      <div class="cash-info">
        <div class="title">账户金额 (元)</div>
        <h3 class="num">
          <span>￥</span>{{ oJson.balance || 0.00 }}
        </h3>
        <div class="rule-box" @click="onSetPopupStatusFn(true)">
          <i>
            <img :src="upyunUrl + '/wxXcxImg/images/reason-icon.png'" />
          </i>
          <span>提现须知</span>
        </div>
      </div>
      <div class="cash-handle">
        <h4>提现到微信</h4>
        <div class="input-box">
          <span>￥</span>
          <input v-model="cash" type="digit" placeholder="请输入提现金额" placeholder-style="color: #ccc;font-size: 17px;" />
        </div>
        <div class="hint">满{{ oJson.user_withdrawal_mini }}元才可提现</div>
      </div>
      <div v-if="cash" class="apply-btn" @click="onApplyFn()">申请提现</div>
      <div v-else class="apply-btn no-apply">申请提现</div>
    </div>
    <div class="list-wrapper">
      <div class="nav-wrapper">
        <ul>
          <li :class="{ 'active' : currentIndex === 1 }" @click="onSelectItemFn(1)">收入明细</li>
          <li :class="{ 'active' : currentIndex === 2 }" @click="onSelectItemFn(2)">支出明细</li>
          <li :class="{ 'active' : currentIndex === 3 }" @click="onSelectItemFn(3)">提现记录</li>
        </ul>
      </div>
      <income-list v-if="currentIndex !== 3" :list="consumeList" />
      <extract-list v-if="currentIndex === 3" :list="extractCashList" />
      <loading-more :lists="currentIndex === 3 ? extractCashList : consumeList" :listsLength="16" />
    </div>
    <!--规则弹窗-->
    <rule-popup @popupStatusChild="onSetPopupStatusFn" :showState="rulePopupStatus" :oRule="oItem" />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { upyunUrl } from '../../../api/config'
import IncomeList from '../../../components/incomeListTemplate'
import extractList from '../../../components/extractListTemplate'
import RulePopup from '../../../components/rulePopupTemplate'
import LoadingMore from '../../../components/loadingMoreTemplate'

export default {
  data () {
    return {
      upyunUrl,
      oJson: '',
      oItem: '',
      page: 1,
      cash: null,
      currentIndex: 1
    }
  },
  onLoad () {
    this.page = 1
    this.currentIndex = 1
    this.onLoadListFn()
    this.getUserAccountInfoFn()
  },
  computed: {
    ...mapState([
      'userInfo',
      'consumeList',
      'extractCashList',
      'rulePopupStatus'
    ])
  },
  // 下拉刷新
  onPullDownRefresh () {
    this.onLoadListFn()
    this.getUserAccountInfoFn()
  },
  // 上拉加载
  onReachBottom () {
    this.page += 1
    if (this.currentIndex === 1 && this.consumeList.length) {
      this.getConsumeListFn(false)
    } else if (this.currentIndex === 2 && this.consumeList.length) {
      this.getConsumeListFn(false)
    } else if (this.currentIndex === 3 && this.extractCashList.length) {
      this.getExtractCashListFn(false)
    }
  },
  methods: {
    ...mapMutations({
      setConsumeList: 'SET_CONSUME_LIST',
      setExtractCashList: 'SET_EXTRACT_CASH_LIST',
      setRulePopupStatus: 'SET_RULE_POPUP_STATUS'
    }),
    ...mapActions([
      'getUserAccountInfo',
      'getConsumeList',
      'getExtractCashList',
      'carryCash',
      'getRuleInfo'
    ]),
    // 获取金额
    getUserAccountInfoFn () {
      this.getUserAccountInfo({ that: this }).then((res) => {
        this.oJson = res
      })
    },
    // 提现
    onApplyFn () {
      const data = {
        that: this,
        amount: this.cash
      }
      uni.showLoading({ title: 'Loading' })
      this.carryCash(data).then(() => {
        this.cash = null
        this.getUserAccountInfoFn()
      })
    },
    // 规则弹窗
    onSetPopupStatusFn (state) {
      this.setRulePopupStatus(state)
      this.getRuleInfo({ that: this }).then((res) => {
        this.oItem = res.tx_rule
      })
    },
    // 跳转页面
    onSkipPageFn (url) {
      uni.navigateTo({
        url
      })
    },
    // 选择类型
    onSelectItemFn (index) {
      this.currentIndex = index
      this.onLoadListFn()
    },
    // 获取收入支出明细列表
    getConsumeListFn (loadingStatus) {
      const data = {
        that: this,
        type: this.currentIndex,
        page: this.page
      }
      if (loadingStatus) {
        uni.showLoading({ title: 'Loading' })
        this.setConsumeList([])
      }
      uni.showNavigationBarLoading()
      this.getConsumeList(data).then(() => {
        if (loadingStatus) uni.hideLoading()
        uni.stopPullDownRefresh()
        uni.hideNavigationBarLoading()
      })
    },
    // 获取提现记录列表
    getExtractCashListFn (loadingStatus) {
      const data = {
        that: this,
        page: this.page
      }
      if (loadingStatus) {
        uni.showLoading({ title: 'Loading' })
        this.setExtractCashList([])
      }
      uni.showNavigationBarLoading()
      this.getExtractCashList(data).then(() => {
        if (loadingStatus) uni.hideLoading()
        uni.stopPullDownRefresh()
        uni.hideNavigationBarLoading()
      })
    },
    // 加载list数据
    onLoadListFn () {
      this.page = 1
      switch (this.currentIndex) {
        case 1:
          this.getConsumeListFn(true)
          break
        case 2:
          this.getConsumeListFn(true)
          break
        case 3:
          this.getExtractCashListFn(true)
          break
        default:
          return false
      }
    }
  },
  components: {
    IncomeList,
    extractList,
    RulePopup,
    LoadingMore
  }
}
</script>

<style lang="stylus" scoped>
  .income-wrapper
    width: 100%
    height: auto
    background-color: #f8f8f8
    .cash-box
      padding: 20px 15px 15px
      margin-bottom: 15px
      box-sizing: border-box
      background-color: #fff
      .cash-info
        position: relative
        .title
          margin-bottom: 3px
          font-size: 12px
          color: #999
        h3
          font-size: 24px
          color: #ff4040
          span
            padding-right: 5px
            font-size: 15px
        .rule-box
          position: absolute
          top: 0
          right: 0
          display: flex
          align-items: center
          padding: 5px
          box-sizing: border-box
          font-size: 12px
          color: #999
          span
            padding-left: 6px
          i
            width: 15px
            height: 15px
            img
              display: block
              width: 100%
              height: 100%
      .cash-handle
        margin: 30px 0 24px
        h4
          margin-bottom: 14px
          font-size: 13px
          color: #333
        .input-box
          display: flex
          align-items: center
          padding-bottom: 7px
          border-bottom: 1px solid #eee
          span
            padding-right: 12px
            font-size: 17px
            color: #333
        .hint
          margin-top: 6px
          font-size: 12px
          color: #999
      .apply-btn
        width: 100%
        height: 44px
        line-height: 44px
        font-size: 15px
        text-align: center
        color: #fff
        background-color: #ff4040
        border-radius: 4px
        &.no-apply
          background-color: #cacaca
    .list-wrapper
      width: 100%
      height: auto
      background-color: #fff
      .nav-wrapper
        width: 100%
        height: auto
        ul
          width: 100%
          height: auto
          display: flex
          align-items: center
          justify-content: space-around
          border-bottom: 1px solid #f5f5f5
          li
            padding: 15px 0
            font-size: 13px
            text-align: center
            color: #999
            &.active
              font-size: 15px
              font-weight: bold
              color: #000
              border-bottom: 2px solid #ff4040
</style>
