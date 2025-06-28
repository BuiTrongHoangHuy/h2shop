export default function Loading() {
  return (
    <div className="flex h-[calc(100vh-140px)] items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading reports...</p>
      </div>
    </div>
  );
} 