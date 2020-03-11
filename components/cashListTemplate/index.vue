<template>
  <div class="info-wrapper" v-if="upyunUrl">
    <ul>
      <li>
        <div class="info-box">
          <h2>转到微信钱包</h2>
          <div class="time">2019-12-05 17:20:55</div>
        </div>
        <div class="cash-box">
          <h3>100元</h3>
          <!--<div class="get-way">提现中</div>
          <div class="get-way end">已到账</div>-->
          <div class="get-way no-pass">
            <i class="icon">
              <img :src="upyunUrl + '/wxXcxImg/images/my-reply-icon.png'" />
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
  onLoad (options) {
  },
  methods: {
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
      padding: 15px
      box-sizing: border-box
      li
        position: relative
        padding-bottom: 15px
        margin-bottom: 15px
        display: flex
        justify-content: space-between
        border-bottom: 1px solid #f5f5f5
        .info-box
          flex: 1
          h2
            margin-bottom: 10px
            font-size: 15px
            color: #333
          .time
            font-size: 12px
            color: #999
        .cash-box
          h3
            margin-bottom: 10px
            font-size: 15px
            text-align: center
            font-weight: bold
            color: #333
          .get-way
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
