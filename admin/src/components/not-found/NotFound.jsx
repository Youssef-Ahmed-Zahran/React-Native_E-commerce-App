import { Link } from "react-router-dom";
import { Home, SearchX } from "lucide-react";

function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="text-center max-w-md">
                {/* Icon */}
                <div className="w-20 h-20 bg-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <SearchX size={40} className="text-indigo-500" />
                </div>

                {/* Status code */}
                <p className="text-7xl font-black text-indigo-600 mb-2 leading-none">
                    404
                </p>
                <h1 className="text-2xl font-bold text-gray-900 mb-3">
                    Page not found
                </h1>
                <p className="text-sm text-gray-500 mb-8">
                    The page you are looking for doesn't exist or has been moved.
                </p>

                {/* CTA */}
                <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors text-sm"
                >
                    <Home size={16} />
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
}

export default NotFound;
