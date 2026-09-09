import { FileCode2, ArrowUpRight } from "lucide-react";
function HistoryCard({ review }) {
    const date = review.reviewedAt ? new Date(review.reviewedAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : "Unknown date";
    const score = review.score ?? 0;
    return <article className="card card-hover rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="min-w-0"><div className="flex items-center gap-3"><div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center"><FileCode2 size={17} className="text-blue-400"/></div><div className="min-w-0"><h2 className="font-semibold truncate">{review.repositoryName || review.fileName || "Repository review"}</h2><p className="text-xs text-slate-500 mt-1">{date} · {review.language || "Unknown language"}</p></div></div></div>
            <div className="shrink-0 rounded-xl bg-white/[.035] border border-white/[.06] px-3 py-2 text-right"><p className="text-[10px] uppercase tracking-wider text-slate-600">Score</p><p className="text-lg font-bold text-slate-200">{score}<span className="text-xs text-slate-600">/10</span></p></div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/[.06] text-sm leading-6 text-slate-400 whitespace-pre-wrap max-h-60 overflow-auto">{review.review}</div>
    </article>;
}
export default HistoryCard;
