import { useEffect, useMemo, useState } from "react";
import { RefreshCw, Search, GitBranch, ShieldCheck, Sparkles, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import MainLayout from "../../layouts/MainLayout";
import RepositoryCard from "../../components/RepositoryCard/RepositoryCard";
import { getRepositories, syncRepositories } from "../../services/repositoryService";

function Dashboard() {
    const [repositories, setRepositories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function loadRepositories(showError = true) {
        try {
            setError("");
            const data = await getRepositories();
            setRepositories(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            if (showError) {
                setError("Unable to load your repositories.");
                toast.error("Unable to load repositories.");
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { loadRepositories(); }, []);

    async function handleSync() {
        try {
            setSyncing(true);
            const message = await syncRepositories();
            await loadRepositories(false);
            toast.success(message || "Repositories synced.");
        } catch (err) {
            console.error(err);
            toast.error("Sync failed. Check your GitHub connection.");
        } finally {
            setSyncing(false);
        }
    }

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return repositories;
        return repositories.filter((repo) =>
            [repo.name, repo.fullName, repo.description, repo.language]
                .filter(Boolean).some((value) => value.toLowerCase().includes(query))
        );
    }, [repositories, search]);

    return (
        <MainLayout>
            <div className="max-w-[1500px] mx-auto px-5 py-7 sm:px-8 lg:px-10">
                <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-8">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/15 bg-blue-500/5 px-3 py-1.5 text-xs text-blue-300 mb-4">
                            <Sparkles size={13} /> AI-powered workspace
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Repository dashboard</h1>
                        <p className="mt-2 text-sm sm:text-base text-slate-500">Review code quality across your GitHub repositories.</p>
                    </div>
                    <button onClick={handleSync} disabled={syncing} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-white/[.07] px-4 py-2.5 text-sm font-medium transition disabled:opacity-50">
                        <RefreshCw size={16} className={syncing ? "animate-spin" : ""} />
                        {syncing ? "Syncing…" : "Sync GitHub"}
                    </button>
                </header>

                <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <Stat icon={<GitBranch size={18} />} label="Repositories" value={repositories.length} />
                    <Stat icon={<Search size={18} />} label="Matching search" value={filtered.length} />
                    <Stat icon={<ShieldCheck size={18} />} label="AI review engine" value="Ready" accent />
                </section>

                <div className="card rounded-2xl p-3 mb-7 flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search repositories, languages, descriptions…" className="w-full h-11 bg-white/[.025] border border-white/[.06] rounded-xl pl-11 pr-4 text-sm outline-none placeholder:text-slate-600 focus:border-blue-500/40 transition" />
                    </div>
                    <div className="flex items-center px-3 text-xs text-slate-500">{filtered.length} visible</div>
                </div>

                {loading && <LoadingGrid />}

                {!loading && error && (
                    <div className="card rounded-2xl p-10 text-center">
                        <p className="text-slate-300 font-medium">{error}</p>
                        <button onClick={() => loadRepositories()} className="mt-4 text-sm text-blue-400 hover:text-blue-300">Try again</button>
                    </div>
                )}

                {!loading && !error && filtered.length === 0 && (
                    <div className="card rounded-2xl p-14 text-center">
                        <div className="mx-auto h-12 w-12 rounded-2xl bg-slate-800 flex items-center justify-center"><GitBranch size={22} className="text-slate-500" /></div>
                        <h2 className="mt-5 text-lg font-semibold">{repositories.length ? "No matches" : "No repositories yet"}</h2>
                        <p className="mt-2 text-sm text-slate-500">{repositories.length ? "Try another search term." : "Sync GitHub to import your current repositories."}</p>
                        {!repositories.length && <button onClick={handleSync} className="mt-5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium">Sync GitHub</button>}
                    </div>
                )}

                {!loading && !error && filtered.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">
                        {filtered.map((repo) => <RepositoryCard key={repo.id} {...repo} onReview={() => navigate(`/repository/${repo.id}`)} />)}
                    </div>
                )}

                <footer className="mt-10 flex items-center justify-between border-t border-white/[.06] pt-5 text-xs text-slate-600">
                    <span>GitHub is the source of truth for repository state.</span>
                    <span className="inline-flex items-center gap-1 hover:text-slate-400 transition"><ArrowUpRight size={12} /> Open a repository to review</span>
                </footer>
            </div>
        </MainLayout>
    );
}

function Stat({ icon, label, value, accent }) {
    return <div className="card rounded-2xl p-5"><div className="flex items-center gap-2 text-xs text-slate-500">{icon}{label}</div><p className={`mt-3 text-2xl font-bold ${accent ? "text-emerald-400" : "text-slate-100"}`}>{value}</p></div>;
}

function LoadingGrid() {
    return <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="card rounded-2xl h-[255px] animate-pulse" />)}</div>;
}

export default Dashboard;
