import SwiftUI

@main
struct NanjingBusServiceApp: App {
    @StateObject private var appState = AppState()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(appState)
        }
    }
}

class AppState: ObservableObject {
    @Published var currentBusLine: BusLine?
    @Published var currentStation: BusStation?
    @Published var favoriteStations: [BusStation] = []
    @Published var isLoading = false

    init() {
        loadFavoriteStations()
    }

    func loadFavoriteStations() {
        // 从UserDefaults加载收藏的站点
        if let data = UserDefaults.standard.data(forKey: "favoriteStations"),
           let stations = try? JSONDecoder().decode([BusStation].self, from: data) {
            favoriteStations = stations
        }
    }

    func saveFavoriteStations() {
        if let data = try? JSONEncoder().encode(favoriteStations) {
            UserDefaults.standard.set(data, forKey: "favoriteStations")
        }
    }

    func toggleFavorite(station: BusStation) {
        if let index = favoriteStations.firstIndex(where: { $0.id == station.id }) {
            favoriteStations.remove(at: index)
        } else {
            favoriteStations.append(station)
        }
        saveFavoriteStations()
    }
}
