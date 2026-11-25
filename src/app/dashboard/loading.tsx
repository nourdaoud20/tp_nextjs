export default function DashboardLoading() {
  return (
    <main className="mx-auto max-w-5xl p-6 pt-12">
      <div className="animate-pulse space-y-6">
        <div className="h-24 rounded-xl bg-gray-200" />
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="h-28 rounded-xl bg-gray-200" />
          <div className="h-28 rounded-xl bg-gray-200" />
          <div className="h-28 rounded-xl bg-gray-200" />
        </div>
        <div className="h-64 rounded-xl bg-gray-200" />
      </div>
    </main>
  );
}