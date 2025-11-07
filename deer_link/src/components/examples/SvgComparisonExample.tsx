/**
 * SVG 方案对比示例
 *
 * 这个文件展示了三种使用 SVG 的方式：
 * 1. RemoteSvg（网络加载）- 当前使用
 * 2. svg-transformer（本地导入）- 推荐迁移
 * 3. 混合方案（开发/生产切换）
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// ============================================================================
// 方式 1: RemoteSvg（网络加载）
// ============================================================================
import RemoteSvg from '../common/RemoteSvg';

const FIGMA_URL = 'http://localhost:3845/assets/1e67e466904771282f83b62e84eab34b326ffea2.svg';

function Method1_RemoteSvg() {
  const [startTime] = useState(Date.now());
  const [loadTime, setLoadTime] = useState<number | null>(null);

  useEffect(() => {
    // 模拟测量加载时间
    const timer = setTimeout(() => {
      setLoadTime(Date.now() - startTime);
    }, 100);
    return () => clearTimeout(timer);
  }, [startTime]);

  return (
    <View style={styles.methodContainer}>
      <Text style={styles.methodTitle}>方式 1: RemoteSvg (网络加载)</Text>

      <View style={styles.iconRow}>
        <RemoteSvg uri={FIGMA_URL} width={48} height={48} />
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>⏱️ 加载时间: {loadTime ? `${loadTime}ms` : '加载中...'}</Text>
          <Text style={styles.infoText}>📡 需要网络: 是</Text>
          <Text style={styles.infoText}>📦 性能: 较差</Text>
        </View>
      </View>

      <View style={styles.codeBox}>
        <Text style={styles.codeText}>
          {`<RemoteSvg
  uri="http://localhost:3845/..."
  width={48}
  height={48}
/>`}
        </Text>
      </View>

      <View style={styles.prosConsBox}>
        <Text style={styles.prosTitle}>✅ 优点:</Text>
        <Text style={styles.prosText}>• 与 Figma 实时同步</Text>
        <Text style={styles.prosText}>• 无需手动下载文件</Text>
        <Text style={styles.prosText}>• 适合快速原型开发</Text>

        <Text style={styles.consTitle}>❌ 缺点:</Text>
        <Text style={styles.consText}>• 首次渲染慢 (~300ms)</Text>
        <Text style={styles.consText}>• 离线不可用</Text>
        <Text style={styles.consText}>• 生产环境不可用</Text>
      </View>
    </View>
  );
}

// ============================================================================
// 方式 2: svg-transformer（本地导入）
// ============================================================================
//
// 使用前需要：
// 1. 下载 SVG 到 src/assets/figma-icons/busIcon.svg
// 2. 导入: import BusIcon from '@/assets/figma-icons/busIcon.svg';
// 3. 使用: <BusIcon width={48} height={48} />
//
// 注意：这个示例需要你先下载 SVG 文件才能运行
//

function Method2_SvgTransformer() {
  // 假设已下载 SVG 并导入（需要取消注释）
  // import BusIcon from '@/assets/figma-icons/busIcon.svg';

  return (
    <View style={styles.methodContainer}>
      <Text style={styles.methodTitle}>方式 2: svg-transformer (本地导入)</Text>

      <View style={styles.iconRow}>
        {/* 取消注释使用: */}
        {/* <BusIcon width={48} height={48} fill="#0285f0" /> */}
        <View style={[styles.placeholder, { width: 48, height: 48 }]}>
          <Text style={styles.placeholderText}>SVG</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>⚡ 加载时间: ~1ms</Text>
          <Text style={styles.infoText}>📦 需要网络: 否</Text>
          <Text style={styles.infoText}>🚀 性能: 最佳</Text>
        </View>
      </View>

      <View style={styles.codeBox}>
        <Text style={styles.codeText}>
          {`import BusIcon from '@/assets/icons/bus.svg';

<BusIcon
  width={48}
  height={48}
  fill="#0285f0"
/>`}
        </Text>
      </View>

      <View style={styles.prosConsBox}>
        <Text style={styles.prosTitle}>✅ 优点:</Text>
        <Text style={styles.prosText}>• 性能最佳 (~1ms)</Text>
        <Text style={styles.prosText}>• 离线可用</Text>
        <Text style={styles.prosText}>• TypeScript 类型安全</Text>
        <Text style={styles.prosText}>• Tree-shaking 支持</Text>

        <Text style={styles.consTitle}>❌ 缺点:</Text>
        <Text style={styles.consText}>• 需要手动下载 SVG</Text>
        <Text style={styles.consText}>• Figma 更新需重新下载</Text>
      </View>
    </View>
  );
}

// ============================================================================
// 方式 3: 混合方案（开发用 RemoteSvg，生产用 svg-transformer）
// ============================================================================

interface HybridIconProps {
  remoteUri?: string;
  localSource?: React.FC<any>;
  width: number;
  height: number;
  fill?: string;
}

function HybridIcon({ remoteUri, localSource, width, height, fill }: HybridIconProps) {
  // 开发环境用 RemoteSvg，生产环境用 svg-transformer
  if (__DEV__ && remoteUri) {
    return <RemoteSvg uri={remoteUri} width={width} height={height} fill={fill} />;
  }

  if (localSource) {
    const SvgComponent = localSource;
    return <SvgComponent width={width} height={height} fill={fill} />;
  }

  return null;
}

function Method3_Hybrid() {
  return (
    <View style={styles.methodContainer}>
      <Text style={styles.methodTitle}>方式 3: 混合方案 (最佳实践)</Text>

      <View style={styles.iconRow}>
        <HybridIcon
          remoteUri={FIGMA_URL}
          // localSource={BusIcon}  // 生产环境使用
          width={48}
          height={48}
        />

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>🔄 开发: RemoteSvg</Text>
          <Text style={styles.infoText}>🚀 生产: svg-transformer</Text>
          <Text style={styles.infoText}>💯 两全其美</Text>
        </View>
      </View>

      <View style={styles.codeBox}>
        <Text style={styles.codeText}>
          {`function HybridIcon({ remoteUri, localSource }) {
  if (__DEV__ && remoteUri) {
    return <RemoteSvg uri={remoteUri} />;
  }
  return <localSource />;
}

<HybridIcon
  remoteUri="http://localhost:3845/..."
  localSource={BusIcon}
  width={48}
  height={48}
/>`}
        </Text>
      </View>

      <View style={styles.prosConsBox}>
        <Text style={styles.prosTitle}>✅ 优点:</Text>
        <Text style={styles.prosText}>• 开发时快速迭代 (Figma 同步)</Text>
        <Text style={styles.prosText}>• 生产时最佳性能</Text>
        <Text style={styles.prosText}>• 无需修改组件代码</Text>

        <Text style={styles.consTitle}>⚠️ 注意:</Text>
        <Text style={styles.consText}>• 需要维护两套资源路径</Text>
        <Text style={styles.consText}>• 发布前需下载所有 SVG</Text>
      </View>
    </View>
  );
}

// ============================================================================
// 性能对比表格
// ============================================================================

function PerformanceComparison() {
  return (
    <View style={styles.tableContainer}>
      <Text style={styles.tableTitle}>📊 性能对比</Text>

      <View style={styles.tableHeader}>
        <Text style={[styles.tableCell, styles.tableHeaderCell, { flex: 2 }]}>指标</Text>
        <Text style={[styles.tableCell, styles.tableHeaderCell, { flex: 1.5 }]}>RemoteSvg</Text>
        <Text style={[styles.tableCell, styles.tableHeaderCell, { flex: 1.5 }]}>svg-transformer</Text>
      </View>

      <View style={styles.tableRow}>
        <Text style={[styles.tableCell, { flex: 2 }]}>首次渲染</Text>
        <Text style={[styles.tableCell, styles.slowCell, { flex: 1.5 }]}>~300ms</Text>
        <Text style={[styles.tableCell, styles.fastCell, { flex: 1.5 }]}>~1ms</Text>
      </View>

      <View style={styles.tableRow}>
        <Text style={[styles.tableCell, { flex: 2 }]}>网络请求</Text>
        <Text style={[styles.tableCell, styles.slowCell, { flex: 1.5 }]}>每个 SVG 1次</Text>
        <Text style={[styles.tableCell, styles.fastCell, { flex: 1.5 }]}>0次</Text>
      </View>

      <View style={styles.tableRow}>
        <Text style={[styles.tableCell, { flex: 2 }]}>离线可用</Text>
        <Text style={[styles.tableCell, styles.slowCell, { flex: 1.5 }]}>❌</Text>
        <Text style={[styles.tableCell, styles.fastCell, { flex: 1.5 }]}>✅</Text>
      </View>

      <View style={styles.tableRow}>
        <Text style={[styles.tableCell, { flex: 2 }]}>TypeScript</Text>
        <Text style={[styles.tableCell, styles.slowCell, { flex: 1.5 }]}>❌</Text>
        <Text style={[styles.tableCell, styles.fastCell, { flex: 1.5 }]}>✅</Text>
      </View>

      <View style={styles.tableRow}>
        <Text style={[styles.tableCell, { flex: 2 }]}>生产可用</Text>
        <Text style={[styles.tableCell, styles.slowCell, { flex: 1.5 }]}>❌</Text>
        <Text style={[styles.tableCell, styles.fastCell, { flex: 1.5 }]}>✅</Text>
      </View>
    </View>
  );
}

// ============================================================================
// 主组件
// ============================================================================

export default function SvgComparisonExample() {
  const [selectedMethod, setSelectedMethod] = useState<1 | 2 | 3>(1);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SVG 使用方案对比</Text>

      {/* 方法选择器 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedMethod === 1 && styles.activeTab]}
          onPress={() => setSelectedMethod(1)}
        >
          <Text style={[styles.tabText, selectedMethod === 1 && styles.activeTabText]}>
            RemoteSvg
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedMethod === 2 && styles.activeTab]}
          onPress={() => setSelectedMethod(2)}
        >
          <Text style={[styles.tabText, selectedMethod === 2 && styles.activeTabText]}>
            svg-transformer
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedMethod === 3 && styles.activeTab]}
          onPress={() => setSelectedMethod(3)}
        >
          <Text style={[styles.tabText, selectedMethod === 3 && styles.activeTabText]}>
            混合方案
          </Text>
        </TouchableOpacity>
      </View>

      {/* 显示选中的方法 */}
      {selectedMethod === 1 && <Method1_RemoteSvg />}
      {selectedMethod === 2 && <Method2_SvgTransformer />}
      {selectedMethod === 3 && <Method3_Hybrid />}

      {/* 性能对比表格 */}
      <PerformanceComparison />

      {/* 推荐建议 */}
      <View style={styles.recommendationBox}>
        <Text style={styles.recommendationTitle}>💡 推荐方案</Text>
        <Text style={styles.recommendationText}>
          • <Text style={styles.bold}>快速原型/设计迭代阶段</Text>: 使用 RemoteSvg
        </Text>
        <Text style={styles.recommendationText}>
          • <Text style={styles.bold}>生产就绪阶段</Text>: 迁移到 svg-transformer
        </Text>
        <Text style={styles.recommendationText}>
          • <Text style={styles.bold}>大型团队</Text>: 使用混合方案
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#0285f0',
    fontWeight: 'bold',
  },
  methodContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  methodTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoBox: {
    flex: 1,
    marginLeft: 16,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  codeBox: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  codeText: {
    fontSize: 11,
    fontFamily: 'Courier',
    color: '#333',
  },
  prosConsBox: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 12,
  },
  prosTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  prosText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    marginLeft: 8,
  },
  consTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F44336',
    marginTop: 12,
    marginBottom: 8,
  },
  consText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    marginLeft: 8,
  },
  placeholder: {
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  placeholderText: {
    fontSize: 10,
    color: '#999',
  },
  tableContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
  },
  tableHeaderCell: {
    fontWeight: 'bold',
    color: '#333',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tableCell: {
    fontSize: 12,
    color: '#666',
  },
  slowCell: {
    color: '#F44336',
  },
  fastCell: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  recommendationBox: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#0285f0',
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0285f0',
    marginBottom: 12,
  },
  recommendationText: {
    fontSize: 13,
    color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
  bold: {
    fontWeight: 'bold',
  },
});
