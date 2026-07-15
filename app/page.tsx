"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Crosshair, X, Terminal, Cpu, Zap, Wifi, Shield, 
  Activity, Radio as RadioIcon, Code, Lock, Unlock, Eye, EyeOff, Search, KeyRound, Power, RefreshCw, FileText, User, Bell, Trash2
} from "lucide-react";
import { supabase } from "@/utils/supabase";

// ==========================================
// 1. 全局多语言词典 (i18n)
// ==========================================
const TRANSLATIONS = {
  en: {
    gatekeeper_title: "RESTRICTED ACCESS PROTOCOL",
    gatekeeper_sub: "INPUT 6-DIGIT CLEARANCE CODE",
    gatekeeper_error: "INVALID CLEARANCE CODE. ACCESS DENIED.",
    login_tab: "LOGIN",
    reg_tab: "REGISTER",
    email: "IDENTIFICATION (EMAIL)",
    codename: "CODENAME",
    password: "ACCESS KEY (PASSWORD)",
    connect_btn: "ESTABLISH CONNECTION",
    verifying: "VERIFYING CREDENTIALS...",
    sys_status: "SYSTEM STATUS",
    core: "CORE LOAD",
    network: "NETWORK TRAFFIC",
    nominal: "SYSTEM NOMINAL",
    anno_title: "ANNOUNCEMENTS",
    anno_1: "[CALENDAR] Celebrating Sylus's 2nd Anniversary!",
    anno_2: "[UPDATE] Onychinus Radar v2.0 Online.",
    my_signals: "MY ARCHIVES",
    radar_active: "Radar active. Signals intercepted.",
    no_records: "> No records found.",
    rsrc: "RSRC USAGE",
    energy: "ENERGY EFF",
    quick_access: "QUICK ACCESS",
    scan: "SCAN",
    target: "TARGET",
    inject: "INJECT",
    target_input: "[ TARGET CODE ]",
    target_btn: "EXECUTE SEARCH",
    disconnect: "DISCONNECT",
    mode: "MODE",
    operator: "OPERATOR",
    encrypt_check: "Enable End-to-End Encryption",
    pass_placeholder: "6-digit passcode",
    inject_btn: "[ EXECUTE INJECTION ]",
    uploading: "UPLOADING PACKETS...",
    secure: "TRANSMISSION SECURE.",
    decrypt_btn: "[ DECRYPT RECORD ]",
    reply_placeholder: "TYPE REPLY...",
    no_replies: "> No response protocols found."
  },
  zh: {
    gatekeeper_title: "ONYCHINUS 底层访问协议",
    gatekeeper_sub: "请输入 6 位通讯授权码",
    gatekeeper_error: "授权码无效，访问被拒绝。",
    login_tab: "身份接入 (LOGIN)",
    reg_tab: "代号注册 (REGISTER)",
    email: "通讯标识 (邮箱)",
    codename: "专属代号 (中英均可)",
    password: "访问密钥 (密码)",
    connect_btn: "建立安全连接",
    verifying: "正在核实身份凭证...",
    sys_status: "系统运行状态",
    core: "核心负载",
    network: "网络吞吐",
    nominal: "各项指标正常",
    anno_title: "暗网公告",
    anno_1: "[日历] 庆祝秦彻上线二周年！",
    anno_2: "[系统] 雷达拦截终端 v2.0 现已上线。包含端到端加密与定向追踪功能。",
    my_signals: "我的传输档案",
    radar_active: "雷达运转中。已拦截频段。",
    no_records: "> 尚未上传任何通讯记录。",
    rsrc: "资源占用",
    energy: "能源效率",
    quick_access: "快捷指令区",
    scan: "频段刷新",
    target: "定向追踪",
    inject: "信号注入",
    target_input: "[ 输入专属追踪码 ]",
    target_btn: "执行检索",
    disconnect: "断开连接",
    mode: "当前模式",
    operator: "操作员",
    encrypt_check: "启用高级端到端加密",
    pass_placeholder: "设置 6 位数字密码",
    inject_btn: "[ 执行数据注入 ]",
    uploading: "正在上传并加密数据包...",
    secure: "数据已安全汇入暗网深渊。",
    decrypt_btn: "[ 破解加密档案 ]",
    reply_placeholder: "输入回音数据包...",
    no_replies: "> 暂无任何响应协议。"
  }
};

// ==========================================
// 2. 基础复用组件
// ==========================================
const ScrambleInput = ({ value, onChange, placeholder }: { value: string, onChange: (v: string) => void, placeholder: string }) => {
  const [display, setDisplay] = useState("");
  const [isRevealed, setIsRevealed] = useState(false);
  const chars = "!<>-_\\/[]{}—=+*^?#X";

  useEffect(() => {
    if (!isRevealed) {
      setDisplay(value.split("").map(() => chars[Math.floor(Math.random() * chars.length)]).join(""));
    }
  }, [value, isRevealed]);

  return (
    <div className="relative w-full flex items-center border-b border-slate-700 bg-transparent focus-within:border-[#7a2f3a] transition-colors">
      <div className="relative flex-1 h-12 flex items-center p-2">
        <input 
          type={isRevealed ? "text" : "password"} 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          className="absolute inset-0 w-full opacity-0 cursor-text z-20" 
        />
        <div className="text-base text-[#7a2f3a] font-mono tracking-[0.2em] flex items-center">
          {value.length === 0 ? (
            <span className="text-slate-500 tracking-widest">{placeholder}</span>
          ) : (
            <span className="text-[#c75a6c] font-bold drop-shadow-[0_0_5px_rgba(199,90,108,0.8)]">
              {isRevealed ? value : display}
            </span>
          )}
          <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="ml-1 w-2 h-5 bg-[#7a2f3a] inline-block" />
        </div>
      </div>
      <button type="button" onMouseDown={() => setIsRevealed(true)} onMouseUp={() => setIsRevealed(false)} onMouseLeave={() => setIsRevealed(false)} className="p-3 z-30 text-slate-400 hover:text-white transition-colors cursor-pointer">
        {isRevealed ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
};

const Panel = ({ title, children, className = "" }: any) => (
  <div className={`relative border border-slate-700/80 bg-[#0c1017]/90 backdrop-blur-md flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.8)] ${className}`}>
    <div className="absolute -top-[1px] -left-[1px] w-2 h-2 border-t border-l border-slate-500"></div>
    <div className="absolute -top-[1px] -right-[1px] w-2 h-2 border-t border-r border-slate-500"></div>
    <div className="absolute -bottom-[1px] -left-[1px] w-2 h-2 border-b border-l border-slate-500"></div>
    <div className="absolute -bottom-[1px] -right-[1px] w-2 h-2 border-b border-r border-slate-500"></div>
    
    <div className="flex justify-between items-center px-4 py-3 border-b border-slate-700/80 bg-[#11141c]">
      <span className="text-sm font-bold tracking-widest text-slate-200">{title}</span>
      <span className="text-slate-500 text-sm">+</span>
    </div>
    <div className="p-4 flex-1 overflow-hidden relative z-10">
      {children}
    </div>
  </div>
);

const ProgressBar = ({ label, value, icon: Icon }: any) => (
  <div className="flex flex-col gap-2 mb-4">
    <div className="flex justify-between items-center text-xs text-slate-300 tracking-wider">
      <div className="flex items-center gap-2"><Icon size={16} className="text-slate-400" /><span>{label}</span></div>
      <span className="text-slate-200 font-bold">{value}%</span>
    </div>
    <div className="w-full h-[3px] bg-slate-800 relative overflow-hidden">
      <div className="absolute top-0 left-0 h-full bg-slate-400" style={{ width: `${value}%` }}></div>
    </div>
  </div>
);

const useScrambleText = (text: string) => {
  const [d, setD] = useState("");
  useEffect(() => {
    let i = 0; const chars = "!<>-_\\/[]{}—=+*^?#";
    const scrambleLimit = Math.min(text?.length || 0, 100); 
    if (scrambleLimit === 0) return;
    const int = setInterval(() => {
      const scrambledPart = text.substring(0, scrambleLimit).split("").map((c, idx) => idx < i ? text[idx] : chars[Math.floor(Math.random()*chars.length)]).join("");
      const rest = text.substring(scrambleLimit);
      setD(scrambledPart + (i >= scrambleLimit ? rest : ""));
      if (i >= scrambleLimit) clearInterval(int); 
      i += Math.ceil(scrambleLimit / 20); 
    }, 40);
    return () => clearInterval(int);
  }, [text]);
  return d;
};

// ==========================================
// 3. 门禁系统 (Gatekeeper)
// ==========================================
const Gatekeeper = ({ onSuccess, t }: { onSuccess: () => void, t: any }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    if (code === "240715") {
      onSuccess();
    } else { 
      setError(true); 
      setCode(""); 
      setTimeout(() => setError(false), 800); 
    }
  };

  return (
    <motion.div animate={{ backgroundColor: error ? ["#0a0d14", "#7a2f3a", "#0a0d14"] : "#0a0d14" }} transition={{ duration: 0.5 }} className="h-screen w-screen flex flex-col items-center justify-center font-mono relative selection:bg-[#7a2f3a] selection:text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#12161f_0%,transparent_100%)] z-0 pointer-events-none"></div>
      
      <div className="relative z-10 w-[90%] max-w-lg text-center">
         <Shield size={56} className={`mx-auto mb-8 ${error ? 'text-black' : 'text-[#7a2f3a]'}`} />
         <h1 className={`text-2xl md:text-3xl font-bold tracking-[0.3em] mb-4 ${error ? 'text-black' : 'text-slate-100'}`}>{t.gatekeeper_title}</h1>
         <p className={`text-sm md:text-base tracking-widest mb-12 ${error ? 'text-black font-bold' : 'text-slate-400'}`}>{t.gatekeeper_sub}</p>
         
         <div className="flex justify-center gap-4 mb-8">
            {Array.from({length: 6}).map((_, i) => (
               <div key={i} className={`w-12 h-16 md:w-14 md:h-20 flex items-center justify-center text-3xl font-bold border-b-4 ${code[i] ? 'border-[#7a2f3a] text-[#7a2f3a]' : 'border-slate-700 text-transparent'} ${error ? 'border-black text-black' : ''}`}>
                 {code[i] || "_"}
               </div>
            ))}
         </div>
         
         <input type="tel" maxLength={6} autoFocus value={code} onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))} className="absolute inset-0 opacity-0 cursor-text" />
         
         {error && <div className="text-black font-bold text-base tracking-widest animate-pulse mt-4 bg-[#7a2f3a] inline-block px-6 py-2">{t.gatekeeper_error}</div>}
         
         {code.length === 6 && !error && (
            <button onClick={handleSubmit} className="mt-10 px-12 py-4 border-2 border-[#7a2f3a] text-[#7a2f3a] text-base font-bold tracking-widest hover:bg-[#7a2f3a] hover:text-[#0a0d14] transition-colors z-20 relative cursor-pointer">
              [ VERIFY ]
            </button>
         )}
      </div>
    </motion.div>
  );
};

// ==========================================
// 4. 终端登录
// ==========================================
const TerminalLogin = ({ onLoginSuccess, t }: { onLoginSuccess: (p: any) => void, t: any }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [codename, setCodename] = useState("");
  const [status, setStatus] = useState<"idle"|"authenticating"|"success">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleAuth = async () => {
    if (!email || !password || (isRegistering && !codename)) { setErrorMsg("> [ERROR] Missing fields."); return; }
    setStatus("authenticating"); setErrorMsg("");
    try {
      if (isRegistering) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.user) {
          await supabase.from("profiles").insert({ id: data.user.id, email, codename });
          setStatus("success"); setTimeout(() => onLoginSuccess({ codename }), 2000);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();
        setStatus("success"); setTimeout(() => onLoginSuccess(profile || { codename: "UNKNOWN_AGENT" }), 2000);
      }
    } catch (err: any) { 
      setStatus("idle"); 
      setErrorMsg(`> [ERROR] ${err.message}`); 
    }
  };

  return (
    <div className="h-screen w-screen bg-[#0a0d14] flex items-center justify-center font-mono relative overflow-hidden px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#12161f_0%,#0a0d14_100%)] z-0"></div>
      
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative z-20 w-full max-w-[500px] border border-slate-700 bg-[#0c1017]/95 backdrop-blur-md p-8 md:p-12 shadow-[0_0_80px_rgba(0,0,0,0.9)]">
        <div className="flex flex-col items-center mb-10 gap-4">
          {status === "success" ? <Unlock size={40} className="text-[#9e3f4d]" /> : <Lock size={40} className="text-slate-400" />}
          <div className="text-2xl md:text-3xl font-bold tracking-[0.3em] text-slate-100 mt-2">ONYCHINUS</div>
        </div>

        {status === "idle" && (
          <div className="flex flex-col gap-6 md:gap-8">
            <div className="flex gap-6 border-b border-slate-700 pb-3">
              <span onClick={() => setIsRegistering(false)} className={`text-sm cursor-pointer tracking-widest ${!isRegistering ? "text-[#7a2f3a] font-bold border-b-2 border-[#7a2f3a] pb-2 -mb-[14px]" : "text-slate-500 hover:text-slate-300"}`}>{t.login_tab}</span>
              <span onClick={() => setIsRegistering(true)} className={`text-sm cursor-pointer tracking-widest ${isRegistering ? "text-[#7a2f3a] font-bold border-b-2 border-[#7a2f3a] pb-2 -mb-[14px]" : "text-slate-500 hover:text-slate-300"}`}>{t.reg_tab}</span>
            </div>

            <div>
              <div className="text-sm text-slate-400 mb-2 tracking-widest font-bold">{t.email}</div>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#0a0d14] border border-slate-700 p-3 h-12 md:h-14 text-base text-slate-100 outline-none focus:border-[#7a2f3a]" />
            </div>

            {isRegistering && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                <div className="text-sm text-slate-400 mb-2 tracking-widest font-bold">{t.codename}</div>
                <input type="text" value={codename} onChange={(e) => setCodename(e.target.value)} className="w-full bg-[#0a0d14] border border-slate-700 p-3 h-12 md:h-14 text-base text-[#9e3f4d] font-bold outline-none focus:border-[#7a2f3a]" />
              </motion.div>
            )}

            <div>
              <div className="text-sm text-slate-400 mb-2 tracking-widest font-bold">{t.password}</div>
              <ScrambleInput value={password} onChange={setPassword} placeholder="******" />
            </div>

            {errorMsg && <div className="text-[#9e3f4d] text-sm font-bold animate-pulse">{errorMsg}</div>}
            
            <button onClick={handleAuth} className="mt-2 w-full py-3 md:py-4 bg-[#11141c] border-2 border-slate-700 text-slate-200 text-sm md:text-base font-bold tracking-widest hover:border-[#7a2f3a] hover:bg-[#7a2f3a] hover:text-[#0a0d14] transition-all cursor-pointer">
              {t.connect_btn}
            </button>
          </div>
        )}

        {status === "authenticating" && (
          <div className="flex flex-col items-center justify-center gap-5 py-12">
            <Activity size={40} className="text-[#7a2f3a] animate-spin" />
            <div className="text-base text-slate-300 font-bold">{t.verifying}</div>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center justify-center gap-5 py-12 text-center">
            <div className="text-base text-slate-300">ACCESS GRANTED.<br/>
              <span className="text-[#9e3f4d] text-xl font-bold mt-4 block">WELCOME, {codename}.</span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

// ==========================================
// 5. 弹窗与交互模块 (解密阅读弹窗)
// ==========================================
const DecryptModal = ({ signal, onClose, onRefresh, currentUser, t }: any) => {
  const dec = useScrambleText(signal.text);
  const [replies, setReplies] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [passkeyInput, setPasskeyInput] = useState("");
  const [passError, setPassError] = useState(false);
  const [step, setStep] = useState<"preview" | "auth" | "read">("preview");

  const isAuthor = currentUser?.codename === signal.author_codename;

  const fetchR = async () => { 
    const { data } = await supabase.from("replies").select("*").eq("signal_id", signal.id).order("created_at"); 
    if(data) setReplies(data); 
  };
  
  useEffect(() => { if (step === "read") fetchR(); }, [signal.id, step]);

  const sendR = async (e: any) => {
    if(e.key === "Enter" && input.trim()) {
      await supabase.from("replies").insert({ signal_id: signal.id, text: input, author_codename: currentUser?.codename || "UNKNOWN" });
      setInput(""); fetchR();
    }
  };

  const handleDecryptClick = () => { if (signal.passkey) setStep("auth"); else setStep("read"); };
  const handleUnlock = () => { if (passkeyInput === signal.passkey) { setStep("read"); setPassError(false); } else { setPassError(true); setPasskeyInput(""); } };

  const handleDelete = async () => {
    if (confirm("DANGER: 您确定要从暗网彻底销毁该通讯记录吗？此操作不可逆。")) {
       await supabase.from("signals").delete().eq("id", signal.id);
       onRefresh();
       onClose();
    }
  };

  return (
    <motion.div key="decrypt-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 flex items-center justify-center bg-[#0a0d14]/80 backdrop-blur-md px-4">
      {step === "preview" && (
        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="relative w-full max-w-[450px] bg-[#0c1017] border border-slate-600 shadow-[0_0_50px_rgba(0,0,0,0.9)] p-8 font-mono text-slate-200 flex flex-col">
          <div className="flex justify-between border-b border-slate-700 pb-4 mb-6 items-center">
             <span className="text-slate-400 text-sm font-bold tracking-widest">[ SIGNAL_INTERCEPTED ]</span>
             <div className="flex items-center gap-4">
                {isAuthor && <button onClick={handleDelete} className="text-[#802020] hover:text-red-500 font-bold text-[10px] tracking-widest flex items-center gap-1 cursor-pointer"><Trash2 size={14}/> [ PURGE ]</button>}
                <button onClick={onClose} className="hover:text-white cursor-pointer relative z-50"><X size={20}/></button>
             </div>
          </div>
          <div className="text-xl md:text-2xl font-bold text-slate-100 mb-4 truncate">{signal.title || "UNTITLED_RECORD"}</div>
          <div className="text-sm text-slate-400 mb-8 italic border-l-4 border-slate-700 pl-4 bg-[#11141c] p-4 rounded-sm leading-relaxed">
            "{signal.text.substring(0, 50)}{signal.text.length > 50 ? "..." : ""}"
          </div>
          <div className="flex items-center justify-between mt-auto pt-5 border-t border-slate-700">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-2">{signal.passkey ? <><Lock size={14} className="text-[#7a2f3a]"/> ENCRYPTED</> : <><Unlock size={14}/> PUBLIC</>}</span>
            <button onClick={handleDecryptClick} className="px-6 py-3 bg-[#11141c] border border-slate-600 text-slate-200 text-sm font-bold hover:border-[#7a2f3a] hover:text-[#7a2f3a] cursor-pointer">
              {t.decrypt_btn}
            </button>
          </div>
        </motion.div>
      )}

      {step === "auth" && (
        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="relative w-full max-w-[400px] bg-[#0c1017] border border-[#7a2f3a] shadow-[0_0_60px_rgba(122,47,58,0.2)] p-8 font-mono text-slate-200 flex flex-col">
          <div className="flex justify-between border-b border-slate-700 pb-4 mb-6">
             <span className="text-[#7a2f3a] text-sm font-bold tracking-widest">[ ENCRYPTION DETECTED ]</span>
             <button onClick={onClose} className="hover:text-white cursor-pointer"><X size={20}/></button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center py-8 gap-6">
            <KeyRound size={48} className="text-[#7a2f3a]" />
            <div className="text-sm text-[#7a2f3a] font-bold text-center">信号受高级协议保护。<br/>请输入 6 位解密密钥。</div>
            <input type="password" maxLength={6} value={passkeyInput} onChange={e=>setPasskeyInput(e.target.value.replace(/[^0-9]/g, ''))} placeholder="******" className="mt-4 w-56 bg-[#0a0d14] border border-slate-700 p-4 text-center text-2xl text-[#c75a6c] tracking-[0.5em] outline-none focus:border-[#7a2f3a] font-bold" />
            {passError && <span className="text-red-500 text-sm font-bold animate-pulse">Error: 无效密钥。</span>}
            <button onClick={handleUnlock} className="mt-4 px-10 py-3 bg-[#11141c] border border-slate-600 text-sm font-bold hover:border-[#7a2f3a] hover:text-[#7a2f3a] cursor-pointer">
              [ SUBMIT ]
            </button>
          </div>
        </motion.div>
      )}

      {step === "read" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative w-full max-w-[600px] h-[85%] md:h-[700px] bg-[#0c1017] border border-slate-600 p-6 md:p-8 font-mono text-slate-200 flex flex-col shadow-[0_0_80px_rgba(0,0,0,0.9)]">
          <div className="flex justify-between border-b border-slate-700 pb-4 mb-6 items-center">
            <span className="text-slate-300 text-sm font-bold tracking-widest truncate max-w-[250px] md:max-w-[400px]">[ DECRYPTED ] - {signal.title || "UNTITLED"}</span>
            <div className="flex items-center gap-5">
               {isAuthor && <button onClick={handleDelete} className="text-[#802020] hover:text-red-500 font-bold text-[10px] tracking-widest flex items-center gap-1 cursor-pointer"><Trash2 size={14}/> [ PURGE ]</button>}
               <button onClick={onClose} className="hover:text-white cursor-pointer relative z-50"><X size={20}/></button>
            </div>
          </div>
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar text-base md:text-lg mb-6 text-slate-200 leading-relaxed tracking-wide whitespace-pre-wrap">
              <span className="text-sm text-slate-400 block mb-6 border-b border-slate-800 pb-3 font-bold">OPERATOR: <span className="text-[#9e3f4d]">{signal.author_codename}</span></span>
              {dec}
            </div>
            <div className="h-[150px] shrink-0 overflow-y-auto pr-3 custom-scrollbar space-y-3 text-sm text-slate-400 border-l-4 border-slate-700 pl-4 mb-5 bg-[#0a0d14] p-4 rounded-sm">
              {replies.map(r => {
                const isReplyAuthor = r.author_codename === signal.author_codename;
                return (
                  <div key={r.id} className="border-b border-slate-800/50 pb-2">
                    &gt; <span className={`${isReplyAuthor ? 'text-[#9e3f4d]' : 'text-slate-300'} font-bold`}>
                      [{r.author_codename}]
                      {isReplyAuthor && <User size={14} className="inline ml-1 mb-0.5"/>}
                    </span>: <span className="text-slate-300 ml-2">{r.text}</span>
                  </div>
                )
              })}
              {replies.length === 0 && <div className="italic text-slate-600 font-bold">{t.no_replies}</div>}
            </div>
            <div className="flex items-center gap-3 border-t border-slate-700 pt-5">
              <span className="text-slate-400 font-bold text-lg">&gt;</span>
              <input type="text" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={sendR} placeholder={t.reply_placeholder} className="w-full bg-[#11141c] border border-slate-700 p-3 md:p-4 outline-none text-sm md:text-base text-slate-100 font-bold focus:border-slate-500 cursor-text" />
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
const InjectPanel = ({ isOpen, onClose, onRefresh, currentUser, t }: any) => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [passkey, setPasskey] = useState("");
  const [status, setStatus] = useState<"idle"|"injecting"|"success">("idle");
  const [generatedCode, setGeneratedCode] = useState("");

  const handleInject = async () => {
    if(!text) return;
    if(isEncrypted && passkey.length !== 6) { alert("6 digits required"); return; }
    setStatus("injecting");
    const accessCode = "ONC-" + Math.random().toString(36).substring(2, 6).toUpperCase();
    const finalTitle = title.trim()||"UNTITLED_RECORD";
    const { error } = await supabase.from("signals").insert({ 
      title: finalTitle, text, pos_x: Math.floor(Math.random()*80)+10, pos_y: Math.floor(Math.random()*80)+10, 
      author_codename: currentUser?.codename || "UNKNOWN", access_code: accessCode, passkey: isEncrypted ? passkey : null 
    });
    if(!error) { setGeneratedCode(accessCode); setTimeout(() => setStatus("success"), 1000); }
  };

  const closeAndReset = () => { setStatus("idle"); setTitle(""); setText(""); setPasskey(""); setIsEncrypted(false); setGeneratedCode(""); onRefresh(); onClose(); };

  return <AnimatePresence>{isOpen && (
    <motion.div key="inject-modal" className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-10 pointer-events-none">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[#0a0d14]/90 backdrop-blur-sm pointer-events-auto cursor-pointer" onClick={status === "idle" ? onClose : undefined} />
      <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="relative w-full max-w-[900px] h-[90vh] md:h-[85vh] bg-[#0c1017] border border-slate-600 p-6 md:p-10 flex flex-col pointer-events-auto overflow-y-auto shadow-[0_0_100px_rgba(0,0,0,1)]">
        <div className="flex justify-between border-b border-slate-700 pb-5 mb-4 md:mb-6 shrink-0">
          <span className="text-slate-200 text-sm md:text-xl font-bold flex items-center gap-3"><FileText size={24} className="text-[#7a2f3a]"/> [ SECURE_COMPOSE_ENVIRONMENT ]</span>
          <button onClick={status==="success" ? closeAndReset : onClose} className="text-slate-600 hover:text-white cursor-pointer"><X size={28}/></button>
        </div>
        
        {status === "idle" && <>
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="RECORD_TITLE (Optional)" className="w-full bg-[#11141c] border border-slate-700 p-4 md:p-5 text-base md:text-lg text-slate-100 font-bold outline-none focus:border-slate-500 mb-5 cursor-text"/>
          <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="> COMMENCE_TYPING..." className="flex-1 min-h-[200px] w-full bg-[#0a0d14] border border-slate-700 p-5 md:p-6 text-sm md:text-base text-slate-200 outline-none focus:border-[#7a2f3a] resize-none mb-5 custom-scrollbar leading-relaxed cursor-text"/>
          <div className="flex flex-col md:flex-row items-stretch md:items-end gap-5 shrink-0">
            <div className="flex-1 border border-slate-700 bg-[#11141c] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <label className="flex items-center gap-3 text-sm text-slate-300 font-bold cursor-pointer">
                <input type="checkbox" checked={isEncrypted} onChange={(e) => setIsEncrypted(e.target.checked)} className="accent-[#7a2f3a] w-5 h-5 cursor-pointer" /> {t.encrypt_check}
              </label>
              {isEncrypted && <input type="text" maxLength={6} placeholder={t.pass_placeholder} value={passkey} onChange={e=>setPasskey(e.target.value.replace(/[^0-9]/g, ''))} className="w-full md:w-40 bg-[#0a0d14] border border-slate-600 p-3 text-center text-base text-[#9e3f4d] tracking-[0.2em] font-bold outline-none focus:border-[#7a2f3a] cursor-text" />}
            </div>
            <button onClick={handleInject} className="py-5 px-12 bg-[#11141c] border-2 border-slate-600 text-slate-200 text-base font-bold hover:border-[#7a2f3a] hover:bg-[#1a0f12] hover:text-[#7a2f3a] transition-all w-full md:w-auto cursor-pointer">
              {t.inject_btn}
            </button>
          </div>
        </>}
        
        {status === "injecting" && <div className="flex-1 flex flex-col items-center justify-center gap-6"><Activity size={56} className="text-[#7a2f3a] animate-spin"/><div className="text-base text-[#7a2f3a] font-bold tracking-widest">{t.uploading}</div></div>}
        
        {status === "success" && (
          <div className="flex-1 flex flex-col items-center justify-center gap-8 text-center">
            <Shield size={72} className="text-slate-500"/>
            <div className="text-base text-slate-200">
              {t.secure}<br/><br/>您的专属通讯密钥为：<br/>
              <span className="text-3xl text-white font-bold block mt-6 border border-slate-600 p-4 bg-[#0a0d14] select-all shadow-lg">{generatedCode}</span>
              <br/><span className="text-slate-500 text-sm mt-2 block">（请截图保存，可在 TARGET 终端检索）</span>
            </div>
            <button onClick={closeAndReset} className="mt-10 px-10 py-4 border-2 border-slate-700 text-slate-300 font-bold hover:text-white hover:border-slate-500 cursor-pointer">CLOSE TERMINAL</button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )}</AnimatePresence>;
};

// ==========================================
// 6. 主控制台
// ==========================================
const Dashboard = ({ currentUser, onLogout, lang, setLang }: any) => {
  const t = TRANSLATIONS[lang as keyof typeof TRANSLATIONS];
  const [cloudPool, setCloudPool] = useState<any[]>([]);
  const [displaySignals, setDisplaySignals] = useState<any[]>([]);
  const [activeSignal, setActiveSignal] = useState<any>(null);
  const [time, setTime] = useState("");
  const [isInjectModalOpen, setIsInjectModalOpen] = useState(false);
  const [isTargeting, setIsTargeting] = useState(false);
  const [targetCode, setTargetCode] = useState("");
  const [scanNumbers, setScanNumbers] = useState({ lat: "00.000", lng: "00.000" });
  const [isScanning, setIsScanning] = useState(false);

  const fetchSignals = async () => { 
    const { data } = await supabase.from("signals").select("*").order("created_at", { ascending: false }).limit(1000); 
    if(data) { 
      const latest80 = data.slice(0, 80);
      const random120 = [...data.slice(80)].sort(() => 0.5 - Math.random()).slice(0, 120);
      const combinedPool = [...latest80, ...random120];
      setCloudPool(combinedPool); shuffleAndDisplay(combinedPool); 
    }
  };

  const shuffleAndDisplay = (pool: any[]) => { setDisplaySignals([...pool].sort(() => 0.5 - Math.random()).slice(0, 18)); };
  
  const handleScanRefresh = () => { 
    setIsScanning(true); 
    setTimeout(() => { shuffleAndDisplay(cloudPool); setIsScanning(false); }, 1000); 
  };

  useEffect(() => { fetchSignals(); }, []);
  
  useEffect(() => { 
    const timer = setInterval(() => { 
      const now = new Date(); setTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`); 
      setScanNumbers({ lat: (Math.random() * 90).toFixed(3), lng: (Math.random() * 180).toFixed(3) });
    }, 1000); 
    return () => clearInterval(timer); 
  }, []);

  const handleTargetSearch = () => {
    if(!targetCode) return;
    const found = cloudPool.find(s => s.access_code === targetCode.toUpperCase());
    if(found) { setActiveSignal(found); setIsTargeting(false); setTargetCode(""); } else alert("> CODE NOT FOUND.");
  };

  const mySignals = cloudPool.filter(s => s.author_codename === currentUser?.codename);

  return (
    <div className="min-h-screen lg:h-screen w-screen bg-[#0a0d14] text-slate-400 font-mono flex flex-col p-2 lg:p-6 relative overflow-y-auto lg:overflow-hidden">
      <style dangerouslySetInnerHTML={{__html: `@keyframes sweep { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } .radar-sweep { animation: sweep 4s linear infinite; } .scanline { background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.5) 51%); background-size: 100% 4px; pointer-events: none !important; } .custom-scrollbar::-webkit-scrollbar { width: 6px; } .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); } .custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; border-radius: 6px; }`}} />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,#12161f_0%,#0a0d14_100%)] z-0 pointer-events-none"></div>
      <div className="fixed inset-0 z-[1] scanline opacity-20 pointer-events-none"></div>

      <header className="relative z-20 flex flex-col md:flex-row justify-between md:items-end pb-4 border-b border-slate-700 mb-4 lg:mb-5 gap-4">
        <div className="flex items-baseline gap-4 md:gap-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-[0.2em] text-slate-100">ONYCHINUS<span className="text-[#7a2f3a] text-xl md:text-2xl ml-3">2.0</span></h1>
        </div>
        <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
          <div className="flex gap-3 text-sm font-bold tracking-widest bg-[#11141c] p-1 border border-slate-700">
             <span onClick={() => setLang('en')} className={`px-3 py-1 cursor-pointer ${lang === 'en' ? 'bg-[#7a2f3a] text-white' : 'text-slate-500 hover:text-white'}`}>EN</span>
             <span onClick={() => setLang('zh')} className={`px-3 py-1 cursor-pointer ${lang === 'zh' ? 'bg-[#7a2f3a] text-white' : 'text-slate-500 hover:text-white'}`}>ZH</span>
          </div>
          <div className="text-sm tracking-widest text-slate-400 flex items-center gap-4">
             <span className="hidden md:inline">2026 / 07 / 15</span><span className="text-slate-200 font-bold">{time || "00:00:00"}</span>
          </div>
        </div>
      </header>

      <main className="relative z-20 flex-1 flex flex-col lg:flex-row gap-6 overflow-y-auto lg:overflow-hidden pb-10 lg:pb-0">
        
        <aside className="w-full lg:w-[340px] flex flex-col gap-6 shrink-0 lg:overflow-y-auto custom-scrollbar lg:pr-3">
          <Panel title={t.anno_title} className="flex-shrink-0">
             <div className="space-y-4 text-sm text-slate-300 font-bold">
               <div className="flex gap-3 items-start"><Bell size={16} className="text-[#9e3f4d] shrink-0 mt-0.5"/> <span className="leading-relaxed">{t.anno_1}</span></div>
               <div className="flex gap-3 items-start"><Bell size={16} className="text-[#9e3f4d] shrink-0 mt-0.5"/> <span className="leading-relaxed">{t.anno_2}</span></div>
             </div>
          </Panel>

          <Panel title={t.sys_status} className="flex-shrink-0">
            <ProgressBar label={t.core} value={98} icon={Cpu}/>
            <ProgressBar label={t.network} value={64} icon={Wifi}/>
            <div className="mt-5 flex items-center gap-3 text-sm text-slate-300 font-bold"><div className="w-3 h-3 bg-slate-300 animate-pulse rounded-full"></div>{t.nominal}</div>
          </Panel>
          
          <Panel title={t.my_signals} className="flex-1 min-h-[180px]">
             <div className="overflow-y-auto h-full pr-3 custom-scrollbar space-y-3">
                {mySignals.length > 0 ? mySignals.map(sig => (
                   <div key={sig.id} onClick={() => setActiveSignal(sig)} className="cursor-pointer bg-[#0a0d14] p-3 border-l-4 border-slate-700 hover:border-[#7a2f3a] hover:bg-[#11141c] transition-colors flex flex-col justify-center">
                      <div className="text-sm text-slate-200 font-bold truncate">{sig.title || "UNTITLED"}</div>
                      <div className="text-xs text-slate-500 mt-2 flex justify-between font-bold"><span>SIG-{sig.id.substring(0,4).toUpperCase()}</span>{sig.passkey && <Lock size={14} className="text-[#9e3f4d]"/>}</div>
                   </div>
                )) : <div className="text-sm text-slate-500 font-bold mt-2">{t.no_records}</div>}
             </div>
          </Panel>
        </aside>

        <section className="flex-1 flex items-center justify-center relative border border-slate-700/60 bg-[#0c1017]/40 p-4 lg:p-0 min-h-[400px] overflow-hidden">
          <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-slate-700"></div>
          <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-slate-700"></div>
          <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-slate-700"></div>
          <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-slate-700"></div>
          
          <div className="absolute inset-0 bg-[#0a0d14] blur-[150px] opacity-10 rounded-full z-0 pointer-events-none"></div>
          
          <div className="relative w-full max-w-[600px] aspect-square flex items-center justify-center z-10 scale-90 lg:scale-100">
            <div className="absolute -top-6 text-xs text-slate-500 font-bold hidden md:block">000° LAT: {scanNumbers.lat}</div>
            <div className="absolute -bottom-6 text-xs text-slate-500 font-bold hidden md:block">180° LNG: {scanNumbers.lng}</div>
            <div className="absolute -left-10 text-xs text-slate-500 font-bold hidden md:block">270°</div>
            <div className="absolute -right-10 text-xs text-slate-500 font-bold hidden md:block">090°</div>

            <Crosshair size={30} className="absolute text-[#7a2f3a] z-20" strokeWidth={1.5} />
            <div className="absolute w-[40px] h-[40px] rounded-full border border-[#7a2f3a]/40 z-10"></div>
            <div className="absolute w-full h-[1px] bg-slate-700/40"></div><div className="absolute w-[1px] h-full bg-slate-700/40"></div>
            
            <div className="absolute inset-16 md:inset-20 rounded-full border border-slate-700/30"></div>
            <div className="absolute inset-32 md:inset-40 rounded-full border-[2px] border-slate-800/50 border-dashed"></div>
            
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 15, ease: "linear" }} className="absolute inset-24 md:inset-28 rounded-full border border-slate-700/40 border-dotted">
               <div className="absolute top-0 left-1/2 w-2 h-2 bg-[#7a2f3a] rounded-full shadow-[0_0_10px_#7a2f3a]"></div>
            </motion.div>

            <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 35, ease: "linear" }} className="absolute inset-40 md:inset-48 rounded-full border border-slate-700/30">
               <div className="absolute bottom-1/4 right-0 w-1.5 h-1.5 bg-slate-400 rounded-full shadow-[0_0_8px_#94a3b8]"></div>
            </motion.div>

            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 50, ease: "linear" }} className="absolute inset-52 md:inset-64 rounded-full border border-slate-800/60 border-dashed">
               <div className="absolute top-1/3 left-0 w-2.5 h-2.5 bg-[#471b23] rounded-full shadow-[0_0_12px_#471b23]"></div>
            </motion.div>

            <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 90, ease: "linear" }} className="absolute inset-64 md:inset-[320px] rounded-full border border-slate-700/20">
               <div className="absolute bottom-0 right-1/2 w-1 h-1 bg-white rounded-full opacity-50"></div>
            </motion.div>
            
            <div className="absolute inset-4 md:inset-6 rounded-full z-10 radar-sweep pointer-events-none" style={{ background: "conic-gradient(from 0deg, transparent 70%, rgba(122, 47, 58, 0.05) 95%, rgba(122, 47, 58, 0.4) 100%)" }} />

            {isScanning ? (
              <div className="absolute inset-0 z-40 flex items-center justify-center bg-[#0c1017]/80 rounded-full backdrop-blur-sm">
                <div className="flex flex-col items-center gap-4">
                  <RefreshCw size={40} className="text-slate-500 animate-spin" />
                  <span className="text-sm text-slate-500 tracking-widest animate-pulse">RE-SCANNING SECTOR...</span>
                </div>
              </div>
            ) : (
              displaySignals.map((sig) => (
                <div key={sig.id} className="absolute z-20 flex items-center justify-center group cursor-pointer" style={{ left: `${sig.pos_x}%`, top: `${sig.pos_y}%` }} onClick={() => setActiveSignal(sig)}>
                  
                  {sig.passkey ? (
                    <div 
                      className="relative w-[14px] h-[14px] md:w-[16px] md:h-[16px] rounded-full group-hover:scale-150 transition-transform shadow-[0_0_10px_rgba(0,0,0,0.8)]"
                      style={{ background: 'radial-gradient(circle at center, #471b23 0%, #1e293b 60%, #0f172a 100%)', boxShadow: 'inset 0 0 4px rgba(71,27,35,0.5)' }}
                    >
                       <div className="absolute inset-0 bg-[#7a2f3a] rounded-full animate-ping opacity-20"></div>
                    </div>
                  ) : (
                    <div className="relative w-[10px] h-[10px] md:w-[12px] md:h-[12px] bg-[#7a2f3a] rounded-full shadow-[0_0_12px_#7a2f3a] group-hover:scale-150 transition-transform"></div>
                  )}

                  <span className="absolute left-5 md:left-6 top-0 text-[10px] md:text-xs text-slate-200 opacity-0 group-hover:opacity-100 bg-[#0a0d14] border border-slate-600 px-3 py-1.5 z-50 pointer-events-none whitespace-nowrap shadow-lg font-bold">
                    {sig.passkey && <Lock size={10} className="inline mr-2 text-slate-500"/>}SIG-{sig.id.substring(0,4).toUpperCase()}
                  </span>
                </div>
              ))
            )}
          </div>

          <AnimatePresence>{activeSignal && <DecryptModal signal={activeSignal} currentUser={currentUser} t={t} onClose={() => setActiveSignal(null)} onRefresh={fetchSignals} />}</AnimatePresence>

        </section>

        <aside className="w-full lg:w-[320px] flex flex-col gap-6 shrink-0 lg:overflow-y-auto custom-scrollbar lg:pl-3">
          <Panel title="SYSTEM ANALYTICS" className="h-[200px] md:h-[240px]">
             <div className="flex items-center gap-6 mt-6 md:mt-8">
                <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border-4 border-slate-800 border-t-slate-500 flex items-center justify-center text-base md:text-xl font-bold text-slate-300">76%</div>
                <div className="flex-1 space-y-4 text-xs md:text-sm text-slate-400 font-bold">
                  <div className="flex justify-between"><span>{t.rsrc}</span><span className="text-slate-300">76%</span></div>
                  <div className="flex justify-between"><span>{t.energy}</span><span className="text-slate-300">82%</span></div>
                </div>
             </div>
          </Panel>
          <Panel title={t.quick_access} className="flex-shrink-0">
            {isTargeting ? (
              <div className="flex flex-col gap-4 p-3">
                <div className="text-sm text-slate-400 font-bold flex justify-between items-center mb-1"><span>{t.target_input}</span> <X size={20} className="cursor-pointer text-slate-500 hover:text-white" onClick={()=>setIsTargeting(false)}/></div>
                <input type="text" value={targetCode} onChange={e=>setTargetCode(e.target.value)} placeholder="ONC-XXXX" className="bg-[#0a0d14] border border-slate-700 p-4 text-base text-slate-100 outline-none uppercase font-bold text-center focus:border-[#7a2f3a]"/>
                <button onClick={handleTargetSearch} className="bg-[#11141c] border border-slate-600 text-slate-200 text-sm font-bold p-4 hover:border-[#7a2f3a] hover:text-[#7a2f3a] cursor-pointer">{t.target_btn}</button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 md:gap-3">
                 <button onClick={handleScanRefresh} className="flex flex-col items-center justify-center gap-3 p-4 border border-slate-800 hover:bg-[#11141c] text-slate-400 hover:text-slate-200 text-[11px] md:text-xs font-bold whitespace-nowrap cursor-pointer shadow-sm"><RefreshCw size={20}/>{t.scan}</button>
                 <button onClick={() => setIsTargeting(true)} className="flex flex-col items-center justify-center gap-3 p-4 border border-slate-800 hover:bg-[#11141c] text-slate-400 hover:text-slate-200 text-[11px] md:text-xs font-bold whitespace-nowrap cursor-pointer shadow-sm"><Search size={20}/>{t.target}</button>
                 <button onClick={() => setIsInjectModalOpen(true)} className="flex flex-col items-center justify-center gap-3 p-4 border border-slate-700 bg-[#11141c] hover:border-[#7a2f3a] text-slate-300 hover:text-[#7a2f3a] text-[11px] md:text-xs font-bold whitespace-nowrap cursor-pointer shadow-sm"><Code size={20}/>{t.inject}</button>
              </div>
            )}
          </Panel>
        </aside>
      </main>

      <footer className="relative z-20 hidden lg:flex justify-between items-center pt-5 border-t border-slate-800 shrink-0 text-sm tracking-widest text-slate-500 font-bold mt-4">
        <button onClick={onLogout} className="flex items-center gap-3 text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-6 py-3 bg-[#0c1017] cursor-pointer transition-colors"><Power size={16}/> {t.disconnect}</button>
        <div className="flex gap-20">
          <div><div className="mb-1 text-xs text-slate-600">{t.mode}</div><div className="text-slate-300">COMMAND</div></div>
          <div><div className="mb-1 text-xs text-slate-600">{t.operator}</div><div className="text-[#9e3f4d] uppercase">{currentUser?.codename}</div></div>
        </div>
      </footer>
    </div>
  );
};

export default function AppRoot() {
  const [accessGranted, setAccessGranted] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [lang, setLang] = useState<"zh" | "en">("zh");
  const t = TRANSLATIONS[lang];

  const handleLogout = async () => { 
    await supabase.auth.signOut(); 
    setCurrentUser(null); 
    setAccessGranted(false); 
  };

  return (
    <AnimatePresence mode="wait">
      {!accessGranted ? (
        <motion.div key="gatekeeper" exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
           <Gatekeeper onSuccess={() => setAccessGranted(true)} t={t} />
        </motion.div>
      ) : !currentUser ? (
        <motion.div key="login" initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
          <TerminalLogin onLoginSuccess={setCurrentUser} t={t} />
        </motion.div> 
      ) : (
        <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <Dashboard currentUser={currentUser} onLogout={handleLogout} lang={lang} setLang={setLang} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
