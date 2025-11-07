// 快捷操作图标 - 精确按Figma还原（所有尺寸除以2）

import React from 'react';
import { View, Text } from 'react-native';

// 公交图标 - 绿色巴士（Figma：68x68/2 = 34x34容器，图形按比例缩小）
export function BusIcon({ size = 34 }: { size?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* SVG占位：49.5x50.4/2 = 25.2x24.75 */}
      <View
        style={{
          width: 25.2,
          height: 24.75,
          backgroundColor: '#4CAF50',
          borderRadius: 4,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {/* 巴士窗户 - 两个白色方块 */}
        <View
          style={{
            flexDirection: 'row',
            gap: 3,
            marginTop: -1.5,
          }}
        >
          <View
            style={{
              width: 7,
              height: 7,
              backgroundColor: 'white',
              borderRadius: 1,
            }}
          />
          <View
            style={{
              width: 7,
              height: 7,
              backgroundColor: 'white',
              borderRadius: 1,
            }}
          />
        </View>

        {/* 车轮 */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: 21,
            position: 'absolute',
            bottom: 2,
          }}
        >
          <View
            style={{
              width: 3,
              height: 3,
              borderRadius: 1.5,
              backgroundColor: '#2E7D32',
            }}
          />
          <View
            style={{
              width: 3,
              height: 3,
              borderRadius: 1.5,
              backgroundColor: '#2E7D32',
            }}
          />
        </View>
      </View>
    </View>
  );
}

// 返利团图标 - 彩色条纹+黄色徽章（Figma尺寸除以2）
export function CashbackIcon({ size = 34 }: { size?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      {/* 容器：60x58/2 = 30x29 */}
      <View style={{ position: 'relative', width: 30, height: 29 }}>
        {/* 蓝色条 - 旋转342.696deg, 14.4x44.1/2 = 7.2x22.05 */}
        <View
          style={{
            position: 'absolute',
            left: 3.95,
            top: 2.52,
            width: 22.05,
            height: 7.2,
            backgroundColor: '#56c9ff',
            borderRadius: 22.5,
            transform: [{ rotate: '342.696deg' }],
          }}
        />

        {/* 橙色条 - 旋转349.676deg, 14.4x50.238/2 = 7.2x25.119 */}
        <View
          style={{
            position: 'absolute',
            left: 3.5,
            top: 4.94,
            width: 25.119,
            height: 7.2,
            backgroundColor: '#fd7f35',
            borderRadius: 22.5,
            transform: [{ rotate: '349.676deg' }],
          }}
        />

        {/* 黄色徽章 - 59.4x43.2/2 = 29.7x21.6 */}
        <View
          style={{
            position: 'absolute',
            left: 2.15,
            top: 8.82,
            width: 29.7,
            height: 21.6,
            backgroundColor: '#ffe631',
            borderRadius: 4,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* "返"字 - 27px/2 = 13.5px Bold, lineHeight 18px */}
          <Text
            style={{
              fontFamily: 'Noto Sans CJK SC',
              fontWeight: '700',
              fontSize: 13.5,
              lineHeight: 18,
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

// 小鹿健康图标 - 蓝色小鹿（Figma：56.82x57.998/2 = 28.41x29px）
export function HealthIcon({ size = 34 }: { size?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* SVG占位：57.998x56.82/2 = 29x28.41 */}
      <View
        style={{
          width: 29,
          height: 28.41,
          backgroundColor: '#2196F3',
          borderRadius: 14.5,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* 简化的小鹿头部图案 */}
        <View style={{ alignItems: 'center' }}>
          {/* 鹿角 */}
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: -2 }}>
            <View
              style={{
                width: 4,
                height: 7,
                backgroundColor: 'white',
                borderRadius: 2,
              }}
            />
            <View
              style={{
                width: 4,
                height: 7,
                backgroundColor: 'white',
                borderRadius: 2,
              }}
            />
          </View>
          {/* 脸部 */}
          <View
            style={{
              width: 13,
              height: 13,
              backgroundColor: 'white',
              borderRadius: 6.5,
            }}
          />
        </View>
      </View>
    </View>
  );
}

// 省钱包图标 - 红色钱包（Figma尺寸除以2）
export function WalletIcon({ size = 34 }: { size?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* 红色渐变背景 - 74x63/2 = 37x31.5 */}
      <View
        style={{
          width: 37,
          height: 31.5,
          borderRadius: 6,
          overflow: 'hidden',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* 红包背景 */}
        <View
          style={{
            width: 37,
            height: 31.5,
            backgroundColor: '#FF5252',
            borderRadius: 6,
          }}
        />

        {/* 金色条纹 */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            backgroundColor: '#FFD700',
            opacity: 0.6,
          }}
        />

        {/* "省"字 - 24px/2 = 12px Black weight, lineHeight 16px */}
        <Text
          style={{
            position: 'absolute',
            fontFamily: 'Noto Sans CJK SC',
            fontWeight: '900',
            fontSize: 12,
            lineHeight: 16,
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
