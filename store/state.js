const state = {
  isLoginStatus: false, // 登录弹窗status
  userInfo: '', // 用户信息
  popUpWindowsObj: '', // 版本提交不通过提示信息
  unionid: '', // unionid
  shareid: '', // 用户id - 讲师id 记录谁邀请谁进来的
  channel: '', // 用户来源渠道
  isIos: false, // 用户设备是否是ios
  isReview: false, // 后台控制部分设置状态是否显示
  indexTypeLabelList: [], // 首页分类标签lists
  navigationVertical: false, // navigation滚动方向
  navigationIndex: 0, // navigationIndex
  navigationScrollLeft: 0, // navigation滑动的位置
  navigationItemWidth: 0, // navigation列表item宽度
  musicList: [], // 首页音频列表lists
  allMusicList: [], // 全局播放列表lists
  currentIndex: 0, // 首页切换歌曲index
  indexLoadingMusicStatus: false, // 首页正在加载音频状态
  duration: 200, // 首页滑动幅度
  currentMusicItem: '', // 当前播放歌曲item信息
  allCurrentMusicItem: '', // 全局当前播放歌曲item信息
  indexCurrentVideoItem: '', // 首页选择视频item信息
  playing: false, // 音频播放状态
  allPlaying: false, // 全局音频播放状态
  miniShowCloseStatus: true, // mini播放(显示-关闭)状态
  miniShowHideStatus: false, // mini播放(显示-隐藏)状态
  miniPlayListStatus: false, // mini播放列表(显示-隐藏)状态
  isSwitchMusic: true, // 是否是滑动切换音频
  scrollWithAnimation: false, // 首页音频列表item动画状态
  currentTime: 0, // 当前音频时长
  totalTime: 0, // 音频总时长
  isSpeedState: false, // 快进状态
  currentSchedule: 0, // 当前音频进度
  totalSchedule: 0, // 音频总进度
  allTypeList: [], // 类型列表lists
  hotColumnList: [], // 热门栏目列表
  allSearchLists: [], // 全部搜索音频列表lists
  subjectSearchLists: [], // 搜索专题列表lists
  collectSubjectList: [], // 个人收藏专题列表lists
  collectMusicList: [], // 个人收藏音频列表lists
  addRemarkStatus: false, // 收藏备注状态
  playHistoryList: [], // 个人播放音频记录lists
  loadingState: false, // 分类音频加载更多loading状态
  isDataState: false, // 分类音频是否有数据
  isNewsDataState: false, // news是否有数据
  recommendLabelList: [], // 分享推荐标签列表lists
  shareThumbnail: '', // 分享缩略图
  seekRecommendLabelList: [], // 搜索推荐标签列表lists
  days: 0, // 坚持签到天数
  checkInList: [], // 坚持签到列表
  checkInDateList: [], // 坚持签到日期列表
  newsList: [], // 每日头条列表
  collectArticleList: [], // 个人收藏文章列表lists
  shareLatestRankList: [], // 分享记录最新排行榜列表lists
  shareRankingObj: [], // 分享记录总数排行榜对象obj
  checkRankingObj: '', // 排行榜信息
  shareEnergyObj: '', // 分享我的能量信息
  shareInfo: [], // 分享我的info
  feedbackHistoryList: [], // 反馈历史列表lists
  feedbackDetails: '', // 反馈详情
  giveThumbsMusicList: [], // 个人点赞音频列表lists
  contentWordList: [], // 内容定制关键词列表lists
  subjectDetailList: [], // 专题音频列表lists
  similarityCourseList: [], // 专题相似课程列表lists
  commentList: [], // 评论列表
  conversionBookList: [], // 兑换书和物品lists
  robBookList: [], // 抢书列表lists
  bingPhoneInfo: '', // 绑定手机号信息
  levelOneJobList: '', // 一级岗位分类
  selectedJobInfo: '', // 是否选择岗位
  addressList: [], // 选择地址列表
  AffirmSiteInfo: '', // 默认收货地址
  screenBottleStatus: false, // 筛选瓶盖区间状态
  orderList: [], // 订单列表
  bottleRecordList: [], // 赚瓶盖收支记录
  taskCaseList: [], // 每日任务完成状况列表
  growhtRecordList: [], // 成长记录列表lists
  inTheBookList: [], // 中书记录lists
  missionPopupStatus: false, // 任务弹窗状态
  checkStatus: true, // 复选框选中状态
  sharePopupState: false, // 首页分享引导状态
  rulePopupStatus: false, // 抢学费规则弹窗
  tuitionMeListStatus: false, // 我获得学费记录状态
  consumeList: [], // 收入支出明细列表
  allGrabList: [], // 全部抢学费用户Lists
  grabTuitionList: [], // 疯狂抢学费列表Lists
  conductGrabTuitionList: [], // 我的抢学费进行中列表Lists
  accomplishGrabTuitionList: [], // 我的完成抢学费列表Lists
  extractCashList: [], // 提现记录列表
  lectureSubjectList: [], // 讲师专题
  lectureMusicList: [], // 讲师音频Lists
  myAttentionList: [], // 我的关注列表
  mySubscriptionList: [], // 我的订阅列表
  myCourseList: [], // 我的课程列表
  returnMoneyPopUpState: false, // 返现弹窗state
  excellentCourseIndex: 0, // 精品课程navIndex
  excellentCourseScrollLeft: 0, // excellentCourse滑动的位置
  excellentCourseItemWidth: 0, // 精品课程导航宽度
  musicDetails: '', // 音频详情
  exchangeInviteState: false, // 专题展示兑换邀请状态
  setTitleState: false, // 动态设置page标题状态
  messageFromUserList: [], // 发送人私信列表lists
  messageReadList: [], // 私信列表lists
  getCoursePopUpState: false, // 领取课程弹窗状态
  authorWindowGoodsList: [], // 讲师橱窗商品列表lists
  authorSearchGoodsList: [], // 讲师搜索商品列表lists
  indexVideoList: [], // 首页视频列表
  workInfo: '', // 获取工作经历
  educationInfo: '', // 获取教育经历
  subjectGoodsLabelList: [], // 获取精品课分类
  occupationList: '' // 获取一级职业分类
}

export default state