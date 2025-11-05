// 快捷操作图标 - 根据Figma精确尺寸还原

import React from 'react';
import { View, Text } from 'react-native';
import { scale, scaleFont } from '../../utils/scale';

// 公交图标 - 绿色巴士（根据Figma SVG尺寸：68x68容器，49.5x50.4图形）
export function BusIcon({ size = 68 }: { size?: number }) {
  return (
    <View
      style={{
        width: scale(size),
        height: scale(size),
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* SVG占位：49.5x50.4，偏移left 8.8px, top 9.75px */}
      <View
        style={{
          width: scale(50.4),
          height: scale(49.5),
          backgroundColor: '#4CAF50',
          borderRadius: scale(8),
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {/* 巴士窗户 - 两个白色方块 */}
        <View
          style={{
            flexDirection: 'row',
            gap: scale(6),
            marginTop: scale(-3),
          }}
        >
          <View
            style={{
              width: scale(14),
              height: scale(14),
              backgroundColor: 'white',
              borderRadius: scale(2),
            }}
          />
          <View
            style={{
              width: scale(14),
              height: scale(14),
              backgroundColor: 'white',
              borderRadius: scale(2),
            }}
          />
        </View>

        {/* 车轮 */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: scale(42),
            position: 'absolute',
            bottom: scale(4),
          }}
        >
          <View
            style={{
              width: scale(6),
              height: scale(6),
              borderRadius: scale(3),
              backgroundColor: '#2E7D32',
            }}
          />
          <View
            style={{
              width: scale(6),
              height: scale(6),
              borderRadius: scale(3),
              backgroundColor: '#2E7D32',
            }}
          />
        </View>
      </View>
    </View>
  );
}

// 返利团图标 - 彩色条纹+黄色徽章（根据Figma精确尺寸）
export function CashbackIcon({ size = 68 }: { size?: number }) {
  return (
    <View
      style={{
        width: scale(size),
        height: scale(size),
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      {/* 容器：从left 4.3px, top 5.04px开始 */}
      <View style={{ position: 'relative', width: scale(60), height: scale(58) }}>
        {/* 蓝色条 - 旋转342.696deg, 14.4x44.1 */}
        <View
          style={{
            position: 'absolute',
            left: scale(7.9),
            top: scale(5.04),
            width: scale(44.1),
            height: scale(14.4),
            backgroundColor: '#56c9ff',
            borderRadius: scale(45),
            transform: [{ rotate: '342.696deg' }],
          }}
        />

        {/* 橙色条 - 旋转349.676deg, 14.4x50.238 */}
        <View
          style={{
            position: 'absolute',
            left: scale(6.99),
            top: scale(9.88),
            width: scale(50.238),
            height: scale(14.4),
            backgroundColor: '#fd7f35',
            borderRadius: scale(45),
            transform: [{ rotate: '349.676deg' }],
          }}
        />

        {/* 黄色徽章 - 59.4x43.2 at left 4.3px, top 17.64px */}
        <View
          style={{
            position: 'absolute',
            left: scale(4.3),
            top: scale(17.64),
            width: scale(59.4),
            height: scale(43.2),
            backgroundColor: '#ffe631',
            borderRadius: scale(8),
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* "返"字 - 27px Bold, left 34px (居中), top 24.94px */}
          <Text
            style={{
              fontFamily: 'Noto Sans CJK SC',
              fontWeight: '700',
              fontSize: scaleFont(27),
              lineHeight: scaleFont(27),
              color: '#b34a00',
              textAlign: 'center',
            }}
          >
            返
          </Text>
        </View>
      </View>
    </View>
  );
}

// 小鹿健康图标 - 蓝色小鹿（根据Figma SVG尺寸：56.82x57.998）
export function HealthIcon({ size = 68 }: { size?: number }) {
  return (
    <View
      style={{
        width: scale(size),
        height: scale(size),
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* SVG占位：56.82x57.998，偏移left 5px, top 6.98px */}
      <View
        style={{
          width: scale(57.998),
          height: scale(56.82),
          backgroundColor: '#2196F3',
          borderRadius: scale(28.991),
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* 简化的小鹿头部图案 */}
        <View style={{ alignItems: 'center' }}>
          {/* 鹿角 */}
          <View style={{ flexDirection: 'row', gap: scale(16), marginBottom: scale(-4) }}>
            <View
              style={{
                width: scale(8),
                height: scale(14),
                backgroundColor: 'white',
                borderRadius: scale(4),
              }}
            />
            <View
              style={{
                width: scale(8),
                height: scale(14),
                backgroundColor: 'white',
                borderRadius: scale(4),
              }}
            />
          </View>
          {/* 脸部 */}
          <View
            style={{
              width: scale(26),
              height: scale(26),
              backgroundColor: 'white',
              borderRadius: scale(13),
            }}
          />
        </View>
      </View>
    </View>
  );
}

// 省钱包图标 - 红色钱包
export function WalletIcon({ size = 68 }: { size?: number }) {
  return (
    <View
      style={{
        width: scale(size),
        height: scale(size),
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* 红色渐变背景 */}
      <View
        style={{
          width: scale(74),
          height: scale(63),
          borderRadius: scale(12),
          overflow: 'hidden',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* 红包背景 */}
        <View
          style={{
            width: scale(74),
            height: scale(63),
            backgroundColor: '#FF5252',
            borderRadius: scale(12),
          }}
        />

        {/* 金色条纹 */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: scale(16),
            backgroundColor: '#FFD700',
            opacity: 0.6,
          }}
        />

        {/* "省"字 - 24px Black weight, 白色 */}
        <Text
          style={{
            position: 'absolute',
            fontFamily: 'Noto Sans CJK SC',
            fontWeight: '900',
            fontSize: scaleFont(24),
            lineHeight: scaleFont(24),
            color: 'white',
            textAlign: 'center',
          }}
        >
          省
        </Text>
      </View>
    </View>
  );
}
