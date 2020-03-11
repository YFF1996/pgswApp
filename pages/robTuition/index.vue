<template>
	<div
		v-if="upyunUrl"
		class="rob-wrapper"
		:class="{'rob-wrapper-fixed' : tuitionMeListStatus}"
	>
		<div class="top-wrapper">
			<image class="top-bg" :src="upyunUrl + '/wxXcxImg/images/rob-top-bg.png'" />
			<div class="rule-box" @click="onSetPopupStatusFn(true)">活动规则</div>
		</div>
		<!--抢得学费滚动浮窗-->
		<div v-if="userInfo" class="fixed-box">
			<all-grab-floating-window />
		</div>
		<div v-else class="fixed-box">
			<all-grab-floating-window />
		</div>
		<!-- 余额提示 -->
		<div
			v-if="oJson"
			@click="onSkipPageFn('/pages/me/myIncome/main')"
			class="hint-box"
		>
			<div v-if="oJson.balance > 0" class="text">你获得{{ oJson.balance }}元现金，继续加油哦!</div>
			<div v-if="oJson.balance <= 0" class="text">你还没抢学费，赶紧去抢学费哦!</div>
		</div>
		<div class="list-wrapper">
			<div class="nav-wrapper">
				<div class="nav-ul">
					<div class="item" :class="{ 'active' : currentIndex === 0 }" @click="onSelectItemFn(0)">疯抢中</div>
					<div class="item" :class="{ 'active' : currentIndex === 1 }" @click="onSelectItemFn(1)">进行中</div>
				</div>
				<!-- 疯狂抢学费列表 -->
				<tuition-list v-if="currentIndex === 0" :lists="grabTuitionList" />
				<!-- 抢学费进行中 -->
				<tuition-second v-if="currentIndex === 1" :lists="conductGrabTuitionList" />
			</div>
		</div>
		<!--我的抢学费列表-->
		<tuition-me-list @meListStatusChild="onListStatusFn" :lists="accomplishGrabTuitionList" :status="tuitionMeListStatus" />
		<!-- 上拉加载更多 -->
		<loading-more :lists="currentIndex === 0 ? grabTuitionList : conductGrabTuitionList" :listsLength="16" />
		<!--规则弹窗-->
		<rule-popup @popupStatusChild="onSetPopupStatusFn" :showState="rulePopupStatus" :obj="oItem" />
		<!--我的浮窗-->
		<movable-area class="my-float-wrapper">
			<movable-view
				x="-10"
				y="450"
				direction="all"
				@click="onListStatusFn(true)"
				class="my-float"
			>
				<div class="info">
					<div class="avatar">
						<image :src="upyunUrl + '/wxXcxImg/images/rob-me-icon.png'" />
					</div>
					<div class="text">我的</div>
				</div>
			</movable-view>
		</movable-area>
		<!-- mini play nav -->
		<suspend-play />
	</div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { upyunUrl } from '../../api/config'
import AllGrabFloatingWindow from '../../components/allGrabFloatingWindowTemplate'
import TuitionList from '../../components/tuitionListTemplate'
import TuitionSecond from '../../components/tuitionSecondListTemplate'
import RulePopup from '../../components/rulePopupTemplate'
import TuitionMeList from '../../components/tuitionMeListTemplate'
import LoadingMore from '../../components/loadingMoreTemplate'
import SuspendPlay from '../../components/suspendPlayTemplate'

export default {
	data () {
		return {
			upyunUrl,
			oJson: '',
			oItem: '',
			page: 1,
			currentIndex: 0
		}
	},
	onLoad () {
		this.getAllGrabListFn()
		this.getUserAccountInfoFn()
		this.getDataTableFn()
	},
	// 下拉刷新
	onPullDownRefresh () {
		this.getAllGrabListFn()
		this.getUserAccountInfoFn()
		if (!this.tuitionMeListStatus) this.getDataTableFn()
	},
	// 上拉加载
	onReachBottom () {
		this.page += 1
		if (this.currentIndex === 0) {
			this.getGrabTuitionListFn(false)
		} else if (this.currentIndex === 1) {
			this.getConductGrabTuitionListFn(false)
		}
	},
	computed: {
		...mapState([
			'userInfo',
			'allGrabList',
			'rulePopupStatus',
			'tuitionMeListStatus',
			'grabTuitionList',
			'conductGrabTuitionList',
			'accomplishGrabTuitionList'
		])
	},
	methods: {
		...mapMutations({
			setShareId: 'SET_SHARE_ID',
			setChannel: 'SET_CHANNEL',
			setRulePopupStatus: 'SET_RULE_POPUP_STATUS',
			setTuitionMeListStatus: 'SET_TUITION_ME_LIST_STATUS',
			setGrabTuitionList: 'SET_GRAB_TUITION_LIST',
			setConductGrabTuitionList: 'SET_CONDUCT_GRAB_TUITION_LIST',
			setAccomplishGrabTuitionList: 'SET_ACCOMPLISH_GRAB_TUITION_LIST'
		}),
		...mapActions([
			'getAllGrabList',
			'getUserAccountInfo',
			'getGrabTuitionList',
			'getConductGrabTuitionList',
			'getAccomplishGrabTuitionList',
			'getRuleInfo'
		]),
		// 获取全部抢学费用户列表
		getAllGrabListFn () {
			this.getAllGrabList({ that: this })
		},
		// 获取用户余额
		getUserAccountInfoFn () {
			if (this.userInfo) {
				this.getUserAccountInfo({ that: this }).then((res) => {
					this.oJson = res.data
				})
			}
		},
		// 选择类型
		onSelectItemFn (index) {
			if (index === 1 && !this.userInfo) {
				this.onSkipPageFn(`/pages/login/index`)
			} else {
				this.page = 1
				this.currentIndex = index
				this.getDataTableFn()
			}
		},
		// 获取疯狂抢学费列表
		getGrabTuitionListFn (isLoading) {
			const data = {
				that: this,
				page: this.page
			}
			if (isLoading) {
        uni.showLoading({ title: 'Loading' })
				this.setGrabTuitionList([])
			}
			this.getGrabTuitionList(data).then(() => {
				if (isLoading) uni.hideLoading()
        uni.stopPullDownRefresh()
			})
		},
		// 获取抢学费进行中列表
		getConductGrabTuitionListFn (isLoading) {
			const data = {
				that: this,
				page: this.page
			}
			if (isLoading) {
        uni.showLoading({ title: 'Loading' })
				this.setConductGrabTuitionList([])
			}
			this.getConductGrabTuitionList(data).then(() => {
				if (isLoading) uni.hideLoading()
        uni.stopPullDownRefresh()
			})
		},
		// 获取我的完成抢学费列表
		getAccomplishGrabTuitionListFn () {
			const data = {
				that: this,
				page: 1,
				pageSize: 100
			}
			this.setAccomplishGrabTuitionList([])
      uni.showLoading({ title: 'Loading' })
			this.getAccomplishGrabTuitionList(data).then(() => {
        uni.hideLoading()
			})
		},
		// 规则弹窗
		onSetPopupStatusFn (state) {
			this.setRulePopupStatus(state)
			this.getRuleInfo({ that: this }).then((res) => {
				this.oItem = res.sp_rule
			})
		},
		// 我获得学费记录
		onListStatusFn (status) {
			if (this.userInfo) {
				this.setTuitionMeListStatus(status)
				if (status) this.getAccomplishGrabTuitionListFn()
			} else {
				this.onSkipPageFn(`/pages/login/index`)
			}
		},
		// 请求数据列表
		getDataTableFn () {
			this.page = 1
			switch (this.currentIndex) {
				case 0:
					this.getGrabTuitionListFn(true)
					break
				case 1:
					this.getConductGrabTuitionListFn(true)
					break
				default:
					return false
			}
		},
		onSkipPageFn (url) {
      uni.navigateTo({
				url
			})
		}
	},
	components: {
		AllGrabFloatingWindow,
		TuitionList,
		TuitionSecond,
		RulePopup,
		TuitionMeList,
		LoadingMore,
		SuspendPlay
	}
}
</script>

<style lang="stylus" scoped>
	.rob-wrapper
		width: 100%
		height: auto
		&.rob-wrapper-fixed
			position: fixed
			left: 0
			top: 0
			right: 0
			bottom: 0
			height: 100%
		.top-wrapper
			position: relative
			width: 100%
			height: 220px
			.top-bg
				position: absolute
				top: 0
				left: 0
				bottom: 0
				right: 0
				width: 100%
				height: 100%
			.rule-box
				position: absolute
				top: 10px
				right:0
				width: 56px
				height: 25px
				line-height: 25px
				font-size: 10px
				text-align: center
				color: #fff
				background-color: rgba(255,72,85,1)
				border-radius: 13px 0 0 13px
		.float-box
			position: absolute
			top: 12px
			left: 0
			z-index: 80
		.fixed-box
			position: fixed
			top: 12px
			left: 0
			z-index: 80
		.hint-box
			width: 100%
			height: 36px
			background-color: #ffeded
			box-shadow: 0px -1px 0px 0px rgba(255,255,255,0.64)
			.text
				line-height: 36px
				font-size: 13px
				text-align: center
				color: #ff4040
		.list-wrapper
			width: 100%
			height: auto
			.nav-wrapper
				width: 100%
				height: auto
				.nav-ul
					width: 100%
					height: auto
					display: flex
					align-items: center
					border-bottom: 1px solid #f5f5f5
					.item
						padding: 15px 0
						width: 50%
						font-size: 15px
						text-align: center
						color: #999
						&.active
							font-weight: bold
							color: #000
							border-bottom: 2px solid #ff4040
		.my-float-wrapper
			position: fixed
			right: 50px
			bottom: 0
			width: 1px
			height: 100%
			z-index: 990
			.my-float
				width: 50px
				height: 50px
				display: flex
				align-items: center
				justify-content: center
				background-color: #fff
				box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.23)
				border-radius: 50%
				.info
					.avatar
						margin: 0 auto
						width: 18px
						height: 18px
						image
							width: 100%
							height: 100%
					.text
						margin-top: 3px
						font-size: 11px
						text-align: center
						color: #fe5237
</style>
