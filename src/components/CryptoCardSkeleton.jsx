const CryptoCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800" />
        <div className="flex-1">
          <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="mt-2 h-3 w-1/3 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
      </div>

      <div className="mt-4">
        <div className="h-6 w-1/2 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="mt-2 h-3 w-1/3 bg-gray-200 dark:bg-gray-800 rounded" />
      </div>
    </div>
  )
}

export default CryptoCardSkeleton