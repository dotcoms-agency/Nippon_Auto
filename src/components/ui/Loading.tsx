export function Spinner({ className = '' }: { className?: string }) {
  return (
    <div
      className={`inline-block animate-spin rounded-full border-2 border-neutral-200 border-t-brand-red ${className}`}
      style={{ width: '1em', height: '1em' }}
      role="status"
      aria-label="Loading"
    />
  );
}

export function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <Spinner className="w-8 h-8" />
      <p className="text-sm text-neutral-500">{message}</p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="border border-neutral-200 bg-white">
      <div className="aspect-[4/3] bg-neutral-100 animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-neutral-100 animate-pulse w-2/3" />
        <div className="h-4 bg-neutral-100 animate-pulse w-1/2" />
        <div className="h-4 bg-neutral-100 animate-pulse w-3/4" />
        <div className="h-8 bg-neutral-100 animate-pulse w-full mt-4" />
      </div>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <p className="text-neutral-600">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-brand-red font-semibold hover:underline"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, message, action }: { title: string; message: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
      <h3 className="text-lg font-semibold text-neutral-800">{title}</h3>
      <p className="text-sm text-neutral-500 max-w-md">{message}</p>
      {action}
    </div>
  );
}
