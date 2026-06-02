import { useState, useEffect, useRef } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../../firebase";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";


const G = {
  50: "#f0fdf4", 100: "#dcfce7", 200: "#bbf7d0",
  300: "#86efac", 400: "#4ade80", 500: "#22c55e",
  600: "#16a34a", 700: "#15803d",
};


function Particles() {
  const ref = useRef(); const raf = useRef(); const pts = useRef([]);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; init(); };
    const init = () => {
      pts.current = Array.from({ length: 22 }, () => ({
        x: Math.random() * c.width, y: Math.random() * c.height,
        vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 3 + 1.5, o: Math.random() * 0.3 + 0.08,
      }));
    };
    resize();
    window.addEventListener("resize", resize);
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      pts.current.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > c.width) p.vx *= -1;
        if (p.y < 0 || p.y > c.height) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34,197,94,${p.o})`; ctx.fill();
      });
      pts.current.forEach((a, i) => pts.current.slice(i + 1).forEach(b => {
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 130) {
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(34,197,94,${0.1 * (1 - d / 130)})`;
          ctx.lineWidth = 0.7; ctx.stroke();
        }
      }));
      raf.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf.current); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}


function FloatShape({ size, color, top, left, delay, shape = "circle" }) {
  return (
    <div style={{
      position: "absolute", top, left,
      width: size, height: size,
      borderRadius: shape === "circle" ? "50%" : shape === "square" ? "12px" : "50% 0 50% 0",
      background: color, opacity: 0.18,
      animation: `floatY 6s ease-in-out ${delay}s infinite`,
      pointerEvents: "none",
    }} />
  );
}


function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

/* ── typewriter ── */
function Typewriter({ texts }) {
  const [ti, setTi] = useState(0); const [chars, setChars] = useState(0); const [del, setDel] = useState(false);
  useEffect(() => {
    const cur = texts[ti];
    if (!del && chars < cur.length) { const t = setTimeout(() => setChars(c => c + 1), 55); return () => clearTimeout(t); }
    if (!del && chars === cur.length) { const t = setTimeout(() => setDel(true), 1600); return () => clearTimeout(t); }
    if (del && chars > 0) { const t = setTimeout(() => setChars(c => c - 1), 30); return () => clearTimeout(t); }
    if (del && chars === 0) { const t = setTimeout(() => { setDel(false); setTi(i => (i + 1) % texts.length); }, 0); return () => clearTimeout(t); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chars, del, ti]);
  return (
    <span>
      {texts[ti].slice(0, chars)}
      <span style={{ borderRight: `2px solid ${G[400]}`, marginLeft: 1, animation: "blink .7s step-end infinite" }} />
    </span>
  );
}

function Input({ label, type, placeholder, icon, value, onChange, error, dark }) {
  const [focused, setFocused] = useState(false); const [show, setShow] = useState(false);
  const isPass = type === "password";
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: dark ? "#94a3b8" : "#374151", marginBottom: 7, letterSpacing: "-0.01em" }}>{label}</label>
      <div style={{
        display: "flex", alignItems: "center",
        border: `1.5px solid ${error ? "#ef4444" : focused ? G[500] : dark ? "#334155" : "#e5e7eb"}`,
        borderRadius: 12, background: dark ? "#0f172a" : "#fff", overflow: "hidden",
        boxShadow: focused ? `0 0 0 3px ${G[500]}20` : "0 1px 3px rgba(0,0,0,0.06)",
        transition: "all .25s ease",
      }}>
        <span style={{ padding: "0 14px", fontSize: 17, color: focused ? G[500] : "#9ca3af", transition: "color .25s" }}>{icon}</span>
        <input
          type={isPass ? (show ? "text" : "password") : type}
          placeholder={placeholder} value={value} onChange={onChange}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ flex: 1, border: "none", outline: "none", padding: "13px 0",
            fontSize: 14.5, color: dark ? "#f1f5f9" : "#111827", background: "transparent", fontFamily: "inherit" }}
        />
        {isPass && (
          <button onClick={() => setShow(s => !s)} style={{ border: "none", background: "none", cursor: "pointer",
            padding: "0 14px", color: "#9ca3af", fontSize: 17, lineHeight: 1 }}>{show ? "🙈" : "👁️"}</button>
        )}
      </div>
      {error && <p style={{ fontSize: 12, color: "#ef4444", margin: "5px 0 0 2px" }}>{error}</p>}
    </div>
  );
}


function GoogleButton({ onClick, loading }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      disabled={loading}
      style={{
        width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
        padding: "13px 20px", border: "1.5px solid #e5e7eb", borderRadius: 12, background: h ? "#f9fafb" : "#fff",
        cursor: loading ? "not-allowed" : "pointer", fontSize: 15, fontWeight: 600, color: "#374151",
        fontFamily: "inherit", transition: "all .25s ease",
        boxShadow: h ? "0 4px 16px rgba(0,0,0,0.1)" : "0 1px 4px rgba(0,0,0,0.06)",
        transform: h ? "translateY(-1px)" : "translateY(0)",
      }}>
      {loading ? (
        <span style={{ width: 20, height: 20, border: "2px solid #e5e7eb", borderTopColor: G[500],
          borderRadius: "50%", animation: "spin .7s linear infinite", display: "inline-block" }} />
      ) : <GoogleIcon />}
      Continue with Google
    </button>
  );
}

function ThemeToggle({ dark, onToggle }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onToggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      style={{
        position: "absolute",
        top: 20,
        right: 24,
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 14px",
        borderRadius: 40,
        border: `1.5px solid ${dark ? "#334155" : "#e5e7eb"}`,
        background: dark
          ? hovered ? "#1e293b" : "#0f172a"
          : hovered ? "#f3f4f6" : "#fff",
        cursor: "pointer",
        fontFamily: "inherit",
        fontSize: 13,
        fontWeight: 600,
        color: dark ? "#94a3b8" : "#6b7280",
        boxShadow: hovered
          ? dark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 16px rgba(0,0,0,0.1)"
          : "0 1px 4px rgba(0,0,0,0.06)",
        transform: hovered ? "translateY(-1px)" : "translateY(0)",
        transition: "all .25s ease",
        whiteSpace: "nowrap",
      }}
    >
      <div style={{
        position: "relative",
        width: 38,
        height: 22,
        borderRadius: 11,
        background: dark
          ? `linear-gradient(135deg, #1e3a5f, #0f172a)`
          : `linear-gradient(135deg, ${G[400]}, ${G[500]})`,
        border: `1.5px solid ${dark ? "#334155" : G[300]}`,
        transition: "all .35s ease",
        flexShrink: 0,
      }}>
        <div style={{
          position: "absolute",
          top: 2,
          left: dark ? 17 : 2,
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: "#fff",
          boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
          transition: "left .3s cubic-bezier(.34,1.56,.64,1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 8,
        }}>
          {dark ? "🌙" : "☀️"}
        </div>
      </div>
      <span style={{ transition: "color .25s" }}>
        {dark ? "Dark" : "Light"}
      </span>
    </button>
  );
}

/* ── Legal Modal ── */
function LegalModal({ type, dark, onClose }) {
  const scrollRef = useRef();

  // Close on backdrop click
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const isTerms = type === "terms";

  const termsContent = [
    {
      title: "1. Acceptance of Terms",
      body: "By accessing or using AI Resume Builder, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service. These terms apply to all visitors, users, and others who access or use the service.",
    },
    {
      title: "2. Use of Service",
      body: "AI Resume Builder grants you a limited, non-exclusive, non-transferable license to use the platform for personal, non-commercial resume creation purposes. You agree not to misuse the service, attempt to reverse-engineer any part of it, or use it to generate misleading or fraudulent content.",
    },
    {
      title: "3. User Accounts",
      body: "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use. We reserve the right to terminate accounts that violate these terms.",
    },
    {
      title: "4. Intellectual Property",
      body: "The service and its original content, features, and functionality are owned by AI Resume Builder and are protected by international copyright, trademark, and other intellectual property laws. Resumes generated by you remain your own property.",
    },
    {
      title: "5. Subscription & Payments",
      body: "Certain features of AI Resume Builder require a paid subscription. All payments are processed securely. Subscriptions renew automatically unless cancelled before the renewal date. Refunds are available within 7 days of purchase if no premium features have been used.",
    },
    {
      title: "6. Limitation of Liability",
      body: "AI Resume Builder shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of the service. We do not guarantee job placement or interview success. The service is provided 'as is' without warranties of any kind.",
    },
    {
      title: "7. Changes to Terms",
      body: "We reserve the right to modify these terms at any time. We will provide notice of significant changes via email or a prominent notice on the platform. Your continued use of the service after changes constitutes acceptance of the new terms.",
    },
    {
      title: "8. Contact",
      body: "For any questions about these Terms of Service, please contact us at legal@AI Resume Builder.com or write to us at AI Resume Builder Inc., 123 Innovation Drive, San Francisco, CA 94105.",
    },
  ];

  const privacyContent = [
    {
      title: "1. Information We Collect",
      body: "We collect information you provide directly — such as your name, email address, work history, and resume content. We also automatically collect usage data, device information, IP addresses, and interaction logs to improve our service.",
    },
    {
      title: "2. How We Use Your Information",
      body: "Your data is used to provide and improve AI Resume Builder's features, personalize your experience, send important service notifications, and ensure platform security. We use anonymized, aggregated data to improve our AI models.",
    },
    {
      title: "3. Data Sharing",
      body: "We do not sell your personal data to third parties. We may share data with trusted service providers (e.g., cloud hosting, payment processors) who are bound by strict confidentiality agreements. We may disclose data if required by law.",
    },
    {
      title: "4. Resume Data",
      body: "Your resume content is stored securely and is only accessible to you. We use it solely to provide the resume-building service. We do not share your resume content with employers or third parties without your explicit consent.",
    },
    {
      title: "5. Cookies & Tracking",
      body: "We use cookies and similar technologies to maintain sessions, remember preferences, and analyze usage patterns. You can control cookie settings through your browser. Disabling cookies may affect some platform features.",
    },
    {
      title: "6. Data Security",
      body: "We implement industry-standard security measures including AES-256 encryption, secure HTTPS connections, and regular security audits. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.",
    },
    {
      title: "7. Your Rights",
      body: "You have the right to access, correct, or delete your personal data at any time from your account settings. You may also request a full export of your data. For GDPR or CCPA requests, contact privacy@AI Resume Builder.com within 30 days.",
    },
    {
      title: "8. Contact & Updates",
      body: "For privacy concerns, contact our Data Protection Officer at privacy@AI Resume Builder.com. We will notify you of material changes to this policy via email at least 14 days before they take effect.",
    },
  ];

  const content = isTerms ? termsContent : privacyContent;

  return (
    <div
      onClick={handleBackdrop}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
        animation: "fadeIn .2s ease both",
      }}
    >
      <div style={{
        width: "100%", maxWidth: 580,
        maxHeight: "85vh",
        borderRadius: 20,
        background: dark ? "#1e293b" : "#fff",
        boxShadow: dark
          ? "0 24px 80px rgba(0,0,0,0.6)"
          : "0 24px 80px rgba(0,0,0,0.18)",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
        animation: "scaleIn .25s cubic-bezier(.34,1.56,.64,1) both",
      }}>
        {/* Header */}
        <div style={{
          padding: "24px 28px 20px",
          borderBottom: `1px solid ${dark ? "#334155" : "#f0f0f0"}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: `linear-gradient(135deg, ${G[400]}, ${G[600]})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, boxShadow: `0 4px 14px ${G[500]}40`,
            }}>
              {isTerms ? "📋" : "🔒"}
            </div>
            <div>
              <h2 style={{
                margin: 0, fontSize: 20, fontWeight: 800,
                color: dark ? "#f1f5f9" : "#111827",
                letterSpacing: "-0.03em",
              }}>
                {isTerms ? "Terms of Service" : "Privacy Policy"}
              </h2>
              <p style={{ margin: 0, fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
                Last updated: June 1, 2026
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 36, height: 36, borderRadius: "50%",
              border: `1.5px solid ${dark ? "#334155" : "#e5e7eb"}`,
              background: dark ? "#0f172a" : "#f9fafb",
              cursor: "pointer", fontSize: 16, color: "#6b7280",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all .2s ease",
              flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = dark ? "#334155" : "#f3f4f6"; e.currentTarget.style.color = dark ? "#f1f5f9" : "#111827"; }}
            onMouseLeave={e => { e.currentTarget.style.background = dark ? "#0f172a" : "#f9fafb"; e.currentTarget.style.color = "#6b7280"; }}
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div
          ref={scrollRef}
          style={{
            overflowY: "auto", padding: "24px 28px",
            flex: 1,
            scrollbarWidth: "thin",
            scrollbarColor: `${G[300]} transparent`,
          }}
        >
          <p style={{
            fontSize: 14, lineHeight: 1.7,
            color: dark ? "#94a3b8" : "#6b7280",
            marginBottom: 24,
            padding: "14px 16px",
            background: dark ? `${G[600]}18` : `${G[50]}`,
            borderLeft: `3px solid ${G[500]}`,
            borderRadius: "0 8px 8px 0",
          }}>
            {isTerms
              ? "Please read these terms carefully before using AI Resume Builder. By creating an account, you agree to be bound by these terms."
              : "Your privacy matters to us. This policy explains how AI Resume Builder collects, uses, and protects your personal information."}
          </p>

          {content.map((section, i) => (
            <div key={i} style={{ marginBottom: 22 }}>
              <h3 style={{
                fontSize: 14.5, fontWeight: 700,
                color: dark ? "#e2e8f0" : "#1f2937",
                marginBottom: 8, letterSpacing: "-0.02em",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: 22, height: 22, borderRadius: 6,
                  background: `${G[500]}20`, color: G[600],
                  fontSize: 11, fontWeight: 800, flexShrink: 0,
                }}>
                  {i + 1}
                </span>
                {section.title.replace(/^\d+\.\s/, "")}
              </h3>
              <p style={{
                fontSize: 13.5, lineHeight: 1.75,
                color: dark ? "#94a3b8" : "#4b5563",
                margin: 0, paddingLeft: 30,
              }}>
                {section.body}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: "16px 28px",
          borderTop: `1px solid ${dark ? "#334155" : "#f0f0f0"}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0,
          background: dark ? "#0f172a" : "#f9fafb",
        }}>
          <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>
            © 2026 AI Resume Builder Inc. All rights reserved.
          </p>
          <button
            onClick={onClose}
            style={{
              padding: "9px 20px", borderRadius: 10, border: "none",
              background: `linear-gradient(135deg, ${G[500]}, ${G[600]})`,
              color: "#fff", fontSize: 13.5, fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit",
              boxShadow: `0 4px 14px ${G[500]}40`,
              transition: "all .2s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 6px 20px ${G[500]}55`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 4px 14px ${G[500]}40`; }}
          >
            Got it ✓
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── main ── */
export default function Login() {
  const navigate = useNavigate();
  const { dark, toggleTheme } = useTheme();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState(""); const [pass, setPass] = useState(""); const [name, setName] = useState("");
  const [errors, setErrors] = useState({});
  const [gLoading, setGLoading] = useState(false); const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [panelIn, setPanelIn] = useState(true);
  const [legalModal, setLegalModal] = useState(null); // "terms" | "privacy" | null

  const switchMode = (m) => {
    setPanelIn(false);
    setTimeout(() => { setMode(m); setErrors({}); setPanelIn(true); setSuccess(false); }, 280);
  };

  const validate = () => {
    const e = {};
    if (mode === "signup" && !name.trim()) e.name = "Full name is required";
    if (!email.includes("@")) e.email = "Enter a valid email address";
    if (mode !== "forgot" && pass.length < 6) e.pass = "Password must be at least 6 characters";
    setErrors(e); return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      navigate("/Final");
    }, 1000);
  };

  const handleGoogle = async () => {
    try {
      setGLoading(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      localStorage.setItem("user", JSON.stringify({
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
      }));
      navigate("/Final");
    } catch (error) {
      console.log(error);
      alert("Google Login Failed");
    } finally {
      setGLoading(false);
    }
  };

  const features = [
    "Build a stunning resume in 3 minutes",
    "Beat ATS systems with a 98% score",
    "50+ professional templates included",
    "Export as PDF or share a live link",
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans','Segoe UI',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Lora:wght@700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes floatY{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-18px) rotate(6deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideIn{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:translateX(0)}}
        @keyframes slideOut{from{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(-20px)}}
        @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes scaleIn{from{opacity:0;transform:scale(0.85)}to{opacity:1;transform:scale(1)}}
        @keyframes checkPop{0%{transform:scale(0) rotate(-20deg)}70%{transform:scale(1.2) rotate(4deg)}100%{transform:scale(1) rotate(0)}}
        @keyframes rippleOut{0%{transform:scale(1);opacity:.5}100%{transform:scale(2.4);opacity:0}}
        @keyframes gradShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes marqueeScroll{from{transform:translateY(0)}to{transform:translateY(-50%)}}
        input::placeholder{color:#9ca3af}
      `}</style>

      {/* Legal Modal */}
      {legalModal && (
        <LegalModal
          type={legalModal}
          dark={dark}
          onClose={() => setLegalModal(null)}
        />
      )}

      {/* ── LEFT PANEL ── */}
      <div style={{
        width: "46%", minHeight: "100vh", position: "relative", overflow: "hidden",
        background: `linear-gradient(135deg, ${G[600]} 0%, ${G[500]} 50%, ${G[400]} 100%)`,
        backgroundSize: "200% 200%", animation: "gradShift 8s ease infinite",
        display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 52px",
      }}>
        <Particles />
        <FloatShape size={90} color={G[200]} top="8%" left="72%" delay={0} shape="circle" />
        <FloatShape size={55} color="#fff" top="20%" left="10%" delay={1.2} shape="square" />
        <FloatShape size={70} color={G[300]} top="68%" left="78%" delay={2} shape="diamond" />
        <FloatShape size={40} color="#fff" top="78%" left="15%" delay={0.6} shape="circle" />
        <FloatShape size={110} color={G[700]} top="40%" left="62%" delay={1.8} shape="square" />

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 52, position: "relative", zIndex: 2, animation: "fadeUp .7s ease both" }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(255,255,255,0.25)",
            backdropFilter: "blur(8px)", border: "1.5px solid rgba(255,255,255,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🤖</div>
          <span style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.04em" }}>AI Resume Builder</span>
        </div>

        <div style={{ position: "relative", zIndex: 2, animation: "fadeUp .7s ease .1s both" }}>
          <h1 style={{ fontSize: "clamp(28px,3vw,40px)", fontWeight: 800, color: "#fff",
            letterSpacing: "-0.04em", lineHeight: 1.15, margin: "0 0 16px", fontFamily: "'Lora', serif" }}>
            Land your dream job<br />with AI-powered resumes
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.82)", lineHeight: 1.7, maxWidth: 340, margin: "0 0 40px" }}>
            Join <strong style={{ color: "#fff" }}>2.4 million</strong> professionals who built standout resumes in minutes — not hours.
          </p>
        </div>

        <div style={{ position: "relative", zIndex: 2 }}>
          {features.map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14,
              animation: `fadeUp .6s ease ${.2 + i * .12}s both` }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(255,255,255,0.22)",
                border: "1.5px solid rgba(255,255,255,0.4)", display: "flex", alignItems: "center",
                justifyContent: "center", flexShrink: 0, fontSize: 12, color: "#fff", fontWeight: 700 }}>✓</div>
              <span style={{ fontSize: 14.5, color: "rgba(255,255,255,0.92)", fontWeight: 500 }}>{f}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 44, overflow: "hidden", height: 72, position: "relative", zIndex: 2 }}>
          <div style={{ animation: "marqueeScroll 10s linear infinite" }}>
            {[
              { text: '"Got hired at Google in 2 weeks!"', name: "Sarah K." },
              { text: '"ATS score hit 98% first try."', name: "James L." },
              { text: '"Built mine in 4 minutes flat."', name: "Priya M." },
              { text: '"Got hired at Google in 2 weeks!"', name: "Sarah K." },
              { text: '"ATS score hit 98% first try."', name: "James L." },
              { text: '"Built mine in 4 minutes flat."', name: "Priya M." },
            ].map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.2)",
                  border: "1.5px solid rgba(255,255,255,0.35)", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 14, flexShrink: 0 }}>⭐</div>
                <div>
                  <p style={{ fontSize: 13, color: "#fff", fontWeight: 600, margin: 0 }}>{t.text}</p>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", margin: 0 }}>— {t.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        background: dark ? "#0f172a" : "#f9fafb", padding: "40px 24px", position: "relative", overflow: "hidden",
        transition: "background .3s" }}>

        <ThemeToggle dark={dark} onToggle={toggleTheme} />

        <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%",
          background: `radial-gradient(circle, ${G[50]} 0%, transparent 70%)`,
          top: "-10%", right: "-5%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%",
          background: `radial-gradient(circle, ${G[50]} 0%, transparent 70%)`,
          bottom: "0%", left: "0%", pointerEvents: "none" }} />

        <div style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 2,
          background: dark ? "#1e293b" : "transparent", borderRadius: 24,
          padding: dark ? "32px" : "0", boxShadow: dark ? "0 8px 40px rgba(0,0,0,0.4)" : "none",
          transition: "all .3s" }}>
          {success ? (
            <div style={{ textAlign: "center", animation: "scaleIn .5s cubic-bezier(.34,1.56,.64,1) both" }}>
              <div style={{ position: "relative", width: 90, height: 90, margin: "0 auto 24px" }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%",
                  background: `${G[500]}20`, animation: "rippleOut 1.2s ease .3s both" }} />
                <div style={{ width: 90, height: 90, borderRadius: "50%",
                  background: `linear-gradient(135deg,${G[400]},${G[600]})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 38, boxShadow: `0 12px 40px ${G[500]}50`,
                  animation: "checkPop .5s cubic-bezier(.34,1.56,.64,1) .1s both" }}>✓</div>
              </div>
              <h2 style={{ fontSize: 26, fontWeight: 800, color: dark ? "#f1f5f9" : "#111827", letterSpacing: "-0.03em", marginBottom: 10 }}>
                {mode === "forgot" ? "Email sent!" : "Welcome aboard! 🎉"}
              </h2>
              <p style={{ color: "#6b7280", fontSize: 15, lineHeight: 1.65, marginBottom: 28 }}>
                {mode === "forgot"
                  ? "Check your inbox for a password reset link."
                  : mode === "login" ? "You're signed in. Redirecting..." : "Account created! Redirecting now..."}
              </p>
            </div>
          ) : (
            <div style={{ animation: panelIn ? "slideIn .28s ease both" : "slideOut .28s ease both" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginBottom: 36 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9,
                  background: `linear-gradient(135deg,${G[400]},${G[600]})`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17,
                  boxShadow: `0 4px 14px ${G[500]}50` }}>✦</div>
                <span style={{ fontSize: 20, fontWeight: 800, color: dark ? "#f1f5f9" : "#111827", letterSpacing: "-0.04em" }}>
                  <span style={{ color: G[500] }}>AI</span> Resume Builder
                </span>
              </div>

              {mode === "forgot" ? (
                <>
                  <h2 style={{ fontSize: 26, fontWeight: 800, color: dark ? "#f1f5f9" : "#111827", letterSpacing: "-0.03em", marginBottom: 8, textAlign: "center" }}>
                    Reset your password
                  </h2>
                  <p style={{ color: dark ? "#94a3b8" : "#6b7280", fontSize: 14.5, textAlign: "center", marginBottom: 28, lineHeight: 1.6 }}>
                    Enter your email and we'll send a reset link.
                  </p>
                  <Input label="Email address" type="email" placeholder="fahhhh@example.com" icon="📧" dark={dark}
                    value={email} onChange={e => setEmail(e.target.value)} error={errors.email} />
                  <button onClick={handleSubmit} disabled={submitting}
                    style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none",
                      background: submitting ? G[300] : `linear-gradient(135deg,${G[500]},${G[600]})`,
                      color: "#fff", fontSize: 15.5, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer",
                      fontFamily: "inherit", transition: "all .3s ease",
                      boxShadow: submitting ? "none" : `0 8px 28px ${G[500]}45`,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                    {submitting
                      ? <span style={{ width: 20, height: 20, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .7s linear infinite", display: "inline-block" }} />
                      : "Send Reset Link →"}
                  </button>
                  <button onClick={() => switchMode("login")} style={{ marginTop: 18, background: "none", border: "none",
                    color: G[600], fontWeight: 600, fontSize: 14, cursor: "pointer", width: "100%", fontFamily: "inherit" }}>
                    ← Back to login
                  </button>
                </>
              ) : (
                <>
                  <div style={{ display: "flex", background: dark ? "#0f172a" : "#f3f4f6", borderRadius: 12, padding: 4, marginBottom: 28 }}>
                    {[["login", "Sign In"], ["signup", "Create Account"]].map(([m, label]) => (
                      <button key={m} onClick={() => switchMode(m)}
                        style={{ flex: 1, padding: "10px", borderRadius: 9, border: "none", cursor: "pointer",
                          fontFamily: "inherit", fontSize: 14, fontWeight: 700, transition: "all .25s ease",
                          background: mode === m ? (dark ? "#1e293b" : "#fff") : "transparent",
                          color: mode === m ? (dark ? "#f1f5f9" : "#111827") : "#9ca3af",
                          boxShadow: mode === m ? "0 2px 8px rgba(0,0,0,0.08)" : "none" }}>
                        {label}
                      </button>
                    ))}
                  </div>

                  <div style={{ marginBottom: 24, textAlign: "center" }}>
                    <h2 style={{ fontSize: 24, fontWeight: 800, color: dark ? "#f1f5f9" : "#111827", letterSpacing: "-0.03em", margin: "0 0 6px" }}>
                      {mode === "login" ? "Welcome back 👋" : "Start for free 🚀"}
                    </h2>
                    <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.6 }}>
                      {mode === "login"
                        ? <Typewriter texts={["Sign in to continue building.", "Your resume is waiting for you.", "One click to your dashboard."]} />
                        : "Create your account in seconds."}
                    </p>
                  </div>

                  <GoogleButton onClick={handleGoogle} loading={gLoading} />

                  <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
                    <div style={{ flex: 1, height: 1, background: dark ? "#1e293b" : "#e5e7eb" }} />
                    <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600 }}>OR CONTINUE WITH EMAIL</span>
                    <div style={{ flex: 1, height: 1, background: dark ? "#1e293b" : "#e5e7eb" }} />
                  </div>

                  {mode === "signup" && (
                    <Input label="Full name" type="text" placeholder="Virat Kohli" icon="👤" dark={dark}
                      value={name} onChange={e => setName(e.target.value)} error={errors.name} />
                  )}
                  <Input label="Email address" type="email" placeholder="you@example.com" icon="📧" dark={dark}
                    value={email} onChange={e => setEmail(e.target.value)} error={errors.email} />
                  <Input label="Password" type="password" dark={dark} placeholder={mode === "login" ? "Your password" : "Create a strong password"} icon="🔒"
                    value={pass} onChange={e => setPass(e.target.value)} error={errors.pass} />

                  {mode === "login" && (
                    <div style={{ textAlign: "right", marginTop: -10, marginBottom: 20 }}>
                      <button onClick={() => switchMode("forgot")}
                        style={{ background: "none", border: "none", color: G[600], fontSize: 13,
                          fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                        Forgot password?
                      </button>
                      
                    </div>
                    
                  )}

                  {mode === "signup" && (
                    <p style={{ fontSize: 12.5, color: "#9ca3af", lineHeight: 1.65, marginBottom: 20, marginTop: 4 }}>
                      By creating an account you agree to our{" "}
                      <button
                        onClick={() => setLegalModal("terms")}
                        style={{
                          background: "none", border: "none", color: G[600], fontWeight: 600,
                          fontSize: 12.5, cursor: "pointer", fontFamily: "inherit",
                          padding: 0, textDecoration: "underline", textDecorationColor: `${G[400]}`,
                        }}
                      >
                        Terms
                      </button>
                      {" "}and{" "}
                      <button
                        onClick={() => setLegalModal("privacy")}
                        style={{
                          background: "none", border: "none", color: G[600], fontWeight: 600,
                          fontSize: 12.5, cursor: "pointer", fontFamily: "inherit",
                          padding: 0, textDecoration: "underline", textDecorationColor: `${G[400]}`,
                        }}
                      >
                        Privacy Policy
                      </button>
                      .
                    </p>
                  )}

                  <button onClick={handleSubmit} disabled={submitting}
                    style={{ width: "100%", padding: "15px", borderRadius: 12, border: "none",
                      background: submitting ? G[300] : `linear-gradient(135deg,${G[500]},${G[600]})`,
                      color: "#fff", fontSize: 15.5, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer",
                      fontFamily: "inherit", letterSpacing: "-0.01em", transition: "all .3s ease",
                      boxShadow: submitting ? "none" : `0 10px 32px ${G[500]}45`,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
                    onMouseEnter={e => { if (!submitting) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 14px 40px ${G[500]}55`; } }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 10px 32px ${G[500]}45`; }}>
                    {submitting
                      ? <span style={{ width: 20, height: 20, border: "2px solid rgba(255,255,255,.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .7s linear infinite", display: "inline-block" }} />
                      : mode === "login" ? "Sign In to AI Resume Builder →" : "Create My Free Account →"}
                  </button>

                  <p style={{ textAlign: "center", marginTop: 22, fontSize: 13.5, color: "#6b7280" }}>
                    {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={() => switchMode(mode === "login" ? "signup" : "login")}
                      style={{ background: "none", border: "none", color: G[600], fontWeight: 700,
                        cursor: "pointer", fontSize: 13.5, fontFamily: "inherit" }}>
                      {mode === "login" ? "Sign up free" : "Sign in"}
                    </button>
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}