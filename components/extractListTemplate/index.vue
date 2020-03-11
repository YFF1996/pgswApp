<template>
  <div v-if="upyunUrl" class="info-wrapper">
    <ul v-if="list.length">
      <li v-for="(item, index) in list" :key="index">
        <div class="info-box">
          <h2 v-if="item.type === 0">转到微信钱包</h2>
          <div class="time">{{ item.ctime }}</div>
        </div>
        <div class="cash">
          <h3>{{ item.amount }}元</h3>
          <div v-if="item.status === 0" class="get-type end">提现中</div>
          <div v-if="item.status === 1" class="get-type">已到账</div>
          <div v-if="item.status === 2" class="get-type no-pass" @click="onResultFn(item.feedback)">
            <i class="icon">
              <img :src="upyunUrl + '/wxXcxImg/images/reason-icon.png'" />
            </i>
            <span>审核不通过</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { upyunUrl } from '../../api/config'

export default {
  data () {
    return {
      upyunUrl
    }
  },
  methods: {
    onResultFn (feedback) {
      uni.showModal({
        content: feedback,
        confirmText: '我知道了',
        confirmColor: '#ff4040',
        showCancel: false
      })
    }
  },
  props: {
    list: {
      type: Array,
      default: []
    }
  }
}
</script>

<style lang="stylus" scoped>
  .info-wrapper
    width: 100%
    height: auto
    ul
      padding: 15px
      width: 100%
      height: auto
      box-sizing: border-box
      li
        padding-bottom: 15px
        margin-bottom: 15px
        display: flex
        justify-content: space-between
        border-bottom: 1px solid #f5f5f5
        .avatar
          width: 55px
          height: 55px
          img
            width: 100%
            height: 100%
        .info-box
          flex: 1
          h2
            margin-bottom: 10px
            font-size: 15px
            color: #333
          .time
            font-size: 12px
            color: #999
        .cash
          text-align: right
          h3
            margin-bottom: 5px
            font-size: 15px
            text-align: center
            font-weight: bold
            color: #333
          .get-type
            padding-top: 5px
            font-size: 12px
            color: #25a0ff
            &.end
              color: #999
            &.no-pass
              display: flex
              align-items: center
              color: #ff4040
              span
                padding-left: 6px
              .icon
                width: 12px
                height: 12px
                img
                  display: block
                  width: 100%
                  height: 100%
        &:last-child
          border: none

</style>
