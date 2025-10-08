import SwiftUI

struct SmartRecommendationCard: View {
    let recommendations: [POI]

    var timeSlotTitle: String {
        let hour = Calendar.current.component(.hour, from: Date())
        switch hour {
        case 7..<9:
            return "早餐推荐"
        case 11..<13:
            return "午餐推荐"
        case 17..<19:
            return "晚餐推荐"
        case 19..<22:
            return "娱乐休闲"
        default:
            return "附近推荐"
        }
    }

    var timeSlotIcon: String {
        let hour = Calendar.current.component(.hour, from: Date())
        switch hour {
        case 7..<9, 11..<13, 17..<19:
            return "fork.knife"
        case 19..<22:
            return "gamecontroller.fill"
        default:
            return "sparkles"
        }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: timeSlotIcon)
                    .foregroundColor(.orange)
                Text(timeSlotTitle)
                    .font(.headline)
                Spacer()
                Text("下车步行5分钟内")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }

            if recommendations.isEmpty {
                Text("暂无推荐")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                    .padding(.vertical, 8)
            } else {
                ForEach(recommendations) { poi in
                    POIRowView(poi: poi, showFullInfo: true)
                    if poi.id != recommendations.last?.id {
                        Divider()
                    }
                }

                if recommendations.count > 3 {
                    Button(action: {
                        // 查看更多
                    }) {
                        HStack {
                            Text("查看更多")
                                .font(.subheadline)
                            Image(systemName: "chevron.right")
                                .font(.caption)
                        }
                        .foregroundColor(.blue)
                    }
                    .padding(.top, 4)
                }
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(Color.orange.opacity(0.05))
        )
    }
}
