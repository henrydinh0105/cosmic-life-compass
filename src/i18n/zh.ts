const translations: Record<string, string> = {
  // Start page
  'start.title': '你现在处于人生的哪个阶段？',
  'start.subtitle': '通过东方智慧发现你当前的生命节奏',
  'start.button': '开始你的旅程',
  
  // Quiz page
  'quiz.back': '返回',
  'quiz.next': '继续',
  'quiz.submit': '揭示我的洞见',
  'quiz.skip': '跳过此问题',
  'quiz.step': '步骤',
  'quiz.of': '共',
  
  // Quiz questions
  'quiz.birthDate': '你的旅程何时开始？',
  'quiz.birthTime': '你出生在什么时间？',
  'quiz.gender': '你如何定义自己？',
  'quiz.lifeFocus': '现在生活中哪个领域最吸引你？',
  'quiz.currentAttention': '此刻什么最吸引你的注意力？',
  'quiz.seekClarity': '你在哪里寻求清晰？',
  
  // Birth time options
  'quiz.morning': '早晨',
  'quiz.morning.desc': '上午6:00 - 中午12:00',
  'quiz.afternoon': '下午',
  'quiz.afternoon.desc': '中午12:00 - 下午6:00',
  'quiz.evening': '傍晚',
  'quiz.evening.desc': '下午6:00 - 午夜12:00',
  'quiz.night': '深夜',
  'quiz.night.desc': '午夜12:00 - 上午6:00',
  'quiz.unknown': '我不确定',
  'quiz.unknown.desc': '没关系，我们会根据现有信息分析',
  
  // Birth time - Earthly Branches
  'quiz.time.rat': '子时 (23h-1h)',
  'quiz.time.rat.desc': '23:00 - 01:00',
  'quiz.time.ox': '丑时 (1h-3h)',
  'quiz.time.ox.desc': '01:00 - 03:00',
  'quiz.time.tiger': '寅时 (3h-5h)',
  'quiz.time.tiger.desc': '03:00 - 05:00',
  'quiz.time.rabbit': '卯时 (5h-7h)',
  'quiz.time.rabbit.desc': '05:00 - 07:00',
  'quiz.time.dragon': '辰时 (7h-9h)',
  'quiz.time.dragon.desc': '07:00 - 09:00',
  'quiz.time.snake': '巳时 (9h-11h)',
  'quiz.time.snake.desc': '09:00 - 11:00',
  'quiz.time.horse': '午时 (11h-13h)',
  'quiz.time.horse.desc': '11:00 - 13:00',
  'quiz.time.goat': '未时 (13h-15h)',
  'quiz.time.goat.desc': '13:00 - 15:00',
  'quiz.time.monkey': '申时 (15h-17h)',
  'quiz.time.monkey.desc': '15:00 - 17:00',
  'quiz.time.rooster': '酉时 (17h-19h)',
  'quiz.time.rooster.desc': '17:00 - 19:00',
  'quiz.time.dog': '戌时 (19h-21h)',
  'quiz.time.dog.desc': '19:00 - 21:00',
  'quiz.time.pig': '亥时 (21h-23h)',
  'quiz.time.pig.desc': '21:00 - 23:00',
  'quiz.time.unknown': '我不知道',
  'quiz.time.unknown.desc': '没关系',
  'quiz.time.selectPlaceholder': '选择出生时辰...',
  'quiz.time.question': '您是什么时辰出生的？',
  'quiz.time.helper': '出生日期和时间帮助我们分析您的生命模式',
  
  // Gender options
  'quiz.feminine': '阴性能量',
  'quiz.feminine.desc': '阴性导向模式',
  'quiz.masculine': '阳性能量',
  'quiz.masculine.desc': '阳性导向模式',
  'quiz.balanced': '平衡',
  'quiz.balanced.desc': '和谐模式',
  'quiz.preferNot': '不想说',
  'quiz.preferNot.desc': '我们将进行通用分析',
  
  // Life focus options
  'quiz.career': '事业与目标',
  'quiz.career.desc': '职业发展和有意义的工作',
  'quiz.relationships': '人际关系',
  'quiz.relationships.desc': '与亲人的联系',
  'quiz.personal': '个人成长',
  'quiz.personal.desc': '自我发现和内在发展',
  'quiz.balance': '生活平衡',
  'quiz.balance.desc': '各方面的和谐',
  
  // Current attention options
  'quiz.stability': '稳定',
  'quiz.stability.desc': '建立稳固的基础',
  'quiz.change': '变化',
  'quiz.change.desc': '拥抱新方向',
  'quiz.growth': '成长',
  'quiz.growth.desc': '拓展你的视野',
  'quiz.rest': '休息',
  'quiz.rest.desc': '恢复和更新',
  
  // Seek clarity options
  'quiz.work': '工作与事业',
  'quiz.work.desc': '职业道路和决策',
  'quiz.love': '爱情与连接',
  'quiz.love.desc': '心灵的事务',
  'quiz.health': '健康与活力',
  'quiz.health.desc': '身心健康',
  'quiz.purpose': '人生目标',
  'quiz.purpose.desc': '意义和方向',
  
  // Results page
  'results.title': '你的生命洞见',
  'results.personality': '性格快照',
  'results.coreNature': '核心本质',
  'results.coreNature.subtitle': '你如何自然地思考、反应和决策',
  'results.naturalStrength': '天然优势',
  'results.naturalStrength.subtitle': '你在平衡时的独特优势',
  'results.blindSpot': '盲点',
  'results.blindSpot.subtitle': '你不知不觉中限制自己的地方',
  'results.innerTension': '内在张力',
  'results.innerTension.subtitle': '你经常经历的内在冲突',
  'results.growthDirection': '成长方向',
  'results.growthDirection.subtitle': '如何恢复平衡',
  
  'results.recognition': '自我认同分数',
  'results.recognition.subtitle': '这份反思与你的生活经历有多接近',
  'results.recognition.20': '几乎不相关',
  'results.recognition.40': '有些熟悉',
  'results.recognition.60': '大部分准确',
  'results.recognition.80': '非常接近',
  'results.recognition.100': '准确到让人不安',
  'results.recognition.message': '如果这份反思引起共鸣，理解时机可能和理解自己一样重要。',
  
  'results.lifeEnergy': '生命能量图',
  'results.currentState': '当前状态',
  'results.guidance': '指导',
  
  'results.achievement': '成就与认可',
  'results.achievement.desc': '你对成就和能见度的追求',
  'results.connection': '关系与连接',
  'results.connection.desc': '你如何建立和维持关系',
  'results.emotional': '情感与内在平衡',
  'results.emotional.desc': '你的内在和谐与情感稳定',
  'results.support': '支持与资源',
  'results.support.desc': '可用的帮助和资源',
  'results.direction': '方向与目标',
  'results.direction.desc': '你的意义感和人生道路',
  
  'results.overall': '整体模式',
  'results.reflection': '反思问题',
  
  'results.guidance2026': '2026年月度指导',
  'results.guidance2026.subtitle': '每月接收个性化的时机洞见',
  'results.email.placeholder': '输入你的邮箱',
  'results.email.button': '获取月度洞见',
  'results.email.success': '谢谢！请留意你的第一份洞见。',
  'results.email.privacy': '我们尊重你的隐私。随时可以取消订阅。',
  
  'results.startOver': '重新开始',
  
  // Balance levels
  'balance.low': '低',
  'balance.moderate': '中等',
  'balance.strong': '强',
  
  // Loading
  'loading.title': '正在分析你的模式...',
  'loading.subtitle': '咨询东方智慧',
  'loading.message.1': '正在分析你的出生能量…',
  'loading.message.2': '搜索对应的宇宙模式…',
  'loading.message.3': '与生命节奏同步…',
  'loading.message.4': '发现隐藏的倾向…',
  'loading.message.5': '完成你的内心画像…',
  'loading.complete': '完成',

  // Common
  'common.loading': '加载中...',
  'common.error': '出现了问题',
};

export default translations;
