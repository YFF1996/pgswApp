<template>
  <div v-if="upyunUrl && lists.length" class="goods-wrapper">
    <div
      v-for="(item, index) in lists"
      class="goods-box"
      :key="index"
    >
      <div class="title-h1">{{ item.title }}</div>
      <div
        v-for="(oJson, j) in item.level_sort"
        class="goods-list"
        :key="j"
      >
        <div class="goods-info">
          <div
            v-for="(obj, i) in oJson"
            class="li-wrapper"
            :key="i"
          >
            <div
              v-if="obj.recommend"
              @click="onSkipPageFn(`/pages/subject/subjectMusic/index?sid=${obj.special.id}`, false)"
              class="goods-list-item first"
            >
              <div class="cover">
                <image mode="aspectFill" :src="obj.special.cover_full || obj.special.cover" />
                <div class="tj-icon">
                  <image :src="upyunUrl + '/wxXcxImg/images/tj-tag-icon.png'" />
                </div>
              </div>
              <div class="special-title">{{ obj.special.title }}</div>
              <div class="info-box">
                <div class="item left">
                  <div
                    v-if="obj.special.author"
                    @click.stop="onSkipPageFn(`/pages/subject/lectureHome/index?id=${obj.special.au_id}`, false)"
                    class="cnt"
                  >
                    <div class="avatar">
                      <image mode="aspectFill" :src="obj.special.author.headimgurl" />
                    </div>
                    <div class="text">{{ obj.special.author.nick_name }}</div>
                  </div>
                  <div v-if="(isIos && isReview && obj.special.price > 0) || (!isIos && obj.special.price > 0)" class="price">¥{{ obj.special.price }}</div>
                </div>
                <div class="item">
                  <div class="cnt">
                    <div class="browse-icon">
                      <image :src="upyunUrl + '/wxXcxImg/images/browse-icon.png'" />
                    </div>
                    <div class="text">{{ obj.special.play_hits }}人浏览</div>
                  </div>
                  <div
                    v-if="obj.is_can_get !== 1 && obj.special.is_buy !== 1 && obj.is_get !== 1"
                    class="btn-box"
                  >
                    <div
                      v-if="obj.special.can_exchange === 1"
                      @click.stop="onSkipPageFn(`/pages/subject/subjectMusic/index?sid=${obj.special.id}`, true, 'free')"
                      class="btn"
                    >免费获得</div>
                    <div
                      v-if="(isIos && isReview && obj.special.price > 0) || (!isIos && obj.special.price > 0)"
                      @click.stop="onSkipSubmitPayPageFn(obj.special)"
                      class="btn buy"
                    >购买</div>
                  </div>
                  <div
                    v-if="obj.is_can_get === 1 && obj.special.is_buy !== 1"
                    @click.stop="onFreeOfChargeGetCourseFn(obj.job_collection_id, obj.special.id)"
                    class="bottom-btn btn"
                  >免费领取</div>
                  <div
                    v-if="obj.is_get === 1"
                    class="bottom-btn end-btn"
                  >已领取</div>
                  <div
                    v-if="obj.is_get !== 1 && obj.special.is_buy === 1"
                    class="bottom-btn end-btn"
                  >已获得</div>
                </div>
              </div>
            </div>
            <div
							v-else
              @click="onSkipPageFn(`/pages/subject/subjectMusic/index?sid=${obj.special.id}`, false)"
              class="goods-list-item other"
            >
              <div class="cover">
                <image mode="aspectFill" :src="obj.special.cover" />
              </div>
              <div class="info">
                <div class="special-title">{{ obj.special.title }}</div>
                <div
                  v-if="obj.special.author"
                  @click.stop="onSkipPageFn(`/pages/subject/lectureHome/index?id=${obj.special.au_id}`, false)"
                  class="cnt"
                >
                  <div class="avatar">
                    <image mode="aspectFill" :src="obj.special.author.headimgurl" />
                  </div>
                  <div class="text">{{ obj.special.author.nick_name }}</div>
                </div>
                <div class="cnt">
                  <div class="browse-icon">
                    <image :src="upyunUrl + '/wxXcxImg/images/browse-icon.png'" />
                  </div>
                  <div class="text">{{ obj.special.play_hits }}人浏览</div>
                </div>
                <div class="bottom">
                  <div v-if="(isIos && isReview && obj.special.price > 0) || (!isIos && obj.special.price > 0)" class="price">¥{{ obj.special.price }}</div>
                  <div
                    v-if="obj.is_can_get !== 1 && obj.special.is_buy !== 1 && obj.is_get !== 1"
                    class="btn-box"
                  >
                    <div
                      v-if="obj.special.can_exchange === 1"
                      @click.stop="onSkipPageFn(`/pages/subject/subjectMusic/index?sid=${obj.special.id}`, true, 'free')"
                      class="btn"
                    >免费获得</div>
                    <div
                      v-if="(isIos && isReview && obj.special.price > 0) || (!isIos && obj.special.price > 0)"
                      @click.stop="onSkipSubmitPayPageFn(obj.special)"
                      class="btn buy"
                    >购买</div>
                  </div>
                  <div
                    v-if="obj.is_can_get === 1 && obj.special.is_buy !== 1"
                    @click.stop="onFreeOfChargeGetCourseFn(obj.job_collection_id, obj.special.id)"
                    class="bottom-btn"
                  >免费领取</div>
                  <div
                    v-if="obj.is_get === 1"
                    class="bottom-btn end-btn"
                  >已领取</div>
                  <div
                    v-if="obj.is_get !== 1 && obj.special.is_buy === 1"
                    class="bottom-btn end-btn"
                  >已获得</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { upyunUrl } from '../../api/config'

export default {
  data () {
    return {
      upyunUrl
    }
  },
  computed: {
    ...mapState([
      'isIos',
      'isReview',
      'userInfo'
    ])
  },
  methods: {
    ...mapMutations({
      setExchangeInviteState: 'SET_EXCHANGE_INVITE_STATE'
    }),
    ...mapActions([
      'freeOfChargeGetCourse'
    ]),
    // 免费领取课程
    onFreeOfChargeGetCourseFn (jobCollectionId, specialId) {
      const that = this
      const data = {
        that,
        job_collection_id: jobCollectionId,
        special_id: specialId
      }
      if (this.userInfo) {
        uni.showModal({
          title: '温馨提示',
          content: '每个阶段只能领取一门课程哦!',
          confirmColor: '#e1564f',
          success (res) {
            if (res.confirm) {
              that.freeOfChargeGetCourse(data).then(() => {
                that.showToastFn('领取成功!')
                that.$emit('subjectGoodsListChild')
              })
            }
          }
        })
      } else {
        this.onSkipPageFn(`/pages/login/index`, false)
      }
    },
    // 跳转页面
    onSkipPageFn (url, state, type) {
      if (state) {
        if (this.userInfo) {
          if (type === 'free') this.setExchangeInviteState(true)
          uni.navigateTo({
            url
          })
        } else {
          this.onSkipPageFn(`/pages/login/index`, false)
        }
      } else {
        uni.navigateTo({
          url
        })
      }
    },
    // 跳转支付页面
    onSkipSubmitPayPageFn (obj) {
      if (this.userInfo) {
        uni.navigateTo({
          url: `/pages/subject/submitPay/index?oJson=${encodeURIComponent(JSON.stringify(obj))}`
        })
      } else {
        this.onSkipPageFn(`/pages/login/index`, false)
      }
    },
    showToastFn (title) {
      uni.showToast({
        title,
        icon: 'none',
        duration: 2000
      })
    }
  },
  props: {
    lists: {
      type: Array,
      default: []
    }
  }
}
</script>

<style lang="stylus" scoped>
  .goods-wrapper
    padding: 70px 15px 15px
    width: 100%
    height: auto
    box-sizing: border-box
    .goods-box
      width: 100%
      height: auto
      .title-h1
        padding: 0 10px
        margin-bottom: 15px
        line-height: 18px
        border-left: 5px solid #ff4040
        font-size: 15px
        font-weight: bold
        color: #000
        box-sizing: border-box
      .goods-list
        width: 100%
        height: auto
        margin-bottom: 15px
        .goods-info
          padding: 15px 15px 0
          box-sizing: border-box
          border-radius: 4px
          background-color: #fff
          .li-wrapper
            width: 100%
            height: auto
            .goods-list-item
              padding-bottom: 15px
              margin-bottom: 15px
              width: 100%
              height: auto
              border-bottom: 1px solid #f3f3f3
            .first
              .cover
                position: relative
                width: 100%
                height: 130px
                border-radius: 4px
                image
                  width: 100%
                  height: 100%
                  border-radius: 4px
                .tj-icon
                  position: absolute
                  top: -1px
                  left: 5px
                  width: 30px
                  height: 30px
                  image
                    display: block
                    width: 100%
                    height: 100%
              .special-title
                margin: 10px 0
                height: 19px
                line-height: 19px
                font-size: 14px
                font-weight: bold
                color: #333
                display: -webkit-box
                -webkit-box-orient: vertical
                -webkit-line-clamp: 1
                overflow: hidden
              .info-box
                width: 100%
                height: auto
                display: flex
                align-items: center
                justify-content: space-around
                .item
                  .cnt
                    display: flex
                    align-items: center
                    .avatar
                      width: 16px
                      height: 16px
                      border-radius: 50%
                      image
                        display: block
                        width: 100%
                        height: 100%
                        border-radius: 50%
                    .browse-icon
                      width: 12px
                      height: 12px
                      image
                        display: block
                        width: 100%
                        height: 100%
                    .text
                      padding-left: 6px
                      font-size: 11px
                      color: #666
                  .price
                    padding-top: 17px
                    font-size: 15px
                    color: #ff4040
                  .btn-box
                    padding-top: 13px
                    display: flex
                    align-items: center
                    .btn
                      width: auto
                      height: 26px
                      padding: 0 10px
                      line-height: 26px
                      font-size: 13px
                      text-align: center
                      color: #ff4d4d
                      border: 1px solid #ff4040
                      border-radius: 20px
                      &.buy
                        margin-left: 10px
                        color: #fff
                        background-color: #ff4d4d
                  .bottom-btn
                    width: 80px
                    height: 26px
                    margin-top: 13px
                    line-height: 26px
                    font-size: 13px
                    text-align: center
                    color: #fff
                    background-color: #ff4d4d
                    border-radius: 20px
                  .end-btn
                    background-color: #cacaca
                  &.left
                    flex: 1
            .other
              display: flex
              .cover
                width: 110px
                height: 110px
                border-radius: 4px
                image
                  width: 100%
                  height: 100%
                  border-radius: 4px
              .info
                padding-left: 13px
                flex: 1
                .special-title
                  margin-bottom: 10px
                  min-height: 19px
                  font-size: 14px
                  font-weight: bold
                  color: #333
                  display: -webkit-box
                  -webkit-box-orient: vertical
                  -webkit-line-clamp: 2
                  overflow: hidden
                .cnt
                  margin-bottom: 10px
                  display: flex
                  align-items: center
                  .avatar
                    width: 16px
                    height: 16px
                    border-radius: 50%
                    image
                      display: block
                      width: 100%
                      height: 100%
                      border-radius: 50%
                  .browse-icon
                    width: 12px
                    height: 12px
                    image
                      display: block
                      width: 100%
                      height: 100%
                  .text
                    padding-left: 6px
                    font-size: 11px
                    color: #666
                .bottom
                  display: flex
                  align-items: center
                  .price
                    flex: 1
                    font-size: 15px
                    color: #ff4040
                  .btn-box
                    display: flex
                    align-items: center
                    .btn
                      width: auto
                      height: 26px
                      padding: 0 10px
                      line-height: 26px
                      font-size: 13px
                      text-align: center
                      color: #ff4d4d
                      border: 1px solid #ff4040
                      border-radius: 20px
                      &.buy
                        margin-left: 9px
                        color: #fff
                        background-color: #ff4d4d
                  .bottom-btn
                    width: 80px
                    height: 26px
                    line-height: 26px
                    font-size: 13px
                    text-align: center
                    color: #fff
                    background-color: #ff4d4d
                    border-radius: 20px
                  .end-btn
                    background-color: #cacaca
					.li-wrapper:last-child
						.goods-list-item
							border-bottom: none !important
</style>
