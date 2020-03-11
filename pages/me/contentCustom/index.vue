<template>
  <div class="custom-wrapper">
    <div class="describe">可通过该处以关键词形式，提交你感兴趣的内容，系统审核通过后会为您准备您需要的内容</div>
    <h2 class="title">输入需要的关键词：</h2>
    <input
      class="edit-box"
      v-model="wordVal"
      cursor-spacing="10"
      placeholder-style="color:#9d9c9c"
      maxlength="10"
      placeholder="如管理、销售、口才等、一次只能输入一个关键词..."
    />
    <div class="hint">注：一个用户一天最多能提交2个关键词，后续会陆续开放更多关键词</div>
    <div
      v-if="wordVal"
      class="submit-btn submit-btn-active"
      @click="onSubmitFn()"
    >提交</div>
    <div v-else class="submit-btn">提交</div>
    <div class="submit-btn look-btn" @click="onSkipPageFn(`/pages/me/contentCustom/contentList/index`)">查看关键词列表</div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data () {
    return {
      wordVal: ''
    }
  },
  computed: {
    ...mapState([
      'userInfo'
    ])
  },
  methods: {
    ...mapActions([
      'addContentWord'
    ]),
    // 跳转关键词列表
    onSkipPageFn (url) {
      uni.navigateTo({
        url
      })
    },
    // 提交
    onSubmitFn () {
      const data = {
        that: this,
        wordVal: this.wordVal
      }
      this.addContentWord(data).then((res) => {
        this.showToastFn(res.message)
        if (res.ret === 1) {
          this.wordVal = ''
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
  .custom-wrapper
    padding: 20px
    width: 100%
    height: auto
    box-sizing: border-box
    .describe
      font-size: 14px
      line-height: 20px
      color: #666
    .title
      margin: 32px 0 12px
      font-size: 14px
      font-weight: 600
      color: #333
    .edit-box
      padding-left: 11px
      width: 100%
      height: 40px
      box-sizing: border-box
      line-height: 40px
      font-size: 13px
      background: #f5f5f5
    .hint
      margin: 16px 0 35px
      font-size: 14px
      line-height: 20px
      color: #ff6464
    .submit-btn
      margin-bottom: 20px
      width: 100%
      height: 40px
      text-align: center
      line-height: 40px
      font-size: 14px
      border-radius: 22px
      box-shadow: 0 6px 6px #efefef
      color: #999
      background-color: #f8f8f8
      &.look-btn
        color: #fff
        background-color: #ff7960
    .submit-btn-active
      color: #fff
      background-color: rgb(255, 100, 100)

</style>
