import { GitBranch, Sparkles, ShieldCheck, Code2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

function Login() {
    const login = () => {
        toast("Redirecting to GitHub…");
        window.location.href = "http://localhost:8080/oauth2/authorization/github";
    };

    return <div className="min-h-screen app-shell relative flex items-center justify-center px-5 py-10 overflow-hidden">
        <div className="absolute -top-48 -left-48 h-[520px] w-[520px] rounded-full bg-blue-600/10 blur-[140px]" />
        <div className="absolute -bottom-48 -right-48 h-[520px] w-[520px] rounded-full bg-cyan-500/10 blur-[140px]" />
        <div className="absolute inset-0 opacity-[.035]" style={{backgroundImage:"linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)", backgroundSize:"42px 42px"}} />

        <motion.main initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:.5}} className="relative w-full max-w-[980px] grid lg:grid-cols-[1.1fr_.9fr] rounded-3xl border border-white/[.09] bg-slate-900/70 backdrop-blur-2xl shadow-2xl overflow-hidden">
            <section className="p-8 sm:p-12 lg:p-14 border-b lg:border-b-0 lg:border-r border-white/[.07]">
                <div className="flex items-center gap-3"><div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center"><Code2 className="text-blue-400" size={21}/></div><span className="font-semibold">CodeLens</span></div>
                <div className="mt-16 max-w-xl"><p className="text-xs uppercase tracking-[.2em] text-blue-400 font-medium">AI code intelligence</p><h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight text-white leading-[1.08]">Understand your codebase before it becomes a problem.</h1><p className="mt-6 text-base leading-7 text-slate-400">Connect GitHub and get focused AI feedback on code quality, risks, maintainability, and practical improvements.</p></div>
                <div className="mt-10 grid sm:grid-cols-3 gap-3"><Feature icon={<Sparkles size={16}/>} title="AI analysis"/><Feature icon={<ShieldCheck size={16}/>} title="OAuth secure"/><Feature icon={<GitBranch size={16}/>} title="GitHub native"/></div>
            </section>
            <section className="p-8 sm:p-12 flex flex-col justify-center bg-black/10"><div className="max-w-sm mx-auto w-full"><p className="text-sm text-slate-500">Welcome back</p><h2 className="mt-2 text-2xl font-semibold">Connect your GitHub account</h2><p className="mt-3 text-sm leading-6 text-slate-500">We use GitHub OAuth so you can review repositories you already have access to.</p><button onClick={login} className="mt-8 w-full h-12 rounded-xl bg-white text-slate-950 hover:bg-slate-200 transition font-semibold flex items-center justify-center gap-3"><GitBranch size={18}/> Continue with GitHub <ArrowRight size={16}/></button><p className="mt-4 text-center text-[11px] leading-5 text-slate-600">You will be redirected to GitHub to authorize access.</p></div></section>
        </motion.main>
    </div>;
}
function Feature({icon,title}) { return <div className="rounded-xl border border-white/[.06] bg-white/[.025] p-3 flex items-center gap-2 text-xs text-slate-400">{icon}<span>{title}</span></div>; }
export default Login;
