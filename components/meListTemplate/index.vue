<template>
  <div v-if="upyunUrl" class="my-wrapper">
    <div v-if="lists.length" class="my-ul">
      <div
        v-for="(item, index) in lists"
        v-if="item.url || (!item.url && userInfo)"
        @click="onSkipMeListFn(item)"
        :key="index"
        class="item"
      >
        <div class="list-icon">
          <image :src="item.icon"/>
        </div>
        <div class="title">{{ item.title }}</div>
        <div class="more-icon">
          <image :src="upyunUrl + '/wxXcxImg/images/next-icon.png'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { upyunUrl } from '../../api/config'

export default {
  data () {
    return {
      upyunUrl
    }
  },
  computed: {
    ...mapState([
      'userInfo'
    ])
  },
  methods: {
    ...mapMutations({
      setUserInfo: 'SET_USERINFO'
    }),
    onSkipMeListFn (item) {
      const _this = this
      if (this.userInfo || !item.isLogin) {
        if (item.url) {
          uni.navigateTo({
            url: item.url
          })
        } else {
          uni.showModal({
            title: '提示',
            content: '是否要退出登录!',
            success (res) {
              if (res.confirm) {
                uni.removeStorageSync('openid')
                _this.setUserInfo('')
              }
            }
          })
        }
      } else {
        uni.navigateTo({
          url: `/pages/login/index`
        })
      }
    }
  },
  props: {
    lists: Array,
    default: []
  }
}
</script>

<style lang="stylus" scoped>
  .my-wrapper
    width: 100%
    height: auto
    padding: 20px 20px 10px 25px
    box-sizing: border-box
    .my-ul
      width: 100%
      height: auto
      .item
        position: relative
        width: 100%
        height: 45px
        display: flex
        align-items: center
        .list-icon
          width: 17px
          height: 17px
          image
            display: block
            width: 100%
            height: 100%
        .title
          flex: 1
          padding: 0 13px
          line-height: 17px
          font-size: 15px
          font-weight: bold
          color: #333333
        .more-icon
          width: 8px
          height: 12px
          image
            display: block
            width: 100%
            height: 100%
</style>
