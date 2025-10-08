// 模拟数据
export const busData = {
  routeNumber: '25路',
  routeName: '南京公交免费WiFi',
  direction: '北固山 → 南理工科技园',
  currentStation: '中兴路',
  nextStation: '沼呷站',
  stationsRemaining: 5,
  estimatedTime: 16,
  totalStations: 18,
  currentStationIndex: 8,
  wifiStatus: 'connected', // connected, available, unavailable
};

export const stations = [
  { name: '楼医院', passed: true, hasTransfer: false },
  { name: '石板路', passed: true, hasTransfer: false },
  { name: '中兴路', passed: false, current: true, hasTransfer: true, transfers: ['地铁2号线', '地铁3号线'] },
  { name: '南苑路...公路(视桥)', passed: false, hasTransfer: false },
  { name: '东湍路', passed: false, hasTransfer: true, transfers: ['6路', '11路'] },
];

export const emergencyServices = [
  {
    id: 1,
    icon: '🚻',
    name: '公共厕所',
    distance: '120米',
    walkTime: '2分钟',
    status: '24小时开放'
  },
  {
    id: 2,
    icon: '🏪',
    name: '24h便利店',
    distance: '80米',
    walkTime: '1分钟',
    status: '营业中'
  },
  {
    id: 3,
    icon: '💊',
    name: '药店',
    distance: '200米',
    walkTime: '3分钟',
    status: '营业至22:00'
  },
];

export const transferInfo = {
  nextStation: '中兴路',
  metro: [
    { line: '地铁2号线', nextTrain: '3分钟后', direction: '经天路方向' },
    { line: '地铁3号线', nextTrain: '5分钟后', direction: '秣周东路方向' },
  ],
  bus: [
    { route: '6路', info: '途经新街口' },
    { route: '11路', info: '途经夫子庙' },
    { route: '33路', info: '途经鼓楼' },
  ],
  bike: [
    { brand: '美团单车', count: 5, status: '运营中' },
    { brand: '哈啰单车', count: 3, status: '运营中' },
  ]
};

export const offers = [
  {
    id: 1,
    image: '🍜',
    title: '旺福·贵州酸汤牛肉火锅',
    subtitle: '牛肉火锅双人套餐超值',
    distance: '1.2km',
    tags: ['随时退', '过期自动退'],
    price: '¥177.5',
    originalPrice: '¥308',
    discount: '首单省70.5元',
    sales: '5000+'
  },
  {
    id: 2,
    image: '☕',
    title: '星巴克（新街口店）',
    subtitle: '第二杯半价',
    distance: '0.3km',
    tags: ['新用户专享'],
    price: '¥28',
    originalPrice: '¥38',
    discount: '新人优惠',
    sales: '3000+'
  },
  {
    id: 3,
    image: '🍺',
    title: '海底捞火锅',
    subtitle: '等位送小吃',
    distance: '0.5km',
    tags: ['随时退', '免预约'],
    price: '¥198',
    originalPrice: '¥258',
    discount: '限时特惠',
    sales: '8000+'
  },
];

export const nearbyAttractions = [
  { name: '新街口', type: '商圈', distance: '500米' },
  { name: '夫子庙', type: '景点', distance: '2.3km' },
  { name: '德基广场', type: '购物', distance: '600米' },
];
