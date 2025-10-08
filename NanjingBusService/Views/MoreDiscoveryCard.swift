import SwiftUI

struct MoreDiscoveryCard: View {
    @State private var showingCategoryView = false
    @State private var selectedCategory: ServiceCategory?

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: "square.grid.2x2.fill")
                    .foregroundColor(.purple)
                Text("更多发现")
                    .font(.headline)
                Spacer()
            }

            LazyVGrid(columns: [
                GridItem(.flexible()),
                GridItem(.flexible()),
                GridItem(.flexible()),
                GridItem(.flexible())
            ], spacing: 12) {
                CategoryButton(icon: "🍜", title: "美食", category: .restaurant) {
                    selectedCategory = .restaurant
                    showingCategoryView = true
                }

                CategoryButton(icon: "🎮", title: "玩乐", category: .entertainment) {
                    selectedCategory = .entertainment
                    showingCategoryView = true
                }

                CategoryButton(icon: "🏛️", title: "景点", category: .attraction) {
                    selectedCategory = .attraction
                    showingCategoryView = true
                }

                CategoryButton(icon: "🏪", title: "全部", category: nil) {
                    selectedCategory = nil
                    showingCategoryView = true
                }
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(Color.purple.opacity(0.05))
        )
        .sheet(isPresented: $showingCategoryView) {
            if let category = selectedCategory {
                CategoryDetailView(category: category)
            } else {
                AllCategoriesView()
            }
        }
    }
}

struct CategoryButton: View {
    let icon: String
    let title: String
    let category: ServiceCategory?
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 8) {
                Text(icon)
                    .font(.largeTitle)
                Text(title)
                    .font(.caption)
                    .foregroundColor(.primary)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 12)
            .background(
                RoundedRectangle(cornerRadius: 10)
                    .fill(Color.gray.opacity(0.1))
            )
        }
    }
}

// MARK: - Category Detail View
struct CategoryDetailView: View {
    let category: ServiceCategory
    @Environment(\.dismiss) var dismiss
    @State private var pois: [POI] = []

    var body: some View {
        NavigationView {
            List(pois) { poi in
                POIRowView(poi: poi, showFullInfo: true)
            }
            .navigationTitle(category.rawValue)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("关闭") {
                        dismiss()
                    }
                }
            }
            .onAppear {
                loadPOIs()
            }
        }
    }

    private func loadPOIs() {
        // 模拟加载数据
        Task {
            // 这里应该调用 NetworkService 获取真实数据
            pois = []
        }
    }
}

struct AllCategoriesView: View {
    @Environment(\.dismiss) var dismiss

    var body: some View {
        NavigationView {
            List {
                ForEach(ServiceCategory.allCases, id: \.self) { category in
                    NavigationLink(destination: CategoryDetailView(category: category)) {
                        HStack {
                            Text(category.icon)
                                .font(.title2)
                            Text(category.rawValue)
                                .font(.body)
                        }
                    }
                }
            }
            .navigationTitle("全部服务")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("关闭") {
                        dismiss()
                    }
                }
            }
        }
    }
}
