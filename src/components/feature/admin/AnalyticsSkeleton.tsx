export default function AnalyticsSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100 p-6 pt-10 w-full">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="h-32 bg-gray-200 rounded-2xl animate-pulse" />
          <div className="h-32 bg-gray-200 rounded-2xl animate-pulse" />
        </div>

        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-4" />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 h-[500px] animate-pulse" />
      </div>
    </div>
  );
}
