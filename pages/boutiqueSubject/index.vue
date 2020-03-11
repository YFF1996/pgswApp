<template>
  <div v-if="upyunUrl" class="goods-wrapper">
      <div class="bg-color"></div>
      <goods-navigation :lists="subjectGoodsLabelList" />
			<goods-list @subjectGoodsListChild="getSubjectGoodsListFn" :lists="subjectGoodsList" />
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { upyunUrl } from '../../api/config'
import GoodsNavigation from '../../components/goodsNavigationTemplate'
import GoodsList from '../../components/subjectGoodsListTemplate'

export default {
  data () {
    return {
			upyunUrl,
			subjectGoodsLabelList: [],
			subjectGoodsList: []
    }
  },
  onLoad (options) {
    this.getSubjectGoodsLabelFn()
  },
  // 下拉刷新
  onPullDownRefresh () {
    this.getSubjectGoodsLabelFn()
  },
  computed: {
		...mapState([
			'userInfo',
			'excellentCourseIndex'
		])
  },
  methods: {
    ...mapActions([
      'getSubjectGoodsLabel',
			'getSubjectGoodsList'
    ]),
    // 获取分类标签
    getSubjectGoodsLabelFn () {
      uni.showLoading({ title: 'Loading' })
      this.getSubjectGoodsLabel().then((res) => {
        this.subjectGoodsLabelList = res
				this.getSubjectGoodsListFn()
      })
    },
		// 获取课程列表
		getSubjectGoodsListFn () {
			const data = { id: this.subjectGoodsLabelList[this.excellentCourseIndex].id }
      uni.showLoading({ title: 'Loading' })
			this.getSubjectGoodsList(data).then((res) => {
				this.subjectGoodsList = res
        uni.stopPullDownRefresh()
        uni.hideLoading()
			})
		}
  },
	watch: {
		excellentCourseIndex () {
			this.getSubjectGoodsListFn()
		}
	},
	components: {
		GoodsNavigation,
		GoodsList
	}
}
</script>

<style lang="stylus" scoped>
  .goods-wrapper
    width: 100%
    height: auto
</style>

