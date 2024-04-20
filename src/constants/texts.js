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
  _backToHome: '返回首页'
}
const _allTextCombined = Object.values(texts).join(' ')

export default { ...texts, _allTextCombined }
