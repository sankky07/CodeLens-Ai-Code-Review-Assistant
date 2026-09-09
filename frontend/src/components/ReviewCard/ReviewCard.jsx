import { useState } from "react";
import { AlertTriangle, CheckCircle2, ChevronDown, ChevronRight, ShieldAlert, Zap, Code2, Lightbulb, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const sections = [
    { key: "criticalIssues", title: "Critical issues", icon: ShieldAlert, tone: "red", empty: "No critical issues found." },
    { key: "bugs", title: "Bugs & correctness", icon: AlertTriangle, tone: "amber", empty: "No obvious bugs identified." },
    { key: "securityIssues", title: "Security", icon: ShieldAlert, tone: "red", empty: "No significant security issues identified." },
    { key: "performanceIssues", title: "Performance", icon: Zap, tone: "blue", empty: "No significant performance issues identified." },
    { key: "codeSmells", title: "Code quality", icon: Code2, tone: "violet", empty: "No major code smells identified." },
    { key: "bestPractices", title: "Best practices", icon: CheckCircle2, tone: "emerald", empty: "No additional best-practice notes." },
    { key: "suggestedImprovements", title: "Recommended improvements", icon: Lightbulb, tone: "cyan", empty: "No further improvements suggested." },
];

const toneMap = {
    red: "border-red-500/20 bg-red-500/[.06] text-red-300",
    amber: "border-amber-500/20 bg-amber-500/[.06] text-amber-300",
    blue: "border-blue-500/20 bg-blue-500/[.06] text-blue-300",
    violet: "border-violet-500/20 bg-violet-500/[.06] text-violet-300",
    emerald: "border-emerald-500/20 bg-emerald-500/[.06] text-emerald-300",
    cyan: "border-cyan-500/20 bg-cyan-500/[.06] text-cyan-300",
};

function ReviewCard({ review }) {
    const [open, setOpen] = useState({ criticalIssues: true, bugs: true, securityIssues: true });
    const analysis = typeof review === "string" ? safeParse(review) : review;

    if (!analysis || !analysis.overallSummary) {
        return <LegacyReview review={review} />;
    }

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="card rounded-2xl p-6 sm:p-7">
                <div className="flex items-start gap-4">
                    <div className="h-11 w-11 shrink-0 rounded-xl bg-blue-500/10 border border-blue-500/15 flex items-center justify-center"><Sparkles size={20} className="text-blue-400" /></div>
                    <div><p className="text-[10px] uppercase tracking-[.18em] text-blue-400">AI assessment</p><h3 className="mt-1 text-lg font-semibold">Executive summary</h3><p className="mt-3 text-sm leading-7 text-slate-400">{analysis.overallSummary}</p></div>
                </div>
                {analysis.strengths?.length > 0 && <div className="mt-6 rounded-xl border border-emerald-500/15 bg-emerald-500/[.04] p-5"><h4 className="text-sm font-semibold text-emerald-300">What is working well</h4><BulletList items={analysis.strengths} /></div>}
            </div>

            <div className="space-y-3">
                {sections.map(({ key, title, icon: Icon, tone, empty }) => {
                    const items = Array.isArray(analysis[key]) ? analysis[key] : [];
                    const isOpen = open[key];
                    return <div key={key} className="card rounded-2xl overflow-hidden">
                        <button onClick={() => setOpen(v => ({ ...v, [key]: !v[key] }))} className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-white/[.02] transition">
                            <div className="flex items-center gap-3"><span className={`h-9 w-9 rounded-lg border flex items-center justify-center ${toneMap[tone]}`}><Icon size={16}/></span><div><p className="font-semibold text-sm">{title}</p><p className="text-xs text-slate-600 mt-0.5">{items.length} finding{items.length === 1 ? "" : "s"}</p></div></div>
                            {isOpen ? <ChevronDown size={17} className="text-slate-500"/> : <ChevronRight size={17} className="text-slate-500"/>}
                        </button>
                        {isOpen && <div className="border-t border-white/[.05] px-5 pb-5">{items.length ? <BulletList items={items} /> : <p className="pt-4 text-sm text-slate-600">{empty}</p>}</div>}
                    </div>;
                })}
            </div>

            {analysis.truncated && <div className="rounded-xl border border-amber-500/20 bg-amber-500/[.05] px-4 py-3 text-xs leading-5 text-amber-300">This review analyzed {analysis.filesReviewed ?? "selected"} source files. The repository was larger than the AI context limit, so some files were not included in this run.</div>}
        </motion.div>
    );
}

function BulletList({ items }) {
    return <ul className="mt-3 space-y-2">{items.map((item, i) => <li key={i} className="flex gap-3 text-sm leading-6 text-slate-400"><span className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-slate-600"/><span>{item}</span></li>)}</ul>;
}

function safeParse(value) {
    try { return JSON.parse(value); } catch { return null; }
}

function LegacyReview({ review }) {
    return <div className="card rounded-2xl p-6"><p className="text-sm font-medium text-slate-300 mb-4">AI review</p><pre className="whitespace-pre-wrap text-sm leading-7 text-slate-400 font-mono">{review}</pre></div>;
}

export default ReviewCard;
