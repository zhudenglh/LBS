// 金陵驿站 v3.0 - JavaScript交互逻辑
// WiFi核心功能 + 路线换乘统一 + 社交元素

// ==================== 全局状态 ====================
const AppState = {
    wifiStatus: 'disconnected', // disconnected, connecting, connected, error
    currentStation: null,
    userLikes: new Set(),
    followedUsers: new Set()
};

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', function() {
    // 检查首次访问
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
        showOnboarding();
    } else {
        hideOnboarding();
    }

    // 加载用户数据
    loadUserData();

    // 自动滚动到当前站点
    scrollToCurrentStation();

    // 不再自动连接WiFi，等待用户手动点击
});

// ==================== 路线滚动 ====================
function scrollToCurrentStation() {
    setTimeout(() => {
        const currentStation = document.querySelector('.station-node.current');
        const scrollContainer = document.querySelector('.route-scroll-container');

        if (currentStation && scrollContainer) {
            const containerWidth = scrollContainer.clientWidth;
            const stationLeft = currentStation.offsetLeft;
            const stationWidth = currentStation.clientWidth;

            // 滚动到当前站点居中位置
            const scrollPosition = stationLeft - (containerWidth / 2) + (stationWidth / 2);

            scrollContainer.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
        }
    }, 100);
}

// ==================== WiFi功能 ====================
function connectWiFi() {
    setWiFiStatus('connecting');
    showToast('正在连接车载WiFi...');

    // 模拟连接过程（2秒）
    setTimeout(() => {
        // 90%成功率
        if (Math.random() > 0.1) {
            setWiFiStatus('connected');
            showToast('✅ WiFi已连接\n畅享免费网络！');
        } else {
            setWiFiStatus('error');
            showToast('❌ WiFi连接失败\n可能处于隧道/地下路段');
        }
    }, 2000);
}

function setWiFiStatus(status) {
    AppState.wifiStatus = status;

    // 隐藏所有状态
    document.querySelectorAll('.wifi-state').forEach(el => {
        el.classList.add('hidden');
    });

    // 显示当前状态
    const statusMap = {
        'disconnected': 'wifiDisconnected',
        'connecting': 'wifiConnecting',
        'connected': 'wifiConnected',
        'error': 'wifiError'
    };

    const targetId = statusMap[status];
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        targetElement.classList.remove('hidden');
    }
}

// ==================== 路线抽屉 ====================
function toggleRouteDrawer() {
    const drawer = document.getElementById('routeDrawer');
    drawer.classList.toggle('open');

    if (drawer.classList.contains('open')) {
        showToast('查看完整路线与换乘');
    }
}

// ==================== 社交功能 ====================
function likePost(event, button) {
    event.stopPropagation();

    const countSpan = button.querySelector('.count');
    let count = parseInt(countSpan.textContent);

    if (button.classList.contains('liked')) {
        // 取消点赞
        button.classList.remove('liked');
        count--;
        showToast('已取消点赞');
    } else {
        // 点赞
        button.classList.add('liked');
        count++;
        showToast('❤️ 已点赞');

        // 点赞动画
        button.style.animation = 'bounce 0.3s';
        setTimeout(() => {
            button.style.animation = '';
        }, 300);
    }

    countSpan.textContent = count;
}

function showComments(event) {
    event.stopPropagation();
    showToast('查看评论');
    // 实际应用中会打开评论弹窗
}

function followUser(event, userName) {
    event.stopPropagation();

    const button = event.target;

    if (button.classList.contains('following')) {
        button.classList.remove('following');
        button.textContent = '+ 关注';
        showToast(`已取消关注 ${userName}`);
        AppState.followedUsers.delete(userName);
    } else {
        button.classList.add('following');
        button.textContent = '已关注';
        showToast(`✅ 已关注 ${userName}`);
        AppState.followedUsers.add(userName);
    }

    saveUserData();
}

function showProfile() {
    showToast('个人主页\n查看我的收藏和打卡');
}

// ==================== 内容交互 ====================
function navigate(event, lat, lon, name) {
    event.stopPropagation();

    const amapUrl = `https://uri.amap.com/navigation?to=${lon},${lat},${encodeURIComponent(name)}&mode=walk&coordinate=gaode&callnative=1`;

    showToast(`📍 导航到 ${name}`);

    setTimeout(() => {
        window.open(amapUrl, '_blank');
    }, 500);
}

function shareContent(title) {
    showToast(`📤 分享：${title}`);

    if (navigator.share) {
        navigator.share({
            title: `金陵驿站推荐：${title}`,
            text: `在金陵驿站发现了好去处！`,
            url: window.location.href
        }).catch(() => {});
    }
}

function saveContent(title) {
    showToast(`⭐ 已收藏：${title}`);

    let saved = localStorage.getItem('savedContent') || '[]';
    try {
        let savedList = JSON.parse(saved);
        if (!savedList.includes(title)) {
            savedList.push(title);
            localStorage.setItem('savedContent', JSON.stringify(savedList));
        }
    } catch (e) {
        console.error('保存失败:', e);
    }
}

function getCoupon(shop) {
    showToast(`🎟️ 优惠券已领取！\n${shop}等你来~`);

    // 添加领券动画
    event.target.style.animation = 'pulse 0.5s';
    setTimeout(() => {
        event.target.style.animation = '';
    }, 500);
}

function showMore(category) {
    showToast('查看更多服务');
}

// ==================== 加载更多内容 ====================
function loadMoreContent() {
    const btn = document.querySelector('.load-more-btn');
    btn.textContent = '加载中...';
    btn.disabled = true;

    setTimeout(() => {
        showToast('已加载更多内容');
        btn.textContent = '查看更多推荐 ↓';
        btn.disabled = false;
    }, 1000);
}

// ==================== 引导页 ====================
function showOnboarding() {
    const onboarding = document.getElementById('onboarding');
    if (onboarding) {
        onboarding.classList.remove('hidden');
    }
}

function hideOnboarding() {
    const onboarding = document.getElementById('onboarding');
    if (onboarding) {
        onboarding.classList.add('hidden');
    }
}

function skipOnboarding() {
    localStorage.setItem('hasVisited', 'true');
    hideOnboarding();
    showToast('随时点击路线图查看完整信息');
}

function startExperience() {
    localStorage.setItem('hasVisited', 'true');
    hideOnboarding();
    showToast('欢迎使用金陵驿站！🚌');

    // 1秒后展示路线图
    setTimeout(() => {
        toggleRouteDrawer();
    }, 1000);
}

// ==================== Toast提示 ====================
function showToast(message) {
    // 移除现有toast
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    // 创建新toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.85);
        color: white;
        padding: 12px 24px;
        border-radius: 20px;
        font-size: 14px;
        z-index: 1000;
        max-width: 80%;
        text-align: center;
        line-height: 1.5;
        white-space: pre-line;
        animation: toastSlideIn 0.3s ease-out;
    `;
    toast.textContent = message;

    document.body.appendChild(toast);

    // 3秒后移除
    setTimeout(() => {
        toast.style.animation = 'toastSlideOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Toast动画
const style = document.createElement('style');
style.textContent = `
    @keyframes toastSlideIn {
        from { opacity: 0; transform: translate(-50%, -20px); }
        to { opacity: 1; transform: translate(-50%, 0); }
    }
    @keyframes toastSlideOut {
        from { opacity: 1; transform: translate(-50%, 0); }
        to { opacity: 0; transform: translate(-50%, -20px); }
    }
    @keyframes bounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
`;
document.head.appendChild(style);

// ==================== 数据持久化 ====================
function loadUserData() {
    try {
        const likes = localStorage.getItem('userLikes');
        if (likes) {
            AppState.userLikes = new Set(JSON.parse(likes));
        }

        const follows = localStorage.getItem('followedUsers');
        if (follows) {
            AppState.followedUsers = new Set(JSON.parse(follows));
        }
    } catch (e) {
        console.error('加载用户数据失败:', e);
    }
}

function saveUserData() {
    try {
        localStorage.setItem('userLikes', JSON.stringify([...AppState.userLikes]));
        localStorage.setItem('followedUsers', JSON.stringify([...AppState.followedUsers]));
    } catch (e) {
        console.error('保存用户数据失败:', e);
    }
}

// ==================== 键盘快捷键 ====================
document.addEventListener('keydown', function(e) {
    if (e.key === 'r' || e.key === 'R') location.reload();
    if (e.key === 'o' || e.key === 'O') showOnboarding();
    if (e.key === 'l' || e.key === 'L') toggleRouteDrawer();
    if (e.key === 'w' || e.key === 'W') {
        if (AppState.wifiStatus === 'disconnected') {
            connectWiFi();
        }
    }
});

// ==================== 触摸优化 ====================
document.addEventListener('touchstart', function() {}, { passive: true });

// 防止双击缩放
let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// ==================== 控制台信息 ====================
console.log('%c金陵驿站 🚌', 'font-size: 24px; color: #1890FF; font-weight: bold;');
console.log('%c南京公交服务平台 v3.0 - 社交版', 'font-size: 14px; color: #8C8C8C;');
console.log('%c\n核心功能:', 'font-size: 12px; color: #52C41A; font-weight: bold;');
console.log('✅ WiFi多状态展示（未连接/连接中/已连接/故障）');
console.log('✅ 路线与换乘信息统一（抽屉式）');
console.log('✅ 社交元素（点赞/评论/关注/打卡）');
console.log('✅ 应急服务融入内容流');
console.log('\n%c快捷键:', 'font-size: 12px; color: #FF8C00; font-weight: bold;');
console.log('  R - 重新加载');
console.log('  O - 显示引导');
console.log('  L - 路线图');
console.log('  W - 连接WiFi');

// 模拟WiFi状态变化（进入隧道）- 仅当已连接时
setTimeout(() => {
    if (Math.random() > 0.7 && AppState.wifiStatus === 'connected') {
        setWiFiStatus('error');
        showToast('⚠️ WiFi信号丢失\n可能进入了隧道');

        // 10秒后恢复到未连接状态，等待用户手动重连
        setTimeout(() => {
            if (AppState.wifiStatus === 'error') {
                setWiFiStatus('disconnected');
                showToast('已离开隧道，WiFi可用\n点击"连接WiFi"按钮重新连接');
            }
        }, 10000);
    }
}, 30000);

// ==================== 应急服务详情页 ====================
const emergencyServicesData = [
    // 医疗健康
    {
        id: 1, category: 'medical', icon: '🏥', name: '南京市第一医院',
        type: '三甲医院', distance: '450米', walkTime: '6分钟',
        status: '24小时急诊', phone: '025-52271000',
        features: ['急诊', '内科', '外科', '儿科'],
        lat: 32.0425, lng: 118.7785
    },
    {
        id: 2, category: 'medical', icon: '💊', name: '老百姓大药房',
        type: '连锁药店', distance: '200米', walkTime: '3分钟',
        status: '营业至22:00', phone: '025-83456789',
        features: ['处方药', '非处方药', '医保定点'],
        lat: 32.0422, lng: 118.7782
    },
    {
        id: 3, category: 'medical', icon: '🚑', name: '社区卫生服务中心',
        type: '社区医院', distance: '320米', walkTime: '4分钟',
        status: '营业中 8:00-17:30', phone: '025-83123456',
        features: ['全科', '中医', '康复', '体检'],
        lat: 32.0423, lng: 118.7783
    },
    // 应急救援
    {
        id: 4, category: 'emergency', icon: '🚓', name: '新街口派出所',
        type: '公安机关', distance: '380米', walkTime: '5分钟',
        status: '24小时值班', phone: '110 / 025-84457110',
        features: ['报警', '求助', '咨询'],
        lat: 32.0421, lng: 118.7781
    },
    {
        id: 5, category: 'emergency', icon: '🚒', name: '消防救援站',
        type: '消防机构', distance: '550米', walkTime: '7分钟',
        status: '24小时待命', phone: '119',
        features: ['火灾扑救', '应急救援'],
        lat: 32.0426, lng: 118.7786
    },
    {
        id: 6, category: 'emergency', icon: '🆘', name: 'AED自动除颤器',
        type: '急救设备', distance: '150米', walkTime: '2分钟',
        status: '可用', location: '地铁站A出口',
        features: ['心脏骤停急救'],
        lat: 32.0419, lng: 118.7779
    },
    // 日常便利
    {
        id: 7, category: 'daily', icon: '🏪', name: '罗森便利店',
        type: '24小时便利店', distance: '80米', walkTime: '1分钟',
        status: '营业中', phone: '025-83234567',
        features: ['零食饮料', '日用品', '热食'],
        lat: 32.0418, lng: 118.7776
    },
    {
        id: 8, category: 'daily', icon: '🚻', name: '公共卫生间',
        type: '公共设施', distance: '120米', walkTime: '2分钟',
        status: '24小时开放', features: ['无障碍', '母婴室'],
        lat: 32.0420, lng: 118.7780
    },
    {
        id: 9, category: 'daily', icon: '🏧', name: '中国银行ATM',
        type: '自助银行', distance: '90米', walkTime: '1分钟',
        status: '24小时服务', features: ['取款', '存款', '转账', '查询'],
        lat: 32.0417, lng: 118.7777
    },
    {
        id: 10, category: 'daily', icon: '☕', name: '瑞幸咖啡',
        type: '咖啡店', distance: '110米', walkTime: '2分钟',
        status: '营业中 7:00-22:00', phone: '4000-100-100',
        features: ['咖啡', '茶饮', '轻食'],
        lat: 32.0419, lng: 118.7778
    },
    // 生活服务
    {
        id: 11, category: 'service', icon: '🔧', name: '快修侠手机维修',
        type: '维修服务', distance: '250米', walkTime: '3分钟',
        status: '营业中 9:00-21:00', phone: '025-83345678',
        features: ['手机维修', '电脑维修', '上门服务'],
        lat: 32.0424, lng: 118.7784
    },
    {
        id: 12, category: 'service', icon: '💈', name: '星艺发型设计',
        type: '美发店', distance: '180米', walkTime: '2分钟',
        status: '营业中 10:00-20:00', phone: '025-83456123',
        features: ['理发', '烫染', '造型'],
        lat: 32.0421, lng: 118.7781
    },
    {
        id: 13, category: 'service', icon: '🧺', name: '衣之恋干洗店',
        type: '洗衣服务', distance: '160米', walkTime: '2分钟',
        status: '营业中 8:00-20:00', phone: '025-83567890',
        features: ['干洗', '水洗', '熨烫', '取送'],
        lat: 32.0420, lng: 118.7780
    },
    {
        id: 14, category: 'service', icon: '📦', name: '菜鸟驿站',
        type: '快递服务', distance: '95米', walkTime: '1分钟',
        status: '营业中 8:00-22:00', phone: '025-83678901',
        features: ['快递收发', '包裹寄存'],
        lat: 32.0418, lng: 118.7778
    },
    // 政务服务
    {
        id: 15, category: 'government', icon: '🏛️', name: '市民服务中心',
        type: '政务大厅', distance: '420米', walkTime: '6分钟',
        status: '工作日 9:00-17:00', phone: '025-12345',
        features: ['证件办理', '社保', '公积金', '税务'],
        lat: 32.0426, lng: 118.7786
    },
    {
        id: 16, category: 'government', icon: '📮', name: '中国邮政',
        type: '邮政网点', distance: '210米', walkTime: '3分钟',
        status: '营业中 8:30-17:30', phone: '025-83789012',
        features: ['邮寄', 'EMS', '邮政储蓄'],
        lat: 32.0422, lng: 118.7782
    }
];

let currentCategory = 'all';

// 显示更多服务
function showMore(type) {
    if (type === 'emergency') {
        const detailPage = document.getElementById('emergencyDetailPage');
        detailPage.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        renderEmergencyServices('all');
    }
}

// 关闭详情页
function closeDetailPage() {
    const detailPage = document.getElementById('emergencyDetailPage');
    detailPage.classList.add('hidden');
    document.body.style.overflow = '';
}

// 过滤服务
function filterEmergencyServices(category) {
    currentCategory = category;

    // 更新标签状态
    const tabs = document.querySelectorAll('.category-tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.closest('.category-tab').classList.add('active');

    renderEmergencyServices(category);
}

// 渲染服务列表
function renderEmergencyServices(category) {
    const filteredServices = category === 'all'
        ? emergencyServicesData
        : emergencyServicesData.filter(s => s.category === category);

    // 更新计数
    const countElement = document.querySelector('#servicesCount .count-number');
    countElement.textContent = filteredServices.length;

    // 渲染列表
    const listElement = document.getElementById('servicesList');
    listElement.innerHTML = filteredServices.map(service => `
        <div class="service-detail-card">
            <div class="service-main">
                <div class="service-icon-large">${service.icon}</div>
                <div class="service-content">
                    <div class="service-title">
                        <h3>${service.name}</h3>
                        <span class="service-type">${service.type}</span>
                    </div>
                    <div class="service-distance-info">
                        <span class="distance">${service.distance}</span>
                        <span class="separator">·</span>
                        <span class="walk-time">步行约${service.walkTime}</span>
                    </div>
                    <div class="service-status-badge">
                        <span class="status-dot ${service.status.includes('24小时') || service.status.includes('营业中') ? 'open' : 'limited'}"></span>
                        ${service.status}
                    </div>
                    ${service.features ? `
                        <div class="service-features">
                            ${service.features.map(f => `<span class="feature-tag">${f}</span>`).join('')}
                        </div>
                    ` : ''}
                    ${service.location ? `<div class="service-location">📍 ${service.location}</div>` : ''}
                </div>
            </div>
            <div class="service-actions">
                ${service.phone ? `
                    <button class="action-btn call-btn" onclick="makeCall('${service.phone}')">
                        📞 拨打
                    </button>
                ` : ''}
                <button class="action-btn navigate-btn" onclick="navigate(event, ${service.lat}, ${service.lng}, '${service.name}')">
                    🧭 导航
                </button>
            </div>
        </div>
    `).join('');
}

// 拨打电话
function makeCall(phone) {
    const cleanPhone = phone.split('/')[0].trim();
    window.location.href = `tel:${cleanPhone}`;
    showToast(`正在拨打 ${cleanPhone}`);
}
