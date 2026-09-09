import { useEffect, useState } from "react";
import { LayoutDashboard, History, LogOut, GitBranch, ShieldCheck } from "lucide-react";
import { NavLink } from "react-router-dom";
import { getCurrentUser } from "../../services/userService";

function Sidebar() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        getCurrentUser().then(setUser).catch(console.error);
    }, []);

    const menuClass = ({ isActive }) =>
        `group flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all ${
            isActive
                ? "bg-blue-500/15 text-blue-300 border border-blue-500/20"
                : "text-slate-400 hover:text-slate-100 hover:bg-white/[.04]"
        }`;

    return (
        <aside className="w-[248px] min-h-screen sticky top-0 flex flex-col bg-[#080d18] border-r border-white/[.07]">
            <div className="px-5 py-6 border-b border-white/[.07]">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-600/15 border border-blue-500/20 flex items-center justify-center">
                        <GitBranch size={21} className="text-blue-400" />
                    </div>
                    <div>
                        <p className="font-semibold tracking-tight text-slate-100">CodeLens</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">AI Repository Review</p>
                    </div>
                </div>
            </div>

            <div className="px-4 pt-7">
                <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[.16em] text-slate-600">Workspace</p>
                <nav className="space-y-1.5">
                    <NavLink to="/dashboard" className={menuClass}><LayoutDashboard size={18} /> Dashboard</NavLink>
                    <NavLink to="/history" className={menuClass}><History size={18} /> Review history</NavLink>
                </nav>
            </div>

            <div className="mt-auto p-4">
                <div className="rounded-2xl bg-white/[.035] border border-white/[.07] p-3.5">
                    <div className="flex items-center gap-3">
                        <img
                            src={user?.avatarUrl || "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"}
                            alt="GitHub profile"
                            className="h-9 w-9 rounded-full border border-white/10"
                        />
                        <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{user?.name || user?.login || "GitHub User"}</p>
                            <p className="text-xs text-slate-500 truncate">@{user?.login || "github"}</p>
                        </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-[11px] text-emerald-400">
                        <ShieldCheck size={13} /> GitHub connected
                    </div>
                </div>
                <button
                    onClick={() => { window.location.href = "http://localhost:8080/logout"; }}
                    className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm text-slate-400 hover:text-red-300 hover:bg-red-500/10 transition"
                >
                    <LogOut size={16} /> Sign out
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;
