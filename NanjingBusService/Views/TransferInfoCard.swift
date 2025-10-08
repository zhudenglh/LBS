import SwiftUI

struct TransferInfoCard: View {
    let transferInfo: TransferInfo

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: "arrow.triangle.branch")
                    .foregroundColor(.green)
                Text("换乘信息")
                    .font(.headline)
                Spacer()
            }

            // 地铁换乘
            if !transferInfo.subwayLines.isEmpty {
                VStack(alignment: .leading, spacing: 6) {
                    HStack {
                        Image(systemName: "tram.fill")
                            .foregroundColor(.green)
                        Text("可换乘地铁")
                            .font(.subheadline)
                            .fontWeight(.medium)
                    }

                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 8) {
                            ForEach(transferInfo.subwayLines, id: \.self) { line in
                                Text(line)
                                    .font(.subheadline)
                                    .padding(.horizontal, 12)
                                    .padding(.vertical, 6)
                                    .background(Color.green.opacity(0.2))
                                    .foregroundColor(.green)
                                    .cornerRadius(8)
                            }
                        }
                    }

                    if let nextTime = transferInfo.nextSubwayTime {
                        HStack(spacing: 4) {
                            Image(systemName: "clock.fill")
                                .font(.caption)
                                .foregroundColor(.orange)
                            Text("最近一班：\(nextTime)分钟后")
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                    }
                }
            }

            // 公交换乘
            if !transferInfo.busLines.isEmpty {
                VStack(alignment: .leading, spacing: 6) {
                    HStack {
                        Image(systemName: "bus.fill")
                            .foregroundColor(.blue)
                        Text("可换乘公交")
                            .font(.subheadline)
                            .fontWeight(.medium)
                    }

                    Text(transferInfo.busLines.prefix(5).joined(separator: "、") + (transferInfo.busLines.count > 5 ? "..." : ""))
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }

            // 共享单车
            if transferInfo.bikeSharingAvailable {
                VStack(alignment: .leading, spacing: 6) {
                    HStack {
                        Image(systemName: "bicycle")
                            .foregroundColor(.orange)
                        Text("共享单车")
                            .font(.subheadline)
                            .fontWeight(.medium)
                    }

                    HStack(spacing: 8) {
                        ForEach(transferInfo.bikeSharingBrands, id: \.self) { brand in
                            HStack(spacing: 4) {
                                Image(systemName: "circle.fill")
                                    .font(.caption2)
                                    .foregroundColor(brandColor(for: brand))
                                Text(brand)
                                    .font(.caption)
                            }
                        }
                    }
                }
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(Color.green.opacity(0.05))
        )
    }

    private func brandColor(for brand: String) -> Color {
        switch brand {
        case "美团单车":
            return .yellow
        case "哈啰单车":
            return .blue
        case "青桔单车":
            return .green
        default:
            return .gray
        }
    }
}
