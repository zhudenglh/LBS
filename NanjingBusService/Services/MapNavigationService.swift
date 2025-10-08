import Foundation
import CoreLocation

class MapNavigationService {
    static let shared = MapNavigationService()

    private init() {}

    // MARK: - 高德地图导航
    func navigateToLocation(latitude: Double, longitude: Double, name: String) {
        // 高德地图 URL Scheme
        let urlString = "iosamap://path?sourceApplication=NanjingBusService&dlat=\(latitude)&dlon=\(longitude)&dname=\(name.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? name)&dev=0&t=0"

        if let url = URL(string: urlString), canOpenAMap() {
            openURL(url)
        } else {
            // 降级到高德地图Web版
            let webUrlString = "https://uri.amap.com/navigation?to=\(longitude),\(latitude),\(name.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? name)&mode=walk&coordinate=gaode&callnative=1"
            if let webUrl = URL(string: webUrlString) {
                openURL(webUrl)
            }
        }
    }

    // MARK: - 拨打电话
    func makePhoneCall(phoneNumber: String) {
        let cleanNumber = phoneNumber.replacingOccurrences(of: "-", with: "").replacingOccurrences(of: " ", with: "")
        if let url = URL(string: "tel://\(cleanNumber)") {
            openURL(url)
        }
    }

    // MARK: - 检查是否安装高德地图
    private func canOpenAMap() -> Bool {
        if let url = URL(string: "iosamap://") {
            return canOpen(url)
        }
        return false
    }

    private func canOpen(_ url: URL) -> Bool {
        #if targetEnvironment(simulator)
        return false
        #else
        return UIApplication.shared.canOpenURL(url)
        #endif
    }

    private func openURL(_ url: URL) {
        #if !targetEnvironment(simulator)
        UIApplication.shared.open(url)
        #else
        print("模拟器环境，无法打开URL: \(url)")
        #endif
    }
}
