import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ExternalLink, GitBranch, Lock, Globe2, Play, RefreshCw, Sparkles, ShieldAlert, Lightbulb, FileCode2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import MainLayout from "../../layouts/MainLayout";
import ReviewCard from "../../components/ReviewCard/ReviewCard";
import { runReview } from "../../services/reviewService";
import { getRepository } from "../../services/repositoryService";

function Repository() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [repository, setRepository] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [loadingRepository, setLoadingRepository] = useState(true);
    const [loadingReview, setLoadingReview] = useState(false);

    useEffect(() => { loadRepository(); }, [id]);

    async function loadRepository() {
        try { setLoadingRepository(true); setRepository(await getRepository(id)); }
        catch (e) { console.error(e); toast.error("Unable to load repository."); }
        finally { setLoadingRepository(false); }
    }

    async function handleReview() {
        try {
            setLoadingReview(true);
            setAnalysis(null);
            const data = await runReview(id);
            setAnalysis(data);
            toast.success("AI review completed.");
        } catch (e) {
            console.error(e);
            toast.error(e?.response?.data?.message || "AI review failed. Check the backend logs.");
        } finally { setLoadingReview(false); }
    }

    const score = analysis?.score ?? null;
    const scoreLabel = analysis?.scoreLabel || scoreLabelFor(score);
    const issueCount = useMemo(() => {
        if (!analysis) return 0;
        return ["criticalIssues", "bugs", "securityIssues", "performanceIssues", "codeSmells"].reduce((n, key) => n + (analysis[key]?.length || 0), 0);
    }, [analysis]);
    const suggestionCount = analysis?.suggestedImprovements?.length || 0;

    if (loadingRepository) return <MainLayout><div className="max-w-6xl mx-auto px-5 py-10"><div className="h-8 w-64 bg-slate-800 rounded animate-pulse"/><div className="mt-6 h-40 card rounded-2xl animate-pulse"/></div></MainLayout>;
    if (!repository) return <MainLayout><div className="p-10 text-center text-slate-500">Repository unavailable.</div></MainLayout>;

    return <MainLayout><div className="max-w-6xl mx-auto px-5 py-7 sm:px-8 lg:px-10">
        <button onClick={() => navigate("/dashboard")} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-200 transition"><ArrowLeft size={16}/> Back to repositories</button>
        <header className="mt-6 flex flex-col lg:flex-row lg:items-end justify-between gap-5">
            <div className="min-w-0"><div className="flex items-center gap-3"><div className="h-11 w-11 rounded-xl bg-blue-500/10 border border-blue-500/15 flex items-center justify-center"><GitBranch className="text-blue-400" size={21}/></div><div className="min-w-0"><h1 className="text-3xl font-bold truncate">{repository.name}</h1><p className="text-sm text-slate-500 mt-1 truncate">{repository.fullName}</p></div></div><p className="mt-4 max-w-2xl text-sm leading-6 text-slate-500">{repository.description || "No repository description provided."}</p></div>
            <div className="flex flex-wrap gap-2"><a href={repository.htmlUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-slate-800 border border-white/[.07] px-3.5 py-2.5 text-sm hover:bg-slate-700 transition"><ExternalLink size={15}/> GitHub</a><button onClick={handleReview} disabled={loadingReview} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2.5 text-sm font-medium disabled:opacity-50 transition"><Play size={15} fill="currentColor"/>{loadingReview ? "Analyzing…" : "Run AI review"}</button></div>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-7">
            <Info label="Visibility" value={repository.private ? "Private" : "Public"} icon={repository.private ? <Lock size={14}/> : <Globe2 size={14}/>} />
            <Info label="Branch" value={repository.defaultBranch || "main"} icon={<GitBranch size={14}/>} />
            <Info label="Language" value={repository.language || "Unknown"} />
            <Info label="Review status" value={analysis ? "Complete" : "Not reviewed"} icon={<Sparkles size={14}/>} />
        </div>

        {loadingReview && <div className="card rounded-2xl p-7 mt-6"><div className="flex items-center gap-3"><div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center"><RefreshCw size={17} className="text-blue-400 animate-spin"/></div><div><p className="font-medium">AI is analyzing the repository</p><p className="text-xs text-slate-500 mt-1">Selecting source files and generating a structured review…</p></div></div><div className="mt-6 h-1.5 bg-slate-800 rounded-full overflow-hidden"><div className="h-full w-2/3 bg-blue-500 rounded-full animate-pulse"/></div></div>}

        {analysis && <section className="mt-7">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_290px] gap-4 mb-6">
                <div className="card rounded-2xl p-6"><p className="text-[10px] uppercase tracking-[.18em] text-blue-400">Analysis complete</p><h2 className="text-xl font-semibold mt-1">Repository quality report</h2><p className="mt-2 text-sm text-slate-500">A concise assessment of the source files selected for this review.</p></div>
                <div className="card rounded-2xl p-5 flex items-center justify-between"><div><p className="text-[10px] uppercase tracking-[.16em] text-slate-600">Final score</p><p className="mt-1 text-sm font-medium text-slate-400">{scoreLabel}</p></div><div className="text-right"><span className="text-5xl font-black text-emerald-400">{score ?? "—"}</span><span className="text-sm text-slate-600"> / 10</span></div></div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                <Metric icon={<FileCode2 size={16}/>} label="Files reviewed" value={analysis.filesReviewed ?? 0}/>
                <Metric icon={<ShieldAlert size={16}/>} label="Issues" value={issueCount}/>
                <Metric icon={<Lightbulb size={16}/>} label="Suggestions" value={suggestionCount}/>
                <Metric icon={<Sparkles size={16}/>} label="Score" value={`${score ?? "—"}/10`}/>
            </div>
            <ReviewCard review={analysis}/>
        </section>}

        {!analysis && !loadingReview && <div className="card rounded-2xl p-12 text-center mt-7"><div className="mx-auto h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center"><Sparkles size={22} className="text-blue-400"/></div><h3 className="mt-5 font-semibold">Ready for analysis</h3><p className="mt-2 text-sm text-slate-500 max-w-lg mx-auto">Run the AI review to inspect code quality, security, bugs, performance and improvement opportunities.</p><button onClick={handleReview} className="mt-5 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2.5 text-sm font-medium">Start review</button></div>}
    </div></MainLayout>;
}
function Info({ label, value, icon }) { return <div className="card rounded-xl p-4"><div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-slate-600">{icon}{label}</div><p className="mt-2 text-sm font-medium text-slate-200 truncate">{value}</p></div>; }
function Metric({ icon, label, value }) { return <div className="card rounded-xl p-4"><div className="flex items-center gap-2 text-slate-500 text-xs">{icon}{label}</div><p className="mt-2 text-xl font-bold text-slate-100">{value}</p></div>; }
function scoreLabelFor(score) { if (score == null) return "Not Reviewed"; if (score >= 9) return "Excellent"; if (score >= 8) return "Very Good"; if (score >= 7) return "Good"; if (score >= 5) return "Average"; return "Needs Improvement"; }
export default Repository;
