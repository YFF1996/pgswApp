<template>
  <div v-if="upyunUrl" class="apply-wrapper">
    <scroll-view
      :scroll-y="true"
      class="scroll-view"
    >
      <img class="banner" :src="upyunUrl + '/wxXcxImg/images/apply-top-bg.png'" />
      <div class="apply-content">
        <div class="list-box">
          <h2>
            <img :src="upyunUrl + '/wxXcxImg/images/teacher-title-icon01.png'" />
          </h2>
          <ul>
            <li v-for="(item, index) in rights" :key="index">
              <i class="list-icon">
                <img :src="item.icon" />
              </i>
              <div class="info">
                <h3>{{ item.title }}</h3>
                <div class="text">{{ item.text }}</div>
              </div>
            </li>
          </ul>
        </div>
        <div class="list-box">
          <h2>
            <img :src="upyunUrl + '/wxXcxImg/images/teacher-title-icon02.png'" />
          </h2>
          <ul>
            <li v-for="(objs, num) in lists" :key="num">
              <i class="list-icon">
                <img :src="objs.icon" />
              </i>
              <div class="info">
                <h3>{{ objs.title }}</h3>
                <div class="text">{{ objs.text }}</div>
              </div>
            </li>
          </ul>
        </div>
        <div class="contact">
          <h2>联系客服 马上入驻</h2>
          <div class="avatar">
            <img @click="onSaveFn" :src="upyunUrl + '/wxXcxImg/images/kefu-qr-icon.png'" />
          </div>
          <div class="hint">
            点击保存图片后扫描识别或加入微信号
            <span>pinggaisiwei666</span>
          </div>
        </div>
      </div>
    </scroll-view>
  </div>
</template>
<script>
import { upyunUrl } from '../../../api/config'

export default {
  data () {
    return {
      upyunUrl,
      rights: [
        {
          icon: upyunUrl + '/wxXcxImg/images/teacher-icon01.png',
          title: '流量扶持',
          text: '平台高质量活跃粉丝和多渠道自媒体推广，实现内容最大曝光'
        },
        {
          icon: upyunUrl + '/wxXcxImg/images/teacher-icon02.png',
          title: '内容创作支持',
          text: '共同打造优质内容，提供专业建议'
        },
        {
          icon: upyunUrl + '/wxXcxImg/images/teacher-icon03.png',
          title: '多方面收益来源',
          text: '广告分成、平台高质量内容补贴等，实现多方面收益'
        },
        {
          icon: upyunUrl + '/wxXcxImg/images/teacher-icon04.png',
          title: '多种增值服务',
          text: '全网课程数据分析、付费咨询、广告服务等更容易多重扶持及资源倾斜'
        }
      ],
      lists: [
        {
          icon: upyunUrl + '/wxXcxImg/images/teacher-icon05.png',
          title: '独家身份标识',
          text: '享有讲师身份头衔标识，彰显身份'
        },
        {
          icon: upyunUrl + '/wxXcxImg/images/teacher-icon06.png',
          title: '内容优先推荐',
          text: '高质量内容精准推荐，多渠道涨粉'
        },
        {
          icon: upyunUrl + '/wxXcxImg/images/teacher-icon07.png',
          title: '更多特权',
          text: '更多入驻讲师专享功能和服务'
        }
      ]
    }
  },
  methods: {
    // 授权保存图片
    onSaveFn () {
      let that = this
      uni.getSetting({
        success (res) {
          if (!res.authSetting['scope.writePhotosAlbum']) {
            uni.authorize({
              scope: 'scope.writePhotosAlbum',
              success () {
                that.saveImageFn()
              },
              fail () {
                uni.showModal({
                  title: '提示',
                  content: '你点击了拒绝授权，将无法保存图片，请先同意授权。',
                  cancelText: '拒绝',
                  cancelColor: '#999',
                  confirmText: '同意',
                  confirmColor: '#ff6464',
                  success (res) {
                    if (res.confirm) {
                      uni.openSetting({
                        success () {
                          that.saveImageFn()
                        }
                      })
                    }
                  }
                })
              }
            })
          } else {
            that.saveImageFn()
          }
        }
      })
    },
    // 保存图片到本地
    saveImageFn () {
      let that = this
      uni.downloadFile({
        url: upyunUrl + '/wxXcxImg/images/kefu-qr-icon.png',
        success: function (res) {
          if (res.statusCode === 200) {
            let img = res.tempFilePath
            uni.saveImageToPhotosAlbum({
              filePath: img,
              success () {
                that.showToastFn('图片保存成功')
              },
              fail () {
                that.showToastFn('图片保存失败')
              }
            })
          }
        }
      })
    },
    showToastFn (title) {
      uni.showToast({
        title,
        icon: 'none',
        duration: 2000
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
  .apply-wrapper
    position: fixed
    left: 0
    top: 0
    right: 0
    bottom: 0
    width: 100%
    height: auto
    background: linear-gradient(4deg,rgba(255,109,64,1),rgba(255,64,64,1))
    .scroll-view
      width: 100%
      height: 100%
      .banner
        position: relative
        display: block
        width: 100%
        height: 232px
        z-index: 10
      .apply-content
        position: relative
        margin-top: -13px
        padding: 0 22px 20px
        width: 100%
        height: auto
        box-sizing: border-box
        z-index: 20
        .list-box
          margin-bottom: 20px
          padding: 20px
          box-sizing: border-box
          box-shadow: 0px 1px 0px 0px rgba(255,255,255,0.17)
          border-radius: 5px
          background-color: #fff
          h2
            margin: 0 auto
            width: 140px
            height: 17px
            img
              width: 100%
              height: 100%
          ul
            margin-top: 20px
            width: 100%
            height: auto
            li
              margin-bottom: 20px
              display: flex
              .list-icon
                width: 37px
                height: 37px
                img
                  width: 100%
                  height: 100%
              .info
                padding-left: 14px
                flex: 1
                h3
                  margin-bottom: 5px
                  font-size: 14px
                  line-height: 19px
                  font-weight: bold
                  color: #ff4040
                .text
                  font-size: 12px
                  line-height: 16px
                  color: #333
              &:last-child
                margin-bottom: 0
        .contact
          width: 100%
          height: auto
          text-align: center
          h2
            font-size: 14px
            line-height: 19px
            font-family: 35
            color: #fff
            text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.55)
          .avatar
            margin: 12px auto 14px
            position: relative
            width: 125px
            height: 125px
            border-radius: 5px
            img
              width: 100%
              height: 100%
              border-radius: 5px
          .hint
            font-size: 12px
            line-height: 16px
            color: #fff
            span
              padding-left: 2px
              font-weight: bold
    ::-webkit-scrollbar
      width: 0
      height: 0
      color: transparent
</style>
