interface AdminHeaderProps {
    userEmail?: string;
    onLogout: () => void;
}

export default function AdminHeader({ userEmail, onLogout }: AdminHeaderProps) {
    return (
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
                <p className="text-gray-400">Welcome back, {userEmail}</p>
            </div>
            <button
                onClick={onLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
            >
                Log Out
            </button>
        </div>
    );
}