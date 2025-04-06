const texts = {
  _loading: '读取中',
  _lostConnection: '失去连接',
  _notFound: '查无此页',
  _notFoundUser: '查无此人',
  _notFoundSubject: '查无此片',
  _startingYear: '开始年份',
  _endingYear: '结束年份',
  _minScore: '最低分数',
  _maxScore: '最高分数',
  _enterTargetUsername: '输入目标用户名',
  _feedback: '问题反馈',
  _changeLog: '更新日志',
  _submitPr: '查看源码',
  _backToHome: '返回首页',
  _season: '当季动画',
  _trending: '评分趋势',
  _history: '历史分布',
  _user: '个人评分',
  _experimental: '实验功能',
  _menu: '————',
  _darkMode: '黑暗模式',
  _lightMode: '明亮模式',
  // Season view texts
  _seasonBattleStatus: '新番战况',
  _howToZoom: '如何放大缩小？',
  _zoomInstruction:
    '用鼠标左键在图表中拖选一个方块自定义时间范围，点击图表右上角的重置缩放按钮恢复',
  _howToShowLabels: '如何在曲线上显示标签？',
  _altKeyShowLabels: '按Alt键可显示标签',
  _top10ScoreComparison: '热门前10评分对比',
  _top10RankingComparison: '热门前10排名对比',
  _balanceChart: '平衡榜',
  _scoreComparison: '打1分和10分的数量对比',
  _distributionChart: '分布图',
  _chartLegend: '尺寸越大越热门，颜色越红争议越大',
  _january: '一月',
  _april: '四月',
  _july: '七月',
  _october: '十月',
  // Trending view texts
  _popularEntries: '热门条目',
  _increasingRank: '涨幅排行',
  _decreasingRank: '跌幅排行',
  // Home view texts
  _currentSeason: '当季动画',
  _dragonVsTiger: '龙争虎斗',
  _allSiteAnime: '全站动画',
  _hotTrends: '热门趋势',
  _scoreDistribution: '评分分布图',
  _personalAnime: '个人动画',
  _scoreDistribution2: '评分分布',
  _credits: 'Credits',
  _specialThanks: 'Special Thanks',
  _dataSupport: '数据支持',
  _netabareCommittee: 'Netabare制作委员会',
  _autoScrolling: 'Auto-scrolling (Press Enter to stop)',
  // Vs view texts
  _destroyedSpaceTime: '你摧毁了时空结构',
  _gameOver: 'game over',
  // Guess view texts
  _scoreChartRecognition: '评分图识别技术考试',
  _continueChallenge: '继续挑战',
  _submitExam: '交卷',
  _graph: '图形',
  // Subject view texts
  _visitBangumi: '访问Bangumi上的条目',
  _all: '全部',
  _broadcastPeriod: '放送期间',
  _howToCustomizeTimeRange: '如何自定义时间范围？',
  _score: '评分',
  _rank: '排名',
  _watching: '在看',
  _ratingDistribution: '评分分布',
  _currentRating: '当前评分',
  _oneMonthRating: '一个月内评分',
  _oneYearRating: '一年内评分',
  _currentAverageScore: '当前均分',
  _oneMonthAverageScore: '一个月内均分与当前均分的差异',
  _oneYearAverageScore: '一年内均分与当前均分的差异',
  _experimentalFeature: '实验功能',
  _compareWithFrieren: '实验功能：对比「葬送的芙莉莲」'
};
const _allTextCombined = Object.values(texts).join(' ');

export default { ...texts, _allTextCombined };
