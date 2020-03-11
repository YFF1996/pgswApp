<template>
  <div v-if="upyunUrl" class="my-data-wrapper">
    <div class="data-wrapper">
      <ul>
        <li @click="onUpdateAvatarFn()">
          <h3>头像</h3>
          <div class="right">
            <div class="avatar">
              <img v-if="userInfo" :src="userInfo.avatarurl" mode="aspectFill" />
              <img v-else :src="upyunUrl + '/wxXcxImg/images/not-avatar-icon.png'" />
            </div>
            <i class="more-icon">
              <img :src="upyunUrl + '/wxXcxImg/images/more-icon.png'" />
            </i>
          </div>
        </li>
        <li @click="onSetPopupStatusFn(true, 'nickname', oItem.nickname)">
          <h3>用户昵称</h3>
          <div class="right">
            <div v-if="oItem.nickname" class="state active">{{ oItem.nickname }}</div>
            <div v-else class="state">待完善</div>
            <i class="more-icon">
              <img :src="upyunUrl + '/wxXcxImg/images/more-icon.png'" />
            </i>
          </div>
        </li>
        <li @click="onSetPopupStatusFn(true, 'sex', oItem.sex)">
          <h3>性别</h3>
          <div class="right">
            <div v-if="oItem.sex === 0" class="state">待完善</div>
            <div v-if="oItem.sex === 1" class="state active">男</div>
            <div v-if="oItem.sex === 2" class="state active">女</div>
            <i class="more-icon">
              <img :src="upyunUrl + '/wxXcxImg/images/more-icon.png'" />
            </i>
          </div>
        </li>
        <li @click="onSetPopupStatusFn(true, 'user_desc', oItem.user_desc)">
          <h3>介绍</h3>
          <div class="right">
            <div v-if="oItem.user_desc" class="state active">{{ oItem.user_desc }}</div>
            <div v-else class="state">待完善</div>
            <i class="more-icon">
              <img :src="upyunUrl + '/wxXcxImg/images/more-icon.png'" />
            </i>
          </div>
        </li>
      </ul>
      <ul>
        <li>
          <picker mode="date" :value="date" @change="bindDateChange">
            <div class="picker-info">
              <h3>生日</h3>
              <div class="right">
                <div v-if="date" class="state active">{{ date }}</div>
                <div v-else class="state">待完善</div>
                <i class="more-icon">
                  <img :src="upyunUrl + '/wxXcxImg/images/more-icon.png'" />
                </i>
              </div>
            </div>
          </picker>
        </li>
        <li>
          <picker mode="region" :value="region" @change="bindRegionChange">
            <div class="picker-info">
              <h3>地区</h3>
              <div class="right">
                <div v-if="region.length" class="state active">{{ region[0] }} - {{ region[1] }}</div>
                <div v-else class="state">待完善</div>
                <i class="more-icon">
                  <img :src="upyunUrl + '/wxXcxImg/images/more-icon.png'" />
                </i>
              </div>
            </div>
          </picker>
        </li>
        <li @click="onSkipMyAddressFn()">
          <h3>收货地址</h3>
          <div class="right">
            <div class="state active" v-if="AffirmSiteInfo">已填写</div>
            <div class="state" v-else>待完善</div>
            <i class="more-icon">
              <img :src="upyunUrl + '/wxXcxImg/images/more-icon.png'" />
            </i>
          </div>
        </li>
        <li @click="onSkipPageFn('/pages/me/setPayPassword/index')">
          <h3>支付密码</h3>
          <div class="right">
            <div class="state" v-if="isPayPassword === 1">去设置</div>
            <div class="state active" v-else>已设置</div>
            <i class="more-icon">
              <img :src="upyunUrl + '/wxXcxImg/images/more-icon.png'" />
            </i>
          </div>
        </li>
        <li @click="onSkipPageFn('/pages/me/bingPhone/index')">
          <h3>手机号绑定</h3>
          <div class="right">
            <div class="state active" v-if="bingPhoneInfo.status">已绑定</div>
            <div class="state" v-else>去绑定</div>
            <i class="more-icon">
              <img :src="upyunUrl + '/wxXcxImg/images/more-icon.png'" />
            </i>
          </div>
        </li>
        <li>
          <h3>自动播放</h3>
          <div class="right">
            <switch :checked="oItem.auto_play && switchState" @change="onSwitchFn" />
          </div>
        </li>
      </ul>
      <ul>
        <li @click="onSkipPageFn(`/pages/me/myProfession/index?oJson=${encodeURIComponent(JSON.stringify(oItem.profession))}`)">
          <h3>职业</h3>
          <div class="right">
            <div v-if="oItem.profession" class="state active">已填写</div>
            <div v-else class="state">待完善</div>
            <i class="more-icon">
              <img :src="upyunUrl + '/wxXcxImg/images/more-icon.png'" />
            </i>
          </div>
        </li>
        <li @click="onSkipPageFn('/pages/me/myJob/index')">
          <h3>岗位</h3>
          <div class="right">
            <div v-if="selectedJobInfo.status" class="state active">已填写</div>
            <div v-else class="state">待完善</div>
            <i class="more-icon">
              <img :src="upyunUrl + '/wxXcxImg/images/more-icon.png'" />
            </i>
          </div>
        </li>
        <li @click="onSkipPageFn(`/pages/me/salary/index?oJson=${encodeURIComponent(JSON.stringify(oItem.salary))}`)">
          <h3>当前收入</h3>
          <div class="right">
            <div v-if="oItem.salary" class="state active">已填写</div>
            <div v-else class="state">待完善</div>
            <i class="more-icon">
              <img :src="upyunUrl + '/wxXcxImg/images/more-icon.png'" />
            </i>
          </div>
        </li>
        <li @click="onSkipWorkSufferFn(workInfo)">
          <h3>工作经历</h3>
          <div class="right">
            <div v-if="workInfo" class="state active">已填写</div>
            <div v-else class="state">待完善</div>
            <i class="more-icon">
              <img :src="upyunUrl + '/wxXcxImg/images/more-icon.png'" />
            </i>
          </div>
        </li>
        <li @click="onSkipEducationSufferFn(educationInfo)">
          <h3>教育经历</h3>
          <div class="right">
            <div v-if="educationInfo" class="state active">已填写</div>
            <div v-else class="state">待完善</div>
            <i class="more-icon">
              <img :src="upyunUrl + '/wxXcxImg/images/more-icon.png'" />
            </i>
          </div>
        </li>
        <li @click="onSetPopupStatusFn(true, 'plan', oItem.plan)">
          <h3>职业生涯规划</h3>
          <div class="right">
            <div v-if="oItem.plan" class="state active">{{ oItem.plan }}</div>
            <div v-else class="state">待完善</div>
            <i class="more-icon">
              <img :src="upyunUrl + '/wxXcxImg/images/more-icon.png'" />
            </i>
          </div>
        </li>
      </ul>
    </div>
    <data-popup
      @popupStatusChild="onSetPopupStatusFn"
      @saveInfo="onSaveFn"
      :showState="rulePopupStatus"
      :oJson="oInfo"
      :type="oType"
    />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { apiUrl, upyunUrl } from '../../../api/config'
import Upyun from '../../../utils/upyun-wxapp-sdk'
import DataPopup from '../../../components/meDataPopupTemplate'

const upyun = new Upyun({
  bucket: 'pgsw-flow',
  operator: 'ftpuser',
  getSignatureUrl: `${apiUrl}/msg/get_upyun_sign.php`
})

export default {
  data () {
    return {
      upyunUrl,
      isPayPassword: 1,
      oItem: '',
      oInfo: '',
      oType: '',
      date: '',
      region: [],
      switchState: false
    }
  },
  onShow () { this.initializeFn() },
  onPullDownRefresh () { this.getInitializeInfoFn() },
  computed: {
    ...mapState([
      'userInfo',
      'bingPhoneInfo',
      'selectedJobInfo',
      'AffirmSiteInfo',
      'rulePopupStatus',
      'workInfo',
      'educationInfo'
    ])
  },
  methods: {
    ...mapMutations({
      setRulePopupStatus: 'SET_RULE_POPUP_STATUS'
    }),
    ...mapActions([
      'updateAvatar',
      'getSelectedJobInfo',
      'getAddressList',
      'getDefaultAddress',
      'isBindingMobile',
      'isSetPayPassword',
      'isMyDataInfo',
      'getUserInfo',
      'getWorkInfo',
      'getEducationInfo'
    ]),
    initializeFn () {
      this.isBindingMobileFn()
      this.getSelectedJobInfoFn()
      this.getDefaultAddressFn()
      this.isSetPayPasswordFn()
      this.getUserInfoFn()
      this.getWorkInfoFn()
      this.getEducationSufferFn()
    },
    // 获取介绍和昵称等信息
    getUserInfoFn () {
      uni.showLoading({ title: 'Loading' })
      this.getUserInfo().then((res) => {
        this.date = res.birthday
        if (res.address) {
          const addressObj = JSON.parse(res.address)
          this.region.push(addressObj.province)
          this.region.push(addressObj.city)
        } else {
          this.region = []
        }
        if (res.auto_play) {
          res['auto_play'] = JSON.parse(res.auto_play)
          this.switchState = res.auto_play.voice
        }
        this.oItem = res
        uni.hideLoading()
      })
    },
    // 获取是否选择岗位info
    getSelectedJobInfoFn () {
      this.getSelectedJobInfo()
    },
    // 获取默认地址
    getDefaultAddressFn () {
      this.getDefaultAddress().then(() => {
        uni.stopPullDownRefresh()
      })
    },
    // 获取是否绑定手机info
    isBindingMobileFn () {
      this.isBindingMobile()
    },
    // 获取是否设置了支付密码
    isSetPayPasswordFn () {
      this.isSetPayPassword().then((res) => {
        this.isPayPassword = res.is_set
      })
    },
    // 选择生日
    bindDateChange (e) {
      this.date = e.target.value
      this.isMyDataInfoFn('birthday', this.date)
    },
    // 选择地区
    bindRegionChange (e) {
      this.region = e.target.value
      const data = {
        province: this.region[0],
        city: this.region[1],
        area: '',
        detail: ''
      }
      this.isMyDataInfoFn('address', data)
    },
    // 打开介绍等信息弹窗
    onSetPopupStatusFn (state, type, cntVal) {
      this.setRulePopupStatus(state)
      this.oType = type
      this.oInfo = cntVal
    },
    // 获取工作经历
    getWorkInfoFn () {
      this.getWorkInfo({ that: this })
    },
    // 获取教育经历
    getEducationSufferFn () {
      this.getEducationInfo({ that: this })
    },
    // 上传头像
    onUpdateAvatarFn () {
      const _this = this
      uni.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success (res) {
          _this.showToastIconFn()
          _this.upyunUploadFn(res.tempFilePaths[0])
        }
      })
    },
    // 通过又拍云转网络图片url
    upyunUploadFn (localPath) {
      const _this = this
      upyun.upload({
        localPath,
        remotePath: '/Pic-x/{year}-{mon}-{day}/{filemd5}{.suffix}',
        success (res) {
          const oJson = JSON.parse(res.data)
          _this.updateAvatar({ that: _this, url: upyunUrl + oJson.url }).then((res) => {
            if (res.ret === 1) {
              _this.userInfo['avatarurl'] = upyunUrl + oJson.url
              _this.showToastFn('上传成功')
            } else {
              _this.showToastFn('上传失败!')
            }
          })
        }
      })
    },
    onSaveFn (state, type, textVal) {
      this.setRulePopupStatus(state)
      this.isMyDataInfoFn(type, textVal)
    },
    // 保存介绍和昵称等信息
    isMyDataInfoFn (type, textVal) {
      const data = {
        field: type,
        infoVal: textVal
      }
      this.isMyDataInfo(data)
      switch (type) {
        case 'address':
          this.region.push(textVal.province)
          this.region.push(textVal.city)
          break
        case 'birthday':
          this.date = textVal
          break
        case 'nickname':
          this.oItem['nickname'] = textVal
          break
        case 'sex':
          this.oItem['sex'] = textVal
          break
        case 'user_desc':
          this.oItem['user_desc'] = textVal
          break
        case 'plan':
          this.oItem['plan'] = textVal
          break
        default:
          return false
      }
    },
    onSkipPageFn (url) {
      uni.navigateTo({
        url
      })
    },
    // 设置是否自动播放音频
    onSwitchFn (e) {
      const _this = this
      const state = e.mp.detail.value
      let data = {
        voice: 0,
        video: 0
      }
      data['voice'] = state
      this.switchState = state
      this.oItem['auto_play'] = data
      if (!state) {
        uni.showModal({
          content: '你确定关闭自动播放功能!',
          confirmColor: '#e1564f',
          success (res) {
            if (res.confirm) {
              _this.isMyDataInfoFn('auto_play', data)
            } else {
              _this.switchState = true
            }
          }
        })
      } else {
        this.isMyDataInfoFn('auto_play', data)
      }
    },
    // 跳转收货地址
    onSkipMyAddressFn () {
      uni.navigateTo({
        url: `/pages/me/myAddress/index?isAddressBack=${false}`
      })
    },
    // 跳转工作经历
    onSkipWorkSufferFn (data = '') {
      uni.navigateTo({
        url: `/pages/me/workSuffer/index?data=${JSON.stringify(data)}`
      })
    },
    // 跳转教育经历
    onSkipEducationSufferFn (data = '') {
      uni.navigateTo({
        url: `/pages/me/educationSuffer/index?data=${JSON.stringify(data)}`
      })
    },
    showToastIconFn () {
      uni.showToast({
        icon: 'loading',
        duration: 2000
      })
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
    this.setRulePopupStatus(false)
  },
  components: {
    DataPopup
  }
}
</script>

<style lang="stylus" scoped>
  .my-data-wrapper
    position: absolute
    left: 0
    top: 0
    right: 0
    bottom: 0
    width: 100%
    height: 100%
    background-color: #f8f8f8
    .data-wrapper
      width: 100%
      height: auto
      ul
        width: 100%
        height: auto
        margin-top: 10px
        background-color: #fff
        li
          position: relative
          width: 100%
          height: 55px
          padding: 19px 20px 19px 15px
          border-bottom: 1px solid #f5f5f5
          display: flex
          align-items: center
          justify-content: space-between
          box-sizing: border-box
          h3
            line-height: 16px
            font-size: 16px
            color: #333
          .right
            flex: 1
            display: flex
            align-items: center
            justify-content: flex-end
            .avatar
              margin-right: 13px
              width: 43px
              height: 43px
              border-radius: 50%
              img
                width: 100%
                height: 100%
                border-radius: 50%
            .state
              padding-right: 13px
              width: 200px
              text-align: right
              color: #959595
              display: -webkit-box
              -webkit-box-orient: vertical
              -webkit-line-clamp: 1
              overflow: hidden
              &.active
                color: #333
            .more-icon
              width: 7px
              height: 13px
              img
                display: block
                width: 100%
                height: 100%
          picker
            width: 100%
            .picker-info
              display: flex
              align-items: center
              justify-content: space-between
          button
            position: absolute
            left: 0
            top: 0
            width: 100%
            height: 100%
            opacity: 0
        li:last-child
          border: none
</style>
