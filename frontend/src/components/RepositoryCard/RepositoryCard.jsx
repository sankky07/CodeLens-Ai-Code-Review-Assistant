import { motion } from "framer-motion";
import { ArrowUpRight, Lock, Globe2, GitBranch, Sparkles } from "lucide-react";

const languageStyle = {
    Java: "bg-orange-500/10 text-orange-300 border-orange-500/15",
    JavaScript: "bg-yellow-500/10 text-yellow-300 border-yellow-500/15",
    TypeScript: "bg-blue-500/10 text-blue-300 border-blue-500/15",
    Python: "bg-green-500/10 text-green-300 border-green-500/15",
    HTML: "bg-red-500/10 text-red-300 border-red-500/15",
    CSS: "bg-cyan-500/10 text-cyan-300 border-cyan-500/15",
    React: "bg-sky-500/10 text-sky-300 border-sky-500/15",
};

function RepositoryCard({ name, fullName, language, description, htmlUrl, branch, isPrivate, onReview }) {
    return (
        <motion.article whileHover={{ y: -4 }} transition={{ duration: .18 }} className="card card-hover rounded-2xl p-5 flex flex-col min-h-[255px]">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 shrink-0 rounded-lg bg-slate-800/80 flex items-center justify-center">
                            <GitBranch size={17} className="text-slate-300" />
                        </div>
                        <div className="min-w-0">
                            <h2 className="font-semibold text-slate-100 truncate">{name}</h2>
                            <p className="text-xs text-slate-500 truncate mt-0.5">{fullName || name}</p>
                        </div>
                    </div>
                </div>
                <a href={htmlUrl} target="_blank" rel="noreferrer" className="p-2 rounded-lg text-slate-500 hover:text-slate-100 hover:bg-white/[.05] transition" title="Open on GitHub">
                    <ArrowUpRight size={17} />
                </a>
            </div>

            <p className="mt-5 text-sm leading-6 text-slate-400 line-clamp-2 flex-1">{description || "No repository description provided."}</p>

            <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/[.06] bg-white/[.025] text-xs text-slate-400">
                    {isPrivate ? <Lock size={13} /> : <Globe2 size={13} />} {isPrivate ? "Private" : "Public"}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/[.06] bg-white/[.025] text-xs text-slate-400">
                    <GitBranch size={13} /> {branch || "main"}
                </span>
                <span className={`px-2.5 py-1.5 rounded-lg border text-xs ${languageStyle[language] || "bg-slate-800/50 text-slate-400 border-white/[.06]"}`}>
                    {language || "Unknown"}
                </span>
            </div>

            <button onClick={onReview} className="mt-5 w-full h-10 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-medium text-white flex items-center justify-center gap-2 transition shadow-lg shadow-blue-600/10">
                <Sparkles size={15} /> Analyze with AI
            </button>
        </motion.article>
    );
}

export default RepositoryCard;
