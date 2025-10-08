import Foundation
import CoreLocation

class NetworkService {
    static let shared = NetworkService()
    private let baseURL = "https://api.nanjingbus.com" // 示例API地址

    private init() {}

    // MARK: - 获取站点周边服务
    func fetchStationServices(stationId: String) async throws -> StationServicesResponse {
        // 模拟网络请求
        try await Task.sleep(nanoseconds: 500_000_000) // 0.5秒延迟

        // 返回模拟数据
        return createMockStationServices(stationId: stationId)
    }

    // MARK: - 获取公交线路信息
    func fetchBusLine(lineId: String) async throws -> BusLine {
        try await Task.sleep(nanoseconds: 300_000_000)
        return createMockBusLine(lineId: lineId)
    }

    // MARK: - 搜索POI
    func searchPOI(near coordinate: CLLocationCoordinate2D, category: ServiceCategory, radius: Int = 500) async throws -> [POI] {
        try await Task.sleep(nanoseconds: 200_000_000)
        return createMockPOIs(category: category, coordinate: coordinate)
    }

    // MARK: - Mock数据生成
    private func createMockStationServices(stationId: String) -> StationServicesResponse {
        let station = BusStation(
            id: stationId,
            name: "新街口站",
            coordinate: Coordinate(latitude: 32.0416, longitude: 118.7778),
            nextStation: "大行宫北站",
            estimatedTime: 2,
            transferInfo: TransferInfo(
                subwayLines: ["地铁2号线", "地铁3号线"],
                busLines: ["6路", "11路", "33路"],
                bikeSharingAvailable: true,
                bikeSharingBrands: ["美团单车", "哈啰单车"],
                nextSubwayTime: 3
            )
        )

        let emergencyServices = [
            POI(
                id: "toilet_1",
                name: "新街口公共厕所",
                category: .toilet,
                coordinate: Coordinate(latitude: 32.0420, longitude: 118.7780),
                distance: 120,
                rating: nil,
                priceRange: nil,
                is24Hours: true,
                phone: nil,
                tags: ["无障碍", "母婴室"]
            ),
            POI(
                id: "convenience_1",
                name: "全家便利店（新街口店）",
                category: .convenience,
                coordinate: Coordinate(latitude: 32.0418, longitude: 118.7776),
                distance: 80,
                rating: 4.7,
                priceRange: nil,
                is24Hours: true,
                phone: "025-12345678",
                tags: ["24小时"]
            ),
            POI(
                id: "pharmacy_1",
                name: "益丰大药房",
                category: .pharmacy,
                coordinate: Coordinate(latitude: 32.0422, longitude: 118.7782),
                distance: 200,
                rating: 4.5,
                priceRange: nil,
                is24Hours: false,
                phone: "025-87654321",
                tags: ["应急药品", "医保定点"]
            )
        ]

        let currentHour = Calendar.current.component(.hour, from: Date())
        var recommendations: [POI] = []

        // 根据时间推荐
        if currentHour >= 11 && currentHour <= 13 {
            // 午餐时间
            recommendations = [
                POI(
                    id: "restaurant_1",
                    name: "老南京面馆",
                    category: .restaurant,
                    coordinate: Coordinate(latitude: 32.0425, longitude: 118.7785),
                    distance: 150,
                    rating: 4.8,
                    priceRange: "¥18/人",
                    is24Hours: false,
                    phone: "025-11111111",
                    tags: ["快餐", "南京特色"]
                ),
                POI(
                    id: "restaurant_2",
                    name: "麦当劳",
                    category: .restaurant,
                    coordinate: Coordinate(latitude: 32.0428, longitude: 118.7788),
                    distance: 200,
                    rating: 4.5,
                    priceRange: "¥30/人",
                    is24Hours: false,
                    phone: "025-22222222",
                    tags: ["快餐", "连锁"]
                )
            ]
        }

        return StationServicesResponse(
            station: station,
            emergencyServices: emergencyServices,
            recommendations: recommendations
        )
    }

    private func createMockBusLine(lineId: String) -> BusLine {
        BusLine(
            id: lineId,
            name: "5路",
            direction: "新街口方向",
            stations: [
                BusStation(
                    id: "s1",
                    name: "火车站",
                    coordinate: Coordinate(latitude: 32.0855, longitude: 118.7965),
                    nextStation: "玄武门",
                    estimatedTime: 3,
                    transferInfo: nil
                ),
                BusStation(
                    id: "s2",
                    name: "新街口",
                    coordinate: Coordinate(latitude: 32.0416, longitude: 118.7778),
                    nextStation: "夫子庙",
                    estimatedTime: 5,
                    transferInfo: TransferInfo(
                        subwayLines: ["地铁2号线", "地铁3号线"],
                        busLines: ["6路", "11路"],
                        bikeSharingAvailable: true,
                        bikeSharingBrands: ["美团单车"],
                        nextSubwayTime: 3
                    )
                )
            ]
        )
    }

    private func createMockPOIs(category: ServiceCategory, coordinate: CLLocationCoordinate2D) -> [POI] {
        // 返回模拟POI数据
        return []
    }
}

// MARK: - 缓存管理
class CacheManager {
    static let shared = CacheManager()
    private let cacheDirectory: URL

    private init() {
        let paths = FileManager.default.urls(for: .cachesDirectory, in: .userDomainMask)
        cacheDirectory = paths[0].appendingPathComponent("StationCache")

        try? FileManager.default.createDirectory(at: cacheDirectory, withIntermediateDirectories: true)
    }

    func cacheStationData(_ data: StationServicesResponse, forStationId stationId: String) {
        let fileURL = cacheDirectory.appendingPathComponent("\(stationId).json")
        if let encoded = try? JSONEncoder().encode(data) {
            try? encoded.write(to: fileURL)
        }
    }

    func getCachedStationData(forStationId stationId: String) -> StationServicesResponse? {
        let fileURL = cacheDirectory.appendingPathComponent("\(stationId).json")
        guard let data = try? Data(contentsOf: fileURL),
              let decoded = try? JSONDecoder().decode(StationServicesResponse.self, from: data) else {
            return nil
        }
        return decoded
    }
}
