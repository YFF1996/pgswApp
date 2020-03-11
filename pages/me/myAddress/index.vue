<template>
  <div v-if="upyunUrl" class="address-wrapper">
    <ul v-if="addressList.length">
      <li
        v-for="(item, index) in addressList"
        @click="onSelectAddressFn(item, index)"
        :key="index"
      >
        <i class="select-btn">
          <img v-if="item.is_default === '1'" :src="upyunUrl + '/wxXcxImg/images/select-icon-active.png'" />
          <img v-else :src="upyunUrl + '/wxXcxImg/images/select-icon.png'" />
        </i>
        <div class="address-info">
          <h3>{{ item.receiver }}</h3>
          <div class="phone">{{ item.mobile }}</div>
          <div class="site">{{ item.province }} - {{ item.city }} - {{ item.area }} - {{ item.address }}</div>
        </div>
        <div class="handle-box">
          <div class="edit-btn handle" @click.stop="onSkipPageFn(item)">
            <img :src="upyunUrl + '/wxXcxImg/images/edit-icon.png'" />
          </div>
          <div
            @click.stop="onDeleteFn(item.id, index)"
            class="del-btn handle"
          >
            <img :src="upyunUrl + '/wxXcxImg/images/remove-icon.png'" />
          </div>
        </div>
      </li>
      <!-- 上拉加载更多loading -->
      <loading-more :lists="addressList" :listsLength="10" />
    </ul>
    <div v-else class="perfect-box" @click="onSkipPageFn()">
      <i class="avatar">
        <img :src="upyunUrl + '/wxXcxImg/images/add-icon.png'" />
      </i>
      <h4>完善收货信息</h4>
    </div>
    <div class="btn-box" v-if="addressList.length">
      <div class="change-btn" @click="onSkipPageFn()">添加地址</div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import LoadingMore from '../../../components/loadingMoreTemplate'
import { upyunUrl } from '../../../api/config'

export default {
  data () {
    return {
      upyunUrl,
      isAddressBack: false,
      page: 1
    }
  },
  onLoad (options) {
    this.isAddressBack = options.isAddressBack
  },
  onShow () {
    this.getAddressListFn(true)
  },
  // 下拉刷新
  onPullDownRefresh () {
    this.page = 1
    this.getAddressListFn(true)
  },
  // 上拉加载
  onReachBottom () {
    this.page += 1
    this.getAddressListFn(false)
  },
  computed: {
    ...mapState([
      'userInfo',
      'addressList'
    ])
  },
  methods: {
    ...mapMutations({
      setAffirmSiteInfo: 'SET_AFFIRM_SITE_INFO',
      setAddressList: 'SET_ADDRESS_LIST'
    }),
    ...mapActions([
      'getAddressList',
      'selectAddress',
      'deletedAddressInfo'
    ]),
    // 获取地址列表
    getAddressListFn (isLoading) {
      let data = {
        that: this,
        page: this.page
      }
      if (isLoading) {
        this.page = 1
        this.setAddressList([])
      }
      uni.showNavigationBarLoading()
      this.getAddressList(data).then(() => {
        if (isLoading) uni.hideLoading()
        uni.hideNavigationBarLoading()
        uni.stopPullDownRefresh()
      })
    },
    // 删除地址列表
    onDeleteFn (id, index) {
      const that = this
      let data = {
        that: this,
        id
      }
      uni.showModal({
        content: '确定移除地址?',
        confirmColor: '#ff4040',
        success (res) {
          if (res.confirm) {
            that.deletedAddressInfo(data).then((res) => {
              if (res.ret === 1) {
                that.addressList.splice(index, 1)
                that.showToastFn('删除成功!')
              } else {
                that.showToastFn('删除失败!')
              }
            })
          }
        }
      })
    },
    // 选择地址
    onSelectAddressFn (item) {
      const that = this
      if (this.isAddressBack === 'true') {
        this.setAffirmSiteInfo(item)
        uni.showModal({
          content: '是否设置成默认地址?',
          cancelText: '否',
          confirmText: '是',
          confirmColor: '#e1564f',
          success (res) {
            if (res.confirm) that.onSetDefaultAddressFn(item.id)
            uni.navigateBack()
          }
        })
      } else {
        this.onSetDefaultAddressFn(item.id)
      }
    },
    // 设置默认地址
    onSetDefaultAddressFn (id) {
      this.selectAddress({ that: this, id }).then(() => {
        this.addressList.forEach((item) => {
          if (id === item.id) {
            item.is_default = '1'
            if (this.isAddressBack === 'false') this.showToastFn('设置为默认地址')
          } else {
            item.is_default = '0'
          }
        })
      })
    },
    // 编辑地址
    onSkipPageFn (data = '') {
      uni.navigateTo({
        url: `/pages/me/myAddress/addressDetails/index?data=${JSON.stringify(data)}`
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
  components: {
    LoadingMore
  }
}
</script>

<style lang="stylus" scoped>
  .address-wrapper
    position: absolute
    top: 0
    left: 0
    bottom: 0
    right: 0
    width: 100%
    height: auto
    background: #f8f8f8
    padding: 10px 0 75px 0
    box-sizing: border-box
    ul
      width: 100%
      height: auto
      li
        position: relative
        margin-bottom: 10px
        padding: 22px 15px 28px 10px
        box-sizing: border-box
        display: flex
        align-items: center
        background-color: #fff
        .select-btn
          padding: 8px
          box-sizing: border-box
          img
            display: block
            width: 25px
            height: 25px
        .address-info
          padding-left: 4px
          color: #4d4d4d
          flex: 1
          h3
            font-size: 16px
            line-height: 16px
          .phone
            margin: 9px  0
            font-size: 13px
            line-height: 13px
          .site
            padding-right: 35px
            font-size: 12px
            line-height: 20px
            display: -webkit-box
            -webkit-box-orient: vertical
            -webkit-line-clamp: 2
            overflow: hidden
        .handle-box
          position: absolute
          top: 12px
          right: 10px
          margin: 0 auto
          .handle
            padding: 8px
            box-sizing: border-box
            &.edit-btn
              margin-bottom: 19px
              img
                display: block
                width: 17px
                height: 16px
            &.del-btn
              img
                display: block
                width: 13px
                height: 16px
    .perfect-box
      width: 100%
      height: auto
      padding: 40px 0 55px
      display: flex
      align-items: center
      justify-content: center
      background-color: #fff
      box-sizing: border-box
      .avatar
        width: 26px
        height: 26px
        img
          width: 100%
          height: 100%
      h4
        padding-left: 18px
        font-size: 14px
        line-height: 14px
        color: #333
    .btn-box
      position: fixed
      left: 0
      bottom: 0
      width: 100%
      height: auto
      padding: 15px
      box-sizing: border-box
      background-color: #fff
      box-shadow: 0 3px 12px rgba(89,100,118,0.2)
      .change-btn
        width: 100%
        height: 45px
        line-height: 45px
        font-size: 16px
        text-align: center
        color: #fff
        border-radius: 25px
        background-color: #ff4040
</style>
