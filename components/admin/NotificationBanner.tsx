interface NotificationBannerProps {
    success?: boolean;
    error?: string;
}

export default function NotificationBanner({ success, error }: NotificationBannerProps) {
    if (!success && !error) return null;

    return (
        <>
            {success && (
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-lg mb-6 animate-pulse shadow-lg border border-green-500">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Pandal created successfully!
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-lg mb-6 shadow-lg border border-red-500">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </div>
                </div>
            )}
        </>
    );
}