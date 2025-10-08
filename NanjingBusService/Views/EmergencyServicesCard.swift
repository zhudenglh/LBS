import SwiftUI

struct EmergencyServicesCard: View {
    let services: [POI]

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: "exclamationmark.triangle.fill")
                    .foregroundColor(.red)
                Text("应急服务")
                    .font(.headline)
                Spacer()
            }

            if services.isEmpty {
                Text("附近暂无应急服务")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                    .padding(.vertical, 8)
            } else {
                ForEach(services) { poi in
                    POIRowView(poi: poi, showFullInfo: false)
                }
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(Color.red.opacity(0.05))
        )
    }
}

struct POIRowView: View {
    let poi: POI
    let showFullInfo: Bool

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            Text(poi.category.icon)
                .font(.title2)

            VStack(alignment: .leading, spacing: 4) {
                HStack {
                    Text(poi.name)
                        .font(.subheadline)
                        .fontWeight(.medium)

                    if let rating = poi.rating {
                        HStack(spacing: 2) {
                            Image(systemName: "star.fill")
                                .font(.caption)
                                .foregroundColor(.yellow)
                            Text(String(format: "%.1f", rating))
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                    }
                }

                HStack(spacing: 8) {
                    Label("\(poi.distanceText)", systemImage: "location.fill")
                        .font(.caption)
                        .foregroundColor(.secondary)

                    Text("步行\(poi.walkingTime)分钟")
                        .font(.caption)
                        .foregroundColor(.secondary)

                    if poi.is24Hours {
                        Text("24h")
                            .font(.caption)
                            .padding(.horizontal, 6)
                            .padding(.vertical, 2)
                            .background(Color.green.opacity(0.2))
                            .foregroundColor(.green)
                            .cornerRadius(4)
                    }
                }

                if showFullInfo && !poi.tags.isEmpty {
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 6) {
                            ForEach(poi.tags, id: \.self) { tag in
                                Text(tag)
                                    .font(.caption2)
                                    .padding(.horizontal, 8)
                                    .padding(.vertical, 4)
                                    .background(Color.blue.opacity(0.1))
                                    .foregroundColor(.blue)
                                    .cornerRadius(6)
                            }
                        }
                    }
                }
            }

            Spacer()

            VStack(spacing: 8) {
                Button(action: {
                    MapNavigationService.shared.navigateToLocation(
                        latitude: poi.coordinate.latitude,
                        longitude: poi.coordinate.longitude,
                        name: poi.name
                    )
                }) {
                    Image(systemName: "arrow.triangle.turn.up.right.circle.fill")
                        .font(.title3)
                        .foregroundColor(.blue)
                }

                if let phone = poi.phone {
                    Button(action: {
                        MapNavigationService.shared.makePhoneCall(phoneNumber: phone)
                    }) {
                        Image(systemName: "phone.circle.fill")
                            .font(.title3)
                            .foregroundColor(.green)
                    }
                }
            }
        }
        .padding(.vertical, 4)
    }
}
