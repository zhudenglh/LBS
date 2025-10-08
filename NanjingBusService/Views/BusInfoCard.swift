import SwiftUI

struct BusInfoCard: View {
    let busLine: BusLine
    let station: BusStation

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // 线路信息
            HStack {
                Image(systemName: "bus.fill")
                    .foregroundColor(.blue)
                Text(busLine.displayName)
                    .font(.headline)
            }

            // 下一站信息
            if let nextStation = station.nextStation,
               let estimatedTime = station.estimatedTime {
                HStack {
                    Image(systemName: "clock.fill")
                        .foregroundColor(.orange)
                    Text("下一站：\(nextStation)（约\(estimatedTime)分钟）")
                        .font(.subheadline)
                }
            }

            // 换乘简要信息
            if let transfer = station.transferInfo {
                if !transfer.subwayLines.isEmpty {
                    HStack {
                        Image(systemName: "tram.fill")
                            .foregroundColor(.green)
                        Text("可换乘\(transfer.subwayLines.joined(separator: "/"))")
                            .font(.subheadline)
                    }
                }
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(Color.blue.opacity(0.1))
        )
    }
}
