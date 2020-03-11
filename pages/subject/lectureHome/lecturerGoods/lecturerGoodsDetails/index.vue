<template>
  <div v-if="upyunUrl && obj" class="lecturer-goods-details">
    <div class="banner">
      <div class="share-btn">
        <button open-type='share'/>
        <img :src="upyunUrl + '/wxXcxImg/images/share-goods-icon.png'">
      </div>
      <img mode="aspectFill" :src="obj.cover" />
    </div>
    <div class="goods-info">
      <div class="price">¥<p>{{ obj.price }}</p></div>
      <div class="title">{{ obj.name }}</div>
    </div>
    <div class="goods-details editor-box">
      <h3>商品详情</h3>
      <parse v-if="obj.content" :html="obj.content" />
    </div>
    <div class="bottom-wrapper">
      <ul>
        <li
          v-if="obj.url"
          @click="onCopyTextFn(obj.url, true)"
          class="active"
        >复制链接</li>
        <li
          v-if="obj.key"
          @click="onCopyTextFn(obj.key, false)"
        >淘口令</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Parse from '../../../../../components/jyf-parser/jyf-parser'
import { upyunUrl } from '../../../../../api/config'

export default {
  data () {
    return {
      upyunUrl,
      oJson: '',
      obj: ''
    }
  },
  onLoad (options) {
    this.oJson = JSON.parse(decodeURIComponent(options.oJson))
    this.getAuthorWindowGoodsDetailsFn()
  },
  methods: {
    ...mapActions([
      'getAuthorWindowGoodsDetails'
    ]),
    // 获取商品详情
    getAuthorWindowGoodsDetailsFn () {
      uni.showLoading({ title: 'Loading' })
      this.getAuthorWindowGoodsDetails({ that: this, id: this.oJson.id }).then((res) => {
        this.obj = res
        uni.hideLoading()
      })
    },
    // 复制文本
    onCopyTextFn (url, state) {
      const content = state ? '：(复制链接后在浏览器打开)' : ''
      uni.setClipboardData({
        data: url,
        success () {
          uni.hideToast()
        }
      })
      uni.showModal({
        content: url + content,
        confirmColor: '#e1564f',
        confirmText: '复制'
      })
    }
  },
  onUnload () {
    this.obj = ''
  },
  components: {
    Parse
  }
}
</script>

<style lang="stylus" scoped>
  .lecturer-goods-details
    width: 100%
    height: auto
    padding-bottom: 55px
    background-color: #f8f8f8
    .banner
      position: relative
      width: 100%
      height: 340px
      background-color: #ccc
      img
        width: 100%
        height: 100%
      .share-btn
        position: fixed
        right: 15px
        top: 15px
        width: 28px
        height: 28px
        border-radius: 50%
        display: flex
        justify-content: center
        align-items: center
        background-color: rgba(0, 0, 0, 0.5)
        img
          display: block
          width: 14px
          height: 14px
        button
          position: absolute
          left: 0
          top: 0
          width: 100%
          height: 100%
          opacity: 0
    .goods-info
      width: 100%
      height: auto
      padding: 5px 15px 10px 15px
      background-color: #fff
      box-sizing: border-box
      .price
        font-size: 15px
        line-height: 40px
        display: flex
        color: #F94B49
        p
          font-size: 20px
      .title
        font-size: 16px
        line-height: 22px
        color: #333
    .goods-details
      width: 100%
      height: auto
      margin-top: 15px
      background-color: #fff
      h3
        padding: 0 15px
        font-size: 15px
        line-height: 45px
        font-weight: bold
        color: #333
        box-sizing: border-box
    .bottom-wrapper
      position: fixed
      left: 0
      bottom: 0
      width: 100%
      height: auto
      padding: 7px 15px
      z-index: 999
      background-color: #fff
      box-sizing: border-box
      ul
        width: 100%
        height: auto
        border-radius: 20px
        display: flex
        overflow: hidden
        li
          flex: 1
          text-align: center
          line-height: 40px
          font-size: 15px
          color: #fff
          background-color: #F94B49
        li.active
          background-color: #FF9148
</style>
