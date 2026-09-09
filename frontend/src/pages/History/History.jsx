import { useEffect, useMemo, useState } from "react";
import { History as HistoryIcon, Search, Trash2, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import MainLayout from "../../layouts/MainLayout";
import HistoryCard from "../../components/HistoryCard/HistoryCard";
import { getAllHistory } from "../../services/historyService";
import api from "../../services/api";

function History() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    async function loadHistory() {
        try { setLoading(true); setHistory(await getAllHistory()); }
        catch (e) { console.error(e); toast.error("Unable to load history."); }
        finally { setLoading(false); }
    }
    useEffect(() => { loadHistory(); }, []);

    async function clearHistory() {
        if (!history.length || !window.confirm("Delete all review history? This cannot be undone.")) return;
        try { await api.delete("/api/review/history"); setHistory([]); toast.success("Review history cleared."); }
        catch (e) { console.error(e); toast.error("Could not clear history."); }
    }

    const filtered = useMemo(() => history.filter((item) => {
        const q = search.toLowerCase().trim();
        return !q || [item.fileName, item.repositoryName, item.language, item.review].filter(Boolean).some(v => v.toLowerCase().includes(q));
    }), [history, search]);

    return <MainLayout><div className="max-w-6xl mx-auto px-5 py-7 sm:px-8 lg:px-10">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8">
            <div><div className="inline-flex items-center gap-2 text-xs text-slate-500 mb-3"><HistoryIcon size={14}/> REVIEW ACTIVITY</div><h1 className="text-3xl font-bold tracking-tight">Review history</h1><p className="mt-2 text-sm text-slate-500">Your previous AI repository analyses, newest first.</p></div>
            <div className="flex gap-2"><button onClick={loadHistory} className="p-2.5 rounded-xl bg-slate-800 border border-white/[.06] text-slate-400 hover:text-white" title="Refresh"><RefreshCw size={16}/></button><button onClick={clearHistory} disabled={!history.length} className="inline-flex items-center gap-2 rounded-xl border border-red-500/10 bg-red-500/5 px-3.5 py-2.5 text-sm text-red-300 hover:bg-red-500/10 disabled:opacity-40"><Trash2 size={15}/> Clear history</button></div>
        </header>
        <div className="card rounded-2xl p-3 mb-6"><div className="relative"><Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search review history…" className="w-full h-11 rounded-xl bg-white/[.025] border border-white/[.06] pl-11 pr-4 outline-none text-sm placeholder:text-slate-600 focus:border-blue-500/40"/></div></div>
        {loading ? <div className="space-y-4">{[1,2,3].map(i=><div key={i} className="card h-40 rounded-2xl animate-pulse"/>)}</div> : filtered.length ? <div className="space-y-4">{filtered.map(review=><HistoryCard key={review.id} review={review}/>)}</div> : <div className="card rounded-2xl p-14 text-center"><HistoryIcon size={25} className="mx-auto text-slate-600"/><h2 className="mt-4 font-semibold">No reviews found</h2><p className="mt-2 text-sm text-slate-500">Run an AI review from the dashboard to create history.</p></div>}
    </div></MainLayout>;
}
export default History;
