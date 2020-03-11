<template>
	<div class="index-wrapper">
		<navigation :lists="indexTypeLabelList" />
		<swiper
			class="swiper-wrapper"
			:duration="duration"
			:current="navigationIndex"
			:vertical="navigationVertical"
			@change="onChangeFn"
			@touchstart="onTouchStartFn"
		>
			<swiper-item
				v-if="indexTypeLabelList.length"
				v-for="(item, index) in indexTypeLabelList"
				:key="index"
			>
				<music-play
					v-if="item.type === 0"
					:musicList="musicList"
					@loadingMoreMusicChild="onLoadingMoreMusicFn"
				/>
				<news v-if="item.type === 1" />
				<video-play-list v-if="item.type === 2" />
				<job-classify v-if="item.type === 3" :catid="item.catid" :index="index" />
			</swiper-item>
		</swiper>
	</div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import Navigation from '../../components/navigationTemplate'
import MusicPlay from '../../components/musicPlayTemplate'
import News from '../../components/newsTemplate'
import VideoPlayList from '../../components/videoPlayListTemplate'
import JobClassify from '../../components/jobClassifyTemplate'

export default {
	data () {
		return {
			page: 1,
			activityInfo: ''
		}
	},
  created () {
		this.getActivityUpWindowsFn()
	},
  mounted () {
    this.getMusicListFn(true)
		this.setActivityViewRecordFn()
		this.getTypeLabelFn()
	},
	computed: {
		...mapState([
			'userInfo',
			'indexTypeLabelList',
			'navigationVertical',
			'navigationIndex',
			'musicList',
			'duration'
		])
	},
	methods: {
		...mapMutations({
			setNavigationIndex: 'SET_NAVIGATION_INDEX',
			setDuration: 'SET_DURATION',
			setShareId: 'SET_SHARE_ID',
			setChannel: 'SET_CHANNEL'
		}),
		...mapActions([
			'getIsReview',
			'getUserInfo',
			'setActivityViewRecord',
			'getTypeLabel',
			'getMusicList',
			'getActivityUpWindows'
		]),
		// 统计用户浏览记录
		setActivityViewRecordFn () {
			this.setActivityViewRecord({ that: this })
		},
		// 获取分类标签
		getTypeLabelFn () { this.getTypeLabel({ that: this }) },
		// 获取音频列表
		getMusicListFn (first) {
			let data = {
				that: this,
				page: this.page,
				first: first
			}
			this.getMusicList(data)
		},
		// 加载更多音频列表
		onLoadingMoreMusicFn () {
			this.page = this.musicList[0].page + 1
			this.getMusicListFn(false)
		},
		// 获取活动弹窗信息
		getActivityUpWindowsFn () {
			this.getActivityUpWindows({ that: this }).then((res) => {
				this.activityInfo = res.data
			})
		},
		// 滑动切换音频
		onChangeFn (e) { this.setNavigationIndex(e.mp.detail.current) },
		// 手指按下时
		onTouchStartFn () { this.setDuration(200) }
	},
  components: {
    Navigation,
    MusicPlay,
    News,
    VideoPlayList,
    JobClassify
  }
}
</script>

<style lang="stylus" scoped>
	.index-wrapper
		position: fixed
		left: 0
		top: 0
		right: 0
		bottom: 0
		width: 100%
		height: 100%
		display: flex
		background-color: #000
		.swiper-wrapper
			width: 100%
			height: 100%
			swiper-item
				width: 100%
				height: 100%
		.pop-up-wrapper
			position: fixed
			left: 0
			top: 0
			right: 0
			bottom: 0
			z-index: 999
			display: flex
			justify-content: center
			align-items: center
			background-color: rgba(0, 0, 0, 0.3)
			.pop-up-content
				width: 240px
				height: auto
				padding: 10px 15px
				font-size: 14px
				line-height: 22px
				border-radius: 6px
				background-color: #fff
				box-sizing: border-box
</style>
