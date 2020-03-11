<template>
  <div v-if="showState && upyunUrl" class="popup-wrapper">
    <div class="popup-box">
      <div class="close-btn" @click="onShowStatusFn()">
        <img :src="upyunUrl + '/wxXcxImg/images/pic-close.png'" >
      </div>
      <div class="content">
        <div class="title">完善资料</div>
        <div v-if="type !== 'sex' && type === 'nickname'" class="hint">昵称</div>
        <div v-if="type !== 'sex' && type === 'user_desc'" class="hint">介绍</div>
        <div v-if="type !== 'sex' && type === 'plan'" class="hint">职业生涯规划</div>
        <div v-if="type === 'sex'" class="gender-box">
          <div class="gender-content">
            <div class="gender">
              <div class="avatar">
                <img :src="upyunUrl + '/wxXcxImg/images/default-avatar-icon.png'" />
              </div>
              <div class="select">
                <div class="check">
                  <div class="select-icon">
                    <img v-if="sex !== 1" @click="onCheckStatusFn(1)" :src="upyunUrl + '/wxXcxImg/images/select-icon.png'" />
                    <img v-if="sex === 1" :src="upyunUrl + '/wxXcxImg/images/select-icon-active.png'" />
                  </div>
                </div>
                <div class="text">男</div>
              </div>
            </div>
            <div class="gender">
              <div class="avatar">
                <img :src="upyunUrl + '/wxXcxImg/images/default-avatar-icon.png'" />
              </div>
              <div class="select">
                <div class="check">
                  <div class="select-icon">
                    <img v-if="sex !== 2" @click="onCheckStatusFn(2)" :src="upyunUrl + '/wxXcxImg/images/select-icon.png'" />
                    <img v-if="sex === 2" :src="upyunUrl + '/wxXcxImg/images/select-icon-active.png'" />
                  </div>
                </div>
                <div class="text">女</div>
              </div>
            </div>
          </div>
          <div class="hint">请选择您的性别</div>
        </div>
        <div v-else class="edit-box">
          <textarea
            v-model="textareaVal"
            :placeholder="text"
            :minlength="minNum"
            :maxlength="maxNum"
            placeholder-class="placeholder"
          />
          <div class="num-box">
            <div class="num">{{ maxNum }}</div>
          </div>
        </div>
        <div class="confirm" @click="onSaveFn()">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
import { upyunUrl } from '../../api/config'

export default {
  data () {
    return {
      upyunUrl,
      textareaVal: '',
      sex: 0,
      minNum: 0,
      maxNum: 0,
      text: '',
      checkState: 0,
      initialStatus: false
    }
  },
  methods: {
    // 关闭弹窗
    onShowStatusFn () {
      this.$emit('popupStatusChild', false, this.textareaVal)
    },
    // 保存填写内容
    onSaveFn () {
      if (this.textareaVal) {
        this.$emit('saveInfo', false, this.type, this.textareaVal)
      } else {
        this.showToastFn('不能提交空内容!')
        return false
      }
    },
    // 清空数据
    onEmptyFn () {
      this.textareaVal = ''
    },
    // 单选勾选
    onCheckStatusFn (index) {
      this.sex = index
      this.textareaVal = index
    },
    showToastFn (title) {
      uni.showToast({
        title,
        icon: 'none',
        duration: 1500
      })
    }
  },
  props: {
    oJson: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    showState: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    oJson (str) {
      if (str) {
        this.textareaVal = str
      } else {
        this.onEmptyFn()
      }
    },
    type (type) {
      if (type === 'nickname') {
        this.minNum = 1
        this.maxNum = 10
        this.text = '最多不能超过10个字'
      } else if (type === 'user_desc') {
        this.minNum = 10
        this.maxNum = 30
        this.text = '请输入不少于10个字的介绍'
      } else if (type === 'plan') {
        this.minNum = 10
        this.maxNum = 300
        this.text = '最多不能超过300个字'
      } else if (type === 'sex') {
        this.sex = parseInt(this.oJson)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  .popup-wrapper
    position: fixed
    left: 0
    top: 0
    width: 100%
    height: 100%
    z-index: 100
    background-color: rgba(0,0,0,0.5)
    .popup-box
      margin: 50px auto 0
      position: relative
      width: 300px
      height: auto
      overflow: hidden
      border-radius: 8px
      background-color: #fff
      .close-btn
        position: absolute
        top: 0
        right: 0
        width: 35px
        height: 35px
        transform: rotate(-90deg)
        background-color: #ff4040
        border-radius: 35px 0 0 0
        img
          position: absolute
          top: 16px
          right: 9px
          display: block
          width: 11px
          height: 11px
      .content
        padding: 20px 20px 20px
        box-sizing: border-box
        width: 100%
        height: auto
        .title
          font-size: 17px
          text-align: center
          color: #000
        .hint
          margin: 25px 0 12px
          font-size: 16px
          color: #37474e
        .edit-box
          position: relative
          margin-bottom: 25px
          width: 100%
          height: auto
          font-size: 14px
          color: rgba(0,0,0,0.65)
          border-radius: 5px
          border: 1px solid #ced8dc
          textarea
            padding: 2px 2px 25px 5px
            box-sizing: border-box
            width: 100%
            height: 150px
            line-height: 20px
          .num-box
            position: absolute
            bottom: 0
            right: 0
            width: 100%
            height: 25px
            line-height: 25px
            text-align: right
            font-size: 12px
            color: #000
            background-color: #fff
            border-radius: 0 0 5px 5px
            z-index: 10
            .num
              padding: 0 8px 0 0
              box-sizing: border-box
        .gender-box
          margin-top: 25px
          width: 100%
          height: auto
          .gender-content
            display: flex
            align-items: center
            justify-content: space-around
            .gender
              width: 100%
              height: auto
              .avatar
                margin: 0 auto;
                width: 74px
                height:74px
                border-radius:50%
                background: #eee
                img
                  width: 100%
                  height: 100%
                  border-radius: 50%
              .select
                margin-top: 6px
                display: flex
                align-items: center
                justify-content: center
                .check
                  display: flex
                  align-items: center
                  justify-content: center
                  .select-icon
                    padding: 6px
                    box-sizing: border-box
                    border-radius: 50%
                    img
                      display: block
                      width: 18px
                      height: 18px
                      border-radius: 50%
                .text
                  font-size: 14px
                  color: rgba(0,0,0,0.65)
          .hint
            margin: 15px 0 30px
            text-align: center
            font-size: 14px
            color: rgba(0,0,0,0.65)
        .confirm
          margin: 0 auto
          width: 175px
          height: 34px
          line-height: 34px
          font-size: 14px
          text-align: center
          color: #fff
          background-color: #ff4040
          box-shadow: 0 0 1px 0 rgba(65,117,246,0.65)
          border-radius: 25px
</style>
