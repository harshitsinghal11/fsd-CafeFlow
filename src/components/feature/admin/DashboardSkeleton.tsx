export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100 p-6 pt-10 w-full">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="flex gap-3">
            <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </div>

        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-4" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm animate-pulse h-64" />
          ))}
        </div>

        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 h-96 animate-pulse" />
      </div>
    </div>
  );
}
