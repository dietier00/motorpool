export default function DeleteConfirmation({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    isLoading = false,
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 rounded-lg shadow-lg max-w-md w-full">
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">{title}</h3>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                    <p className="text-gray-600 dark:text-slate-300 text-sm leading-relaxed">{message}</p>
                </div>

                {/* Action Buttons */}
                <div className="px-6 py-4 border-t border-gray-200 dark:border-white/10 flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
}
