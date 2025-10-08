import SwiftUI

struct ContentView: View {
    @EnvironmentObject var appState: AppState
    @StateObject private var viewModel = ContentViewModel()

    var body: some View {
        NavigationView {
            ZStack {
                if viewModel.isLoading {
                    LoadingView()
                } else {
                    ScrollView {
                        VStack(spacing: 16) {
                            // 顶部公交信息卡片
                            if let busLine = viewModel.currentBusLine,
                               let station = viewModel.currentStation {
                                BusInfoCard(busLine: busLine, station: station)
                            }

                            // 应急服务（P0优先级）
                            EmergencyServicesCard(services: viewModel.emergencyServices)

                            // 换乘信息（P0优先级）
                            if let transferInfo = viewModel.currentStation?.transferInfo {
                                TransferInfoCard(transferInfo: transferInfo)
                            }

                            // 智能推荐（P1优先级）
                            if !viewModel.recommendations.isEmpty {
                                SmartRecommendationCard(recommendations: viewModel.recommendations)
                            }

                            // 更多发现
                            MoreDiscoveryCard()

                            Spacer(minLength: 20)
                        }
                        .padding()
                    }
                }
            }
            .navigationTitle("金陵驿站")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: {
                        viewModel.showFavorites.toggle()
                    }) {
                        Image(systemName: "star.fill")
                            .foregroundColor(.yellow)
                    }
                }
            }
            .sheet(isPresented: $viewModel.showFavorites) {
                FavoriteStationsView()
            }
            .onAppear {
                viewModel.loadStationData()
            }
        }
    }
}

// MARK: - Loading View
struct LoadingView: View {
    var body: some View {
        VStack(spacing: 20) {
            ProgressView()
                .scaleEffect(1.5)
            Text("加载中...")
                .font(.headline)
                .foregroundColor(.secondary)
        }
    }
}

// MARK: - ViewModel
@MainActor
class ContentViewModel: ObservableObject {
    @Published var isLoading = true
    @Published var currentBusLine: BusLine?
    @Published var currentStation: BusStation?
    @Published var emergencyServices: [POI] = []
    @Published var recommendations: [POI] = []
    @Published var showFavorites = false

    func loadStationData() {
        Task {
            isLoading = true

            do {
                // 模拟扫码获取线路信息
                let busLine = try await NetworkService.shared.fetchBusLine(lineId: "5")
                self.currentBusLine = busLine
                self.currentStation = busLine.stations.first

                // 获取站点周边服务
                if let stationId = currentStation?.id {
                    // 先尝试从缓存加载
                    if let cached = CacheManager.shared.getCachedStationData(forStationId: stationId) {
                        self.emergencyServices = cached.emergencyServices
                        self.recommendations = cached.recommendations
                    }

                    // 从网络加载最新数据
                    let services = try await NetworkService.shared.fetchStationServices(stationId: stationId)
                    self.emergencyServices = services.emergencyServices
                    self.recommendations = services.recommendations

                    // 缓存数据
                    CacheManager.shared.cacheStationData(services, forStationId: stationId)
                }

                isLoading = false
            } catch {
                print("加载失败: \(error)")
                isLoading = false
            }
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
            .environmentObject(AppState())
    }
}
