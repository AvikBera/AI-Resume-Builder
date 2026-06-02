import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
/* ─── PALETTE ─── */
const G = {
  50:"#f0fdf4",100:"#dcfce7",200:"#bbf7d0",300:"#86efac",
  400:"#4ade80",500:"#22c55e",600:"#16a34a",700:"#15803d",800:"#166534",900:"#14532d",
};

/* ─── DATA ─── */
const FEATURES = [
  { icon:"⚡", title:"AI-Powered Writing",    desc:"Craft compelling bullet points in seconds. Our AI learns your tone and tailors every line to your dream role.", color:G[500], glow:"rgba(34,197,94,0.3)" },
  { icon:"🎯", title:"ATS Optimization",      desc:"Beat applicant tracking systems with real-time scoring against Fortune 500 ATS engines before you hit send.", color:"#3b82f6", glow:"rgba(59,130,246,0.3)" },
  { icon:"🎨", title:"50+ Premium Templates", desc:"Designer-crafted layouts. Every template is recruiter-approved and pixel-perfect across every device.", color:"#f59e0b", glow:"rgba(245,158,11,0.3)" },
  { icon:"📤", title:"One-Click Export",       desc:"Download as PDF or DOCX, or share a live link. Perfect formatting guaranteed everywhere, always.", color:"#ec4899", glow:"rgba(236,72,153,0.3)" },
  { icon:"💡", title:"Real-Time Suggestions", desc:"Power words, action verbs, and measurable achievements surfaced as you type — live coaching in the editor.", color:"#8b5cf6", glow:"rgba(139,92,246,0.3)" },
  { icon:"🔗", title:"LinkedIn Import",        desc:"Pull your entire career history from LinkedIn in one click. Start from what you already have.", color:"#06b6d4", glow:"rgba(6,182,212,0.3)" },
];

const STATS = [
  { value:"2.4M+", label:"Resumes Built",  num:2.4,  suffix:"M+", float:true  },
  { value:"94%",   label:"Interview Rate", num:94,   suffix:"%",  float:false },
  { value:"3",     label:"Minutes Avg.",   num:3,    suffix:"",   float:false },
  { value:"180+",  label:"Countries",      num:180,  suffix:"+",  float:false },
];

const STEPS = [
  { num:"01", title:"Pick a Template",  desc:"50+ ATS-ready designs for every industry",  emoji:"🖼️" },
  { num:"02", title:"Add Your Details", desc:"AI fills smart suggestions as you type",      emoji:"✍️" },
  { num:"03", title:"Export & Apply",   desc:"Download PDF instantly, land the interview", emoji:"🚀" },
];

const WORDS = ["Stunning","AI-Crafted","Job-Winning","Standout","Professional","Irresistible"];

const COMPANIES = ["Google","Amazon","Microsoft","Meta","Stripe","Airbnb","Spotify","Netflix","Notion","Figma","Apple","Uber"];

const TESTIMONIALS = [
  { name:"Akash M.",  role:"Hired at Stripe", text:"Got 3 interview calls in the first week. The AI suggestions completely transformed my resume.", emoji:"👩‍💼", rating:5 },
  { name:"James L.",  role:"Hired at Google", text:"The ATS score feature is a game changer. Went from zero replies to landing my dream job at Google.", emoji:"🧑‍💻", rating:5 },
  { name:"Priya M.",  role:"Hired at Airbnb", text:"Built my entire resume in 8 minutes. Downloaded, applied, got the interview. Absolutely unbelievable.", emoji:"👩‍🎨", rating:5 },
  { name:"Sunny L.",  role:"Hired at Meta",   text:"The LinkedIn import saved me hours. ATS score jumped from 62 to 96. Worth every second.", emoji:"🧑‍🔬", rating:5 },
  { name:"Yuki T.",   role:"Hired at Notion", text:"As a designer I'm picky about layouts. These templates are genuinely gorgeous and they work.", emoji:"👩‍💻", rating:5 },
  { name:"Marco S.",  role:"Hired at Tesla",  text:"I was skeptical but the AI nailed my tone. Recruiters told me my resume was the best they'd seen.", emoji:"🧑‍🎨", rating:5 },
];

const PRICING = [
  { name:"Free",  price:"$0",  period:"forever", color:"#6b7280", features:["3 resume downloads","5 AI suggestions/day","10 templates","PDF export"],                                    cta:"Start Free",      popular:false },
  { name:"Pro",   price:"$9",  period:"/month",  color:G[500],    features:["Unlimited downloads","Unlimited AI writing","50+ templates","ATS score live","LinkedIn import","Priority support"], cta:"Start Pro Trial", popular:true  },
  { name:"Teams", price:"$29", period:"/month",  color:"#8b5cf6", features:["Everything in Pro","5 team seats","Shared brand kit","Analytics dashboard","API access","Dedicated CSM"],   cta:"Talk to Sales",   popular:false },
];

const TEMPLATES = [
  { name:"Executive",   color:"#1e293b", accent:G[500],    tag:"Most Popular" },
  { name:"Creative",    color:"#4f46e5", accent:"#a78bfa",  tag:"Designer Pick" },
  { name:"Minimalist",  color:"#0f172a", accent:"#38bdf8",  tag:"ATS Friendly" },
  { name:"Modern",      color:"#064e3b", accent:G[400],    tag:"New" },
];

/* ─── HOOKS ─── */
function useInView(ref, threshold=0.1, once=true) {
  const [visible, setVisible] = useState(false);
  useEffect(()=>{
    const obs = new IntersectionObserver(
      ([e])=>{ if(e.isIntersecting){setVisible(true);if(once)obs.disconnect();}else if(!once)setVisible(false); },
      {threshold}
    );
    if(ref.current)obs.observe(ref.current);
    return ()=>obs.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
  return visible;
}

function useParallax(speed=0.3){
  const [offset,setOffset]=useState(0);
  useEffect(()=>{
    const fn=()=>setOffset(window.scrollY*speed);
    window.addEventListener("scroll",fn,{passive:true});
    return ()=>window.removeEventListener("scroll",fn);
  },[speed]);
  return offset;
}

function useScrollY(){
  const [y,setY]=useState(0);
  useEffect(()=>{
    const fn=()=>setY(window.scrollY);
    window.addEventListener("scroll",fn,{passive:true});
    return ()=>window.removeEventListener("scroll",fn);
  },[]);
  return y;
}

/* ═══════════════════════════════════════════════════
   ─── WELCOME SCREEN ─── (fully upgraded)
   ═══════════════════════════════════════════════════ */
function WelcomeScreen({ onDone }) {
  const canvasRef = useRef();
  const [phase, setPhase] = useState("in");
  const [progress, setProgress] = useState(0);
  const [counter, setCounter] = useState(5);
  const [glitch, setGlitch] = useState(false);
  const animRef = useRef();

  /* WebGL-style particle field on canvas */
  useEffect(()=>{
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const W = canvas.width, H = canvas.height;
    const PARTICLE_COUNT = 220;
    const particles = Array.from({length: PARTICLE_COUNT}, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      z: Math.random() * 1000 + 100,
      vz: -(Math.random() * 2 + 0.5),
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.8 + 0.2,
      hue: 120 + Math.random() * 60,
      trail: [],
    }));

    /* Warp grid lines */
    const GRID_LINES = 20;
    let time = 0;

    const draw = () => {
      ctx.fillStyle = "rgba(0,3,1,0.18)";
      ctx.fillRect(0, 0, W, H);

      /* Warp grid perspective floor */
      ctx.save();
      const horizon = H * 0.48;
      for(let i = 0; i <= GRID_LINES; i++) {
        const t = i / GRID_LINES;
        const alpha = (0.04 + t * 0.12) * (0.5 + 0.5 * Math.sin(time * 0.8 + i * 0.3));
        ctx.strokeStyle = `rgba(34,197,94,${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        /* perspective horizontal lines */
        const yPos = horizon + (H - horizon) * Math.pow(t, 1.8);
        ctx.moveTo(0, yPos);
        ctx.lineTo(W, yPos);
        ctx.stroke();
      }
      /* perspective vertical lines converging to vanishing point */
      const vp = { x: W / 2, y: horizon };
      for(let i = 0; i <= GRID_LINES; i++) {
        const t = i / GRID_LINES;
        const baseX = (t * W);
        const alpha = (0.03 + Math.abs(t - 0.5) * 0.08) * (0.4 + 0.6 * Math.sin(time + i * 0.5));
        ctx.strokeStyle = `rgba(34,197,94,${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(vp.x + (baseX - vp.x) * 0.02, vp.y);
        ctx.lineTo(baseX, H);
        ctx.stroke();
      }
      ctx.restore();

      /* 3D star-warp particles */
      particles.forEach(p => {
        p.z += p.vz;
        if(p.z < 1) {
          p.z = 1000;
          p.x = Math.random() * W;
          p.y = Math.random() * H;
          p.trail = [];
        }

        const scale = 800 / p.z;
        const sx = (p.x - W/2) * scale + W/2;
        const sy = (p.y - H/2) * scale + H/2;
        const r = p.size * scale;
        const alpha = Math.min(1, (800 - p.z) / 400) * p.opacity;

        p.trail.push({x: sx, y: sy});
        if(p.trail.length > 6) p.trail.shift();

        /* trail streaks */
        if(p.trail.length > 1) {
          const prev = p.trail[0];
          const grad = ctx.createLinearGradient(prev.x, prev.y, sx, sy);
          grad.addColorStop(0, `hsla(${p.hue},90%,60%,0)`);
          grad.addColorStop(1, `hsla(${p.hue},90%,60%,${alpha * 0.6})`);
          ctx.beginPath();
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(sx, sy);
          ctx.strokeStyle = grad;
          ctx.lineWidth = r * 0.8;
          ctx.stroke();
        }

        /* glow dot */
        if(sx > -10 && sx < W+10 && sy > -10 && sy < H+10) {
          ctx.beginPath();
          ctx.arc(sx, sy, Math.max(0.5, r), 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue},90%,65%,${alpha})`;
          ctx.fill();
        }
      });

      /* Scan-line overlay */
      for(let y = 0; y < H; y += 3) {
        const a = 0.012 + 0.004 * Math.sin(y * 0.1 + time * 2);
        ctx.fillStyle = `rgba(0,0,0,${a})`;
        ctx.fillRect(0, y, W, 1);
      }

      /* Central glow orb */
      const cx = W / 2, cy = H * 0.42;
      const orbR = 200 + Math.sin(time * 0.6) * 30;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, orbR);
      grad.addColorStop(0, `rgba(34,197,94,${0.12 + Math.sin(time) * 0.04})`);
      grad.addColorStop(0.4, `rgba(22,163,74,${0.06 + Math.sin(time * 1.3) * 0.02})`);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      time += 0.016;
      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => { if(animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  /* Progress + countdown */
  useEffect(()=>{
    const start = performance.now();
    const dur = 3000;
    const raf = () => {
      const p = Math.min((performance.now() - start) / dur, 1);
      setProgress(p * 100);
      if(p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    const iv = setInterval(() => setCounter(c => c - 1), 1000);

    /* Glitch effect at intervals */
    const glitchInterval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 120);
    }, 800);
const t1 = setTimeout(() => setPhase("out"), 2600);
const t2 = setTimeout(() => onDone(), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearInterval(iv); clearInterval(glitchInterval); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:9999,
      background:"#000301",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      opacity: phase === "out" ? 0 : 1,
      transform: phase === "out" ? "scale(1.04)" : "scale(1)",
      transition: "opacity .7s cubic-bezier(.22,1,.36,1), transform .7s cubic-bezier(.22,1,.36,1)",
      overflow:"hidden",
    }}>
      {/* Animated canvas background */}
      <canvas ref={canvasRef} style={{
        position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none"
      }}/>

      {/* Horizontal scan sweep */}
      <div style={{
        position:"absolute", top:0, left:0, right:0,
        height:"3px",
        background:"linear-gradient(90deg,transparent,rgba(34,197,94,0.8),transparent)",
        animation:"scanSweep 2.4s ease-in-out infinite",
        boxShadow:"0 0 20px rgba(34,197,94,0.9)",
        zIndex:2,
      }}/>

      {/* Corner frame decorations */}
      {[
        {top:20,left:20,borderTop:"2px solid rgba(34,197,94,0.6)",borderLeft:"2px solid rgba(34,197,94,0.6)"},
        {top:20,right:20,borderTop:"2px solid rgba(34,197,94,0.6)",borderRight:"2px solid rgba(34,197,94,0.6)"},
        {bottom:20,left:20,borderBottom:"2px solid rgba(34,197,94,0.6)",borderLeft:"2px solid rgba(34,197,94,0.6)"},
        {bottom:20,right:20,borderBottom:"2px solid rgba(34,197,94,0.6)",borderRight:"2px solid rgba(34,197,94,0.6)"},
      ].map((s,i) => (
        <div key={i} style={{
          position:"absolute", width:40, height:40,
          ...s,
          opacity:0.7,
          zIndex:3,
          animation:`cornerPulse 2s ease-in-out ${i*0.3}s infinite alternate`,
        }}/>
      ))}

      {/* HUD-style data lines top-left */}
      <div style={{
        position:"absolute", top:60, left:60, zIndex:3,
        fontFamily:"'Fira Code',monospace", fontSize:11,
        color:"rgba(34,197,94,0.45)",
        lineHeight:1.8,
        animation:"fadeIn 1.5s ease both",
      }}>
        {["SYSTEM.BOOT","AI_ENGINE: ACTIVE","ATS_MODEL: v4.2","NEURAL_NET: READY"].map((l,i)=>(
          <div key={i} style={{opacity: progress > i*25 ? 1 : 0.15, transition:"opacity 0.3s"}}>
            <span style={{color:"rgba(34,197,94,0.6)"}}>{'>'}</span> {l}
          </div>
        ))}
      </div>

      {/* HUD stats top-right */}
      <div style={{
        position:"absolute", top:60, right:60, zIndex:3,
        fontFamily:"'Fira Code',monospace", fontSize:11,
        color:"rgba(34,197,94,0.45)",
        lineHeight:1.8, textAlign:"right",
        animation:"fadeIn 1.5s ease both",
      }}>
        {["USERS: 2.4M+","RATE: 94% HIRED","BUILD: 3 MIN","COUNTRIES: 180+"].map((l,i)=>(
          <div key={i} style={{opacity: progress > i*25 ? 1 : 0.15, transition:"opacity 0.3s"}}>
            {l} <span style={{color:"rgba(34,197,94,0.6)"}}>|</span>
          </div>
        ))}
      </div>

      {/* Central content */}
      <div style={{position:"relative", zIndex:4, textAlign:"center"}}>

        {/* Glitch logo */}
        <div style={{
          position:"relative",
          width:110, height:110, margin:"0 auto 36px",
          animation:"logoBounce 1s cubic-bezier(.34,1.56,.64,1) both",
        }}>
          {/* Outer ring spin */}
          <div style={{
            position:"absolute", inset:-16,
            borderRadius:"50%",
            border:"1px solid rgba(34,197,94,0.3)",
            animation:"spinCW 6s linear infinite",
          }}/>
          <div style={{
            position:"absolute", inset:-28,
            borderRadius:"50%",
            border:"1px dashed rgba(34,197,94,0.15)",
            animation:"spinCCW 10s linear infinite",
          }}/>
          {/* Logo box */}
          <div style={{
            position:"relative",
            width:110, height:110, borderRadius:28,
            background:" rgba(130, 201, 158, 0.95)",
            border:"1.5px solid rgb(34, 197, 94)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:52,
            boxShadow:"0 0 40px rgba(34,197,94,0.5), inset 0 0 30px rgba(34,197,94,0.05)",
          }}>🤖
            {/* Corner brackets */}
            {[{t:-1,l:-1},{t:-1,r:-1},{b:-1,l:-1},{b:-1,r:-1}].map((pos,i)=>(
              <div key={i} style={{
                position:"absolute",width:10,height:10,
                ...(pos.t!==undefined?{top:pos.t}:{}),
                ...(pos.b!==undefined?{bottom:pos.b}:{}),
                ...(pos.l!==undefined?{left:pos.l}:{}),
                ...(pos.r!==undefined?{right:pos.r}:{}),
                borderTop:pos.t!==undefined?"2px solid rgba(34,197,94,0.9)":"none",
                borderBottom:pos.b!==undefined?"2px solid rgba(34,197,94,0.9)":"none",
                borderLeft:pos.l!==undefined?"2px solid rgba(34,197,94,0.9)":"none",
                borderRight:pos.r!==undefined?"2px solid rgba(34,197,94,0.9)":"none",
              }}/>
            ))}
          </div>
        </div>

        {/* Brand name with glitch effect */}
        <div style={{position:"relative", marginBottom:8}}>
          {glitch && (
            <>
              <h1 style={{
                fontSize:"clamp(40px,7vw,80px)", fontWeight:900, letterSpacing:"-0.06em",
                color:"rgba(34,197,94,0.8)", fontFamily:"Georgia,serif",
                position:"absolute", top:0, left:0, right:0,
                transform:"translateX(-3px)", clipPath:"inset(20% 0 40% 0)",
                animation:"none",
              }}><span style={{color:"#4ade80"}}>AI</span> Resume Builder</h1>
              <h1 style={{
                fontSize:"clamp(40px,7vw,80px)", fontWeight:900, letterSpacing:"-0.06em",
                color:"rgba(34,197,94,0.8)", fontFamily:"Georgia,serif",
                position:"absolute", top:0, left:0, right:0,
                transform:"translateX(3px)", clipPath:"inset(60% 0 10% 0)",
                animation:"none",
              }}><span style={{color:"#4ade80"}}>AI</span> Resume Builder</h1>
            </>
          )}
          <h1 style={{
            fontSize:"clamp(40px,7vw,80px)", fontWeight:900, letterSpacing:"-0.06em",
            color:"#fff", fontFamily:"Georgia,serif",
            margin:0,
            animation:"fadeUp 1s cubic-bezier(.22,1,.36,1) .3s both",
            textShadow:"0 0 60px rgba(34,197,94,0.4)",
          }}>
            <span style={{color:G[400]}}>AI</span> Resume Builder
          </h1>
        </div>

        {/* Tagline */}
        <p style={{
          color:"rgba(255,255,255,0.45)", fontSize:13, letterSpacing:".22em",
          textTransform:"uppercase", fontWeight:600,
          fontFamily:"'Fira Code',monospace",
          animation:"fadeUp 1s cubic-bezier(.22,1,.36,1) .5s both",
          margin:"0 0 52px",
        }}>
          <span style={{color:G[500]}}>▸</span> Your Career, Elevated <span style={{color:G[500]}}>◂</span>
        </p>

        {/* Progress bar */}
        <div style={{width:320, margin:"0 auto 20px", animation:"fadeIn .6s ease .7s both"}}>
          <div style={{
            height:2, background:"rgba(255,255,255,0.08)",
            borderRadius:1, overflow:"hidden", marginBottom:10,
          }}>
            <div style={{
              height:"100%", width:`${progress}%`,
              background:`linear-gradient(90deg,${G[500]},${G[300]})`,
              borderRadius:1,
              boxShadow:`0 0 12px ${G[400]}`,
              transition:"width .05s linear",
              position:"relative",
            }}>
              <div style={{
                position:"absolute", right:-1, top:-3, width:8, height:8,
                borderRadius:"50%", background:G[300],
                boxShadow:`0 0 8px ${G[300]}`,
              }}/>
            </div>
          </div>
          <div style={{
            display:"flex", justifyContent:"space-between", alignItems:"center",
            fontFamily:"'Fira Code',monospace",
          }}>
            <span style={{color:"rgba(255,255,255,0.25)", fontSize:11}}>
              LOADING SYSTEMS
            </span>
            <span style={{color:G[400], fontSize:11, fontWeight:600}}>
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Countdown */}
        <div style={{
          color:"rgba(255,255,255,0.25)", fontSize:12,
          fontFamily:"'Fira Code',monospace", letterSpacing:".1em",
          animation:"fadeIn .6s ease .9s both",
        }}>
          LAUNCHING IN <span style={{color:G[500], fontWeight:700}}>{Math.max(counter,0)}</span>S
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        position:"absolute", bottom:24, left:0, right:0,
        display:"flex", justifyContent:"center", gap:40,
        fontFamily:"'Fira Code',monospace", fontSize:10,
        color:"rgba(34,197,94,0.3)", letterSpacing:".1em",
        zIndex:3, animation:"fadeIn 2s ease both",
      }}>
        {["GPT-4o ENGINE","ATS CERTIFIED","256-BIT SECURE","99.9% UPTIME"].map(t=>(
          <span key={t}>{t}</span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ─── FULLY UPGRADED 3D BACKGROUND ───
   ═══════════════════════════════════════════════════ */
function ThreeDBackground({ dark, scrollY }) {
  const canvasRef = useRef();
  const stateRef = useRef({ scrollY: 0, dark: true, time: 0 });
  const mouseRef = useRef({ x: 0, y: 0, vx: 0, vy: 0 });

  useEffect(()=>{
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext("2d");
    let rafId, W, H;

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    /* Mouse tracking with velocity */
    const onMouse = e => {
      mouseRef.current.vx = e.clientX - mouseRef.current.x;
      mouseRef.current.vy = e.clientY - mouseRef.current.y;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    window.addEventListener("mousemove", onMouse);

    /* 3D nodes in frustum */
    const NODES = Array.from({length:80}, () => ({
      x: (Math.random() - 0.5) * 2000,
      y: (Math.random() - 0.5) * 2000,
      z: Math.random() * 1200 + 100,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.4,
      vz: (Math.random() - 0.5) * 0.6,
      baseSize: Math.random() * 3 + 1,
      hue: 110 + Math.random() * 60,
      pulse: Math.random() * Math.PI * 2,
    }));

    /* Nebula clouds (large blurry circles) */
    const NEBULAS = Array.from({length:6}, () => ({
      x: Math.random() * 1.4 - 0.2,
      y: Math.random() * 1.4 - 0.2,
      r: Math.random() * 300 + 150,
      hue: Math.random() > 0.5 ? 130 : (Math.random() > 0.5 ? 200 : 160),
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.003 + 0.001,
    }));

    /* DNA-helix ribbon */
    const HELIX_POINTS = 60;

    const draw = () => {
      const S = stateRef.current;
      const M = mouseRef.current;
      S.time += 0.008;

      /* Clear with trail */
      ctx.fillStyle = S.dark
        ? "rgba(2,7,3,0.14)"
        : "rgba(245,252,248,0.18)";
      ctx.fillRect(0, 0, W, H);

      /* Nebula clouds */
      NEBULAS.forEach(n => {
        n.phase += n.speed;
        const nx = n.x * W + Math.sin(n.phase) * 80;
        const ny = n.y * H + Math.cos(n.phase * 0.7) * 60;
        const grad = ctx.createRadialGradient(nx, ny, 0, nx, ny, n.r);
        const a = S.dark ? 0.06 : 0.03;
        grad.addColorStop(0, `hsla(${n.hue},70%,45%,${a + Math.sin(n.phase)*0.015})`);
        grad.addColorStop(0.5, `hsla(${n.hue},60%,35%,${a*0.4})`);
        grad.addColorStop(1, "hsla(0,0%,0%,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
      });

      /* Floating warp grid lines (perspective) */
      const scroll = S.scrollY;
      const gridAlpha = S.dark ? 0.025 : 0.012;
      ctx.save();
      const vpy = H * 0.5 - scroll * 0.1;
      for(let i = 0; i <= 16; i++) {
        const t = i / 16;
        const x = t * W;
        const pulse = Math.sin(S.time * 1.2 + t * Math.PI * 2) * 0.3 + 0.7;
        ctx.strokeStyle = `rgba(34,197,94,${gridAlpha * pulse})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(W/2 + (x - W/2) * 0.05, vpy);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for(let i = 0; i <= 10; i++) {
        const t = i / 10;
        const y = vpy + (H - vpy) * Math.pow(t, 1.5);
        const spread = 0.05 + t * 0.95;
        const pulse = Math.sin(S.time * 0.8 + t * 4) * 0.3 + 0.7;
        ctx.strokeStyle = `rgba(34,197,94,${gridAlpha * pulse})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(W/2 - W/2*spread, y);
        ctx.lineTo(W/2 + W/2*spread, y);
        ctx.stroke();
      }
      ctx.restore();

      /* DNA helix ribbon (right side) */
      ctx.save();
      ctx.globalAlpha = S.dark ? 0.12 : 0.06;
      const helixX = W * 0.88;
      const helixH = H * 0.7;
      const helixY = H * 0.15;
      for(let i = 0; i < HELIX_POINTS - 1; i++) {
        const t0 = i / (HELIX_POINTS - 1);
        const t1 = (i + 1) / (HELIX_POINTS - 1);
        const phase0 = t0 * Math.PI * 6 + S.time;
        const phase1 = t1 * Math.PI * 6 + S.time;
        const x0a = helixX + Math.sin(phase0) * 22;
        const x0b = helixX + Math.sin(phase0 + Math.PI) * 22;
        const x1a = helixX + Math.sin(phase1) * 22;
        const x1b = helixX + Math.sin(phase1 + Math.PI) * 22;
        const y0 = helixY + t0 * helixH;
        const y1 = helixY + t1 * helixH;
        ctx.strokeStyle = `hsl(${130 + Math.sin(phase0)*20},80%,55%)`;
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(x0a, y0); ctx.lineTo(x1a, y1); ctx.stroke();
        ctx.strokeStyle = `hsl(${160 + Math.sin(phase0)*20},70%,60%)`;
        ctx.beginPath(); ctx.moveTo(x0b, y0); ctx.lineTo(x1b, y1); ctx.stroke();
        /* crossbars every 4 */
        if(i % 4 === 0) {
          ctx.strokeStyle = `rgba(34,197,94,0.5)`;
          ctx.lineWidth = 0.5;
          ctx.beginPath(); ctx.moveTo(x0a, y0); ctx.lineTo(x0b, y0); ctx.stroke();
        }
      }
      ctx.restore();

      /* Project 3D nodes */
      const projected = [];
      const fov = 600;
      NODES.forEach(n => {
        n.pulse += 0.02;
        /* mouse influence */
        const influenceX = (M.x / W - 0.5) * 0.3;
        const influenceY = (M.y / H - 0.5) * 0.3;
        n.x += n.vx + influenceX * 0.4;
        n.y += n.vy + influenceY * 0.4;
        n.z += n.vz;

        /* bounce */
        if(Math.abs(n.x) > 1200) n.vx *= -1;
        if(Math.abs(n.y) > 1200) n.vy *= -1;
        if(n.z < 80 || n.z > 1400) n.vz *= -1;

        const scale = fov / (fov + n.z);
        const sx = n.x * scale + W/2;
        const sy = (n.y - scroll * 0.08) * scale + H/2;
        projected.push({ sx, sy, scale, n });
      });

      /* Draw connections first */
      for(let i = 0; i < projected.length; i++) {
        for(let j = i+1; j < projected.length; j++) {
          const a = projected[i], b = projected[j];
          const dx = a.sx - b.sx, dy = a.sy - b.sy;
          const dist = Math.hypot(dx, dy);
          if(dist < 120) {
            const avgScale = (a.scale + b.scale) / 2;
            const alpha = (1 - dist/120) * 0.18 * avgScale;
            /* Color teal-green gradient connections */
            const grad2 = ctx.createLinearGradient(a.sx, a.sy, b.sx, b.sy);
            grad2.addColorStop(0, `hsla(${a.n.hue},80%,55%,${alpha})`);
            grad2.addColorStop(1, `hsla(${b.n.hue},80%,55%,${alpha})`);
            ctx.beginPath();
            ctx.moveTo(a.sx, a.sy);
            ctx.lineTo(b.sx, b.sy);
            ctx.strokeStyle = grad2;
            ctx.lineWidth = avgScale * 0.7;
            ctx.stroke();
          }
        }
      }

      /* Draw nodes */
      projected.forEach(({ sx, sy, scale, n }) => {
        const r = n.baseSize * scale * (1 + Math.sin(n.pulse) * 0.25);
        const alpha = Math.min(0.95, scale * 0.85);
        const isDark = S.dark;

        /* Outer glow ring */
        if(r > 1.5) {
          ctx.beginPath();
          ctx.arc(sx, sy, r * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${n.hue},80%,55%,${alpha * 0.06})`;
          ctx.fill();
        }

        /* Core dot */
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? `hsla(${n.hue},85%,62%,${alpha})`
          : `hsla(${n.hue},70%,38%,${alpha * 0.55})`;
        ctx.fill();
      });

      /* Mouse attraction beam */
      const beamAlpha = Math.min(0.15, Math.hypot(M.vx, M.vy) / 30 * 0.15);
      if(beamAlpha > 0.01) {
        const beamGrad = ctx.createRadialGradient(M.x, M.y, 0, M.x, M.y, 60);
        beamGrad.addColorStop(0, `rgba(34,197,94,${beamAlpha})`);
        beamGrad.addColorStop(1, "rgba(34,197,94,0)");
        ctx.fillStyle = beamGrad;
        ctx.fillRect(0, 0, W, H);
      }

      rafId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  useEffect(()=>{ stateRef.current.scrollY = scrollY; }, [scrollY]);
  useEffect(()=>{ stateRef.current.dark = dark; }, [dark]);

  return (
    <canvas ref={canvasRef} style={{
      position:"fixed", inset:0, width:"100%", height:"100%",
      pointerEvents:"none", zIndex:0,
      opacity: dark ? 0.75 : 0.35,
      transition:"opacity .6s",
    }}/>
  );
}

/* ─── SCROLL PROGRESS ─── */
function ScrollProgress(){
  const [progress,setProgress]=useState(0);
  useEffect(()=>{
    const fn=()=>{const total=document.documentElement.scrollHeight-window.innerHeight;setProgress((window.scrollY/total)*100);};
    window.addEventListener("scroll",fn,{passive:true});
    return ()=>window.removeEventListener("scroll",fn);
  },[]);
  return(
    <div style={{position:"fixed",top:0,left:0,right:0,zIndex:300,height:3,background:"rgba(0,0,0,0.05)"}}>
      <div style={{height:"100%",width:`${progress}%`,background:`linear-gradient(90deg,${G[400]},${G[600]})`,transition:"width .05s",boxShadow:`0 0 8px ${G[400]}`}}/>
    </div>
  );
}

/* ─── CUSTOM CURSOR ─── */
function CustomCursor({dark}){
  const dot=useRef();const ring=useRef();
  const pos=useRef({x:0,y:0});const ringPos=useRef({x:0,y:0});const rafRef=useRef();
  useEffect(()=>{
    const onMove=(e)=>{pos.current={x:e.clientX,y:e.clientY};};
    window.addEventListener("mousemove",onMove);
    const tick=()=>{
      ringPos.current.x+=(pos.current.x-ringPos.current.x)*0.15;
      ringPos.current.y+=(pos.current.y-ringPos.current.y)*0.15;
      if(dot.current){dot.current.style.left=pos.current.x+"px";dot.current.style.top=pos.current.y+"px";}
      if(ring.current){ring.current.style.left=ringPos.current.x+"px";ring.current.style.top=ringPos.current.y+"px";}
      rafRef.current=requestAnimationFrame(tick);
    };
    tick();
    return ()=>{window.removeEventListener("mousemove",onMove);cancelAnimationFrame(rafRef.current);};
  },[]);
  const c=dark?"#4ade80":G[500];
  return(
    <>
      <div ref={dot} style={{position:"fixed",width:8,height:8,borderRadius:"50%",background:c,pointerEvents:"none",zIndex:9999,transform:"translate(-50%,-50%)",transition:"background .3s"}}/>
      <div ref={ring} style={{position:"fixed",width:36,height:36,borderRadius:"50%",border:`2px solid ${c}`,pointerEvents:"none",zIndex:9998,transform:"translate(-50%,-50%)",opacity:.6,transition:"background .3s"}}/>
    </>
  );
}

/* ─── ANIMATED WORD ─── */
function AnimatedWord(){
  const [idx,setIdx]=useState(0);
  const [phase,setPhase]=useState("in");
  useEffect(()=>{
    const id=setInterval(()=>{
      setPhase("out");
      setTimeout(()=>{setIdx(i=>(i+1)%WORDS.length);setPhase("in");},450);
    },2600);
    return ()=>clearInterval(id);
  },[]);
  return(
    <span style={{
      display:"inline-block",
      background:`linear-gradient(120deg,${G[600]},${G[400]},#86efac)`,
      WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",
      transition:"opacity .45s cubic-bezier(.22,1,.36,1), transform .45s cubic-bezier(.22,1,.36,1)",
      opacity:phase==="in"?1:0,
      transform:phase==="in"?"translateY(0) scale(1)":"translateY(-24px) scale(0.94)",
      filter:phase==="in"?"blur(0px)":"blur(4px)",
    }}>
      {WORDS[idx]}
    </span>
  );
}

/* ─── COUNT UP ─── */
function CountUp({num,suffix,float:isFloat}){
  const [val,setVal]=useState("0");
  const ref=useRef();
  const visible=useInView(ref);
  useEffect(()=>{
    if(!visible)return;
    const dur=1800;const start=performance.now();
    const tick=now=>{
      const p=Math.min((now-start)/dur,1);
      const ease=1-Math.pow(1-p,4);
      const cur=isFloat?(ease*num).toFixed(1):Math.round(ease*num);
      setVal(cur+suffix);
      if(p<1)requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[visible]);
  return <span ref={ref}>{val}</span>;
}

/* ─── FLOAT BADGE ─── */
function FloatBadge({style,children,delay=0,dark}){
  return(
    <div style={{position:"absolute",background:dark?"#0f172a":"#fff",border:`1.5px solid ${dark?"#1e293b":"#e5e7eb"}`,borderRadius:16,padding:"12px 16px",boxShadow:dark?"0 8px 32px rgba(0,0,0,0.5)":"0 8px 32px rgba(0,0,0,0.08)",animation:`float ${5+delay}s ease-in-out ${delay}s infinite`,...style}}>
      {children}
    </div>
  );
}

/* ─── REVEAL ─── */
function Reveal({children,delay=0,direction="up"}){
  const ref=useRef();const visible=useInView(ref);
  const transforms={up:"translateY(50px)",down:"translateY(-50px)",left:"translateX(-50px)",right:"translateX(50px)"};
  return(
    <div ref={ref} style={{opacity:visible?1:0,transform:visible?"translate(0,0)":transforms[direction],transition:`opacity .7s cubic-bezier(.22,1,.36,1) ${delay}ms, transform .7s cubic-bezier(.22,1,.36,1) ${delay}ms`}}>
      {children}
    </div>
  );
}

/* ─── TYPEWRITER CHIP ─── */
function TypewriterChip({dark}){
  const lines=["Improved leadership bullet point","Added quantified achievement ↑43%","ATS score jumped to 97%","Tailored for Product Manager role","Action verb upgraded: 'Led' → 'Spearheaded'"];
  const [li,setLi]=useState(0);const [chars,setChars]=useState(0);const [del,setDel]=useState(false);
  useEffect(()=>{
    const cur=lines[li];
    if(!del&&chars<cur.length){const t=setTimeout(()=>setChars(c=>c+1),36);return ()=>clearTimeout(t);}
    if(!del&&chars===cur.length){const t=setTimeout(()=>setDel(true),1600);return ()=>clearTimeout(t);}
    if(del&&chars>0){const t=setTimeout(()=>setChars(c=>c-1),20);return ()=>clearTimeout(t);}
    if(del&&chars===0){const t=setTimeout(()=>{setDel(false);setLi(l=>(l+1)%lines.length);},0);return ()=>clearTimeout(t);}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[chars,del,li]);
  return(
    <div style={{background:dark?"rgba(34,197,94,0.1)":G[50],border:`1px solid ${dark?"rgba(34,197,94,0.3)":G[200]}`,borderRadius:12,padding:"10px 14px",fontSize:12.5,color:dark?G[400]:G[700],fontFamily:"'Fira Code',monospace",display:"flex",alignItems:"center",gap:8,marginTop:16}}>
      <span style={{width:8,height:8,borderRadius:"50%",background:G[400],flexShrink:0,animation:"pulse 1.4s ease-in-out infinite"}}/>
      <span>✨ AI: {lines[li].slice(0,chars)}</span>
      <span style={{width:2,height:14,background:G[500],borderRadius:1,animation:"blink .7s step-end infinite"}}/>
    </div>
  );
}

/* ─── FEATURE CARD ─── */
function FeatureCard({f,i,dark}){
  const ref=useRef();const visible=useInView(ref);const [hovered,setHovered]=useState(false);const [tilt,setTilt]=useState({x:0,y:0});
  const onMouseMove=(e)=>{
    const r=ref.current.getBoundingClientRect();
    setTilt({x:((e.clientY-(r.top+r.height/2))/r.height)*12,y:-((e.clientX-(r.left+r.width/2))/r.width)*12});
  };
  const bg=dark?(hovered?"#1e293b":"#0f172a"):(hovered?"#fff":"#fafafa");
  const border=dark?(hovered?`${f.color}66`:"#1e293b"):(hovered?`${f.color}66`:"#e5e7eb");
  return(
    <div ref={ref} onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>{setHovered(false);setTilt({x:0,y:0});}} onMouseMove={onMouseMove}
      style={{background:bg,border:`1.5px solid ${border}`,borderRadius:22,padding:"34px 28px",cursor:"default",position:"relative",overflow:"hidden",
        boxShadow:hovered?`0 20px 60px ${f.glow}, 0 2px 8px rgba(0,0,0,0.12)`:"0 1px 4px rgba(0,0,0,0.04)",
        opacity:visible?1:0,
        transform:visible?(hovered?`translateY(-10px) scale(1.02) perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`:"translateY(0) scale(1)"):"translateY(48px) scale(0.95)",
        transition:`opacity .6s cubic-bezier(.22,1,.36,1) ${i*100}ms, transform .45s cubic-bezier(.22,1,.36,1), background .3s, border-color .3s, box-shadow .3s`,
      }}>
      <div style={{width:58,height:58,borderRadius:18,background:`${f.color}18`,border:`1.5px solid ${f.color}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,marginBottom:22,
        transform:hovered?"rotate(-10deg) scale(1.15)":"rotate(0) scale(1)",transition:"transform .35s cubic-bezier(.34,1.56,.64,1)",boxShadow:hovered?`0 8px 24px ${f.glow}`:"none"}}>
        {f.icon}
      </div>
      <h3 style={{margin:"0 0 10px",fontSize:17,fontWeight:700,color:dark?"#f1f5f9":"#111827",letterSpacing:"-0.02em"}}>{f.title}</h3>
      <p style={{margin:0,fontSize:14,color:dark?"#94a3b8":"#6b7280",lineHeight:1.7}}>{f.desc}</p>
      <div style={{marginTop:20,display:"flex",alignItems:"center",gap:6,fontSize:13,fontWeight:600,color:f.color,opacity:hovered?1:0,transform:hovered?"translateX(0)":"translateX(-10px)",transition:"all .3s ease"}}>
        Learn more →
      </div>
    </div>
  );
}

/* ─── TESTIMONIAL CARD ─── */
function TestiCard({t,i,dark}){
  const ref=useRef();const visible=useInView(ref);const [hovered,setHovered]=useState(false);
  return(
    <div ref={ref} onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
      style={{background:dark?(hovered?"#1e293b":"#0f172a"):"#fff",border:`1.5px solid ${hovered?(dark?"#22c55e55":G[300]):(dark?"#1e293b":G[100])}`,borderRadius:22,padding:"28px 24px",
        boxShadow:hovered?`0 16px 40px rgba(34,197,94,0.15), 0 2px 8px rgba(0,0,0,0.08)`:"0 2px 12px rgba(0,0,0,0.05)",
        transform:hovered?"translateY(-6px) scale(1.01)":(visible?"translateY(0)":"translateY(44px)"),
        opacity:visible?1:0,transition:`opacity .65s ease ${i*110}ms, transform .4s cubic-bezier(.22,1,.36,1), box-shadow .3s, border-color .3s`,
      }}>
      <div style={{display:"flex",gap:3,marginBottom:16}}>
        {[...Array(t.rating)].map((_,j)=>(
          <span key={j} style={{color:G[400],fontSize:16,transform:`scale(${hovered?1.2:1})`,transition:`transform .3s ease ${j*50}ms`,display:"inline-block"}}>★</span>
        ))}
      </div>
      <p style={{fontSize:14.5,color:dark?"#cbd5e1":"#374151",lineHeight:1.7,margin:"0 0 20px"}}>"{t.text}"</p>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:42,height:42,borderRadius:"50%",background:dark?"#1e3a2f":G[50],border:`1.5px solid ${dark?"#22c55e33":G[200]}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,
          transform:hovered?"scale(1.1) rotate(-5deg)":"scale(1)",transition:"transform .3s cubic-bezier(.34,1.56,.64,1)"}}>
          {t.emoji}
        </div>
        <div>
          <div style={{fontWeight:700,fontSize:14,color:dark?"#f1f5f9":"#111827"}}>{t.name}</div>
          <div style={{fontSize:12,color:G[600],fontWeight:600}}>{t.role}</div>
        </div>
      </div>
    </div>
  );
}

/* ─── PRICING CARD ─── */
function PricingCard({p,i,dark}){
  const ref=useRef();const visible=useInView(ref);const [hovered,setHovered]=useState(false);
  return(
    <div ref={ref} onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
      style={{
        background:p.popular?`linear-gradient(160deg,${G[600]},${G[700]})`:(dark?"#0f172a":"#fff"),
        border:p.popular?"none":`1.5px solid ${hovered?p.color+"55":(dark?"#1e293b":"#e5e7eb")}`,
        borderRadius:24,padding:"36px 28px",position:"relative",
        boxShadow:hovered?(p.popular?`0 24px 64px rgba(34,197,94,0.5)`:`0 16px 48px ${p.color}30`):(p.popular?`0 16px 48px rgba(34,197,94,0.35)`:"0 2px 12px rgba(0,0,0,0.05)"),
        transform:visible?(hovered?"translateY(-10px) scale(1.02)":(p.popular?"translateY(-6px)":"translateY(0)")):"translateY(40px)",
        opacity:visible?1:0,
        transition:`opacity .6s ease ${i*130}ms, transform .4s cubic-bezier(.22,1,.36,1), box-shadow .3s`,
      }}>
      {p.popular&&(
        <div style={{position:"absolute",top:-14,left:"50%",transform:"translateX(-50%)",background:"linear-gradient(90deg,#fbbf24,#f59e0b)",borderRadius:999,padding:"6px 20px",fontSize:12,fontWeight:800,color:"#78350f",boxShadow:"0 4px 16px rgba(245,158,11,0.5)",whiteSpace:"nowrap"}}>
          ✦ Most Popular
        </div>
      )}
      <div style={{marginBottom:6,fontSize:13,fontWeight:700,color:p.popular?"rgba(255,255,255,0.7)":(dark?"#64748b":"#9ca3af"),letterSpacing:".08em",textTransform:"uppercase"}}>{p.name}</div>
      <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:6}}>
        <span style={{fontSize:48,fontWeight:800,letterSpacing:"-0.05em",color:p.popular?"#fff":(dark?"#f1f5f9":"#111827"),lineHeight:1}}>{p.price}</span>
        <span style={{fontSize:14,color:p.popular?"rgba(255,255,255,0.6)":(dark?"#64748b":"#9ca3af")}}>{p.period}</span>
      </div>
      <div style={{height:1,background:p.popular?"rgba(255,255,255,0.15)":(dark?"#1e293b":"#f0f0f0"),margin:"24px 0"}}/>
      <div style={{marginBottom:28}}>
        {p.features.map((feat,j)=>(
          <div key={j} style={{display:"flex",alignItems:"center",gap:10,marginBottom:11,transform:hovered?"translateX(4px)":"translateX(0)",transition:`transform .3s ease ${j*40}ms`}}>
            <div style={{width:20,height:20,borderRadius:"50%",flexShrink:0,background:p.popular?"rgba(255,255,255,0.2)":`${p.color}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:p.popular?"#fff":p.color,fontWeight:800}}>✓</div>
            <span style={{fontSize:14,color:p.popular?"rgba(255,255,255,0.85)":(dark?"#cbd5e1":"#374151")}}>{feat}</span>
          </div>
        ))}
      </div>
      <button style={{width:"100%",padding:"15px",borderRadius:14,border:"none",cursor:"pointer",background:p.popular?"rgba(255,255,255,0.2)":p.color,color:"#fff",fontSize:15,fontWeight:700,fontFamily:"inherit",transition:"all .3s",boxShadow:hovered?`0 8px 24px ${p.popular?"rgba(255,255,255,0.2)":p.color+"60"}`:"none",transform:hovered?"scale(1.02)":"scale(1)"}}>
        {p.cta} →
      </button>
    </div>
  );
}

/* ─── TEMPLATE PREVIEW ─── */
function TemplatePreview({t,dark}){
  const [hovered,setHovered]=useState(false);
  return(
    <div onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
      style={{borderRadius:20,overflow:"hidden",position:"relative",cursor:"pointer",
        transform:hovered?"translateY(-8px) scale(1.02)":"translateY(0) scale(1)",
        boxShadow:hovered?`0 24px 56px rgba(0,0,0,0.25)`:"0 8px 24px rgba(0,0,0,0.12)",
        transition:"all .35s cubic-bezier(.22,1,.36,1)"}}>
      <div style={{background:t.color,height:220,padding:20,position:"relative"}}>
        <div style={{background:"rgba(255,255,255,0.08)",borderRadius:12,padding:14,height:"100%",display:"flex",flexDirection:"column",gap:8}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
            <div style={{width:32,height:32,borderRadius:"50%",background:t.accent,opacity:.8}}/>
            <div>
              <div style={{width:80,height:7,background:"rgba(255,255,255,0.7)",borderRadius:4}}/>
              <div style={{width:55,height:5,background:"rgba(255,255,255,0.4)",borderRadius:4,marginTop:4}}/>
            </div>
          </div>
          <div style={{height:1,background:"rgba(255,255,255,0.15)",margin:"4px 0"}}/>
          {[70,55,85,45,60].map((w,i)=><div key={i} style={{height:5,width:`${w}%`,background:"rgba(255,255,255,0.3)",borderRadius:3}}/>)}
        </div>
        {hovered&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.4)",display:"flex",alignItems:"center",justifyContent:"center"}}>
          
          <div style={{background:t.accent,color:"#fff",padding:"10px 24px",borderRadius:999,fontWeight:700,fontSize:14}}>Use Template →

          </div>
        </div>}
      </div>
      <div style={{background:dark?"#0f172a":"#fff",padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontWeight:700,fontSize:14,color:dark?"#f1f5f9":"#111827"}}>{t.name}</span>
        <span style={{background:`${t.accent}22`,color:t.accent,fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:999}}>{t.tag}</span>
      </div>
    </div>
  );
}

/* ─── FAQ ITEM ─── */
function FAQItem({q,a,i,dark}){
  const [open,setOpen]=useState(false);const ref=useRef();const visible=useInView(ref);
  return(
    <div ref={ref} style={{borderBottom:`1px solid ${dark?"#1e293b":"#e5e7eb"}`,opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(28px)",transition:`all .6s cubic-bezier(.22,1,.36,1) ${i*100}ms`}}>
      <button onClick={()=>setOpen(o=>!o)} style={{width:"100%",padding:"22px 0",display:"flex",justifyContent:"space-between",alignItems:"center",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:16,color:dark?"#f1f5f9":"#111827",textAlign:"left"}}>
        {q}
        <span style={{fontSize:22,color:G[500],transform:open?"rotate(45deg)":"rotate(0)",transition:"transform .3s cubic-bezier(.34,1.56,.64,1)",flexShrink:0,marginLeft:12}}>+</span>
      </button>
      <div style={{overflow:"hidden",maxHeight:open?"200px":"0px",transition:"max-height .4s cubic-bezier(.22,1,.36,1)",paddingBottom:open?20:0}}>
        <p style={{color:dark?"#94a3b8":"#6b7280",fontSize:15,lineHeight:1.72}}>{a}</p>
      </div>
    </div>
  );
}

/* ─── THEME TOGGLE ─── */
function ThemeToggle({dark,setDark}){
  return(
    <button onClick={()=>setDark(d=>!d)}
      style={{width:52,height:28,borderRadius:999,border:`2px solid ${dark?"#22c55e33":"#e5e7eb"}`,
        background:dark?"#1e293b":"#f9fafb",cursor:"pointer",position:"relative",transition:"all .3s",flexShrink:0}}>
      <div style={{position:"absolute",top:2,left:dark?26:2,width:20,height:20,borderRadius:"50%",
        background:dark?G[400]:"#9ca3af",transition:"all .3s cubic-bezier(.34,1.56,.64,1)",
        display:"flex",alignItems:"center",justifyContent:"center",fontSize:11}}>
        {dark?"🌙":"☀️"}
      </div>
    </button>
  );
}

const SECTION_IDS = {
  Features:"features-section",
  Templates:"templates-section",
  Pricing:"pricing-section",
  About:"about-section",
};

function scrollToSection(id){
  const el=document.getElementById(id);
  if(el) el.scrollIntoView({behavior:"smooth",block:"start"});
}

export default function Home(){
   const navigate = useNavigate();
  const [dark,setDark]=useState(true);
  const [showWelcome,setShowWelcome]=useState(true);
  const [scrolled,setScrolled]=useState(false);
  const [atsAnim,setAtsAnim]=useState(false);
  const scrollY = useScrollY();
  const heroParallax=useParallax(0.25);
  const stepsRef=useRef();const stepsV=useInView(stepsRef);
  const ctaRef=useRef();const ctaV=useInView(ctaRef);
  const statsRef=useRef();const statsV=useInView(statsRef);

  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>40);
    window.addEventListener("scroll",fn,{passive:true});
    return ()=>window.removeEventListener("scroll",fn);
  },[]);

  useEffect(()=>{const t=setTimeout(()=>setAtsAnim(true),700);return ()=>clearTimeout(t);},[]);

  const bg=dark?"#030712":"#fff";
  const surface=dark?"#0f172a":G[50];
  const text=dark?"#f1f5f9":"#111827";
  const muted=dark?"#94a3b8":"#6b7280";
  const navBg=dark?"rgba(3,7,18,0.92)":"rgba(255,255,255,0.94)";
  const navBorder=dark?"#1e293b":G[100];
  const statsBorder=dark?"#1e293b":G[100];
  const statsCardBg=dark?"#0f172a":"#fff";

  const css=`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Lora:ital,wght@0,700;1,600&family=Fira+Code:wght@400;500&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth;cursor:none}
    ::-webkit-scrollbar{width:5px}
    ::-webkit-scrollbar-track{background:${dark?"#0f172a":"#f9fafb"}}
    ::-webkit-scrollbar-thumb{background:${dark?"#1e293b":"#d1fae5"};border-radius:3px}

    @keyframes fadeUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-16px)}}
    @keyframes spinSlow{from{transform:rotate(0)}to{transform:rotate(360deg)}}
    @keyframes spinCW{from{transform:rotate(0)}to{transform:rotate(360deg)}}
    @keyframes spinCCW{from{transform:rotate(0)}to{transform:rotate(-360deg)}}
    @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.45;transform:scale(.75)}}
    @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
    @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
    @keyframes wiggle{0%,100%{transform:rotate(0)}25%{transform:rotate(-5deg)}75%{transform:rotate(5deg)}}
    @keyframes glowPulse{0%,100%{box-shadow:0 28px 80px rgba(34,197,94,.4)}50%{box-shadow:0 28px 80px rgba(34,197,94,.75)}}
    @keyframes scrollDot{0%,100%{transform:translateY(0);opacity:1}50%{transform:translateY(16px);opacity:0.3}}
    @keyframes rotateIn{from{opacity:0;transform:rotate(-10deg) scale(0.9)}to{opacity:1;transform:rotate(0) scale(1)}}
    @keyframes logoBounce{from{opacity:0;transform:scale(0.4) rotate(-15deg)}to{opacity:1;transform:scale(1) rotate(0)}}
    @keyframes cornerPulse{from{opacity:0.4;transform:scale(0.95)}to{opacity:1;transform:scale(1.05)}}
    @keyframes scanSweep{0%{top:-4px;opacity:0}5%{opacity:1}95%{opacity:0.7}100%{top:100%;opacity:0}}
    @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}

    .btn-green{background:${G[500]};color:#fff;border:none;border-radius:14px;padding:14px 30px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;letter-spacing:-.01em;position:relative;overflow:hidden;transition:all .3s cubic-bezier(.22,1,.36,1)}
    .btn-green:hover{background:${G[600]};transform:translateY(-3px);box-shadow:0 16px 40px rgba(34,197,94,.5)}
    .btn-green:active{transform:scale(0.97)}
    .btn-outline{background:${dark?"rgba(255,255,255,0.05)":"#fff"};color:${dark?G[400]:G[600]};border:2px solid ${dark?G[700]:G[500]};border-radius:14px;padding:14px 28px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .3s ease;position:relative;overflow:hidden}
    .btn-outline:hover{background:${dark?"rgba(34,197,94,0.1)":G[50]};transform:translateY(-2px);box-shadow:0 8px 24px rgba(34,197,94,.25);border-color:${G[400]}}
    .btn-outline:active{transform:scale(0.97)}
    .nav-link{color:${dark?"#94a3b8":"#4b5563"};text-decoration:none;font-size:14px;font-weight:600;transition:all .2s;position:relative;background:none;border:none;cursor:pointer;font-family:inherit;letter-spacing:.01em}
    .nav-link::after{content:'';position:absolute;bottom:-3px;left:0;width:0;height:2px;background:${G[500]};transition:width .3s ease;border-radius:1px}
    .nav-link:hover{color:${dark?G[400]:G[600]}}
    .nav-link:hover::after{width:100%}
    .skeleton{border-radius:4px;background:${dark?"linear-gradient(90deg,#1e293b 25%,#263445 50%,#1e293b 75%)":"linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)"};background-size:200% 100%;animation:shimmer 1.6s infinite}
    .footer-link-item{color:rgba(255,255,255,.65);margin-bottom:12px;cursor:pointer;transition:all .3s;font-size:14px;display:flex;align-items:center;gap:6px}
    .footer-link-item:hover{color:#4ade80;transform:translateX(4px)}
    .social-icon-btn{width:44px;height:44px;border-radius:12px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .3s;font-size:18px}
    .social-icon-btn:hover{transform:translateY(-5px) rotate(5deg);background:linear-gradient(135deg,${G[500]},${G[600]});box-shadow:0 8px 20px rgba(34,197,94,.4)}
    .footer-legal-item{color:rgba(255,255,255,.55);font-size:13px;cursor:pointer;transition:color .3s}
    .footer-legal-item:hover{color:#4ade80}
    .cta-white-btn{background:#fff;color:${G[700]};border:none;border-radius:14px;padding:18px 48px;font-size:17px;font-weight:800;cursor:pointer;font-family:inherit;transition:all .3s cubic-bezier(.22,1,.36,1);letter-spacing:-.01em}
    .cta-white-btn:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,.22)}
    .marquee-track:hover{animation-play-state:paused}
  `;

  return(
    <div style={{fontFamily:"'Plus Jakarta Sans','Segoe UI',sans-serif",background:bg,color:text,overflowX:"hidden",transition:"background .3s,color .3s",position:"relative"}}>
      <style>{css}</style>

      {showWelcome && <WelcomeScreen onDone={()=>setShowWelcome(false)}/>}

      {/* UPGRADED 3D ANIMATED BACKGROUND */}
      <ThreeDBackground dark={dark} scrollY={scrollY}/>

      <ScrollProgress/>
      <CustomCursor dark={dark}/>

      {/* ─── NAV ─── */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:200,padding:"0 5%",height:68,
        background:scrolled?navBg:"transparent",backdropFilter:scrolled?"blur(20px)":"none",
        borderBottom:scrolled?`1px solid ${navBorder}`:"1px solid transparent",
        boxShadow:scrolled?(dark?"0 2px 24px rgba(0,0,0,.4)":"0 2px 24px rgba(0,0,0,.07)"):"none",
        transition:"all .4s ease",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,zIndex:1}}>
          <div style={{width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${G[400]},${G[600]})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,boxShadow:`0 4px 14px ${G[400]}70`,animation:"rotateIn .6s cubic-bezier(.34,1.56,.64,1) both"}}>🤖</div>
          <span style={{fontWeight:800,fontSize:19,letterSpacing:"-0.04em",color:text}}><span style={{color:G[500]}}>AI</span> Resume Builder</span>
        </div>
        <div style={{display:"flex",gap:32,zIndex:1}}>
          {Object.entries(SECTION_IDS).map(([label,id])=>(
            <button key={label} className="nav-link" onClick={()=>scrollToSection(id)}>{label}</button>
          ))}
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center",zIndex:1}}>
          <ThemeToggle dark={dark} setDark={setDark}/>
          <button className="btn-outline" style={{padding:"9px 20px",fontSize:14}} 
           onClick={() => navigate("/login")}>Log in</button>
          <button className="btn-green" style={{padding:"9px 20px",fontSize:14}}  onClick={() => navigate("/login")}>Get Started Free →</button>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",
        padding:"110px 5% 80px",position:"relative",overflow:"hidden",
        background:dark?`radial-gradient(ellipse 90% 70% at 50% -5%,#0d2818 0%,${bg} 65%)`:`radial-gradient(ellipse 90% 70% at 50% -5%,${G[50]} 0%,#fff 65%)`}}>

        {[700,500,320].map((size,i)=>(
          <div key={i} style={{position:"absolute",width:size,height:size,borderRadius:"50%",
            border:`1px ${i===1?"dashed":"solid"} ${dark?(i===2?"#22c55e33":"#1e293b"):(i===2?G[300]:G[200])}`,
            top:"50%",left:"50%",transform:"translate(-50%,-50%)",pointerEvents:"none",opacity:.6,
            animation:`spinSlow ${30+i*12}s linear ${i%2===0?"":"reverse"} infinite`}}/>
        ))}

        <FloatBadge style={{left:"3%",top:"38%",width:190,opacity:.95}} delay={0.5} dark={dark}>
          <div style={{fontSize:11,color:G[500],fontWeight:700,marginBottom:6,textTransform:"uppercase",letterSpacing:".08em"}}>ATS Score</div>
          <div style={{fontSize:30,fontWeight:800,color:dark?G[400]:G[600],letterSpacing:"-0.04em"}}>98 / 100</div>
          <div style={{marginTop:8,height:6,background:dark?"#1e293b":G[100],borderRadius:3,overflow:"hidden"}}>
            <div style={{height:"100%",background:`linear-gradient(90deg,${G[400]},${G[600]})`,borderRadius:3,width:atsAnim?"98%":"0%",transition:"width 1.4s ease .6s",boxShadow:`0 0 8px ${G[400]}`}}/>
          </div>
        </FloatBadge>

        <FloatBadge style={{right:"3%",top:"35%",width:195,opacity:.95}} delay={1} dark={dark}>
          <div style={{fontSize:11,color:"#3b82f6",fontWeight:700,marginBottom:8,textTransform:"uppercase",letterSpacing:".08em"}}>New Interview</div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:34,height:34,borderRadius:"50%",background:dark?"#1e3a5f":"#dbeafe",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🏢</div>
            <div>
              <div style={{fontWeight:700,fontSize:13,color:dark?"#f1f5f9":"#111827"}}>Google</div>
              <div style={{fontSize:12,color:muted}}>Product Designer</div>
            </div>
          </div>
          <div style={{marginTop:10,background:dark?"rgba(34,197,94,0.1)":G[50],borderRadius:8,padding:"6px 10px",fontSize:12,color:dark?G[400]:G[600],fontWeight:600,display:"flex",alignItems:"center",gap:5}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:G[400],animation:"pulse 1.2s ease-in-out infinite",display:"inline-block"}}/>
            Interview in 2 days
          </div>
        </FloatBadge>

        <FloatBadge style={{left:"5%",bottom:"20%",width:180,opacity:.9}} delay={1.5} dark={dark}>
          <div style={{fontSize:11,color:"#8b5cf6",fontWeight:700,marginBottom:6,textTransform:"uppercase",letterSpacing:".08em"}}>🎉 Just Hired!</div>
          <div style={{fontSize:13,fontWeight:600,color:dark?"#e2e8f0":"#374151"}}>Akash  got hired at Jis University</div>
          <div style={{fontSize:11,color:muted,marginTop:4}}>10 minutes ago</div>
        </FloatBadge>

        <FloatBadge style={{right:"5%",bottom:"20%",width:180,opacity:.9}} delay={2} dark={dark}>
          <div style={{fontSize:11,color:G[600],fontWeight:700,marginBottom:6,textTransform:"uppercase",letterSpacing:".08em"}}>🎉 Just Hired!</div>
          <div style={{fontSize:13,fontWeight:600,color:dark?"#e2e8f0":"#374151"}}>Priya got hired at Google</div>
          <div style={{fontSize:11,color:muted,marginTop:4}}>6 minutes ago</div>
        </FloatBadge>

        <div style={{maxWidth:760,textAlign:"center",position:"relative",zIndex:2,transform:`translateY(${-heroParallax*0.2}px)`}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:dark?"rgba(34,197,94,0.1)":G[50],border:`1.5px solid ${dark?"rgba(34,197,94,0.3)":G[200]}`,borderRadius:999,padding:"7px 18px",marginBottom:32,fontSize:13,fontWeight:600,color:dark?G[400]:G[700],animation:"fadeIn .7s ease both",boxShadow:`0 4px 16px ${dark?"rgba(34,197,94,0.15)":G[200]}`}}>
            <span style={{animation:"pulse 2s ease-in-out infinite",display:"inline-block"}}>🤖</span>
            Powered by GPT-4o · Smarter than ever
          </div>

          <h1 style={{fontSize:"clamp(44px,6.5vw,80px)",fontWeight:800,lineHeight:1.06,letterSpacing:"-0.045em",margin:"0 0 26px",fontFamily:"'Lora','Georgia',serif",animation:"fadeUp .9s cubic-bezier(.22,1,.36,1) .1s both",color:text}}>
            Build a <AnimatedWord/><br/>Resume in Minutes
          </h1>

          <p style={{fontSize:18.5,color:muted,lineHeight:1.68,maxWidth:540,margin:"0 auto 40px",animation:"fadeUp .9s cubic-bezier(.22,1,.36,1) .22s both"}}>
            AI that understands your career. ATS-beating templates. Your dream job — one click away ❤️
          </p>

          <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap",animation:"fadeUp .9s cubic-bezier(.22,1,.36,1) .34s both"}}>
            <button className="btn-green" style={{padding:"18px 40px",fontSize:16}}   onClick={() => navigate("/login")}>
              Build My Resume — Free 🎉
            </button>
            <button className="btn-outline" style={{padding:"18px 28px",fontSize:16,display:"flex",alignItems:"center",gap:10}}>
              <span style={{width:34,height:34,borderRadius:"50%",background:dark?"rgba(255,255,255,0.1)":G[50],border:`1.5px solid ${dark?G[700]:G[300]}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>▶</span>
              Watch Demo
            </button>
          </div>

          <p style={{marginTop:18,fontSize:13,color:dark?"#475569":"#9ca3af",animation:"fadeIn 1s ease .5s both"}}>
            No credit card · Free forever plan · 3-minute setup
          </p>

          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12,marginTop:28,animation:"fadeUp .9s ease .55s both"}}>
            <div style={{display:"flex"}}>
              {["🧑‍💼","👩‍💻","🧑‍🎨","👩‍🔬","🧑‍💻","👩‍🎤"].map((e,i)=>(
                <div key={i} style={{width:36,height:36,borderRadius:"50%",background:`hsl(${135+i*18},55%,${dark?"25%":"88%"})`,border:`2.5px solid ${bg}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,marginLeft:i===0?0:-12,zIndex:10-i,animation:`fadeIn .4s ease ${i*80}ms both`}}>
                  {e}
                </div>
              ))}
            </div>
            <div style={{fontSize:13.5,color:muted}}>
              <span style={{fontWeight:700,color:text}}>2.4M+</span> professionals already hired
            </div>
          </div>

          <div style={{marginTop:48,display:"flex",flexDirection:"column",alignItems:"center",gap:8,animation:"fadeIn 1.2s ease .8s both",opacity:.5}}>
            <div style={{width:28,height:44,border:`2px solid ${dark?"#334155":"#d1d5db"}`,borderRadius:14,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:5}}>
              <div style={{width:4,height:4,borderRadius:"50%",background:dark?"#64748b":"#6b7280",animation:"scrollDot 1.8s ease-in-out infinite"}}/>
            </div>
            <span style={{fontSize:11,color:dark?"#475569":"#9ca3af",letterSpacing:".08em",textTransform:"uppercase"}}>Scroll</span>
          </div>
        </div>
      </section>

      {/* ─── MARQUEE ─── */}
      <div style={{overflow:"hidden",borderTop:`1px solid ${dark?"#1e293b":G[100]}`,borderBottom:`1px solid ${dark?"#1e293b":G[100]}`,padding:"14px 0",background:dark?"#0a0f1a":G[50],position:"relative",zIndex:1}}>
        <div className="marquee-track" style={{display:"flex",width:"max-content",animation:"marquee 22s linear infinite",gap:52}}>
          {[...COMPANIES,...COMPANIES].map((c,i)=>(
            <span key={i} style={{fontSize:13.5,fontWeight:700,color:dark?G[700]:G[600],letterSpacing:".07em",textTransform:"uppercase",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:8}}>
              <span style={{width:6,height:6,borderRadius:"50%",background:dark?G[800]:G[300],display:"inline-block"}}/>
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* ─── STATS ─── */}
      <section ref={statsRef} style={{padding:"80px 5%",maxWidth:1040,margin:"0 auto",position:"relative",zIndex:1}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:0,border:`1px solid ${statsBorder}`,borderRadius:24,overflow:"hidden",boxShadow:dark?"0 4px 24px rgba(0,0,0,0.3)":"0 4px 24px rgba(0,0,0,0.05)"}}>
          {STATS.map((s,i)=>(
            <div key={i} style={{textAlign:"center",padding:"48px 24px",borderLeft:i>0?`1px solid ${statsBorder}`:"none",background:statsV?statsCardBg:(dark?"#0a0f1a":G[50]),transition:`background .5s ease ${i*100}ms`,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",inset:0,background:dark?`radial-gradient(circle at 50% 50%,rgba(34,197,94,0.06),transparent 70%)`:`radial-gradient(circle at 50% 50%,${G[100]},transparent 70%)`,opacity:statsV?1:0,transition:`opacity .8s ease ${i*100}ms`}}/>
              <div style={{fontSize:52,fontWeight:800,color:dark?G[400]:G[600],letterSpacing:"-0.05em",fontFamily:"'Lora',serif",lineHeight:1,marginBottom:8,position:"relative",opacity:statsV?1:0,transform:statsV?"translateY(0)":"translateY(30px)",transition:`all .7s cubic-bezier(.22,1,.36,1) ${i*120}ms`}}>
                <CountUp num={s.num} suffix={s.suffix} float={s.float}/>
              </div>
              <div style={{fontSize:14,color:muted,fontWeight:500,position:"relative",opacity:statsV?1:0,transition:`opacity .6s ease ${i*120+200}ms`}}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features-section" style={{padding:"60px 5% 100px",background:surface,position:"relative",zIndex:1}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <Reveal direction="up">
            <div style={{textAlign:"center",marginBottom:64}}>
              <div style={{fontSize:12,color:G[600],fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",marginBottom:12}}>Why AI Resume Builder</div>
              <h2 style={{fontSize:"clamp(30px,4vw,52px)",fontWeight:800,letterSpacing:"-0.04em",margin:"0 0 14px",fontFamily:"'Lora',serif",color:text}}>
                Everything you need<br/>to get hired faster
              </h2>
              <p style={{color:muted,fontSize:17,maxWidth:460,margin:"0 auto"}}>From blank page to interview-ready in under 3 minutes.</p>
            </div>
          </Reveal>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18}}>
            {FEATURES.map((f,i)=><FeatureCard key={i} f={f} i={i} dark={dark}/>)}
          </div>
        </div>
      </section>

      {/* ─── TEMPLATES ─── */}
      <section id="templates-section" style={{padding:"80px 5% 100px",background:bg,position:"relative",zIndex:1}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <Reveal direction="up">
            <div style={{textAlign:"center",marginBottom:56}}>
              <div style={{fontSize:12,color:G[600],fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",marginBottom:12}}>Templates</div>
              <h2 style={{fontSize:"clamp(28px,4vw,48px)",fontWeight:800,letterSpacing:"-0.04em",margin:"0 0 14px",fontFamily:"'Lora',serif",color:text}}>
                Recruiter-approved designs
              </h2>
              <p style={{color:muted,fontSize:16,maxWidth:440,margin:"0 auto 32px"}}>
                Every template is crafted to pass ATS and impress hiring managers.
              </p>
              <button className="btn-outline" style={{padding:"12px 28px",fontSize:14}}>Browse All 50+ Templates →</button>
            </div>
          </Reveal>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:20}}>
            {TEMPLATES.map((t,i)=>(
              <Reveal key={i} delay={i*80}>
                <TemplatePreview t={t} dark={dark}/>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section ref={stepsRef} style={{padding:"100px 5%",maxWidth:1040,margin:"0 auto",position:"relative",zIndex:1}}>
        <Reveal direction="up">
          <div style={{textAlign:"center",marginBottom:72}}>
            <div style={{fontSize:12,color:G[600],fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",marginBottom:12}}>How It Works</div>
            <h2 style={{fontSize:"clamp(28px,4vw,48px)",fontWeight:800,letterSpacing:"-0.04em",margin:0,fontFamily:"'Lora',serif",color:text}}>
              Three steps to your dream job
            </h2>
          </div>
        </Reveal>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,position:"relative"}}>
          <div style={{position:"absolute",top:52,left:"18%",height:3,zIndex:0,borderRadius:2,background:`linear-gradient(90deg,${G[300]},${G[500]},${G[400]})`,width:stepsV?"63%":"0%",transition:"width 1.4s cubic-bezier(.22,1,.36,1) .5s",boxShadow:stepsV?`0 0 12px ${G[400]}60`:"none"}}/>
          {STEPS.map((s,i)=>(
            <div key={i} style={{textAlign:"center",padding:"0 28px",position:"relative",zIndex:1,opacity:stepsV?1:0,transform:stepsV?"translateY(0)":"translateY(44px)",transition:`all .8s cubic-bezier(.22,1,.36,1) ${i*180}ms`}}>
              <div style={{width:108,height:108,borderRadius:"50%",margin:"0 auto 30px",background:dark?`linear-gradient(135deg,#1e293b,#0f172a)`:`linear-gradient(135deg,${G[100]},${G[200]})`,border:`3px solid ${dark?G[800]:G[300]}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:38,position:"relative",boxShadow:dark?`0 10px 32px rgba(0,0,0,0.5), 0 0 0 6px ${bg}`:`0 10px 32px ${G[200]}, 0 0 0 6px ${bg}`,animation:stepsV?`wiggle 3.5s ease-in-out ${i*0.7+1}s infinite`:"none"}}>
                {s.emoji}
                <div style={{position:"absolute",top:-10,right:-6,width:30,height:30,borderRadius:"50%",background:`linear-gradient(135deg,${G[500]},${G[600]})`,color:"#fff",fontSize:11,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 12px ${G[500]}70`}}>{s.num}</div>
              </div>
              <h3 style={{fontSize:20,fontWeight:800,margin:"0 0 10px",letterSpacing:"-0.025em",color:text}}>{s.title}</h3>
              <p style={{color:muted,fontSize:14.5,lineHeight:1.68}}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── LIVE EDITOR DEMO ─── */}
      <section style={{padding:"80px 5% 100px",background:surface,position:"relative",zIndex:1}}>
        <div style={{maxWidth:1120,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:80,alignItems:"center"}}>
          <Reveal direction="left" delay={0}>
            <div>
              <div style={{fontSize:12,color:G[600],fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",marginBottom:14}}>Live Editor</div>
              <h2 style={{fontSize:"clamp(26px,3.2vw,42px)",fontWeight:800,letterSpacing:"-0.04em",margin:"0 0 18px",fontFamily:"'Lora',serif",lineHeight:1.16,color:text}}>
                Watch your resume come alive as you type
              </h2>
              <p style={{color:muted,fontSize:15.5,lineHeight:1.75,margin:"0 0 28px"}}>
                Real-time preview. AI suggestions inline. An ATS score that updates live.
              </p>
              {["Smart autofill from your LinkedIn profile","Instant ATS compatibility score live","One-click tone: formal, friendly, bold","Auto-translated for 40+ languages"].map((item,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:12,fontSize:15,color:dark?"#cbd5e1":"#374151",marginBottom:14}}>
                  <div style={{width:26,height:26,borderRadius:"50%",flexShrink:0,background:`linear-gradient(135deg,${G[400]},${G[600]})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"#fff",boxShadow:`0 4px 12px ${G[400]}50`}}>✓</div>
                  {item}
                </div>
              ))}
              <button className="btn-green" style={{marginTop:16,padding:"15px 32px",fontSize:15}}  onClick={() => navigate("/login")}>Try the Editor Free →</button>
            </div>
          </Reveal>

          <Reveal direction="right" delay={100}>
            <div style={{background:dark?"#0f172a":"#fff",border:`1.5px solid ${dark?"#1e293b":G[200]}`,borderRadius:28,padding:30,boxShadow:dark?`0 24px 64px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.3)`:`0 24px 64px rgba(0,0,0,0.08), 0 4px 16px ${G[100]}`,position:"relative",animation:"float 7s ease-in-out infinite"}}>
              <div style={{position:"absolute",top:-15,right:22,background:`linear-gradient(135deg,${G[500]},${G[600]})`,borderRadius:999,padding:"6px 16px",fontSize:12,fontWeight:700,color:"#fff",boxShadow:`0 6px 18px ${G[500]}55`}}>✅ ATS Score: 98%</div>
              <div style={{marginBottom:18}}>
                <div className="skeleton" style={{height:13,width:"54%",marginBottom:7}}/>
                <div className="skeleton" style={{height:8,width:"38%"}}/>
              </div>
              <div style={{height:1,background:dark?"#1e293b":G[100],marginBottom:16}}/>
              <div style={{fontSize:10,color:G[600],fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",marginBottom:12}}>Experience</div>
              {[[80,65,92],[75,58,85]].map((widths,i)=>(
                <div key={i} style={{marginBottom:14}}>
                  <div className="skeleton" style={{height:8,width:"58%",marginBottom:5}}/>
                  <div className="skeleton" style={{height:7,width:"40%",marginBottom:8}}/>
                  {widths.map((w,j)=><div key={j} className="skeleton" style={{height:5.5,width:`${w}%`,marginBottom:4}}/>)}
                </div>
              ))}
              <div style={{height:1,background:dark?"#1e293b":G[100],margin:"12px 0"}}/>
              <div style={{fontSize:10,color:"#3b82f6",fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",marginBottom:10}}>Skills</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                {["Figma","React","Python","Strategy","AI/ML","Design"].map(s=>(
                  <div key={s} style={{background:dark?"rgba(34,197,94,0.1)":G[50],border:`1px solid ${dark?"rgba(34,197,94,0.2)":G[200]}`,borderRadius:7,padding:"5px 11px",fontSize:11,fontWeight:600,color:dark?G[400]:G[700]}}>{s}</div>
                ))}
              </div>
              <TypewriterChip dark={dark}/>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section style={{padding:"100px 5%",maxWidth:1200,margin:"0 auto",position:"relative",zIndex:1}}>
        <Reveal direction="up">
          <div style={{textAlign:"center",marginBottom:60}}>
            <div style={{fontSize:12,color:G[600],fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",marginBottom:12}}>Testimonials</div>
            <h2 style={{fontSize:"clamp(26px,3.5vw,46px)",fontWeight:800,letterSpacing:"-0.04em",fontFamily:"'Lora',serif",color:text}}>
              Loved by job seekers worldwide
            </h2>
          </div>
        </Reveal>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18}}>
          {TESTIMONIALS.map((t,i)=><TestiCard key={i} t={t} i={i} dark={dark}/>)}
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing-section" style={{padding:"80px 5% 100px",background:surface,position:"relative",zIndex:1}}>
        <div style={{maxWidth:1060,margin:"0 auto"}}>
          <Reveal direction="up">
            <div style={{textAlign:"center",marginBottom:64}}>
              <div style={{fontSize:12,color:G[600],fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",marginBottom:12}}>Pricing</div>
              <h2 style={{fontSize:"clamp(28px,4vw,50px)",fontWeight:800,letterSpacing:"-0.04em",margin:"0 0 14px",fontFamily:"'Lora',serif",color:text}}>
                Simple, transparent pricing
              </h2>
              <p style={{color:muted,fontSize:16,maxWidth:440,margin:"0 auto"}}>Start free. Upgrade when you're ready. Cancel anytime.</p>
            </div>
          </Reveal>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18,alignItems:"start"}}>
            {PRICING.map((p,i)=><PricingCard key={i} p={p} i={i} dark={dark}/>)}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="about-section" style={{padding:"80px 5%",maxWidth:760,margin:"0 auto",position:"relative",zIndex:1}}>
        <Reveal direction="up">
          <h2 style={{textAlign:"center",fontSize:"clamp(24px,3.5vw,40px)",fontWeight:800,letterSpacing:"-0.04em",fontFamily:"'Lora',serif",color:text,marginBottom:48}}>
            Frequently asked questions
          </h2>
        </Reveal>
        {[
          {q:"Is AI Resume Builder really free?",a:"Yes! The free plan lets you build and download up to 3 resumes forever. No hidden fees, no credit card required."},
          {q:"How does the AI writing work?",a:"Our AI analyzes your role, industry, and experience, then suggests tailored bullet points, power verbs, and quantified achievements in real time."},
          {q:"What is an ATS score?",a:"ATS (Applicant Tracking System) score measures how well your resume passes automated screening. We score against real Fortune 500 ATS engines live as you edit."},
          {q:"Can I import from LinkedIn?",a:"Absolutely. One click and your entire career history, skills, and education are imported and formatted instantly."},
          {q:"Is my data secure?",a:"Yes — all data is encrypted in transit and at rest. We never share your personal information with third parties."},
        ].map((item,i)=>(
          <FAQItem key={i} q={item.q} a={item.a} i={i} dark={dark}/>
        ))}
      </section>

      {/* ─── CTA ─── */}
      <section ref={ctaRef} style={{padding:"80px 5% 100px",position:"relative",zIndex:1}}>
        <div style={{maxWidth:700,margin:"0 auto",textAlign:"center",background:`linear-gradient(135deg,${G[500]},${G[600]},${G[700]})`,borderRadius:36,padding:"76px 52px",animation:"glowPulse 3s ease-in-out infinite",opacity:ctaV?1:0,transform:ctaV?"scale(1) translateY(0)":"scale(0.92) translateY(32px)",transition:"opacity .8s cubic-bezier(.22,1,.36,1), transform .8s cubic-bezier(.22,1,.36,1)",position:"relative",overflow:"hidden"}}>
          <div style={{position:"relative",zIndex:2}}>
            <div style={{fontSize:52,marginBottom:16,animation:"float 3s ease-in-out infinite"}}>🚀</div>
            <h2 style={{fontSize:"clamp(28px,4vw,46px)",fontWeight:800,letterSpacing:"-0.04em",margin:"0 0 16px",fontFamily:"'Lora',serif",color:"#fff"}}>
              Your next job starts here
            </h2>
            <p style={{color:"rgba(255,255,255,0.82)",fontSize:16.5,margin:"0 0 36px",lineHeight:1.68}}>
              Join 2.4 million professionals who built their dream resume with AI Resume Builder.
            </p>
            <button className="cta-white-btn"  onClick={() => navigate("/login")}>Create My Free Resume →</button>
            <p style={{marginTop:16,fontSize:13,color:"rgba(255,255,255,0.58)"}}>Takes 3 minutes · No signup required to start</p>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{background:dark?"linear-gradient(160deg,#000000,#0a0f1a 40%,#0d2818)":"linear-gradient(160deg,#0f172a,#111827 40%,#14532d)",padding:"70px 5% 25px",position:"relative",zIndex:1,overflow:"hidden"}}>
        <div style={{position:"absolute",width:400,height:400,borderRadius:"50%",background:"rgba(34,197,94,0.12)",filter:"blur(90px)",top:-140,right:-80}}/>
        <div style={{position:"absolute",width:300,height:300,borderRadius:"50%",background:"rgba(59,130,246,0.08)",filter:"blur(80px)",bottom:-100,left:-60}}/>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:40,position:"relative",zIndex:2,marginBottom:50}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
              <div style={{width:46,height:46,borderRadius:12,background:"linear-gradient(135deg,#22c55e,#16a34a)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:22,boxShadow:"0 10px 25px rgba(34,197,94,0.4)"}}>✦</div>
              <h2 style={{color:"#fff",fontSize:24,fontWeight:800,letterSpacing:"-0.04em"}}><span style={{color:"#4ade80"}}>AI</span> Resume Builder</h2>
            </div>
            <p style={{color:"rgba(255,255,255,0.65)",lineHeight:1.8,maxWidth:320,fontSize:14}}>
              Build AI-powered resumes that stand out, beat ATS systems, and help you land your dream job faster.
            </p>
            <div style={{display:"flex",gap:14,marginTop:24}}>
              {["🌐","📘","📸","💼"].map((icon,i)=>(
                <div key={i} className="social-icon-btn">{icon}</div>
              ))}
            </div>
          </div>
          <div>
            <h3 style={{color:"#fff",marginBottom:18,fontSize:16,fontWeight:600}}>Product</h3>
            {["Features","Templates","Pricing","Builder","Changelog"].map(item=>(
              <p key={item} className="footer-link-item"><span style={{fontSize:10,opacity:.5}}>→</span> {item}</p>
            ))}
          </div>
          <div>
            <h3 style={{color:"#fff",marginBottom:18,fontSize:16,fontWeight:600}}>Company</h3>
            {["About","Careers","Blog","Press","Contact"].map(item=>(
              <p key={item} className="footer-link-item"><span style={{fontSize:10,opacity:.5}}>→</span> {item}</p>
            ))}
          </div>
          <div>
            <h3 style={{color:"#fff",marginBottom:18,fontSize:16,fontWeight:600}}>Newsletter</h3>
            <p style={{color:"rgba(255,255,255,0.65)",fontSize:14,lineHeight:1.7,marginBottom:18}}>Get resume tips & career updates weekly.</p>
            <div style={{display:"flex",background:"rgba(255,255,255,0.08)",borderRadius:14,overflow:"hidden",border:"1px solid rgba(255,255,255,0.1)"}}>
              <input type="email" placeholder="Enter email" style={{flex:1,border:"none",outline:"none",background:"transparent",padding:14,color:"#fff",fontSize:14}}/>
              <button style={{border:"none",background:"linear-gradient(135deg,#22c55e,#16a34a)",color:"#fff",padding:"0 18px",cursor:"pointer",fontWeight:700,fontSize:18}}>→</button>
            </div>
          </div>
        </div>
        <div style={{borderTop:"1px solid rgba(255,255,255,0.08)",paddingTop:22,display:"flex",justifyContent:"space-between",alignItems:"center",position:"relative",zIndex:2}}>
          <p style={{color:"rgba(255,255,255,0.45)",fontSize:13}}>© 2026 AI Resume Builder. All rights reserved.</p>
          <div style={{display:"flex",gap:24}}>
            {["Privacy Policy","Terms","Support"].map(item=>(
              <span key={item} className="footer-legal-item">{item}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}