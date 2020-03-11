import * as types from './mutation-types'

const mutations = {
  [types.SET_IS_LOGIN_STATUS] (state, data) {
    state.isLoginStatus = data
  },
  [types.SET_USERINFO] (state, data) {
    state.userInfo = data
  },
  [types.SET_POP_UP_WINDOWS_OBJ] (state, data) {
    state.popUpWindowsObj = data
  },
  [types.SET_UNIONID] (state, data) {
    state.unionid = data
  },
  [types.SET_SHARE_ID] (state, data) {
    state.shareid = data
  },
  [types.SET_CHANNEL] (state, data) {
    state.channel = data
  },
  [types.SET_IS_IOS] (state, data) {
    state.isIos = data
  },
  [types.SET_IS_REVIEW] (state, data) {
    state.isReview = data
  },
  [types.SET_INDEX_TYPE_LABEL_LIST] (state, data) {
    state.indexTypeLabelList = data
  },
  [types.SET_NAVIGATION_VERTICAL] (state, data) {
    state.navigationVertical = data
  },
  [types.SET_NAVIGATION_INDEX] (state, data) {
    state.navigationIndex = data
  },
  [types.SET_NAVIGATION_SCROLL_LEFT] (state, data) {
    state.navigationScrollLeft = data
  },
  [types.SET_NAVIGATION_ITEM_WIDTH] (state, data) {
    state.navigationItemWidth = data
  },
  [types.SET_MUSIC_LIST] (state, data) {
    state.musicList = data
  },
  [types.SET_ALL_MUSIC_LIST] (state, data) {
    state.allMusicList = data
  },
  [types.SET_CURRENT_INDEX] (state, data) {
    state.currentIndex = data
  },
  [types.SET_INDEX_LOADING_MUSIC_STATUS] (state, data) {
    state.indexLoadingMusicStatus = data
  },
  [types.SET_DURATION] (state, data) {
    state.duration = data
  },
  [types.CURRENT_MUSIC_ITEM] (state, data) {
    state.currentMusicItem = data
  },
  [types.ALL_CURRENT_MUSIC_ITEM] (state, data) {
    state.allCurrentMusicItem = data
  },
  [types.INDEX_CURRENT_VIDEO_ITEM] (state, data) {
    state.indexCurrentVideoItem = data
  },
  [types.SET_PLAYING_STATE] (state, data) {
    state.playing = data
  },
  [types.SET_ALL_PLAYING_STATE] (state, data) {
    state.allPlaying = data
  },
  [types.SET_MIMI_SHOW_CLOSE_STATUS] (state, data) {
    state.miniShowCloseStatus = data
  },
  [types.SET_MIMI_SHOW_HIDE_STATUS] (state, data) {
    state.miniShowHideStatus = data
  },
  [types.SET_MINI_PLAY_LIST_STATUS] (state, data) {
    state.miniPlayListStatus = data
  },
  [types.SET_IS_SWITCH_MUSIC_STATE] (state, data) {
    state.isSwitchMusic = data
  },
  [types.SET_SCROLL_WIDTH_ANIMATION] (state, data) {
    state.scrollWithAnimation = data
  },
  [types.SET_CURRENT_TIME] (state, data) {
    state.currentTime = data
  },
  [types.SET_TOTAL_TIME] (state, data) {
    state.totalTime = data
  },
  [types.SET_IS_SPEED_STATE] (state, data) {
    state.isSpeedState = data
  },
  [types.SET_ALLTYPE_LIST] (state, data) {
    state.allTypeList = data
  },
  [types.SET_HOT_COLUMN_LIST] (state, data) {
    state.hotColumnList = data
  },
  [types.SET_CHECKBOX_CURRENT_PLAY_STATUS] (state, data) {
    state.checkBoxCurrentPlayStatus = data
  },
  [types.SET_ALL_SEARCH_LISTS] (state, data) {
    state.allSearchLists = data
  },
  [types.SET_SUBJECT_SEARCH_LISTS] (state, data) {
    state.subjectSearchLists = data
  },
  [types.SET_COLLECT_SUBJECT_LIST] (state, data) {
    state.collectSubjectList = data
  },
  [types.SET_COLLECT_MUSIC_LIST] (state, data) {
    state.collectMusicList = data
  },
  [types.SET_ADD_REMARK_STATUS] (state, data) {
    state.addRemarkStatus = data
  },
  [types.SET_PLAY_HISTORY_LIST] (state, data) {
    state.playHistoryList = data
  },
  [types.SET_LOADING_STATE] (state, data) {
    state.loadingState = data
  },
  [types.SET_IS_DATA_STATE] (state, data) {
    state.isDataState = data
  },
  [types.SET_IS_NEWS_DATA_STATE] (state, data) {
    state.isNewsDataState = data
  },
  [types.SET_RECOMMEND_LABEL_LIST] (state, data) {
    state.recommendLabelList = data
  },
  [types.SET_SHARE_THUMBNAIL] (state, data) {
    state.shareThumbnail = data
  },
  [types.SET_SEEK_RECOMMEND_LABEL_LIST] (state, data) {
    state.seekRecommendLabelList = data
  },
  [types.SET_DAYS] (state, data) {
    state.days = data
  },
  [types.SET_CHECK_IN_LIST] (state, data) {
    state.checkInList = data
  },
  [types.SET_CHECK_IN_DATE_LIST] (state, data) {
    state.checkInDateList = data
  },
  [types.SET_NEWS_LIST] (state, data) {
    state.newsList = data
  },
  [types.SET_COLLECT_ARTICLE_LIST] (state, data) {
    state.collectArticleList = data
  },
  [types.SET_SHARE_LATEST_RANK_LIST] (state, data) {
    state.shareLatestRankList = data
  },
  [types.SET_SHARE_RANKING_OBJ] (state, data) {
    state.shareRankingObj = data
  },
  [types.SET_CHECK_RANKING_OBJ] (state, data) {
    state.checkRankingObj = data
  },
  [types.SET_SHARE_ENERGY_OBJ] (state, data) {
    state.shareEnergyObj = data
  },
  [types.SET_SHARE_INFO] (state, data) {
    state.shareInfo = data
  },
  [types.SET_FEEDBACK_HISTORY_LIST] (state, data) {
    state.feedbackHistoryList = data
  },
  [types.SET_FEEDBACK_DATAIL] (state, data) {
    state.feedbackDetails = data
  },
  [types.SET_GIVE_THUMBS_MUSIC_LIST] (state, data) {
    state.giveThumbsMusicList = data
  },
  [types.SET_CONTENT_WORD_LIST] (state, data) {
    state.contentWordList = data
  },
  [types.SET_SUBJECT_DETAIL_LIST] (state, data) {
    state.subjectDetailList = data
  },
  [types.SET_SIMILARITY_COURSE_LIST] (state, data) {
    state.similarityCourseList = data
  },
  [types.SET_COMMENT_LIST] (state, data) {
    state.commentList = data
  },
  [types.SET_CONVERSION_BOOK_LIST] (state, data) {
    state.conversionBookList = data
  },
  [types.SET_ROB_BOOK_LIST] (state, data) {
    state.robBookList = data
  },
  [types.SET_BING_PHONE_INFO] (state, data) {
    state.bingPhoneInfo = data
  },
  [types.SET_LEVEL_ONE_JOB_LIST] (state, data) {
    state.levelOneJobList = data
  },
  [types.SET_SELECTED_JOB_INFO] (state, data) {
    state.selectedJobInfo = data
  },
  [types.SET_ADDRESS_LIST] (state, data) {
    state.addressList = data
  },
  [types.SET_AFFIRM_SITE_INFO] (state, data) {
    state.AffirmSiteInfo = data
  },
  [types.SET_SCREEN_BOTTLE_STATUS] (state, data) {
    state.screenBottleStatus = data
  },
  [types.SET_ORDER_LIST] (state, data) {
    state.orderList = data
  },
  [types.SET_BOTTLE_RECORD_LIST] (state, data) {
    state.bottleRecordList = data
  },
  [types.SET_TASK_CASE_LIST] (state, data) {
    state.taskCaseList = data
  },
  [types.SET_GROWHT_RECORD_LIST] (state, data) {
    state.growhtRecordList = data
  },
  [types.SET_IN_THE_BOOK_LIST] (state, data) {
    state.inTheBookList = data
  },
  [types.SET_MISSION_POPUP_STATUS] (state, data) {
    state.missionPopupStatus = data
  },
  [types.SET_CHECK_STATUS] (state, data) {
    state.checkStatus = data
  },
  [types.SET_SHARE_POPUP_STATE] (state, data) {
    state.sharePopupState = data
  },
  [types.SET_RULE_POPUP_STATUS] (state, data) {
    state.rulePopupStatus = data
  },
  [types.SET_TUITION_ME_LIST_STATUS] (state, data) {
    state.tuitionMeListStatus = data
  },
  [types.SET_ALL_GRAB_LIST] (state, data) {
    state.allGrabList = data
  },
  [types.SET_GRAB_TUITION_LIST] (state, data) {
    state.grabTuitionList = data
  },
  [types.SET_CONDUCT_GRAB_TUITION_LIST] (state, data) {
    state.conductGrabTuitionList = data
  },
  [types.SET_ACCOMPLISH_GRAB_TUITION_LIST] (state, data) {
    state.accomplishGrabTuitionList = data
  },
  [types.SET_CONSUME_LIST] (state, data) {
    state.consumeList = data
  },
  [types.SET_EXTRACT_CASH_LIST] (state, data) {
    state.extractCashList = data
  },
  [types.SET_LECTURE_SUBJECT_LIST] (state, data) {
    state.lectureSubjectList = data
  },
  [types.SET_LECTURE_MUSIC_LIST] (state, data) {
    state.lectureMusicList = data
  },
  [types.SET_MY_ATTENTION_LIST] (state, data) {
    state.myAttentionList = data
  },
  [types.SET_MY_SUBSCRIPTION_LIST] (state, data) {
    state.mySubscriptionList = data
  },
  [types.SET_MY_COURSE_LIST] (state, data) {
    state.myCourseList = data
  },
  [types.SET_RETURN_MONEY_POP_UP_STATE] (state, data) {
    state.returnMoneyPopUpState = data
  },
  [types.SET_EXCELLENT_COURSE_INDEX] (state, data) {
    state.excellentCourseIndex = data
  },
  [types.SET_EXCELLENT_COURSE_SCROLL_LEFT] (state, data) {
    state.excellentCourseScrollLeft = data
  },
  [types.SET_EXCELLENT_COURSE_ITEM_WIDTH] (state, data) {
    state.excellentCourseItemWidth = data
  },
  [types.MUSIC_DETAILS] (state, data) {
    state.musicDetails = data
  },
  [types.SET_EXCHANGE_INVITE_STATE] (state, data) {
    state.exchangeInviteState = data
  },
  [types.SET_TITLE_STATE] (state, data) {
    state.setTitleState = data
  },
  [types.SET_MESSAGE_FROM_USER_LIST] (state, data) {
    state.messageFromUserList = data
  },
  [types.SET_MESSAGE_READ_LIST] (state, data) {
    state.messageReadList = data
  },
  [types.SET_GET_COURSE_POPUP_STATE] (state, data) {
    state.getCoursePopUpState = data
  },
  [types.SET_AUTHOR_WINDOW_GOODS_LIST] (state, data) {
    state.authorWindowGoodsList = data
  },
  [types.SET_AUTHOR_SEARCH_GOODS_LIST] (state, data) {
    state.authorSearchGoodsList = data
  },
  [types.SET_INDEX_VIDEO_LIST] (state, data) {
    state.indexVideoList = data
  },
  [types.SET_WORK_INFO] (state, data) {
    state.workInfo = data
  },
  [types.SET_EDUCATION_INFO] (state, data) {
    state.educationInfo = data
  },
  [types.SET_SUBJECT_GOODS_LABEL_LIST] (state, data) {
    state.subjectGoodsLabelList = data
  },
  [types.SET_ONE_TYPE_OCCUPATION_LIST] (state, data) {
    state.occupationList = data
  }
}

export default mutations
