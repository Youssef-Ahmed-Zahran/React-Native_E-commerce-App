import { Loader2 } from "lucide-react";

/**
 * Full-page loading spinner.
 */
function Loader() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center gap-3">
                <Loader2 size={40} className="animate-spin text-indigo-600" />
                <p className="text-sm text-gray-500 font-medium">Loading…</p>
            </div>
        </div>
    );
}

export default Loader;
