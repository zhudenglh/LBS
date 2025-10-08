import Foundation
import CoreLocation

// MARK: - 公交线路
struct BusLine: Identifiable, Codable {
    let id: String
    let name: String // 如 "5路"
    let direction: String // 方向 如 "新街口方向"
    let stations: [BusStation]

    var displayName: String {
        "\(name)（\(direction)）"
    }
}

// MARK: - 公交站点
struct BusStation: Identifiable, Codable {
    let id: String
    let name: String
    let coordinate: Coordinate
    let nextStation: String?
    let estimatedTime: Int? // 到达下一站的预计时间（分钟）
    let transferInfo: TransferInfo?
}

struct Coordinate: Codable {
    let latitude: Double
    let longitude: Double

    var clLocation: CLLocationCoordinate2D {
        CLLocationCoordinate2D(latitude: latitude, longitude: longitude)
    }
}

// MARK: - 换乘信息
struct TransferInfo: Codable {
    let subwayLines: [String] // 可换乘的地铁线路
    let busLines: [String] // 可换乘的公交线路
    let bikeSharingAvailable: Bool // 是否有共享单车
    let bikeSharingBrands: [String] // 共享单车品牌
    let nextSubwayTime: Int? // 最近一班地铁时间（分钟后）
}

// MARK: - 应急服务 POI
enum ServiceCategory: String, Codable, CaseIterable {
    case toilet = "公厕"
    case convenience = "便利店"
    case pharmacy = "药店"
    case atm = "ATM"
    case restaurant = "餐饮"
    case entertainment = "娱乐"
    case attraction = "景点"

    var icon: String {
        switch self {
        case .toilet: return "🚻"
        case .convenience: return "🏪"
        case .pharmacy: return "💊"
        case .atm: return "🏧"
        case .restaurant: return "🍜"
        case .entertainment: return "🎮"
        case .attraction: return "🏛️"
        }
    }
}

struct POI: Identifiable, Codable {
    let id: String
    let name: String
    let category: ServiceCategory
    let coordinate: Coordinate
    let distance: Int // 距离（米）
    let rating: Double?
    let priceRange: String?
    let is24Hours: Bool
    let phone: String?
    let tags: [String] // 如 ["无障碍", "应急药品"]

    var distanceText: String {
        if distance < 1000 {
            return "\(distance)米"
        } else {
            let km = Double(distance) / 1000.0
            return String(format: "%.1f公里", km)
        }
    }

    var walkingTime: Int {
        // 假设步行速度 80米/分钟
        return distance / 80
    }
}

// MARK: - 智能推荐
struct SmartRecommendation: Identifiable {
    let id = UUID()
    let title: String
    let subtitle: String
    let pois: [POI]
    let timeSlot: TimeSlot

    enum TimeSlot {
        case breakfast, lunch, dinner, entertainment, emergency

        var displayText: String {
            switch self {
            case .breakfast: return "早餐推荐"
            case .lunch: return "午餐推荐"
            case .dinner: return "晚餐推荐"
            case .entertainment: return "娱乐休闲"
            case .emergency: return "应急服务"
            }
        }
    }
}

// MARK: - 响应数据模型
struct StationServicesResponse: Codable {
    let station: BusStation
    let emergencyServices: [POI]
    let recommendations: [POI]
}
