export default function ItineraryLoading() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
        {/* Top bar skeleton */}
        <div className="h-10 bg-slate-200/80 rounded-2xl w-full max-w-md" />

        {/* Hero skeleton */}
        <div className="h-[460px] bg-slate-200/80 rounded-3xl w-full relative overflow-hidden flex flex-col justify-end p-8 space-y-4">
          <div className="h-6 bg-slate-300 rounded-full w-48" />
          <div className="h-12 bg-slate-300 rounded-2xl w-3/4" />
          <div className="h-16 bg-slate-300 rounded-2xl w-full max-w-2xl" />
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 pt-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-14 bg-slate-300/80 rounded-xl" />
            ))}
          </div>
        </div>

        {/* Main Grid skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
          <div className="lg:col-span-2 space-y-8">
            <div className="h-64 bg-slate-200/80 rounded-3xl" />
            <div className="h-96 bg-slate-200/80 rounded-3xl" />
          </div>
          <div className="space-y-6">
            <div className="h-80 bg-slate-200/80 rounded-3xl" />
            <div className="h-48 bg-slate-200/80 rounded-3xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
