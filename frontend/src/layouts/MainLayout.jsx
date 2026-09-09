import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "../components/Sidebar/Sidebar";

function MainLayout({ children }) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const close = () => setOpen(false);
        window.addEventListener("resize", close);
        return () => window.removeEventListener("resize", close);
    }, []);

    return (
        <div className="app-shell min-h-screen flex">
            <div className="desktop-sidebar shrink-0">
                <Sidebar />
            </div>

            <button
                aria-label="Open navigation"
                onClick={() => setOpen(true)}
                className="lg:hidden fixed z-40 left-4 top-4 p-3 rounded-xl glass text-slate-200"
            >
                <Menu size={20} />
            </button>

            {open && (
                <div className="lg:hidden fixed inset-0 z-50 bg-black/60" onClick={() => setOpen(false)}>
                    <div className="h-full w-[280px]" onClick={(e) => e.stopPropagation()}>
                        <div className="absolute top-3 left-[238px]">
                            <button onClick={() => setOpen(false)} className="p-2 rounded-lg bg-slate-900 border border-slate-700">
                                <X size={18} />
                            </button>
                        </div>
                        <Sidebar />
                    </div>
                </div>
            )}

            <main className="min-w-0 flex-1">{children}</main>
        </div>
    );
}

export default MainLayout;
