import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";


 const G = { 50: "#e1e1f5", 100: "#a69fe1", 200: "#c4ddd6", 400: "#1D9E75", 500: "#0F6E56",  600: "#085041", 900: "#04342C"};

const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300;1,9..40,400&family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700;1,800&family=JetBrains+Mono:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{font-family:'DM Sans',sans-serif;background:#f0fdf4;color:#14532d;}
::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-track{background:#dcfce7;}
::-webkit-scrollbar-thumb{background:#86efac;border-radius:99px;}
::-webkit-scrollbar-thumb:hover{background:#4ade80;}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
@keyframes spin{to{transform:rotate(360deg);}}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.4;}}
@keyframes glow{0%,100%{box-shadow:0 0 12px rgba(22,163,74,0.4);}50%{box-shadow:0 0 28px rgba(22, 100, 163, 0.8);}}
@keyframes slideRight{from{opacity:0;transform:translateX(-12px);}to{opacity:1;transform:translateX(0);}}
@keyframes bounceIn{0%{transform:scale(0.85);opacity:0;}70%{transform:scale(1.03);}100%{transform:scale(1);opacity:1;}}
@keyframes shimmer{0%{background-position:-200% 0;}100%{background-position:200% 0;}}
.fade-up{animation:fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both;}
.fade-in{animation:fadeIn 0.3s ease both;}
.bounce-in{animation:bounceIn 0.45s cubic-bezier(.36,.07,.19,.97) both;}
.slide-right{animation:slideRight 0.3s ease both;}
input,textarea,select{
  font-family:'DM Sans',sans-serif;font-size:13px;
  background:#ffffff;border:1.5px solid #e8f3ec;border-radius:10px;
  padding:10px 14px;color:#14532d;width:100%;
  transition:border 0.2s,box-shadow 0.2s,background 0.2s;resize:vertical;outline:none;
  appearance:none;
}
input:focus,textarea:focus,select:focus{
  border-color:#16a34a;box-shadow:0 0 0 3px rgba(22,163,74,0.15);background:#f0fdf4;
}
input::placeholder,textarea::placeholder{color:"grey";}
label{
  display:block;font-size:10.5px;font-weight:600;color:"grey";
  letter-spacing:0.8px;text-transform:uppercase;margin-bottom:5px;
  font-family:'Space Grotesk',sans-serif;
}
button{font-family:'DM Sans',sans-serif;cursor:pointer;}
.nav-btn{transition:all 0.18s ease;}
.nav-btn:hover{background:#dcfce7 !important;}
.tpl-card{transition:all 0.22s cubic-bezier(0.16,1,0.3,1);cursor:pointer;}
.tpl-card:hover{transform:translateY(-4px);box-shadow:0 12px 32px rgba(22,163,74,0.15);}
select option{background:#ffffff;color:#14532d;}
.score-ring-enter{animation:fadeIn 0.6s ease both;}
`;

const TEMPLATES = [
  { id: "midnight", name: "Midnight", tag: "Dark Elegant", accent: "#818cf8" },
  { id: "arctic", name: "Arctic", tag: "Clean Modern", accent: "#06b6d4" },
  { id: "ember", name: "Ember", tag: "Bold & Warm", accent: "#f97316" },
  { id: "forest", name: "Forest", tag: "Nature Pro", accent: "#22c55e" },
  { id: "royal", name: "Royal", tag: "Executive", accent: "#a855f7" },
  { id: "noir", name: "Noir", tag: "ATS Minimal", accent: "#1e293b" },
  { id: "aurora", name: "Aurora", tag: "Creative", accent: "#ec4899" },
  { id: "titanium", name: "Titanium", tag: "Corporate", accent: "#64748b" },
];

const uid = () => Math.random().toString(36).slice(2, 8);

const NAV = [
  { id: "basics", label: "Basic Info", icon: "👤" },
  { id: "profile", label: "Summary", icon: "📝" },
  { id: "education", label: "Education", icon: "🎓" },
  { id: "experience", label: "Experience", icon: "💼" },
  { id: "projects", label: "Projects", icon: "🚀" },
  { id: "skills", label: "Skills", icon: "⚡" },
  { id: "languages", label: "Languages", icon: "🌍" },
  { id: "certifications", label: "Certifications", icon: "🏆" },
  { id: "achievements", label: "Achievements", icon: "🏅" },
  { id: "volunteer", label: "Volunteer", icon: "🤝" },
  { id: "publications", label: "Publications", icon: "📖" },
  { id: "references", label: "References", icon: "👥" },
];

const EMPTY_DATA = () => ({
  photo: null,
  name: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  website: "",
  profile: "",
  reference: "References available upon request.",
  education: [
    {
      id: uid(),
      institution: "",
      degree: "",
      field: "",
      startYear: "",
      endYear: "",
      description: "",
      gpa: "",
    },
  ],
  experience: [
    {
      id: uid(),
      company: "",
      startYear: "",
      endYear: "",
      title: "",
      location: "",
      bullets: "",
    },
  ],
  projects: [
    {
      id: uid(),
      startYear: "",
      endYear: "",
      title: "",
      tech: "",
      link: "",
      bullets: "",
    },
  ],
  skills: [{ id: uid(), category: "Technical", items: "" }],
  languages: [{ id: uid(), language: "", proficiency: "Fluent" }],
  certifications: [
    { id: uid(), name: "", issuer: "", year: "", credentialId: "" },
  ],
  achievements: [{ id: uid(), title: "", description: "" }],
  volunteer: [
    {
      id: uid(),
      role: "",
      organization: "",
      startYear: "",
      endYear: "",
      description: "",
    },
  ],
  publications: [{ id: uid(), title: "", publisher: "", year: "", link: "" }],
  references: [
    { id: uid(), name: "", role: "", company: "", email: "", phone: "" },
  ],
});

const parseBullets = (t) => (t ? t.split("\n").filter((l) => l.trim()) : []);

const BulletList = ({ bullets, color = "#0d3068" }) => {
  const items = parseBullets(bullets);
  if (!items.length) return null;
  return (
    <ul style={{ paddingLeft: 15, margin: "4px 0 0" }}>
      {items.map((b, i) => (
        <li
          key={i}
          style={{ fontSize: 10.5, color, lineHeight: 1.7, marginBottom: 1.5 }}
        >
          {b}
        </li>
      ))}
    </ul>
  );
};

function MidnightTemplate({ data }) {
  const ac = "#818cf8";
  const sidebar = "#111827";
  const main = "#1e1e2e";
  return (
    <div
      style={{
        fontFamily: "'DM Sans',sans-serif",
        display: "grid",
        gridTemplateColumns: "220px 1fr",
        minHeight: "297mm",
        background: main,
        color: "#e2e8f0",
      }}
    >
      <div
        style={{
          background: sidebar,
          padding: "36px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 0,
        }}
      >
        {data.photo ? (
          <img
            src={data.photo}
            alt="p"
            style={{
              width: 90,
              height: 90,
              borderRadius: "50%",
              objectFit: "cover",
              border: `3px solid ${ac}`,
              display: "block",
              margin: "0 auto 20px",
            }}
          />
        ) : (
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "#1e2744",
              border: `2px dashed ${ac}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              margin: "0 auto 20px",
            }}
          >
            👤
          </div>
        )}
        <SideHead color={ac} title="Contact" />
        {data.email && <SideInfo icon="✉" text={data.email} ac={ac} />}
        {data.phone && <SideInfo icon="📞" text={data.phone} ac={ac} />}
        {data.location && <SideInfo icon="📍" text={data.location} ac={ac} />}
        {data.linkedin && <SideInfo icon="in" text={data.linkedin} ac={ac} />}
        {data.github && <SideInfo icon="⌥" text={data.github} ac={ac} />}
        {data.website && <SideInfo icon="🌐" text={data.website} ac={ac} />}
        {data.skills?.some((s) => s.items) && (
          <>
            <SideHead color={ac} title="Skills" />
            {data.skills
              .filter((s) => s.items)
              .map((s, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  {s.category && (
                    <div
                      style={{
                        fontSize: 8.5,
                        fontWeight: 700,
                        color: ac,
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        marginBottom: 5,
                      }}
                    >
                      {s.category}
                    </div>
                  )}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {s.items
                      .split(",")
                      .map((sk) => sk.trim())
                      .filter(Boolean)
                      .map((sk, j) => (
                        <span
                          key={j}
                          style={{
                            background: "rgba(129,140,248,0.12)",
                            border: `1px solid ${ac}44`,
                            color: "#c7d2fe",
                            borderRadius: 4,
                            padding: "2px 7px",
                            fontSize: 9.5,
                          }}
                        >
                          {sk}
                        </span>
                      ))}
                  </div>
                </div>
              ))}
          </>
        )}
        {data.languages?.some((l) => l.language) && (
          <>
            <SideHead color={ac} title="Languages" />
            {data.languages
              .filter((l) => l.language)
              .map((l, i) => (
                <div key={i} style={{ marginBottom: 6 }}>
                  <div
                    style={{
                      fontSize: 10.5,
                      fontWeight: 600,
                      color: "#e2e8f0",
                    }}
                  >
                    {l.language}
                  </div>
                  {l.proficiency && (
                    <div style={{ fontSize: 9.5, color: ac }}>
                      {l.proficiency}
                    </div>
                  )}
                </div>
              ))}
          </>
        )}
        {data.certifications?.some((c) => c.name) && (
          <>
            <SideHead color={ac} title="Certifications" />
            {data.certifications
              .filter((c) => c.name)
              .map((c, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div
                    style={{
                      fontSize: 10.5,
                      fontWeight: 600,
                      color: "#e2e8f0",
                      lineHeight: 1.4,
                    }}
                  >
                    {c.name}
                  </div>
                  <div style={{ fontSize: 9.5, color: ac }}>
                    {c.issuer}
                    {c.year && ` · ${c.year}`}
                  </div>
                </div>
              ))}
          </>
        )}
      </div>
      <div style={{ padding: "36px 32px" }}>
        <div
          style={{
            marginBottom: 24,
            paddingBottom: 16,
            borderBottom: `1px solid ${ac}44`,
          }}
        >
          <div
            style={{
              fontSize: 30,
              fontWeight: 800,
              color: "#fff",
              fontFamily: "'Syne',sans-serif",
              letterSpacing: -0.5,
              lineHeight: 1.1,
            }}
          >
            {data.name || "YOUR NAME"}
          </div>
          {data.title && (
            <div
              style={{
                fontSize: 13,
                color: ac,
                marginTop: 5,
                fontWeight: 500,
                letterSpacing: 0.3,
              }}
            >
              {data.title}
            </div>
          )}
        </div>
        {data.profile && (
          <MainBlock title="Profile" icon="◈" ac={ac} dark>
            <p style={{ fontSize: 11, color: "#9ca3af", lineHeight: 1.8 }}>
              {data.profile}
            </p>
          </MainBlock>
        )}
        {data.education?.some((e) => e.institution || e.degree) && (
          <MainBlock title="Education" icon="◈" ac={ac} dark>
            {data.education
              .filter((e) => e.institution || e.degree)
              .map((e, i) => (
                <EntryCard
                  key={i}
                  ac={ac}
                  dark
                  year={`${e.startYear || ""}${e.endYear ? ` – ${e.endYear}` : ""}`}
                  title={e.degree || (e.field ? `${e.field}` : "Degree")}
                  sub={e.institution}
                  extra={e.gpa ? `GPA: ${e.gpa}` : null}
                  desc={e.description}
                />
              ))}
          </MainBlock>
        )}
        {data.experience?.some((e) => e.title) && (
          <MainBlock title="Experience" icon="◈" ac={ac} dark>
            {data.experience
              .filter((e) => e.title)
              .map((e, i) => (
                <div key={i} style={{ marginBottom: 14 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#f1f5f9",
                        }}
                      >
                        {e.title}
                      </div>
                      {e.company && (
                        <div
                          style={{ fontSize: 10.5, color: ac, fontWeight: 500 }}
                        >
                          {e.company}
                          {e.location ? ` · ${e.location}` : ""}
                        </div>
                      )}
                    </div>
                    {(e.startYear || e.endYear) && (
                      <div
                        style={{
                          fontSize: 9.5,
                          color: "#6b7280",
                          whiteSpace: "nowrap",
                          marginLeft: 8,
                          marginTop: 2,
                        }}
                      >
                        {e.startYear || ""}
                        {e.endYear ? ` – ${e.endYear}` : ""}
                      </div>
                    )}
                  </div>
                  <BulletList bullets={e.bullets} color="#9ca3af" />
                </div>
              ))}
          </MainBlock>
        )}
        {data.projects?.some((p) => p.title) && (
          <MainBlock title="Projects" icon="◈" ac={ac} dark>
            {data.projects
              .filter((p) => p.title)
              .map((p, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#f1f5f9",
                        }}
                      >
                        {p.title}
                      </div>
                      {p.tech && (
                        <div style={{ fontSize: 9.5, color: ac, marginTop: 2 }}>
                          {p.tech}
                        </div>
                      )}
                    </div>
                    {(p.startYear || p.endYear) && (
                      <div
                        style={{
                          fontSize: 9.5,
                          color: "#6b7280",
                          whiteSpace: "nowrap",
                          marginLeft: 8,
                        }}
                      >
                        {p.startYear || ""}
                        {p.endYear ? ` – ${p.endYear}` : ""}
                      </div>
                    )}
                  </div>
                  <BulletList bullets={p.bullets} color="#9ca3af" />
                </div>
              ))}
          </MainBlock>
        )}
        {data.achievements?.some((a) => a.title) && (
          <MainBlock title="Achievements" icon="◈" ac={ac} dark>
            {data.achievements
              .filter((a) => a.title)
              .map((a, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div
                    style={{
                      fontSize: 11.5,
                      fontWeight: 700,
                      color: "#f1f5f9",
                    }}
                  >
                    {a.title}
                  </div>
                  {a.description && (
                    <div
                      style={{
                        fontSize: 10.5,
                        color: "#9ca3af",
                        lineHeight: 1.6,
                      }}
                    >
                      {a.description}
                    </div>
                  )}
                </div>
              ))}
          </MainBlock>
        )}
      </div>
    </div>
  );
}

function SideHead({ color, title }) {
  return (
    <div
      style={{
        fontSize: 9,
        fontWeight: 700,
        color,
        letterSpacing: 1.5,
        textTransform: "uppercase",
        borderBottom: `1px solid ${color}44`,
        paddingBottom: 5,
        marginBottom: 10,
        marginTop: 18,
        fontFamily: "'Space Grotesk',sans-serif",
      }}
    >
      {title}
    </div>
  );
}
function SideInfo({ icon, text, ac }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 6,
        alignItems: "flex-start",
        marginBottom: 5,
      }}
    >
      <span style={{ fontSize: 9.5, color: ac, marginTop: 1, flexShrink: 0 }}>
        {icon}
      </span>
      <span
        style={{
          fontSize: 9.5,
          color: "#9ca3af",
          wordBreak: "break-all",
          lineHeight: 1.5,
        }}
      >
        {text}
      </span>
    </div>
  );
}
function MainBlock({ title, icon, ac, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 10,
        }}
      >
        <span style={{ color: ac, fontSize: 10 }}>{icon}</span>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: ac,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            fontFamily: "'Space Grotesk',sans-serif",
            flex: 1,
            borderBottom: `1px solid ${ac}33`,
            paddingBottom: 3,
          }}
        >
          {title}
        </div>
      </div>
      {children}
    </div>
  );
}
function EntryCard({ year, title, sub, extra, desc, ac, dark }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: dark ? "#f1f5f9" : "#111827",
            }}
          >
            {title}
          </div>
          {sub && (
            <div style={{ fontSize: 10.5, color: ac, fontWeight: 500 }}>
              {sub}
            </div>
          )}
          {extra && (
            <div
              style={{
                fontSize: 10,
                color: dark ? "#6b7280" : "#9ca3af",
                marginTop: 1,
              }}
            >
              {extra}
            </div>
          )}
        </div>
        {year && (
          <div
            style={{
              fontSize: 9.5,
              color: dark ? "#6b7280" : "#9ca3af",
              whiteSpace: "nowrap",
              marginLeft: 8,
              marginTop: 2,
            }}
          >
            {year}
          </div>
        )}
      </div>
      {desc && (
        <div
          style={{
            fontSize: 10.5,
            color: dark ? "#9ca3af" : "#4b5563",
            marginTop: 3,
            lineHeight: 1.6,
          }}
        >
          {desc}
        </div>
      )}
    </div>
  );
}

function ArcticTemplate({ data }) {
  const ac = "#0891b2";
  return (
    <div
      style={{
        fontFamily: "'DM Sans',sans-serif",
        display: "grid",
        gridTemplateColumns: "200px 1fr",
        minHeight: "297mm",
        background: "#fff",
      }}
    >
      <div
        style={{
          background: "#f0f9ff",
          padding: "32px 18px",
          borderRight: "1px solid #e0f2fe",
        }}
      >
        {data.photo ? (
          <img
            src={data.photo}
            alt="p"
            style={{
              width: 80,
              height: 80,
              borderRadius: 10,
              objectFit: "cover",
              border: `2px solid ${ac}`,
              display: "block",
              margin: "0 auto 18px",
            }}
          />
        ) : (
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 10,
              background: "#e0f2fe",
              border: `1.5px dashed ${ac}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              margin: "0 auto 18px",
            }}
          >
            👤
          </div>
        )}
        <ArcticSide title="Contact" color={ac}>
          {data.email && <ArcticInfo icon="✉" text={data.email} />}
          {data.phone && <ArcticInfo icon="☏" text={data.phone} />}
          {data.location && <ArcticInfo icon="◎" text={data.location} />}
          {data.linkedin && <ArcticInfo icon="in" text={data.linkedin} />}
          {data.github && <ArcticInfo icon="◯" text={data.github} />}
        </ArcticSide>
        {data.skills?.some((s) => s.items) && (
          <ArcticSide title="Skills" color={ac}>
            {data.skills
              .filter((s) => s.items)
              .map((s, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  {s.category && (
                    <div
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        color: "#0e7490",
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        marginBottom: 4,
                      }}
                    >
                      {s.category}
                    </div>
                  )}
                  {s.items
                    .split(",")
                    .map((sk) => sk.trim())
                    .filter(Boolean)
                    .map((sk, j) => (
                      <div
                        key={j}
                        style={{
                          fontSize: 10,
                          color: "#155e75",
                          padding: "2px 0",
                          borderBottom: "1px solid #cffafe",
                          marginBottom: 2,
                        }}
                      >
                        {sk}
                      </div>
                    ))}
                </div>
              ))}
          </ArcticSide>
        )}
        {data.languages?.some((l) => l.language) && (
          <ArcticSide title="Languages" color={ac}>
            {data.languages
              .filter((l) => l.language)
              .map((l, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: 5,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 600,
                      color: "#0c4a6e",
                    }}
                  >
                    {l.language}
                  </span>
                  {l.proficiency && (
                    <span style={{ fontSize: 9.5, color: ac }}>
                      {l.proficiency}
                    </span>
                  )}
                </div>
              ))}
          </ArcticSide>
        )}
        {data.certifications?.some((c) => c.name) && (
          <ArcticSide title="Certifications" color={ac}>
            {data.certifications
              .filter((c) => c.name)
              .map((c, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div
                    style={{
                      fontSize: 10.5,
                      fontWeight: 600,
                      color: "#0c4a6e",
                      lineHeight: 1.4,
                    }}
                  >
                    {c.name}
                  </div>
                  <div style={{ fontSize: 9.5, color: ac }}>
                    {c.issuer}
                    {c.year && ` · ${c.year}`}
                  </div>
                </div>
              ))}
          </ArcticSide>
        )}
      </div>
      <div style={{ padding: "32px 28px", background: "#fff" }}>
        <div style={{ marginBottom: 22 }}>
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "#0c4a6e",
              fontFamily: "'Syne',sans-serif",
              letterSpacing: -0.3,
            }}
          >
            {data.name || "YOUR NAME"}
          </div>
          {data.title && (
            <div
              style={{ fontSize: 13, color: ac, marginTop: 4, fontWeight: 500 }}
            >
              {data.title}
            </div>
          )}
          <div
            style={{
              height: 3,
              background: `linear-gradient(90deg,${ac},#67e8f9,transparent)`,
              borderRadius: 99,
              marginTop: 10,
              width: "60%",
            }}
          />
        </div>
        {data.profile && (
          <ArcticMain title="Profile" ac={ac}>
            <p style={{ fontSize: 11, color: "#374151", lineHeight: 1.8 }}>
              {data.profile}
            </p>
          </ArcticMain>
        )}
        {data.education?.some((e) => e.institution) && (
          <ArcticMain title="Education" ac={ac}>
            {data.education
              .filter((e) => e.institution)
              .map((e, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: 12,
                    paddingLeft: 12,
                    borderLeft: `2px solid ${ac}44`,
                  }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#0c4a6e",
                      }}
                    >
                      {e.degree || "Degree"} {e.field && `in ${e.field}`}
                    </div>
                    <div style={{ fontSize: 9.5, color: "#6b7280" }}>
                      {e.startYear}
                      {e.endYear && ` – ${e.endYear}`}
                    </div>
                  </div>
                  <div style={{ fontSize: 10.5, color: ac, fontWeight: 500 }}>
                    {e.institution}
                  </div>
                  {e.gpa && (
                    <div style={{ fontSize: 10, color: "#6b7280" }}>
                      GPA: {e.gpa}
                    </div>
                  )}
                  {e.description && (
                    <div
                      style={{
                        fontSize: 10.5,
                        color: "#4b5563",
                        marginTop: 2,
                        lineHeight: 1.5,
                      }}
                    >
                      {e.description}
                    </div>
                  )}
                </div>
              ))}
          </ArcticMain>
        )}
        {data.experience?.some((e) => e.title) && (
          <ArcticMain title="Experience" ac={ac}>
            {data.experience
              .filter((e) => e.title)
              .map((e, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: 14,
                    paddingLeft: 12,
                    borderLeft: `2px solid ${ac}44`,
                  }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#0c4a6e",
                      }}
                    >
                      {e.title}
                    </div>
                    <div style={{ fontSize: 9.5, color: "#6b7280" }}>
                      {e.startYear}
                      {e.endYear && ` – ${e.endYear}`}
                    </div>
                  </div>
                  {e.company && (
                    <div style={{ fontSize: 10.5, color: ac, fontWeight: 500 }}>
                      {e.company}
                      {e.location ? ` · ${e.location}` : ""}
                    </div>
                  )}
                  <BulletList bullets={e.bullets} color="#4b5563" />
                </div>
              ))}
          </ArcticMain>
        )}
        {data.projects?.some((p) => p.title) && (
          <ArcticMain title="Projects" ac={ac}>
            {data.projects
              .filter((p) => p.title)
              .map((p, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: 12,
                    paddingLeft: 12,
                    borderLeft: `2px solid ${ac}44`,
                  }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#0c4a6e",
                      }}
                    >
                      {p.title}
                    </div>
                    <div style={{ fontSize: 9.5, color: "#6b7280" }}>
                      {p.startYear}
                      {p.endYear && ` – ${p.endYear}`}
                    </div>
                  </div>
                  {p.tech && (
                    <div style={{ fontSize: 10, color: ac, marginTop: 1 }}>
                      {p.tech}
                    </div>
                  )}
                  <BulletList bullets={p.bullets} color="#4b5563" />
                </div>
              ))}
          </ArcticMain>
        )}
        {data.achievements?.some((a) => a.title) && (
          <ArcticMain title="Achievements" ac={ac}>
            {data.achievements
              .filter((a) => a.title)
              .map((a, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: 8,
                    paddingLeft: 12,
                    borderLeft: `2px solid ${ac}44`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11.5,
                      fontWeight: 700,
                      color: "#0c4a6e",
                    }}
                  >
                    {a.title}
                  </div>
                  {a.description && (
                    <div
                      style={{
                        fontSize: 10.5,
                        color: "#4b5563",
                        lineHeight: 1.6,
                      }}
                    >
                      {a.description}
                    </div>
                  )}
                </div>
              ))}
          </ArcticMain>
        )}
      </div>
    </div>
  );
}
function ArcticSide({ title, color, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div
        style={{
          fontSize: 9,
          fontWeight: 700,
          color,
          letterSpacing: 1.2,
          textTransform: "uppercase",
          marginBottom: 8,
          borderBottom: `1.5px solid ${color}`,
          paddingBottom: 4,
          fontFamily: "'Space Grotesk',sans-serif",
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}
function ArcticInfo({ icon, text }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 6,
        alignItems: "flex-start",
        marginBottom: 4,
      }}
    >
      <span
        style={{ fontSize: 9, color: "#0e7490", flexShrink: 0, marginTop: 1.5 }}
      >
        {icon}
      </span>
      <span
        style={{
          fontSize: 9.5,
          color: "#0c4a6e",
          wordBreak: "break-all",
          lineHeight: 1.5,
        }}
      >
        {text}
      </span>
    </div>
  );
}
function ArcticMain({ title, ac, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: ac,
          letterSpacing: 1,
          textTransform: "uppercase",
          marginBottom: 10,
          fontFamily: "'Space Grotesk',sans-serif",
          display: "flex",
          alignItems: "center",
          gap: 7,
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 16,
            height: 2,
            background: ac,
            borderRadius: 99,
          }}
        />
        {title}
      </div>
      {children}
    </div>
  );
}

/* ─── TEMPLATE 3: EMBER ─── */
function EmberTemplate({ data }) {
  const ac = "#f97316";
  return (
    <div
      style={{
        fontFamily: "'DM Sans',sans-serif",
        background: "#fff",
        minHeight: "297mm",
      }}
    >
      <div
        style={{
          background: `linear-gradient(135deg,#431407,#7c2d12)`,
          padding: "36px 40px",
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          gap: 24,
          alignItems: "center",
        }}
      >
        {data.photo && (
          <img
            src={data.photo}
            alt="p"
            style={{
              width: 88,
              height: 88,
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid rgba(255,255,255,0.3)",
            }}
          />
        )}
        <div>
          <div
            style={{
              fontSize: 30,
              fontWeight: 900,
              color: "#fff",
              fontFamily: "'Syne',sans-serif",
              letterSpacing: -0.5,
            }}
          >
            {data.name || "YOUR NAME"}
          </div>
          {data.title && (
            <div style={{ fontSize: 13, color: "#fed7aa", marginTop: 5 }}>
              {data.title}
            </div>
          )}
        </div>
        <div style={{ textAlign: "right" }}>
          {data.email && (
            <div style={{ fontSize: 10, color: "#fed7aa", marginBottom: 3 }}>
              ✉ {data.email}
            </div>
          )}
          {data.phone && (
            <div style={{ fontSize: 10, color: "#fed7aa", marginBottom: 3 }}>
              ☏ {data.phone}
            </div>
          )}
          {data.location && (
            <div style={{ fontSize: 10, color: "#fed7aa", marginBottom: 3 }}>
              ◎ {data.location}
            </div>
          )}
          {data.linkedin && (
            <div style={{ fontSize: 10, color: "#fed7aa", marginBottom: 3 }}>
              in {data.linkedin}
            </div>
          )}
          {data.github && (
            <div style={{ fontSize: 10, color: "#fed7aa" }}>
              ⌥ {data.github}
            </div>
          )}
        </div>
      </div>
      <div
        style={{
          padding: "28px 40px",
          display: "grid",
          gridTemplateColumns: "1fr 280px",
          gap: 32,
        }}
      >
        <div>
          {data.profile && (
            <EmberBlock title="Profile" ac={ac}>
              <p style={{ fontSize: 11, color: "#374151", lineHeight: 1.8 }}>
                {data.profile}
              </p>
            </EmberBlock>
          )}
          {data.experience?.some((e) => e.title) && (
            <EmberBlock title="Experience" ac={ac}>
              {data.experience
                .filter((e) => e.title)
                .map((e, i) => (
                  <div
                    key={i}
                    style={{
                      marginBottom: 14,
                      paddingBottom: 12,
                      borderBottom:
                        i < data.experience.length - 1
                          ? "1px dashed #fef3c7"
                          : "none",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 12.5,
                            fontWeight: 700,
                            color: "#1c1917",
                          }}
                        >
                          {e.title}
                        </div>
                        {e.company && (
                          <div
                            style={{
                              fontSize: 10.5,
                              color: ac,
                              fontWeight: 600,
                            }}
                          >
                            {e.company}
                            {e.location ? ` · ${e.location}` : ""}
                          </div>
                        )}
                      </div>
                      {(e.startYear || e.endYear) && (
                        <span
                          style={{
                            background: "#fff7ed",
                            border: "1px solid #fed7aa",
                            borderRadius: 4,
                            padding: "2px 8px",
                            fontSize: 9.5,
                            color: "#c2410c",
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {e.startYear}
                          {e.endYear && ` – ${e.endYear}`}
                        </span>
                      )}
                    </div>
                    <BulletList bullets={e.bullets} color="#4b5563" />
                  </div>
                ))}
            </EmberBlock>
          )}
          {data.projects?.some((p) => p.title) && (
            <EmberBlock title="Projects" ac={ac}>
              {data.projects
                .filter((p) => p.title)
                .map((p, i) => (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#1c1917",
                        }}
                      >
                        {p.title}
                      </div>
                      {(p.startYear || p.endYear) && (
                        <span style={{ fontSize: 9.5, color: "#9a3412" }}>
                          {p.startYear}
                          {p.endYear && ` – ${p.endYear}`}
                        </span>
                      )}
                    </div>
                    {p.tech && (
                      <div style={{ fontSize: 9.5, color: ac, marginTop: 1 }}>
                        {p.tech}
                      </div>
                    )}
                    <BulletList bullets={p.bullets} color="#4b5563" />
                  </div>
                ))}
            </EmberBlock>
          )}
        </div>
        <div>
          {data.education?.some((e) => e.institution) && (
            <EmberBlock title="Education" ac={ac}>
              {data.education
                .filter((e) => e.institution)
                .map((e, i) => (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <div
                      style={{
                        fontSize: 11.5,
                        fontWeight: 700,
                        color: "#1c1917",
                      }}
                    >
                      {e.degree}
                    </div>
                    {e.field && (
                      <div style={{ fontSize: 10.5, color: "#4b5563" }}>
                        {e.field}
                      </div>
                    )}
                    <div style={{ fontSize: 10.5, color: ac, fontWeight: 600 }}>
                      {e.institution}
                    </div>
                    <div style={{ fontSize: 9.5, color: "#6b7280" }}>
                      {e.startYear}
                      {e.endYear && ` – ${e.endYear}`}
                      {e.gpa && ` · ${e.gpa}`}
                    </div>
                  </div>
                ))}
            </EmberBlock>
          )}
          {data.skills?.some((s) => s.items) && (
            <EmberBlock title="Skills" ac={ac}>
              {data.skills
                .filter((s) => s.items)
                .map((s, i) => (
                  <div key={i} style={{ marginBottom: 10 }}>
                    {s.category && (
                      <div
                        style={{
                          fontSize: 9.5,
                          fontWeight: 700,
                          color: "#9a3412",
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                          marginBottom: 5,
                        }}
                      >
                        {s.category}
                      </div>
                    )}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {s.items
                        .split(",")
                        .map((sk) => sk.trim())
                        .filter(Boolean)
                        .map((sk, j) => (
                          <span
                            key={j}
                            style={{
                              background: "#fff7ed",
                              border: "1px solid #fed7aa",
                              color: "#9a3412",
                              borderRadius: 4,
                              padding: "2px 7px",
                              fontSize: 9.5,
                              fontWeight: 500,
                            }}
                          >
                            {sk}
                          </span>
                        ))}
                    </div>
                  </div>
                ))}
            </EmberBlock>
          )}
          {data.certifications?.some((c) => c.name) && (
            <EmberBlock title="Certifications" ac={ac}>
              {data.certifications
                .filter((c) => c.name)
                .map((c, i) => (
                  <div key={i} style={{ marginBottom: 8 }}>
                    <div
                      style={{
                        fontSize: 10.5,
                        fontWeight: 600,
                        color: "#1c1917",
                      }}
                    >
                      {c.name}
                    </div>
                    <div style={{ fontSize: 9.5, color: ac }}>
                      {c.issuer}
                      {c.year && ` · ${c.year}`}
                    </div>
                  </div>
                ))}
            </EmberBlock>
          )}
          {data.languages?.some((l) => l.language) && (
            <EmberBlock title="Languages" ac={ac}>
              {data.languages
                .filter((l) => l.language)
                .map((l, i) => (
                  <div
                    key={i}
                    style={{
                      marginBottom: 5,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10.5,
                        fontWeight: 600,
                        color: "#1c1917",
                      }}
                    >
                      {l.language}
                    </span>
                    {l.proficiency && (
                      <span style={{ fontSize: 9.5, color: ac }}>
                        {l.proficiency}
                      </span>
                    )}
                  </div>
                ))}
            </EmberBlock>
          )}
        </div>
      </div>
    </div>
  );
}
function EmberBlock({ title, ac, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 10,
        }}
      >
        <div
          style={{ width: 4, height: 18, background: ac, borderRadius: 99 }}
        />
        <div
          style={{
            fontSize: 10.5,
            fontWeight: 700,
            color: ac,
            letterSpacing: 1.2,
            textTransform: "uppercase",
            fontFamily: "'Space Grotesk',sans-serif",
          }}
        >
          {title}
        </div>
      </div>
      {children}
    </div>
  );
}

/* ─── TEMPLATE 4: FOREST ─── */
function ForestTemplate({ data }) {
  const ac = "#16a34a";
  return (
    <div
      style={{
        fontFamily: "'DM Sans',sans-serif",
        display: "grid",
        gridTemplateColumns: "1fr 200px",
        minHeight: "297mm",
        background: "#fff",
      }}
    >
      <div style={{ padding: "32px 28px", borderRight: "1px solid #dcfce7" }}>
        <div
          style={{
            marginBottom: 22,
            paddingBottom: 14,
            borderBottom: "2px solid #dcfce7",
          }}
        >
          {data.photo && (
            <img
              src={data.photo}
              alt="p"
              style={{
                width: 72,
                height: 72,
                borderRadius: 8,
                objectFit: "cover",
                float: "right",
                marginLeft: 12,
                border: `2px solid ${ac}`,
              }}
            />
          )}
          <div
            style={{
              fontSize: 28,
              fontWeight: 900,
              color: "#14532d",
              fontFamily: "'Syne',sans-serif",
              letterSpacing: -0.3,
            }}
          >
            {data.name || "YOUR NAME"}
          </div>
          {data.title && (
            <div
              style={{
                fontSize: 12.5,
                color: ac,
                marginTop: 4,
                fontWeight: 500,
              }}
            >
              {data.title}
            </div>
          )}
          <div
            style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 8 }}
          >
            {data.email && (
              <span style={{ fontSize: 9.5, color: "#166534" }}>
                ✉ {data.email}
              </span>
            )}
            {data.phone && (
              <span style={{ fontSize: 9.5, color: "#166534" }}>
                ☏ {data.phone}
              </span>
            )}
            {data.location && (
              <span style={{ fontSize: 9.5, color: "#166534" }}>
                ◎ {data.location}
              </span>
            )}
          </div>
        </div>
        {data.profile && (
          <ForestBlock title="Summary" ac={ac}>
            <p style={{ fontSize: 11, color: "#374151", lineHeight: 1.8 }}>
              {data.profile}
            </p>
          </ForestBlock>
        )}
        {data.experience?.some((e) => e.title) && (
          <ForestBlock title="Experience" ac={ac}>
            {data.experience
              .filter((e) => e.title)
              .map((e, i) => (
                <div key={i} style={{ marginBottom: 14 }}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#14532d",
                      }}
                    >
                      {e.title}
                    </div>
                    <div style={{ fontSize: 9.5, color: "#6b7280" }}>
                      {e.startYear}
                      {e.endYear && ` – ${e.endYear}`}
                    </div>
                  </div>
                  {e.company && (
                    <div style={{ fontSize: 10.5, color: ac, fontWeight: 500 }}>
                      {e.company}
                    </div>
                  )}
                  <BulletList bullets={e.bullets} color="#4b5563" />
                </div>
              ))}
          </ForestBlock>
        )}
        {data.projects?.some((p) => p.title) && (
          <ForestBlock title="Projects" ac={ac}>
            {data.projects
              .filter((p) => p.title)
              .map((p, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div
                    style={{ fontSize: 12, fontWeight: 700, color: "#14532d" }}
                  >
                    {p.title}
                  </div>
                  {p.tech && (
                    <div style={{ fontSize: 9.5, color: ac, marginTop: 2 }}>
                      {p.tech}
                    </div>
                  )}
                  <BulletList bullets={p.bullets} color="#4b5563" />
                </div>
              ))}
          </ForestBlock>
        )}
        {data.achievements?.some((a) => a.title) && (
          <ForestBlock title="Achievements" ac={ac}>
            {data.achievements
              .filter((a) => a.title)
              .map((a, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div
                    style={{ fontSize: 11, fontWeight: 700, color: "#14532d" }}
                  >
                    {a.title}
                  </div>
                  {a.description && (
                    <div style={{ fontSize: 10.5, color: "#4b5563" }}>
                      {a.description}
                    </div>
                  )}
                </div>
              ))}
          </ForestBlock>
        )}
      </div>
      <div style={{ background: "#f0fdf4", padding: "32px 18px" }}>
        {data.skills?.some((s) => s.items) && (
          <ForestSide title="Skills" ac={ac}>
            {data.skills
              .filter((s) => s.items)
              .map((s, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  {s.category && (
                    <div
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        color: ac,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        marginBottom: 4,
                      }}
                    >
                      {s.category}
                    </div>
                  )}
                  {s.items
                    .split(",")
                    .map((sk) => sk.trim())
                    .filter(Boolean)
                    .map((sk, j) => (
                      <div
                        key={j}
                        style={{
                          fontSize: 10,
                          color: "#14532d",
                          padding: "3px 0",
                          borderBottom: "1px solid #bbf7d0",
                          marginBottom: 2,
                        }}
                      >
                        {sk}
                      </div>
                    ))}
                </div>
              ))}
          </ForestSide>
        )}
        {data.education?.some((e) => e.institution) && (
          <ForestSide title="Education" ac={ac}>
            {data.education
              .filter((e) => e.institution)
              .map((e, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div
                    style={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      color: "#14532d",
                    }}
                  >
                    {e.degree}
                  </div>
                  <div style={{ fontSize: 10, color: ac }}>{e.institution}</div>
                  <div style={{ fontSize: 9.5, color: "#6b7280" }}>
                    {e.startYear}
                    {e.endYear && ` – ${e.endYear}`}
                  </div>
                </div>
              ))}
          </ForestSide>
        )}
        {data.certifications?.some((c) => c.name) && (
          <ForestSide title="Certs" ac={ac}>
            {data.certifications
              .filter((c) => c.name)
              .map((c, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div
                    style={{
                      fontSize: 10.5,
                      fontWeight: 600,
                      color: "#14532d",
                      lineHeight: 1.4,
                    }}
                  >
                    {c.name}
                  </div>
                  <div style={{ fontSize: 9.5, color: ac }}>
                    {c.issuer}
                    {c.year && ` · ${c.year}`}
                  </div>
                </div>
              ))}
          </ForestSide>
        )}
        {data.languages?.some((l) => l.language) && (
          <ForestSide title="Languages" ac={ac}>
            {data.languages
              .filter((l) => l.language)
              .map((l, i) => (
                <div key={i} style={{ marginBottom: 5 }}>
                  <div
                    style={{
                      fontSize: 10.5,
                      fontWeight: 600,
                      color: "#14532d",
                    }}
                  >
                    {l.language}
                  </div>
                  {l.proficiency && (
                    <div style={{ fontSize: 9.5, color: ac }}>
                      {l.proficiency}
                    </div>
                  )}
                </div>
              ))}
          </ForestSide>
        )}
        {data.github && (
          <ForestSide title="Links" ac={ac}>
            {data.github && (
              <div style={{ fontSize: 9.5, color: "#14532d", marginBottom: 4 }}>
                ⌥ {data.github}
              </div>
            )}
            {data.linkedin && (
              <div style={{ fontSize: 9.5, color: "#14532d", marginBottom: 4 }}>
                in {data.linkedin}
              </div>
            )}
            {data.website && (
              <div style={{ fontSize: 9.5, color: "#14532d" }}>
                🌐 {data.website}
              </div>
            )}
          </ForestSide>
        )}
      </div>
    </div>
  );
}
function ForestBlock({ title, ac, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: ac,
          letterSpacing: 1,
          textTransform: "uppercase",
          marginBottom: 9,
          fontFamily: "'Space Grotesk',sans-serif",
          paddingBottom: 4,
          borderBottom: `1.5px solid #bbf7d0`,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}
function ForestSide({ title, ac, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          fontSize: 9,
          fontWeight: 700,
          color: ac,
          letterSpacing: 1,
          textTransform: "uppercase",
          marginBottom: 8,
          paddingBottom: 4,
          borderBottom: `1px solid #bbf7d0`,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

/* ─── TEMPLATE 5: ROYAL ─── */
function RoyalTemplate({ data }) {
  const ac = "#a855f7";
  const dark = "#3b0764";
  return (
    <div
      style={{
        fontFamily: "'Cormorant Garamond',serif",
        minHeight: "297mm",
        background: "#fff",
      }}
    >
      <div
        style={{
          background: `linear-gradient(135deg,${dark},#6b21a8)`,
          padding: "40px 48px",
          textAlign: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "radial-gradient(circle at 20% 50%,rgba(255,255,255,0.05) 0%,transparent 60%),radial-gradient(circle at 80% 50%,rgba(255,255,255,0.05) 0%,transparent 60%)",
          }}
        />
        {data.photo && (
          <img
            src={data.photo}
            alt="p"
            style={{
              width: 90,
              height: 90,
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid rgba(255,255,255,0.4)",
              marginBottom: 16,
              display: "block",
              margin: "0 auto 16px",
            }}
          />
        )}
        <div
          style={{
            fontSize: 34,
            fontWeight: 700,
            color: "#fff",
            fontFamily: "'Cormorant Garamond',serif",
            letterSpacing: 2,
            fontStyle: "italic",
          }}
        >
          {data.name || "Your Name"}
        </div>
        {data.title && (
          <div
            style={{
              fontSize: 10,
              color: "#d8b4fe",
              marginTop: 6,
              letterSpacing: 3,
              textTransform: "uppercase",
              fontStyle: "normal",
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            {data.title}
          </div>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 20,
            marginTop: 14,
            flexWrap: "wrap",
          }}
        >
          {data.email && (
            <span
              style={{
                fontSize: 9.5,
                color: "#e9d5ff",
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              ✉ {data.email}
            </span>
          )}
          {data.phone && (
            <span
              style={{
                fontSize: 9.5,
                color: "#e9d5ff",
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              ☏ {data.phone}
            </span>
          )}
          {data.location && (
            <span
              style={{
                fontSize: 9.5,
                color: "#e9d5ff",
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              ◎ {data.location}
            </span>
          )}
          {data.linkedin && (
            <span
              style={{
                fontSize: 9.5,
                color: "#e9d5ff",
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              in {data.linkedin}
            </span>
          )}
        </div>
      </div>
      <div
        style={{
          padding: "28px 48px",
          display: "grid",
          gridTemplateColumns: "1fr 240px",
          gap: 32,
        }}
      >
        <div>
          {data.profile && (
            <RoyalBlock title="Profile" ac={ac}>
              <p
                style={{
                  fontSize: 11.5,
                  color: "#374151",
                  lineHeight: 1.9,
                  fontStyle: "italic",
                }}
              >
                {data.profile}
              </p>
            </RoyalBlock>
          )}
          {data.experience?.some((e) => e.title) && (
            <RoyalBlock title="Experience" ac={ac}>
              {data.experience
                .filter((e) => e.title)
                .map((e, i) => (
                  <div key={i} style={{ marginBottom: 14 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: dark,
                            fontStyle: "italic",
                          }}
                        >
                          {e.title}
                        </div>
                        {e.company && (
                          <div
                            style={{
                              fontSize: 10,
                              color: ac,
                              fontFamily: "'DM Sans',sans-serif",
                            }}
                          >
                            {e.company}
                          </div>
                        )}
                      </div>
                      {(e.startYear || e.endYear) && (
                        <span
                          style={{
                            fontSize: 9,
                            color: "#9333ea",
                            fontFamily: "'DM Sans',sans-serif",
                            fontStyle: "normal",
                          }}
                        >
                          {e.startYear}
                          {e.endYear && ` – ${e.endYear}`}
                        </span>
                      )}
                    </div>
                    <BulletList bullets={e.bullets} color="#374151" />
                  </div>
                ))}
            </RoyalBlock>
          )}
          {data.projects?.some((p) => p.title) && (
            <RoyalBlock title="Projects" ac={ac}>
              {data.projects
                .filter((p) => p.title)
                .map((p, i) => (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: dark,
                        fontStyle: "italic",
                      }}
                    >
                      {p.title}
                    </div>
                    {p.tech && (
                      <div
                        style={{
                          fontSize: 10,
                          color: ac,
                          fontFamily: "'DM Sans',sans-serif",
                          marginTop: 1,
                        }}
                      >
                        {p.tech}
                      </div>
                    )}
                    <BulletList bullets={p.bullets} color="#374151" />
                  </div>
                ))}
            </RoyalBlock>
          )}
        </div>
        <div>
          {data.education?.some((e) => e.institution) && (
            <RoyalBlock title="Education" ac={ac}>
              {data.education
                .filter((e) => e.institution)
                .map((e, i) => (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: dark,
                        fontStyle: "italic",
                      }}
                    >
                      {e.degree}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: ac,
                        fontFamily: "'DM Sans',sans-serif",
                      }}
                    >
                      {e.institution}
                    </div>
                    <div
                      style={{
                        fontSize: 9.5,
                        color: "#6b7280",
                        fontFamily: "'DM Sans',sans-serif",
                      }}
                    >
                      {e.startYear}
                      {e.endYear && ` – ${e.endYear}`}
                    </div>
                  </div>
                ))}
            </RoyalBlock>
          )}
          {data.skills?.some((s) => s.items) && (
            <RoyalBlock title="Skills" ac={ac}>
              {data.skills
                .filter((s) => s.items)
                .map((s, i) => (
                  <div key={i} style={{ marginBottom: 8 }}>
                    {s.category && (
                      <div
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          color: ac,
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                          marginBottom: 4,
                          fontFamily: "'DM Sans',sans-serif",
                        }}
                      >
                        {s.category}
                      </div>
                    )}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {s.items
                        .split(",")
                        .map((sk) => sk.trim())
                        .filter(Boolean)
                        .map((sk, j) => (
                          <span
                            key={j}
                            style={{
                              background: "#faf5ff",
                              border: "1px solid #e9d5ff",
                              color: dark,
                              borderRadius: 3,
                              padding: "1px 7px",
                              fontSize: 9.5,
                              fontFamily: "'DM Sans',sans-serif",
                            }}
                          >
                            {sk}
                          </span>
                        ))}
                    </div>
                  </div>
                ))}
            </RoyalBlock>
          )}
          {data.certifications?.some((c) => c.name) && (
            <RoyalBlock title="Certifications" ac={ac}>
              {data.certifications
                .filter((c) => c.name)
                .map((c, i) => (
                  <div key={i} style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: dark }}>
                      {c.name}
                    </div>
                    <div
                      style={{
                        fontSize: 9.5,
                        color: ac,
                        fontFamily: "'DM Sans',sans-serif",
                      }}
                    >
                      {c.issuer}
                      {c.year && ` · ${c.year}`}
                    </div>
                  </div>
                ))}
            </RoyalBlock>
          )}
          {data.languages?.some((l) => l.language) && (
            <RoyalBlock title="Languages" ac={ac}>
              {data.languages
                .filter((l) => l.language)
                .map((l, i) => (
                  <div
                    key={i}
                    style={{
                      marginBottom: 5,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{ fontSize: 11, fontWeight: 600, color: dark }}
                    >
                      {l.language}
                    </span>
                    {l.proficiency && (
                      <span
                        style={{
                          fontSize: 9.5,
                          color: ac,
                          fontFamily: "'DM Sans',sans-serif",
                        }}
                      >
                        {l.proficiency}
                      </span>
                    )}
                  </div>
                ))}
            </RoyalBlock>
          )}
        </div>
      </div>
    </div>
  );
}
function RoyalBlock({ title, ac, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: ac,
          letterSpacing: 2,
          textTransform: "uppercase",
          marginBottom: 9,
          fontFamily: "'DM Sans',sans-serif",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontFamily: "'Cormorant Garamond',serif",
            fontStyle: "italic",
            color: ac,
          }}
        >
          —
        </span>{" "}
        {title}
      </div>
      {children}
    </div>
  );
}

/* ─── TEMPLATE 6: NOIR ─── */
function NoirTemplate({ data }) {
  return (
    <div
      style={{
        fontFamily: "'DM Sans',sans-serif",
        background: "#fff",
        padding: "40px 48px",
        minHeight: "297mm",
        color: "#111827",
      }}
    >
      <div
        style={{
          borderBottom: "2px solid #111827",
          paddingBottom: 16,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#111827",
            letterSpacing: -0.5,
          }}
        >
          {data.name || "YOUR NAME"}
        </div>
        {data.title && (
          <div style={{ fontSize: 12, color: "#374151", marginTop: 3 }}>
            {data.title}
          </div>
        )}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 18,
            marginTop: 8,
            fontSize: 10.5,
            color: "#4b5563",
          }}
        >
          {data.email && <span>✉ {data.email}</span>}
          {data.phone && <span>☏ {data.phone}</span>}
          {data.location && <span>◎ {data.location}</span>}
          {data.linkedin && <span>in {data.linkedin}</span>}
          {data.github && <span>⌥ {data.github}</span>}
          {data.website && <span>🌐 {data.website}</span>}
        </div>
      </div>
      {data.profile && (
        <NoirBlock title="SUMMARY">
          <p style={{ fontSize: 11, color: "#374151", lineHeight: 1.8 }}>
            {data.profile}
          </p>
        </NoirBlock>
      )}
      {data.experience?.some((e) => e.title) && (
        <NoirBlock title="EXPERIENCE">
          {data.experience
            .filter((e) => e.title)
            .map((e, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div
                    style={{ fontWeight: 700, fontSize: 12, color: "#111827" }}
                  >
                    {e.title}
                    {e.company && (
                      <span style={{ fontWeight: 400, color: "#374151" }}>
                        {" "}
                        · {e.company}
                      </span>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      color: "#6b7280",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {e.startYear}
                    {e.endYear && ` – ${e.endYear}`}
                  </span>
                </div>
                {e.location && (
                  <div style={{ fontSize: 10, color: "#6b7280" }}>
                    {e.location}
                  </div>
                )}
                <BulletList bullets={e.bullets} color="#374151" />
              </div>
            ))}
        </NoirBlock>
      )}
      {data.education?.some((e) => e.institution) && (
        <NoirBlock title="EDUCATION">
          {data.education
            .filter((e) => e.institution)
            .map((e, i) => (
              <div
                key={i}
                style={{
                  marginBottom: 10,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <div
                    style={{ fontWeight: 700, fontSize: 12, color: "#111827" }}
                  >
                    {e.degree}
                    {e.field && ` in ${e.field}`}
                  </div>
                  <div style={{ fontSize: 11, color: "#374151" }}>
                    {e.institution}
                    {e.gpa && ` · GPA: ${e.gpa}`}
                  </div>
                  {e.description && (
                    <div style={{ fontSize: 10.5, color: "#4b5563" }}>
                      {e.description}
                    </div>
                  )}
                </div>
                <span
                  style={{
                    fontSize: 10,
                    color: "#6b7280",
                    whiteSpace: "nowrap",
                    marginLeft: 8,
                  }}
                >
                  {e.startYear}
                  {e.endYear && ` – ${e.endYear}`}
                </span>
              </div>
            ))}
        </NoirBlock>
      )}
      {data.skills?.some((s) => s.items) && (
        <NoirBlock title="SKILLS">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 20px" }}>
            {data.skills
              .filter((s) => s.items)
              .map((s, i) => (
                <span key={i} style={{ fontSize: 11, color: "#374151" }}>
                  {s.category && (
                    <strong style={{ color: "#111827" }}>{s.category}: </strong>
                  )}
                  {s.items}
                </span>
              ))}
          </div>
        </NoirBlock>
      )}
      {data.projects?.some((p) => p.title) && (
        <NoirBlock title="PROJECTS">
          {data.projects
            .filter((p) => p.title)
            .map((p, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div
                  style={{ fontWeight: 700, fontSize: 12, color: "#111827" }}
                >
                  {p.title}
                  {p.tech && (
                    <span
                      style={{
                        fontWeight: 400,
                        color: "#374151",
                        fontSize: 11,
                      }}
                    >
                      {" "}
                      · {p.tech}
                    </span>
                  )}
                </div>
                <BulletList bullets={p.bullets} color="#374151" />
              </div>
            ))}
        </NoirBlock>
      )}
      {data.certifications?.some((c) => c.name) && (
        <NoirBlock title="CERTIFICATIONS">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 24px" }}>
            {data.certifications
              .filter((c) => c.name)
              .map((c, i) => (
                <span key={i} style={{ fontSize: 11, color: "#374151" }}>
                  {c.name}
                  {c.issuer && ` – ${c.issuer}`}
                  {c.year && ` (${c.year})`}
                </span>
              ))}
          </div>
        </NoirBlock>
      )}
      {(data.achievements?.some((a) => a.title) ||
        data.languages?.some((l) => l.language)) && (
        <NoirBlock title="ADDITIONAL">
          {data.achievements
            ?.filter((a) => a.title)
            .map((a, i) => (
              <div
                key={i}
                style={{ fontSize: 11, color: "#374151", marginBottom: 3 }}
              >
                <strong style={{ color: "#111827" }}>{a.title}:</strong>{" "}
                {a.description}
              </div>
            ))}
          {data.languages?.some((l) => l.language) && (
            <div style={{ fontSize: 11, color: "#374151", marginTop: 4 }}>
              <strong style={{ color: "#111827" }}>Languages: </strong>
              {data.languages
                .filter((l) => l.language)
                .map(
                  (l) =>
                    `${l.language}${l.proficiency ? ` (${l.proficiency})` : ""}`,
                )
                .join(", ")}
            </div>
          )}
        </NoirBlock>
      )}
    </div>
  );
}
function NoirBlock({ title, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          fontSize: 9.5,
          fontWeight: 700,
          color: "#111827",
          letterSpacing: 2,
          marginBottom: 8,
          borderBottom: "1px solid #e5e7eb",
          paddingBottom: 4,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

/* ─── TEMPLATE 7: AURORA ─── */
function AuroraTemplate({ data }) {
  const ac = "#ec4899";
  const dark = "#500724";
  return (
    <div
      style={{
        fontFamily: "'DM Sans',sans-serif",
        minHeight: "297mm",
        background: "#fff",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg,#831843,#9d174d,#be185d)",
          padding: "32px 40px",
          display: "flex",
          gap: 24,
          alignItems: "center",
        }}
      >
        {data.photo ? (
          <img
            src={data.photo}
            alt="p"
            style={{
              width: 90,
              height: 90,
              borderRadius: 16,
              objectFit: "cover",
              border: "3px solid rgba(255,255,255,0.4)",
              flexShrink: 0,
            }}
          />
        ) : (
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 16,
              background: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              flexShrink: 0,
            }}
          >
            👤
          </div>
        )}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 30,
              fontWeight: 900,
              color: "#fff",
              fontFamily: "'Syne',sans-serif",
              letterSpacing: -0.5,
            }}
          >
            {data.name || "YOUR NAME"}
          </div>
          {data.title && (
            <div
              style={{
                fontSize: 12,
                color: "#fce7f3",
                marginTop: 4,
                fontWeight: 400,
              }}
            >
              {data.title}
            </div>
          )}
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          {data.email && (
            <div style={{ fontSize: 9.5, color: "#fce7f3", marginBottom: 3 }}>
              ✉ {data.email}
            </div>
          )}
          {data.phone && (
            <div style={{ fontSize: 9.5, color: "#fce7f3", marginBottom: 3 }}>
              ☏ {data.phone}
            </div>
          )}
          {data.location && (
            <div style={{ fontSize: 9.5, color: "#fce7f3", marginBottom: 3 }}>
              ◎ {data.location}
            </div>
          )}
          {data.linkedin && (
            <div style={{ fontSize: 9.5, color: "#fce7f3" }}>
              in {data.linkedin}
            </div>
          )}
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 230px",
          minHeight: "calc(297mm - 130px)",
        }}
      >
        <div style={{ padding: "28px 32px", borderRight: "1px solid #fce7f3" }}>
          {data.profile && (
            <AuroraBlock title="About Me" ac={ac}>
              <p style={{ fontSize: 11, color: "#374151", lineHeight: 1.8 }}>
                {data.profile}
              </p>
            </AuroraBlock>
          )}
          {data.experience?.some((e) => e.title) && (
            <AuroraBlock title="Work Experience" ac={ac}>
              {data.experience
                .filter((e) => e.title)
                .map((e, i) => (
                  <div
                    key={i}
                    style={{
                      marginBottom: 14,
                      paddingBottom: 12,
                      borderBottom:
                        i < data.experience.filter((e) => e.title).length - 1
                          ? "1px solid #fce7f3"
                          : "none",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 12.5,
                            fontWeight: 700,
                            color: "#500724",
                          }}
                        >
                          {e.title}
                        </div>
                        {e.company && (
                          <div
                            style={{
                              fontSize: 10.5,
                              color: ac,
                              fontWeight: 500,
                            }}
                          >
                            {e.company}
                            {e.location ? ` · ${e.location}` : ""}
                          </div>
                        )}
                      </div>
                      {(e.startYear || e.endYear) && (
                        <span
                          style={{
                            background: "#fff1f2",
                            border: "1px solid #fecdd3",
                            borderRadius: 4,
                            padding: "2px 8px",
                            fontSize: 9.5,
                            color: dark,
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {e.startYear}
                          {e.endYear && ` – ${e.endYear}`}
                        </span>
                      )}
                    </div>
                    <BulletList bullets={e.bullets} color="#4b5563" />
                  </div>
                ))}
            </AuroraBlock>
          )}
          {data.projects?.some((p) => p.title) && (
            <AuroraBlock title="Projects" ac={ac}>
              {data.projects
                .filter((p) => p.title)
                .map((p, i) => (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#500724",
                        }}
                      >
                        {p.title}
                      </div>
                      {(p.startYear || p.endYear) && (
                        <span style={{ fontSize: 9.5, color: "#9d174d" }}>
                          {p.startYear}
                          {p.endYear && ` – ${p.endYear}`}
                        </span>
                      )}
                    </div>
                    {p.tech && (
                      <div style={{ fontSize: 9.5, color: ac, marginTop: 1 }}>
                        {p.tech}
                      </div>
                    )}
                    <BulletList bullets={p.bullets} color="#4b5563" />
                  </div>
                ))}
            </AuroraBlock>
          )}
        </div>
        <div style={{ background: "#fff1f2", padding: "28px 20px" }}>
          {data.education?.some((e) => e.institution) && (
            <AuroraSide title="Education" ac={ac}>
              {data.education
                .filter((e) => e.institution)
                .map((e, i) => (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#500724",
                        lineHeight: 1.4,
                      }}
                    >
                      {e.degree}
                    </div>
                    {e.field && (
                      <div style={{ fontSize: 10, color: "#6b7280" }}>
                        {e.field}
                      </div>
                    )}
                    <div style={{ fontSize: 10.5, color: ac, fontWeight: 500 }}>
                      {e.institution}
                    </div>
                    <div style={{ fontSize: 9.5, color: "#6b7280" }}>
                      {e.startYear}
                      {e.endYear && ` – ${e.endYear}`}
                      {e.gpa && ` · ${e.gpa}`}
                    </div>
                  </div>
                ))}
            </AuroraSide>
          )}
          {data.skills?.some((s) => s.items) && (
            <AuroraSide title="Skills" ac={ac}>
              {data.skills
                .filter((s) => s.items)
                .map((s, i) => (
                  <div key={i} style={{ marginBottom: 9 }}>
                    {s.category && (
                      <div
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          color: "#9d174d",
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                          marginBottom: 4,
                        }}
                      >
                        {s.category}
                      </div>
                    )}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {s.items
                        .split(",")
                        .map((sk) => sk.trim())
                        .filter(Boolean)
                        .map((sk, j) => (
                          <span
                            key={j}
                            style={{
                              background: "#fff",
                              border: "1px solid #fecdd3",
                              color: "#9d174d",
                              borderRadius: 4,
                              padding: "1px 7px",
                              fontSize: 9.5,
                            }}
                          >
                            {sk}
                          </span>
                        ))}
                    </div>
                  </div>
                ))}
            </AuroraSide>
          )}
          {data.certifications?.some((c) => c.name) && (
            <AuroraSide title="Certifications" ac={ac}>
              {data.certifications
                .filter((c) => c.name)
                .map((c, i) => (
                  <div key={i} style={{ marginBottom: 8 }}>
                    <div
                      style={{
                        fontSize: 10.5,
                        fontWeight: 600,
                        color: "#500724",
                        lineHeight: 1.4,
                      }}
                    >
                      {c.name}
                    </div>
                    <div style={{ fontSize: 9.5, color: ac }}>
                      {c.issuer}
                      {c.year && ` · ${c.year}`}
                    </div>
                  </div>
                ))}
            </AuroraSide>
          )}
          {data.languages?.some((l) => l.language) && (
            <AuroraSide title="Languages" ac={ac}>
              {data.languages
                .filter((l) => l.language)
                .map((l, i) => (
                  <div
                    key={i}
                    style={{
                      marginBottom: 5,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10.5,
                        fontWeight: 600,
                        color: "#500724",
                      }}
                    >
                      {l.language}
                    </span>
                    {l.proficiency && (
                      <span style={{ fontSize: 9.5, color: ac }}>
                        {l.proficiency}
                      </span>
                    )}
                  </div>
                ))}
            </AuroraSide>
          )}
          {data.achievements?.some((a) => a.title) && (
            <AuroraSide title="Achievements" ac={ac}>
              {data.achievements
                .filter((a) => a.title)
                .map((a, i) => (
                  <div key={i} style={{ marginBottom: 7 }}>
                    <div
                      style={{
                        fontSize: 10.5,
                        fontWeight: 600,
                        color: "#500724",
                      }}
                    >
                      {a.title}
                    </div>
                    {a.description && (
                      <div
                        style={{
                          fontSize: 9.5,
                          color: "#4b5563",
                          lineHeight: 1.5,
                        }}
                      >
                        {a.description}
                      </div>
                    )}
                  </div>
                ))}
            </AuroraSide>
          )}
        </div>
      </div>
    </div>
  );
}
function AuroraBlock({ title, ac, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: ac,
          letterSpacing: 1.2,
          textTransform: "uppercase",
          marginBottom: 9,
          fontFamily: "'Space Grotesk',sans-serif",
          paddingBottom: 4,
          borderBottom: `1.5px solid #fecdd3`,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}
function AuroraSide({ title, ac, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          fontSize: 9,
          fontWeight: 700,
          color: ac,
          letterSpacing: 1,
          textTransform: "uppercase",
          marginBottom: 8,
          paddingBottom: 4,
          borderBottom: `1px solid #fecdd3`,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

/* ─── TEMPLATE 8: TITANIUM ─── */
function TitaniumTemplate({ data }) {
  const ac = "#475569";
  return (
    <div
      style={{
        fontFamily: "'DM Sans',sans-serif",
        display: "grid",
        gridTemplateColumns: "210px 1fr",
        minHeight: "297mm",
        background: "#fff",
      }}
    >
      <div style={{ background: "#1e293b", padding: "32px 18px" }}>
        {data.photo ? (
          <img
            src={data.photo}
            alt="p"
            style={{
              width: 84,
              height: 84,
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid #475569",
              display: "block",
              margin: "0 auto 20px",
            }}
          />
        ) : (
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: "50%",
              background: "#334155",
              border: "2px dashed #475569",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              margin: "0 auto 20px",
            }}
          >
            👤
          </div>
        )}
        <TitanSide title="Contact" ac={ac}>
          {data.email && (
            <div
              style={{
                fontSize: 9.5,
                color: "#94a3b8",
                marginBottom: 4,
                wordBreak: "break-all",
              }}
            >
              ✉ {data.email}
            </div>
          )}
          {data.phone && (
            <div style={{ fontSize: 9.5, color: "#94a3b8", marginBottom: 4 }}>
              ☏ {data.phone}
            </div>
          )}
          {data.location && (
            <div style={{ fontSize: 9.5, color: "#94a3b8", marginBottom: 4 }}>
              ◎ {data.location}
            </div>
          )}
          {data.linkedin && (
            <div
              style={{
                fontSize: 9.5,
                color: "#94a3b8",
                marginBottom: 4,
                wordBreak: "break-all",
              }}
            >
              in {data.linkedin}
            </div>
          )}
          {data.github && (
            <div
              style={{
                fontSize: 9.5,
                color: "#94a3b8",
                wordBreak: "break-all",
              }}
            >
              ⌥ {data.github}
            </div>
          )}
        </TitanSide>
        {data.skills?.some((s) => s.items) && (
          <TitanSide title="Skills" ac={ac}>
            {data.skills
              .filter((s) => s.items)
              .map((s, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  {s.category && (
                    <div
                      style={{
                        fontSize: 8.5,
                        fontWeight: 700,
                        color: "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        marginBottom: 4,
                      }}
                    >
                      {s.category}
                    </div>
                  )}
                  {s.items
                    .split(",")
                    .map((sk) => sk.trim())
                    .filter(Boolean)
                    .map((sk, j) => (
                      <div
                        key={j}
                        style={{
                          fontSize: 9.5,
                          color: "#cbd5e1",
                          padding: "2px 0",
                          borderBottom: "1px solid #2d3748",
                          marginBottom: 2,
                        }}
                      >
                        {sk}
                      </div>
                    ))}
                </div>
              ))}
          </TitanSide>
        )}
        {data.languages?.some((l) => l.language) && (
          <TitanSide title="Languages" ac={ac}>
            {data.languages
              .filter((l) => l.language)
              .map((l, i) => (
                <div key={i} style={{ marginBottom: 5 }}>
                  <div
                    style={{ fontSize: 10, fontWeight: 600, color: "#e2e8f0" }}
                  >
                    {l.language}
                  </div>
                  {l.proficiency && (
                    <div style={{ fontSize: 9.5, color: "#64748b" }}>
                      {l.proficiency}
                    </div>
                  )}
                </div>
              ))}
          </TitanSide>
        )}
        {data.certifications?.some((c) => c.name) && (
          <TitanSide title="Certifications" ac={ac}>
            {data.certifications
              .filter((c) => c.name)
              .map((c, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: "#e2e8f0",
                      lineHeight: 1.4,
                    }}
                  >
                    {c.name}
                  </div>
                  <div style={{ fontSize: 9.5, color: "#64748b" }}>
                    {c.issuer}
                    {c.year && ` · ${c.year}`}
                  </div>
                </div>
              ))}
          </TitanSide>
        )}
      </div>
      <div style={{ padding: "32px 28px" }}>
        <div
          style={{
            marginBottom: 22,
            paddingBottom: 14,
            borderBottom: "2px solid #e2e8f0",
          }}
        >
          <div
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: "#0f172a",
              fontFamily: "'Syne',sans-serif",
              letterSpacing: -0.3,
            }}
          >
            {data.name || "YOUR NAME"}
          </div>
          {data.title && (
            <div
              style={{
                fontSize: 10,
                color: "#475569",
                marginTop: 4,
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: 0.8,
              }}
            >
              {data.title}
            </div>
          )}
        </div>
        {data.profile && (
          <TitanMain title="Professional Summary" ac={ac}>
            <p style={{ fontSize: 11, color: "#374151", lineHeight: 1.8 }}>
              {data.profile}
            </p>
          </TitanMain>
        )}
        {data.education?.some((e) => e.institution) && (
          <TitanMain title="Education" ac={ac}>
            {data.education
              .filter((e) => e.institution)
              .map((e, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: 12,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#0f172a",
                      }}
                    >
                      {e.degree}
                      {e.field && ` in ${e.field}`}
                    </div>
                    <div style={{ fontSize: 10.5, color: ac }}>
                      {e.institution}
                    </div>
                    {e.description && (
                      <div style={{ fontSize: 10, color: "#6b7280" }}>
                        {e.description}
                      </div>
                    )}
                  </div>
                  <div
                    style={{ textAlign: "right", flexShrink: 0, marginLeft: 8 }}
                  >
                    <div style={{ fontSize: 10, color: "#6b7280" }}>
                      {e.startYear}
                      {e.endYear && ` – ${e.endYear}`}
                    </div>
                    {e.gpa && (
                      <div style={{ fontSize: 10, color: "#475569" }}>
                        GPA: {e.gpa}
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </TitanMain>
        )}
        {data.experience?.some((e) => e.title) && (
          <TitanMain title="Work Experience" ac={ac}>
            {data.experience
              .filter((e) => e.title)
              .map((e, i) => (
                <div key={i} style={{ marginBottom: 14 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#0f172a",
                        }}
                      >
                        {e.title}
                      </div>
                      {e.company && (
                        <div style={{ fontSize: 10.5, color: ac }}>
                          {e.company}
                          {e.location ? ` · ${e.location}` : ""}
                        </div>
                      )}
                    </div>
                    {(e.startYear || e.endYear) && (
                      <span
                        style={{
                          background: "#f1f5f9",
                          border: "1px solid #e2e8f0",
                          borderRadius: 4,
                          padding: "2px 8px",
                          fontSize: 9.5,
                          color: "#475569",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {e.startYear}
                        {e.endYear && ` – ${e.endYear}`}
                      </span>
                    )}
                  </div>
                  <BulletList bullets={e.bullets} color="#374151" />
                </div>
              ))}
          </TitanMain>
        )}
        {data.projects?.some((p) => p.title) && (
          <TitanMain title="Projects" ac={ac}>
            {data.projects
              .filter((p) => p.title)
              .map((p, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#0f172a",
                      }}
                    >
                      {p.title}
                    </div>
                    {(p.startYear || p.endYear) && (
                      <span style={{ fontSize: 9.5, color: "#6b7280" }}>
                        {p.startYear}
                        {p.endYear && ` – ${p.endYear}`}
                      </span>
                    )}
                  </div>
                  {p.tech && (
                    <div style={{ fontSize: 10, color: ac, marginTop: 1 }}>
                      {p.tech}
                    </div>
                  )}
                  <BulletList bullets={p.bullets} color="#374151" />
                </div>
              ))}
          </TitanMain>
        )}
        {data.achievements?.some((a) => a.title) && (
          <TitanMain title="Achievements" ac={ac}>
            {data.achievements
              .filter((a) => a.title)
              .map((a, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div
                    style={{ fontSize: 11, fontWeight: 700, color: "#0f172a" }}
                  >
                    {a.title}
                  </div>
                  {a.description && (
                    <div style={{ fontSize: 10.5, color: "#4b5563" }}>
                      {a.description}
                    </div>
                  )}
                </div>
              ))}
          </TitanMain>
        )}
      </div>
    </div>
  );
}
function TitanSide({ title, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          fontSize: 8.5,
          fontWeight: 700,
          color: "#64748b",
          letterSpacing: 1.5,
          textTransform: "uppercase",
          marginBottom: 8,
          paddingBottom: 4,
          borderBottom: "1px solid #334155",
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}
function TitanMain({ title, ac, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: ac,
          letterSpacing: 1.5,
          textTransform: "uppercase",
          marginBottom: 9,
          paddingBottom: 4,
          borderBottom: "1.5px solid #e2e8f0",
          fontFamily: "'Space Grotesk',sans-serif",
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

const RENDERERS = {
  midnight: MidnightTemplate,
  arctic: ArcticTemplate,
  ember: EmberTemplate,
  forest: ForestTemplate,
  royal: RoyalTemplate,
  noir: NoirTemplate,
  aurora: AuroraTemplate,
  titanium: TitaniumTemplate,
};
function ResumeRender({ data, tpl }) {
  const Comp = RENDERERS[tpl] || MidnightTemplate;
  return <Comp data={data} />;
}

/* ══════════════════════════════════════════════════════
   AI ANALYZER
══════════════════════════════════════════════════════ */
const TECH_KEYWORDS = [
  "javascript",
  "python",
  "react",
  "node",
  "java",
  "sql",
  "html",
  "css",
  "typescript",
  "aws",
  "docker",
  "kubernetes",
  "git",
  "mongodb",
  "postgresql",
  "rest",
  "api",
  "agile",
  "scrum",
  "linux",
  "machine learning",
  "data analysis",
  "cloud",
  "devops",
  "ci/cd",
  "testing",
  "angular",
  "vue",
  "php",
  "c++",
  "c#",
  ".net",
  "spring",
  "django",
  "flask",
  "tensorflow",
  "pytorch",
  "graphql",
  "microservices",
  "redis",
  "elasticsearch",
  "kafka",
  "spark",
  "hadoop",
  "tableau",
  "power bi",
  "figma",
  "sketch",
  "swift",
  "kotlin",
  "flutter",
  "firebase",
  "azure",
  "gcp",
  "terraform",
  "ansible",
];
const ACTION_VERBS = [
  "led",
  "built",
  "developed",
  "implemented",
  "created",
  "designed",
  "managed",
  "improved",
  "increased",
  "reduced",
  "delivered",
  "launched",
  "optimized",
  "automated",
  "streamlined",
  "achieved",
  "collaborated",
  "coordinated",
  "established",
  "generated",
  "spearheaded",
  "transformed",
  "architected",
  "pioneered",
  "executed",
  "oversaw",
];

function analyzeResume(text) {
  const lower = text.toLowerCase();
  const wordCount = lower.split(/\s+/).length;
  const hasEmail = /[\w.-]+@[\w.-]+\.\w{2,}/.test(text);
  const hasPhone = /(\+?\d[\d\s\-().]{7,})/.test(text);
  const hasSummary = /summary|profile|objective|about/i.test(text);
  const hasExperience = /experience|work|employment|intern/i.test(text);
  const hasEducation =
    /education|degree|university|college|bachelor|master/i.test(text);
  const hasSkills = /skills|technologies|tools|stack/i.test(text);
  const hasProjects = /project/i.test(text);
  const hasCerts = /certif/i.test(text);
  const hasAchievements = /achievement|award|honor/i.test(text);
  const hasLinkedIn = /linkedin/i.test(text);
  const hasGithub = /github/i.test(text);
  const matchedKeywords = TECH_KEYWORDS.filter((kw) => lower.includes(kw));
  const matchedVerbs = ACTION_VERBS.filter((v) => lower.includes(v));
  const hasMeasurables =
    /\d+%|\d+x|increased by|reduced by|\$[\d,]+|million|thousand/i.test(text);
  const contactScore =
    (hasEmail ? 25 : 0) +
    (hasPhone ? 25 : 0) +
    (hasLinkedIn ? 25 : 0) +
    (hasGithub ? 25 : 0);
  const skillsScore = hasSkills
    ? matchedKeywords.length >= 8
      ? 90
      : matchedKeywords.length >= 4
        ? 70
        : 50
    : 10;
  const expScore = hasExperience
    ? matchedVerbs.length >= 3
      ? 90
      : matchedVerbs.length >= 1
        ? 70
        : 50
    : 10;
  const atsScore = Math.round(
    (hasEmail ? 10 : 0) +
      (hasPhone ? 10 : 0) +
      (hasSkills ? 15 : 0) +
      (hasExperience ? 15 : 0) +
      (hasEducation ? 10 : 0) +
      Math.min(20, (matchedKeywords.length / 15) * 20) +
      Math.min(10, (matchedVerbs.length / 8) * 10) +
      (wordCount > 200 ? 10 : 5),
  );
  const contentScore = Math.min(
    100,
    Math.round(
      ((hasSummary ? 15 : 0) +
        (hasMeasurables ? 20 : 0) +
        Math.min(25, (matchedVerbs.length / 8) * 25) +
        (hasProjects ? 15 : 0) +
        (hasCerts ? 10 : 0) +
        (hasAchievements ? 15 : 0)) *
        1.1,
    ),
  );
  const overallScore = Math.min(
    100,
    Math.round(
      atsScore * 0.3 +
        contentScore * 0.25 +
        skillsScore * 0.2 +
        expScore * 0.15 +
        contactScore * 0.1,
    ),
  );
  const grade =
    overallScore >= 90
      ? "A+"
      : overallScore >= 80
        ? "A"
        : overallScore >= 70
          ? "B+"
          : overallScore >= 60
            ? "B"
            : overallScore >= 50
              ? "C+"
              : "C";
  const issues = [];
  if (!hasEmail)
    issues.push({ type: "critical", text: "Missing email address." });
  if (!hasPhone)
    issues.push({ type: "critical", text: "Missing phone number." });
  if (!hasExperience)
    issues.push({ type: "critical", text: "No experience section detected." });
  if (!hasSkills)
    issues.push({
      type: "critical",
      text: "No skills section found — critical for ATS.",
    });
  if (!hasSummary)
    issues.push({
      type: "warning",
      text: "No professional summary — add a 3–4 sentence intro.",
    });
  if (!hasProjects)
    issues.push({
      type: "warning",
      text: "No projects section — important for freshers.",
    });
  if (wordCount < 150)
    issues.push({
      type: "warning",
      text: `Resume is very short (${wordCount} words) — aim 300–600.`,
    });
  if (matchedKeywords.length < 5)
    issues.push({
      type: "warning",
      text: "Low keyword density — ATS may rank you lower.",
    });
  if (matchedVerbs.length < 3)
    issues.push({
      type: "warning",
      text: "Weak action verbs — use 'Led', 'Built', 'Optimized'.",
    });
  if (!hasMeasurables)
    issues.push({
      type: "suggestion",
      text: "Add measurable results (e.g. 'Improved speed by 40%').",
    });
  if (!hasCerts)
    issues.push({
      type: "suggestion",
      text: "Include certifications to stand out.",
    });
  if (!hasLinkedIn)
    issues.push({ type: "suggestion", text: "Add your LinkedIn profile URL." });
  if (!hasGithub)
    issues.push({ type: "suggestion", text: "Add your GitHub profile URL." });
  issues.push({
    type: "suggestion",
    text: "Tailor keywords to each job description.",
  });
  const strengths = [
    hasEmail && hasPhone && "Complete contact information",
    hasExperience &&
      matchedVerbs.length >= 2 &&
      "Strong action verbs in experience",
    matchedKeywords.length >= 6 &&
      `${matchedKeywords.length} tech keywords found`,
    hasProjects && "Projects section present",
    hasMeasurables && "Measurable achievements — excellent!",
  ].filter(Boolean);
  return {
    overallScore,
    atsScore: Math.min(100, atsScore),
    contentScore,
    skillsScore,
    expScore,
    contactScore,
    grade,
    wordCount,
    matchedKeywords: matchedKeywords.slice(0, 14),
    missingKeywords: TECH_KEYWORDS.filter((k) => !lower.includes(k)).slice(
      0,
      10,
    ),
    issues,
    criticalCount: issues.filter((i) => i.type === "critical").length,
    warningCount: issues.filter((i) => i.type === "warning").length,
    suggestionCount: issues.filter((i) => i.type === "suggestion").length,
    strengths,
    sections: {
      contact: contactScore,
      summary: hasSummary ? 80 : 10,
      experience: expScore,
      education: hasEducation ? 85 : 20,
      skills: skillsScore,
      projects: hasProjects ? 75 : 20,
    },
  };
}

const SCAN_STEPS = [
  "Reading resume content…",
  "Extracting personal information…",
  "Analyzing skills & keywords…",
  "Checking ATS compatibility…",
  "Reviewing experience section…",
  "Detecting missing sections…",
  "Measuring keyword density…",
  "Generating recommendations…",
];

const scoreColor = (s) =>
  s >= 80 ? G[600] : s >= 60 ? G[400] : s >= 40 ? "#fb923c" : "#f87171";

function Ring({ score, size = 90 }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const col = scoreColor(score);
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={G[100]}
          strokeWidth={9}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={col}
          strokeWidth={9}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1.2s ease" }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: size > 80 ? 22 : 14,
            fontWeight: 900,
            color: col,
            lineHeight: 1,
          }}
        >
          {score}
        </div>
        <div style={{ fontSize: 9, color: G[400], marginTop: 1 }}>/100</div>
      </div>
    </div>
  );
}

function AIAnalyzer({ onClose }) {
  const [stage, setStage] = useState("upload");
  const [scanStep, setScanStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const fileRef = useRef();
  const scoreLabel = (s) =>
    s >= 85 ? "Excellent" : s >= 70 ? "Good" : s >= 55 ? "Fair" : "Needs Work";
  const runScan = useCallback((text) => {
    setStage("scanning");
    setScanStep(0);
    setCompletedSteps([]);
    let step = 0;
    const iv = setInterval(() => {
      setCompletedSteps((p) => [...p, step]);
      step++;
      setScanStep(step);
      if (step >= SCAN_STEPS.length) {
        clearInterval(iv);
        setTimeout(() => {
          setResult(analyzeResume(text));
          setStage("results");
        }, 400);
      }
    }, 450);
  }, []);
  const handleFile = (f) => {
    if (!f) return;
    const r = new FileReader();
    r.onload = (e) => runScan(e.target.result || "");
    r.readAsText(f);
  };
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(20,83,45,0.5)",
          backdropFilter: "blur(6px)",
        }}
      />
      <div
        className="bounce-in"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 880,
          maxHeight: "92vh",
          background: "#fff",
          border: `1px solid ${G[200]}`,
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: `0 32px 80px rgba(22,163,74,0.15)`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            background: `linear-gradient(135deg,${G[50]},${G[100]})`,
            padding: "18px 24px",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `1px solid ${G[200]}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: `linear-gradient(135deg,${G[500]},${G[400]})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
              }}
            >
              🤖
            </div>
            <div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: G[900],
                  fontFamily: "'Syne',sans-serif",
                }}
              >
                AI Resume Analyzer
              </div>
              <div style={{ fontSize: 11, color: G[600] }}>
                Advanced analysis · ATS scoring · Keyword detection
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: G[100],
              border: `1px solid ${G[200]}`,
              borderRadius: 8,
              width: 32,
              height: 32,
              color: G[700],
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>
        <div
          style={{
            overflowY: "auto",
            flex: 1,
            padding: "24px",
            background: "#fff",
          }}
        >
          {stage === "upload" && (
            <div
              className="fade-in"
              style={{ textAlign: "center", padding: "16px 0" }}
            >
              <div style={{ fontSize: 48, marginBottom: 12 }}>📄</div>
              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: G[900],
                  marginBottom: 8,
                  fontFamily: "'Syne',sans-serif",
                }}
              >
                Upload Your Resume
              </h3>
              <p
                style={{
                  color: G[600],
                  fontSize: 13,
                  lineHeight: 1.7,
                  maxWidth: 440,
                  margin: `0 auto 24px`,
                }}
              >
                Upload a plain text (.txt) file. Our engine scans every section
                and provides a detailed score with actionable feedback.
              </p>
              <div
                onClick={() => fileRef.current?.click()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFile(e.dataTransfer.files[0]);
                }}
                onDragOver={(e) => e.preventDefault()}
                style={{
                  maxWidth: 420,
                  margin: "0 auto 20px",
                  border: `2px dashed ${G[300]}`,
                  borderRadius: 14,
                  padding: "36px 24px",
                  cursor: "pointer",
                  background: G[50],
                  transition: "all 0.2s",
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 10 }}>📁</div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 14,
                    color: G[800],
                    marginBottom: 4,
                  }}
                >
                  Click to upload or drag & drop
                </div>
                <div style={{ fontSize: 12, color: G[500] }}>
                  TXT, MD files · Max 5MB
                </div>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept=".txt,.md,.csv"
                onChange={(e) => handleFile(e.target.files[0])}
                style={{ display: "none" }}
              />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3,1fr)",
                  gap: 12,
                  maxWidth: 480,
                  margin: "20px auto 0",
                }}
              >
                {[
                  ["🎯", "ATS Check", "Keyword & structure"],
                  ["📊", "6-Dimension Score", "Detailed breakdown"],
                  ["⚡", "Action Items", "Prioritized fixes"],
                ].map(([ic, t, d]) => (
                  <div
                    key={t}
                    style={{
                      background: G[50],
                      border: `1px solid ${G[200]}`,
                      borderRadius: 10,
                      padding: "14px 10px",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: 22, marginBottom: 5 }}>{ic}</div>
                    <div
                      style={{
                        fontSize: 11.5,
                        fontWeight: 700,
                        color: G[800],
                        marginBottom: 3,
                      }}
                    >
                      {t}
                    </div>
                    <div
                      style={{ fontSize: 10.5, color: G[500], lineHeight: 1.4 }}
                    >
                      {d}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {stage === "scanning" && (
            <div
              className="fade-in"
              style={{ textAlign: "center", padding: "24px 0" }}
            >
              <div
                style={{
                  position: "relative",
                  width: 110,
                  height: 110,
                  margin: "0 auto 24px",
                }}
              >
                <svg
                  viewBox="0 0 110 110"
                  style={{ animation: "spin 2s linear infinite" }}
                >
                  <circle
                    cx="55"
                    cy="55"
                    r="46"
                    fill="none"
                    stroke={G[100]}
                    strokeWidth="7"
                  />
                  <circle
                    cx="55"
                    cy="55"
                    r="46"
                    fill="none"
                    stroke={G[500]}
                    strokeWidth="7"
                    strokeDasharray="75 214"
                    strokeLinecap="round"
                  />
                </svg>
                <svg
                  viewBox="0 0 110 110"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    animation: "spin 1.3s linear infinite reverse",
                  }}
                >
                  <circle
                    cx="55"
                    cy="55"
                    r="34"
                    fill="none"
                    stroke={G[100]}
                    strokeWidth="5"
                  />
                  <circle
                    cx="55"
                    cy="55"
                    r="34"
                    fill="none"
                    stroke={G[400]}
                    strokeWidth="5"
                    strokeDasharray="38 175"
                    strokeLinecap="round"
                  />
                </svg>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                  }}
                >
                  🤖
                </div>
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: G[900],
                  marginBottom: 6,
                  fontFamily: "'Syne',sans-serif",
                }}
              >
                Analyzing Your Resume…
              </div>
              <div style={{ color: G[500], fontSize: 12.5, marginBottom: 24 }}>
                AI engine scanning every section
              </div>
              <div style={{ maxWidth: 400, margin: "0 auto" }}>
                {SCAN_STEPS.map((step, i) => {
                  const done = completedSteps.includes(i),
                    active = scanStep === i;
                  return (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "9px 14px",
                        background: done
                          ? `rgba(22,163,74,0.06)`
                          : active
                            ? `rgba(34,197,94,0.08)`
                            : G[50],
                        border: `1px solid ${done ? G[300] + "50" : active ? G[400] + "40" : G[200]}`,
                        borderRadius: 9,
                        marginBottom: 7,
                        transition: "all 0.3s ease",
                      }}
                    >
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: "50%",
                          flexShrink: 0,
                          background: done ? G[500] : active ? G[400] : G[200],
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 10.5,
                          color: "#fff",
                          animation: active ? "pulse 1s ease infinite" : "none",
                        }}
                      >
                        {done ? "✓" : active ? "●" : i + 1}
                      </div>
                      <span
                        style={{
                          fontSize: 12.5,
                          color: done ? G[700] : active ? G[600] : G[400],
                          fontWeight: done || active ? 600 : 400,
                        }}
                      >
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {stage === "results" && result && (
            <div className="fade-in">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "140px 1fr",
                  gap: 20,
                  background: G[50],
                  border: `1px solid ${G[200]}`,
                  borderRadius: 16,
                  padding: "20px 24px",
                  marginBottom: 18,
                  alignItems: "center",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <Ring score={result.overallScore} size={110} />
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 900,
                      color: scoreColor(result.overallScore),
                      marginTop: 8,
                    }}
                  >
                    {result.grade}
                  </div>
                  <div style={{ fontSize: 11, color: G[500] }}>
                    {scoreLabel(result.overallScore)}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 800,
                      color: G[900],
                      marginBottom: 14,
                      fontFamily: "'Syne',sans-serif",
                    }}
                  >
                    Overall Resume Score
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 9,
                    }}
                  >
                    {[
                      ["ATS Score", result.atsScore],
                      ["Content", result.contentScore],
                      ["Skills", result.skillsScore],
                      ["Experience", result.expScore],
                    ].map(([l, v]) => (
                      <div
                        key={l}
                        style={{
                          background: "#fff",
                          border: `1px solid ${G[200]}`,
                          borderRadius: 10,
                          padding: "10px 12px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 5,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 11.5,
                              color: G[600],
                              fontWeight: 600,
                            }}
                          >
                            {l}
                          </span>
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 800,
                              color: scoreColor(v),
                            }}
                          >
                            {v}
                          </span>
                        </div>
                        <div
                          style={{
                            height: 5,
                            background: G[100],
                            borderRadius: 99,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${v}%`,
                              background: scoreColor(v),
                              borderRadius: 99,
                              transition: "width 1s ease",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4,1fr)",
                  gap: 9,
                  marginBottom: 18,
                }}
              >
                {[
                  [
                    "🔑",
                    "Keyword",
                    `${result.matchedKeywords.length} found`,
                    G[600],
                  ],
                  ["📊", "ATS", `${result.atsScore}/100`, G[500]],
                  ["⚠️", "Issues", `${result.issues.length}`, "#f59e0b"],
                  ["📝", "Words", `${result.wordCount}`, G[700]],
                ].map(([ic, l, v, c]) => (
                  <div
                    key={l}
                    style={{
                      background: G[50],
                      border: `1px solid ${G[200]}`,
                      borderRadius: 12,
                      padding: "12px 10px",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{ic}</div>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 900,
                        color: c,
                        marginBottom: 2,
                      }}
                    >
                      {v}
                    </div>
                    <div style={{ fontSize: 10.5, color: G[500] }}>{l}</div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 3,
                  background: G[100],
                  border: `1px solid ${G[200]}`,
                  borderRadius: 10,
                  padding: 3,
                  marginBottom: 16,
                }}
              >
                {[
                  ["overview", "📊 Overview"],
                  ["issues", "🚨 Issues"],
                  ["sections", "📋 Sections"],
                  ["keywords", "🔑 Keywords"],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    style={{
                      flex: 1,
                      padding: "8px 4px",
                      borderRadius: 8,
                      border: "none",
                      fontSize: 11.5,
                      fontWeight: 700,
                      background: activeTab === id ? G[600] : "transparent",
                      color: activeTab === id ? "#fff" : G[500],
                      transition: "all 0.2s",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {activeTab === "overview" && (
                <div className="fade-in">
                  {result.strengths.length > 0 && (
                    <div style={{ marginBottom: 14 }}>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: G[500],
                          marginBottom: 8,
                          textTransform: "uppercase",
                          letterSpacing: 0.8,
                        }}
                      >
                        ✅ Strengths
                      </div>
                      {result.strengths.map((s, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            gap: 10,
                            padding: "9px 14px",
                            background: `rgba(34,197,94,0.06)`,
                            border: `1px solid rgba(34,197,94,0.2)`,
                            borderRadius: 9,
                            marginBottom: 6,
                          }}
                        >
                          <span style={{ color: G[500], flexShrink: 0 }}>
                            ✓
                          </span>
                          <span
                            style={{
                              fontSize: 12.5,
                              color: G[700],
                              lineHeight: 1.5,
                            }}
                          >
                            {s}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ marginBottom: 14 }}>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: G[500],
                        marginBottom: 8,
                        textTransform: "uppercase",
                        letterSpacing: 0.8,
                      }}
                    >
                      ⚡ Quick Wins
                    </div>
                    {result.issues
                      .filter((i) => i.type === "suggestion")
                      .slice(0, 3)
                      .map((w, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            gap: 10,
                            padding: "9px 14px",
                            background: `rgba(251,191,36,0.06)`,
                            border: `1px solid rgba(251,191,36,0.2)`,
                            borderRadius: 9,
                            marginBottom: 6,
                          }}
                        >
                          <span style={{ flexShrink: 0 }}>💡</span>
                          <span
                            style={{
                              fontSize: 12.5,
                              color: "#92400e",
                              lineHeight: 1.5,
                            }}
                          >
                            {w.text}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
              {activeTab === "issues" && (
                <div className="fade-in">
                  <div style={{ display: "flex", gap: 9, marginBottom: 14 }}>
                    {[
                      ["🔴", "Critical", result.criticalCount, "#f87171"],
                      ["🟡", "Warnings", result.warningCount, "#f59e0b"],
                      ["🔵", "Tips", result.suggestionCount, G[500]],
                    ].map(([ic, l, c, col]) => (
                      <div
                        key={l}
                        style={{
                          flex: 1,
                          background: G[50],
                          border: `1px solid ${G[200]}`,
                          borderRadius: 10,
                          padding: "10px",
                          textAlign: "center",
                        }}
                      >
                        <div style={{ fontSize: 16 }}>{ic}</div>
                        <div
                          style={{ fontSize: 18, fontWeight: 900, color: col }}
                        >
                          {c}
                        </div>
                        <div
                          style={{
                            fontSize: 10.5,
                            color: col,
                            fontWeight: 600,
                          }}
                        >
                          {l}
                        </div>
                      </div>
                    ))}
                  </div>
                  {result.issues.map((issue, i) => {
                    const c =
                      issue.type === "critical"
                        ? {
                            bg: "rgba(248,113,113,0.07)",
                            bd: "rgba(248,113,113,0.2)",
                            col: "#f87171",
                            label: "CRITICAL",
                          }
                        : issue.type === "warning"
                          ? {
                              bg: "rgba(251,191,36,0.07)",
                              bd: "rgba(251,191,36,0.2)",
                              col: "#f59e0b",
                              label: "WARNING",
                            }
                          : {
                              bg: `rgba(22,163,74,0.07)`,
                              bd: `rgba(22,163,74,0.2)`,
                              col: G[600],
                              label: "TIP",
                            };
                    return (
                      <div
                        key={i}
                        style={{
                          background: c.bg,
                          border: `1px solid ${c.bd}`,
                          borderRadius: 10,
                          padding: "12px 14px",
                          marginBottom: 9,
                          display: "flex",
                          gap: 10,
                          alignItems: "flex-start",
                        }}
                      >
                        <span
                          style={{
                            background: c.col,
                            color: "#fff",
                            borderRadius: 99,
                            padding: "2px 8px",
                            fontSize: 9,
                            fontWeight: 800,
                            letterSpacing: 0.5,
                            flexShrink: 0,
                            marginTop: 1,
                          }}
                        >
                          {c.label}
                        </span>
                        <span
                          style={{
                            fontSize: 12.5,
                            color: G[800],
                            lineHeight: 1.6,
                          }}
                        >
                          {issue.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
              {activeTab === "sections" && (
                <div className="fade-in">
                  {Object.entries(result.sections).map(([sec, score]) => (
                    <div
                      key={sec}
                      style={{
                        marginBottom: 10,
                        padding: "12px 14px",
                        background: G[50],
                        border: `1px solid ${G[200]}`,
                        borderRadius: 10,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: 7,
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: 12.5,
                            color: G[900],
                            textTransform: "capitalize",
                          }}
                        >
                          {sec}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              width: 80,
                              height: 5,
                              background: G[100],
                              borderRadius: 99,
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                height: "100%",
                                width: `${score}%`,
                                background: scoreColor(score),
                                borderRadius: 99,
                                transition: "width 1s ease",
                              }}
                            />
                          </div>
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 800,
                              color: scoreColor(score),
                              minWidth: 24,
                            }}
                          >
                            {score}
                          </span>
                        </div>
                      </div>
                      <div style={{ fontSize: 11, color: G[500] }}>
                        {score >= 80
                          ? "✅ Well structured"
                          : score >= 60
                            ? "⚠️ Could use more detail"
                            : "❌ Missing or very weak"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === "keywords" && (
                <div className="fade-in">
                  <div style={{ marginBottom: 16 }}>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: G[500],
                        marginBottom: 9,
                        textTransform: "uppercase",
                        letterSpacing: 0.8,
                      }}
                    >
                      ✅ Detected ({result.matchedKeywords.length})
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                      {result.matchedKeywords.map((kw, i) => (
                        <span
                          key={i}
                          style={{
                            background: `rgba(22,163,74,0.1)`,
                            border: `1px solid rgba(22,163,74,0.25)`,
                            color: G[700],
                            borderRadius: 99,
                            padding: "5px 12px",
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          ✓ {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: G[500],
                        marginBottom: 9,
                        textTransform: "uppercase",
                        letterSpacing: 0.8,
                      }}
                    >
                      ❌ Missing ({result.missingKeywords.length}+)
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                      {result.missingKeywords.map((kw, i) => (
                        <span
                          key={i}
                          style={{
                            background: "rgba(248,113,113,0.08)",
                            border: "1px solid rgba(248,113,113,0.2)",
                            color: "#f87171",
                            borderRadius: 99,
                            padding: "5px 12px",
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          + {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div
                    style={{
                      background: `rgba(22,163,74,0.06)`,
                      border: `1px solid rgba(22,163,74,0.2)`,
                      borderRadius: 12,
                      padding: "14px 16px",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        color: G[700],
                        fontSize: 12.5,
                        marginBottom: 6,
                      }}
                    >
                      💡 Strategy
                    </div>
                    <ul
                      style={{
                        fontSize: 12,
                        color: G[600],
                        lineHeight: 1.9,
                        paddingLeft: 16,
                      }}
                    >
                      <li>
                        Mirror exact keywords from job descriptions you're
                        targeting
                      </li>
                      <li>
                        Weave missing tech keywords naturally into experience
                        bullets
                      </li>
                      <li>Add certifications to validate technical keywords</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        {stage === "results" && (
          <div
            style={{
              borderTop: `1px solid ${G[200]}`,
              padding: "12px 24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: G[50],
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 11.5, color: G[500] }}>
              Rule-based analysis · {new Date().toLocaleDateString()}
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => {
                  setStage("upload");
                  setResult(null);
                }}
                style={{
                  background: "#fff",
                  border: `1px solid ${G[300]}`,
                  borderRadius: 8,
                  padding: "7px 16px",
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: G[600],
                }}
              >
                Re-upload
              </button>
              <button
                onClick={onClose}
                style={{
                  background: `linear-gradient(135deg,${G[600]},${G[500]})`,
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "7px 18px",
                  fontSize: 12.5,
                  fontWeight: 700,
                }}
              >
                Apply Feedback →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   REPEAT SECTION EDITOR
══════════════════════════════════════════════════════ */
function RepeatSection({ label, items, onChange, fields }) {
  const add = () => {
    const b = { id: uid() };
    fields.forEach((f) => {
      b[f.key] = "";
    });
    onChange([...items, b]);
  };
  const remove = (id) => onChange(items.filter((i) => i.id !== id));
  const update = (id, key, val) =>
    onChange(items.map((i) => (i.id === id ? { ...i, [key]: val } : i)));
  return (
    <div>
      {items.map((item, idx) => (
        <div
          key={item.id}
          className="slide-right"
          style={{
            background: "#fff",
            border: `1.5px solid ${G[200]}`,
            borderRadius: 12,
            padding: "16px",
            marginBottom: 12,
            position: "relative",
            boxShadow: `0 2px 8px rgba(22,163,74,0.06)`,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <span
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                color: G[700],
                background: `rgba(22,163,74,0.1)`,
                borderRadius: 99,
                padding: "3px 12px",
                fontFamily: "'Space Grotesk',sans-serif",
              }}
            >
              {label} {idx + 1}
            </span>
            {items.length > 1 && (
              <button
                onClick={() => remove(item.id)}
                style={{
                  background: "rgba(248,113,113,0.08)",
                  color: "#f87171",
                  border: "1px solid rgba(248,113,113,0.2)",
                  borderRadius: 6,
                  padding: "3px 10px",
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                ✕ Remove
              </button>
            )}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: fields.length > 2 ? "1fr 1fr" : "1fr",
              gap: "10px 14px",
            }}
          >
            {fields.map((f) => (
              <div key={f.key} style={{ gridColumn: f.full ? "1/-1" : "auto" }}>
                <label>{f.label}</label>
                {f.type === "textarea" ? (
                  <textarea
                    rows={f.rows || 3}
                    value={item[f.key] || ""}
                    onChange={(e) => update(item.id, f.key, e.target.value)}
                    placeholder={f.placeholder || ""}
                  />
                ) : f.type === "select" ? (
                  <select
                    value={item[f.key] || ""}
                    onChange={(e) => update(item.id, f.key, e.target.value)}
                  >
                    {(f.options || []).map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={item[f.key] || ""}
                    onChange={(e) => update(item.id, f.key, e.target.value)}
                    placeholder={f.placeholder || ""}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={add}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: 10,
          border: `1.5px dashed ${G[300]}`,
          background: "transparent",
          color: G[600],
          fontWeight: 700,
          fontSize: 12.5,
          transition: "all 0.2s",
        }}
      >
        + Add {label}
      </button>
    </div>
  );
}

/* ── Photo Upload ── */
function PhotoUpload({ photo, onChange }) {
  const ref = useRef();
  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = (ev) => onChange(ev.target.result);
    r.readAsDataURL(f);
  };
  return (
    <div style={{ marginBottom: 20 }}>
      <label>Profile Photo</label>
      <div
        style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 6 }}
      >
        <div
          onClick={() => ref.current?.click()}
          style={{
            width: 76,
            height: 76,
            borderRadius: 12,
            border: `2px dashed ${G[300]}`,
            overflow: "hidden",
            cursor: "pointer",
            background: G[50],
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 26,
            flexShrink: 0,
            transition: "border 0.2s",
          }}
        >
          {photo ? (
            <img
              src={photo}
              alt="p"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            "📷"
          )}
        </div>
        <div>
          <button
            onClick={() => ref.current?.click()}
            style={{
              background: `linear-gradient(135deg,${G[600]},${G[500]})`,
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "8px 16px",
              fontSize: 12.5,
              fontWeight: 700,
            }}
          >
            Upload Photo
          </button>
          {photo && (
            <button
              onClick={() => onChange(null)}
              style={{
                marginLeft: 8,
                background: "rgba(248,113,113,0.08)",
                color: "#f87171",
                border: "1px solid rgba(248,113,113,0.2)",
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              Remove
            </button>
          )}
          <div style={{ fontSize: 11, color: G[400], marginTop: 5 }}>
            JPG, PNG · Square recommended
          </div>
        </div>
      </div>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        onChange={handleFile}
        style={{ display: "none" }}
      />
    </div>
  );
}

/* ── Color Accent Picker ── */
function AccentPicker({ value, onChange }) {
  const colors = [
    "#818cf8",
    "#06b6d4",
    "#f97316",
    "#22c55e",
    "#a855f7",
    "#ec4899",
    "#64748b",
    "#f59e0b",
    "#ef4444",
    "#14b8a6",
  ];
  return (
    <div style={{ marginBottom: 20 }}>
      <label>Accent Color Override</label>
      <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
        {colors.map((c) => (
          <div
            key={c}
            onClick={() => onChange(c)}
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: c,
              cursor: "pointer",
              border:
                value === c ? `3px solid ${G[900]}` : "2px solid transparent",
              transition: "border 0.15s",
              flexShrink: 0,
            }}
          />
        ))}
        <div
          onClick={() => onChange(null)}
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: G[100],
            border: !value ? `2px solid ${G[600]}` : `2px solid ${G[200]}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: 12,
            color: G[400],
          }}
        >
          ✕
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   TEMPLATE SELECTOR
══════════════════════════════════════════════════════ */
function TemplatePanel({ activeTpl, onSelect, onClose }) {
  return (
    <div
      style={{
        background: "#fff",
        borderBottom: `1px solid ${G[200]}`,
        padding: "18px 22px",
        boxShadow: `0 8px 32px rgba(22,163,74,0.1)`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            fontWeight: 800,
            fontSize: 15,
            color: G[900],
            fontFamily: "'Syne',sans-serif",
          }}
        >
          Choose Template
        </div>
        <button
          onClick={onClose}
          style={{
            background: G[50],
            border: `1px solid ${G[200]}`,
            borderRadius: 7,
            padding: "5px 14px",
            fontSize: 12,
            fontWeight: 700,
            color: G[600],
          }}
        >
          ✕ Close
        </button>
      </div>
      <div
        style={{
          display: "flex",
          gap: 12,
          overflowX: "auto",
          paddingBottom: 6,
        }}
      >
        {TEMPLATES.map((t) => (
          <div
            key={t.id}
            className="tpl-card"
            onClick={() => {
              onSelect(t.id);
              onClose();
            }}
            style={{
              flexShrink: 0,
              width: 144,
              background: "#fff",
              border: `1.5px solid ${activeTpl === t.id ? G[500] : G[200]}`,
              borderRadius: 12,
              overflow: "hidden",
              boxShadow:
                activeTpl === t.id ? `0 0 0 3px rgba(22,163,74,0.2)` : "none",
            }}
          >
            <div
              style={{
                height: 72,
                background: `linear-gradient(135deg,${t.accent}22,${t.accent}44)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderBottom: `1px solid ${t.accent}33`,
                position: "relative",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: t.accent,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  opacity: 0.9,
                }}
              >
                📄
              </div>
              <div
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: t.accent,
                }}
              />
            </div>
            <div style={{ padding: "10px 12px" }}>
              <div style={{ fontWeight: 700, fontSize: 12, color: G[900] }}>
                {t.name}
              </div>
              <div style={{ fontSize: 10, color: G[400], marginTop: 2 }}>
                {t.tag}
              </div>
              {activeTpl === t.id && (
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: G[600],
                    marginTop: 4,
                  }}
                >
                  ✓ Active
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════════════ */
export default function Final() {
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();
  const [data, setData] = useState(EMPTY_DATA());
  const [activeSection, setActiveSection] = useState("basics");
  const [activeTpl, setActiveTpl] = useState("midnight");
  const [viewMode, setViewMode] = useState("split");
  const [showTpl, setShowTpl] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [accentOverride, setAccentOverride] = useState(null);
  const [zoom, setZoom] = useState(0.65);
  const [showJsonImport, setShowJsonImport] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const pdfRef = useRef(null);
  const set = useCallback((k, v) => setData((p) => ({ ...p, [k]: v })), []);

  const handleDownload = useCallback(() => {
    setDownloading(true);
    const el = pdfRef.current;
    if (!el) {
      setDownloading(false);
      return;
    }
    const win = window.open("", "_blank");
    win.document.write(`<!DOCTYPE html><html><head>
      <meta charset="utf-8"><title>${data.name || "Resume"}</title>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300;1,9..40,400&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Space+Grotesk:wght@400;600;700&display=swap" rel="stylesheet">
      <style>
        *{box-sizing:border-box;margin:0;padding:0;}
        body{-webkit-print-color-adjust:exact;print-color-adjust:exact;font-family:'DM Sans',sans-serif;}
        @page{size:A4;margin:0;}
        @media print{body{margin:0;}html{margin:0;}}
      </style>
    </head><body>${el.innerHTML}</body></html>`);
    win.document.close();
    win.onload = () => {
      setTimeout(() => {
        win.print();
        setDownloading(false);
      }, 700);
    };
  }, [data.name]);

  const handleJsonImport = () => {
    try {
      const d = JSON.parse(jsonInput);
      setData({ ...EMPTY_DATA(), ...d });
      setShowJsonImport(false);
      setJsonInput("");
    } catch {
      alert("Invalid JSON. Please check the format.");
    }
  };
  const handleJsonExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${data.name || "resume"}-data.json`;
    a.click();
  };

  const renderSection = () => {
    if (activeSection === "basics")
      return (
        <div className="fade-up">
          <PhotoUpload photo={data.photo} onChange={(v) => set("photo", v)} />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px 14px",
              marginBottom: 12,
            }}
          >
            {[
              { k: "name", l: "Full Name", p: "Lionel Messi" },
              {
                k: "title",
                l: "Professional Title",
                p: "Full Stack Developer",
              },
              { k: "email", l: "Email", p: "alex@example.com" },
              { k: "phone", l: "Phone", p: "+91 555 000 0000" },
              { k: "location", l: "Location", p: "San Francisco, CA" },
              { k: "linkedin", l: "LinkedIn URL", p: "linkedin.com/in/alex" },
              { k: "github", l: "GitHub URL", p: "github.com/alex" },
              { k: "website", l: "Website / Portfolio", p: "alexjohnson.dev" },
            ].map((f) => (
              <div key={f.k}>
                <label>{f.l}</label>
                <input
                  value={data[f.k]}
                  onChange={(e) => set(f.k, e.target.value)}
                  placeholder={f.p}
                />
              </div>
            ))}
          </div>
          <div>
            <label>Reference Note</label>
            <input
              value={data.reference}
              onChange={(e) => set("reference", e.target.value)}
              placeholder="References available upon request."
            />
          </div>
        </div>
      );
    if (activeSection === "profile")
      return (
        <div className="fade-up">
          <label>Professional Summary / Profile</label>
          <textarea
            rows={7}
            value={data.profile}
            onChange={(e) => set("profile", e.target.value)}
            placeholder="Results-driven full-stack developer with 3+ years of experience building scalable web applications. Proficient in React, Node.js, and cloud infrastructure. Proven track record of delivering high-impact features on time and improving system performance by 40%."
          />
          <div style={{ fontSize: 11, color: G[400], marginTop: 6 }}>
            {data.profile.length} chars · Target: 300–600 chars
          </div>
        </div>
      );
    if (activeSection === "education")
      return (
        <div className="fade-up">
          <RepeatSection
            label="Education"
            items={data.education}
            onChange={(v) => set("education", v)}
            fields={[
              {
                key: "degree",
                label: "Degree / Qualification",
                placeholder: "Bachelor of Computer Science",
              },
              {
                key: "field",
                label: "Field of Study",
                placeholder: "Computer Science",
              },
              {
                key: "institution",
                label: "Institution / University",
                placeholder: "MIT",
                full: true,
              },
              { key: "startYear", label: "Start Year", placeholder: "2020" },
              {
                key: "endYear",
                label: "End / Expected Year",
                placeholder: "2024",
              },
              { key: "gpa", label: "GPA / Grade", placeholder: "3.8/4.0" },
              {
                key: "description",
                label: "Description / Honors",
                placeholder: "Graduated with distinction.",
                full: true,
              },
            ]}
          />
        </div>
      );
    if (activeSection === "experience")
      return (
        <div className="fade-up">
          <div
            style={{
              padding: "10px 14px",
              background: `rgba(22,163,74,0.06)`,
              border: `1px solid rgba(22,163,74,0.2)`,
              borderRadius: 9,
              marginBottom: 14,
            }}
          >
            <span style={{ fontSize: 12, color: G[700] }}>
              💡 One bullet point per line. Start each with an action verb for
              maximum impact.
            </span>
          </div>
          <RepeatSection
            label="Experience"
            items={data.experience}
            onChange={(v) => set("experience", v)}
            fields={[
              {
                key: "title",
                label: "Job Title / Role",
                placeholder: "Senior Software Engineer",
                full: true,
              },
              { key: "company", label: "Company Name", placeholder: "Google" },
              {
                key: "location",
                label: "Location",
                placeholder: "Mountain View, CA",
              },
              { key: "startYear", label: "Start Year", placeholder: "2022" },
              { key: "endYear", label: "End Year", placeholder: "Present" },
              {
                key: "bullets",
                label: "Bullet Points (one per line)",
                type: "textarea",
                rows: 5,
                placeholder:
                  "Led a team of 5 engineers\nReduced API response time by 60%\nIncreased test coverage from 40% to 92%",
                full: true,
              },
            ]}
          />
        </div>
      );
    if (activeSection === "projects")
      return (
        <div className="fade-up">
          <RepeatSection
            label="Project"
            items={data.projects}
            onChange={(v) => set("projects", v)}
            fields={[
              {
                key: "title",
                label: "Project Title",
                placeholder: "E-Commerce Platform",
                full: true,
              },
              {
                key: "tech",
                label: "Tech Stack / Tools",
                placeholder: "React, Node.js, MongoDB, Docker",
              },
              {
                key: "link",
                label: "Live URL / GitHub Link",
                placeholder: "github.com/you/project",
              },
              { key: "startYear", label: "Start Year", placeholder: "2023" },
              { key: "endYear", label: "End Year", placeholder: "2024" },
              {
                key: "bullets",
                label: "Bullet Points (one per line)",
                type: "textarea",
                rows: 4,
                placeholder:
                  "Built a scalable multi-vendor marketplace\nImplemented JWT auth and role-based access control",
                full: true,
              },
            ]}
          />
        </div>
      );
    if (activeSection === "skills")
      return (
        <div className="fade-up">
          <RepeatSection
            label="Skill Group"
            items={data.skills}
            onChange={(v) => set("skills", v)}
            fields={[
              { key: "category", label: "Category", placeholder: "Frontend" },
              {
                key: "items",
                label: "Skills (comma separated)",
                placeholder: "React, TypeScript, Tailwind, Next.js",
                full: true,
              },
            ]}
          />
        </div>
      );
    if (activeSection === "languages")
      return (
        <div className="fade-up">
          <RepeatSection
            label="Language"
            items={data.languages}
            onChange={(v) => set("languages", v)}
            fields={[
              { key: "language", label: "Language", placeholder: "English" },
              {
                key: "proficiency",
                label: "Proficiency",
                type: "select",
                options: [
                  "Native",
                  "Fluent",
                  "Advanced",
                  "Intermediate",
                  "Beginner",
                ],
              },
            ]}
          />
        </div>
      );
    if (activeSection === "certifications")
      return (
        <div className="fade-up">
          <RepeatSection
            label="Certification"
            items={data.certifications}
            onChange={(v) => set("certifications", v)}
            fields={[
              {
                key: "name",
                label: "Certification Name",
                placeholder: "AWS Solutions Architect Associate",
                full: true,
              },
              {
                key: "issuer",
                label: "Issuing Organization",
                placeholder: "Amazon Web Services",
              },
              { key: "year", label: "Year", placeholder: "2024" },
              {
                key: "credentialId",
                label: "Credential ID",
                placeholder: "ABC123XYZ",
                full: true,
              },
            ]}
          />
        </div>
      );
    if (activeSection === "achievements")
      return (
        <div className="fade-up">
          <RepeatSection
            label="Achievement"
            items={data.achievements}
            onChange={(v) => set("achievements", v)}
            fields={[
              {
                key: "title",
                label: "Achievement Title",
                placeholder: "Hackathon Winner — HackMIT 2023",
                full: true,
              },
              {
                key: "description",
                label: "Description",
                placeholder: "Won 1st place among 300+ teams",
                full: true,
              },
            ]}
          />
        </div>
      );
    if (activeSection === "volunteer")
      return (
        <div className="fade-up">
          <RepeatSection
            label="Volunteer"
            items={data.volunteer}
            onChange={(v) => set("volunteer", v)}
            fields={[
              {
                key: "role",
                label: "Role",
                placeholder: "Open Source Contributor",
              },
              {
                key: "organization",
                label: "Organization",
                placeholder: "Mozilla Foundation",
              },
              { key: "startYear", label: "Start", placeholder: "2022" },
              { key: "endYear", label: "End", placeholder: "Present" },
              {
                key: "description",
                label: "Description",
                placeholder: "Contributed 50+ PRs to Firefox DevTools",
                full: true,
              },
            ]}
          />
        </div>
      );
    if (activeSection === "publications")
      return (
        <div className="fade-up">
          <RepeatSection
            label="Publication"
            items={data.publications}
            onChange={(v) => set("publications", v)}
            fields={[
              {
                key: "title",
                label: "Title",
                placeholder: "Deep Learning for NLP: A Survey",
                full: true,
              },
              {
                key: "publisher",
                label: "Publisher / Journal",
                placeholder: "IEEE Transactions",
              },
              { key: "year", label: "Year", placeholder: "2024" },
              {
                key: "link",
                label: "Link / DOI",
                placeholder: "doi.org/10.xxxx/xxxxx",
                full: true,
              },
            ]}
          />
        </div>
      );
    if (activeSection === "references")
      return (
        <div className="fade-up">
          <RepeatSection
            label="Reference"
            items={data.references}
            onChange={(v) => set("references", v)}
            fields={[
              { key: "name", label: "Full Name", placeholder: "Jane Smith" },
              {
                key: "role",
                label: "Title / Role",
                placeholder: "Engineering Manager",
              },
              { key: "company", label: "Company", placeholder: "Google" },
              { key: "email", label: "Email", placeholder: "jane@google.com" },
              { key: "phone", label: "Phone", placeholder: "+1 555 000 0000" },
            ]}
          />
        </div>
      );
  };

  const currentNav = NAV.find((n) => n.id === activeSection);
  const completedSections = NAV.filter((n) => {
    if (n.id === "basics") return !!data.name;
    if (n.id === "profile") return !!data.profile;
    const arr = data[n.id];
    return (
      Array.isArray(arr) &&
      arr.some((i) => Object.values(i).some((v) => v && v !== i.id))
    );
  }).length;

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      {showAI && <AIAnalyzer onClose={() => setShowAI(false)} />}
      {showJsonImport && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            onClick={() => setShowJsonImport(false)}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(20,83,45,0.4)",
              backdropFilter: "blur(4px)",
            }}
          />
          <div
            className="bounce-in"
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 540,
              background: "#fff",
              border: `1px solid ${G[200]}`,
              borderRadius: 16,
              padding: 24,
              boxShadow: `0 32px 80px rgba(22,163,74,0.15)`,
            }}
          >
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: G[900],
                marginBottom: 6,
                fontFamily: "'Syne',sans-serif",
              }}
            >
              Import Resume Data
            </div>
            <div style={{ fontSize: 12, color: G[500], marginBottom: 14 }}>
              Paste JSON exported from a previous session.
            </div>
            <textarea
              rows={10}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='{"name":"...","email":"...",...}'
              style={{
                marginBottom: 12,
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 11.5,
              }}
            />
            <div
              style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}
            >
              <button
                onClick={() => setShowJsonImport(false)}
                style={{
                  background: G[50],
                  border: `1px solid ${G[200]}`,
                  color: G[600],
                  borderRadius: 8,
                  padding: "8px 16px",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleJsonImport}
                style={{
                  background: `linear-gradient(135deg,${G[600]},${G[500]})`,
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 20px",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}
      <div
        style={{
          minHeight: "100vh",
          background: G[50],
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ── TOP BAR ── */}
        <div
          style={{
            background: "#fff",
            padding: "0 18px",
            height: 58,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 100,
            borderBottom: `1px solid ${G[200]}`,
            boxShadow: `0 4px 24px rgba(22,163,74,0.08)`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: `linear-gradient(135deg,${G[600]},${G[400]})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
              }}
            >
              🤖
            </div>
            <div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 15,
                  color: G[900],
                  fontFamily: "'Syne',sans-serif",
                  letterSpacing: -0.3,
                }}
              >
                AI Resume Builder
              </div>
              <div style={{ fontSize: 9.5, color: G[300] }}>
                8 templates · AI analyzer · A4 PDF
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              flexWrap: "wrap",
            }}
          >
            {/* Progress */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: G[50],
                border: `1px solid ${G[200]}`,
                borderRadius: 8,
                padding: "5px 12px",
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 4,
                  background: G[200],
                  borderRadius: 99,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${(completedSections / NAV.length) * 100}%`,
                    background: `linear-gradient(90deg,${G[600]},${G[400]})`,
                    borderRadius: 99,
                    transition: "width 0.5s ease",
                  }}
                />
              </div>
              <span style={{ fontSize: 10.5, color: G[600], fontWeight: 600 }}>
                {completedSections}/{NAV.length}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                gap: 2,
                background: G[50],
                border: `1px solid ${G[200]}`,
                borderRadius: 8,
                padding: 3,
              }}
            >
              {[
                ["split", "⊞"],
                ["editor", "✏"],
                ["preview", "👁"],
              ].map(([v, l]) => (
                <button
                  key={v}
                  onClick={() => setViewMode(v)}
                  style={{
                    padding: "5px 10px",
                    borderRadius: 6,
                    border: "none",
                    fontSize: 12,
                    fontWeight: 700,
                    background: viewMode === v ? G[600] : "transparent",
                    color: viewMode === v ? "#fff" : G[400],
                    transition: "all 0.2s",
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowTpl((p) => !p)}
              style={{
                background: G[50],
                color: G[800],
                border: `1px solid ${G[200]}`,
                borderRadius: 8,
                padding: "7px 13px",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              🎨 Templates
            </button>
            <button
              onClick={() => setShowAI(true)}
              style={{
                background: `linear-gradient(135deg,${G[600]},${G[400]})`,
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "8px 14px",
                fontSize: 12,
                fontWeight: 700,
                boxShadow: `0 4px 12px rgba(22,163,74,0.3)`,
              }}
            >
              🤖 AI Analyze
            </button>
            <div
              style={{
                display: "flex",
                gap: 1,
                background: G[50],
                border: `1px solid ${G[200]}`,
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              <button
                onClick={handleJsonExport}
                style={{
                  background: "transparent",
                  color: G[600],
                  border: "none",
                  padding: "8px 12px",
                  fontSize: 11.5,
                  fontWeight: 700,
                  borderRight: `1px solid ${G[200]}`,
                }}
              >
                ⬆ Export
              </button>
              <button
                onClick={() => setShowJsonImport(true)}
                style={{
                  background: "transparent",
                  color: G[600],
                  border: "none",
                  padding: "8px 12px",
                  fontSize: 11.5,
                  fontWeight: 700,
                }}
              >
                ⬇ Import
              </button>
            </div>
            <button
              onClick={handleDownload}
              disabled={downloading}
              style={{
                background: downloading ? G[100] : G[600],
                color: downloading ? G[400] : "#fff",
                border: "none",
                borderRadius: 8,
                padding: "8px 18px",
                fontSize: 12,
                fontWeight: 800,
                transition: "all 0.2s",
                boxShadow: downloading
                  ? "none"
                  : `0 4px 12px rgba(22,163,74,0.3)`,
              }}
            >
              {downloading ? (
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span
                    style={{
                      animation: "spin 0.8s linear infinite",
                      display: "inline-block",
                    }}
                  >
                    ⟳
                  </span>
                  Preparing…
                </span>
              ) : (
                "⬇ Save PDF"
              )}
            </button>

            
           
  <div style={{ position: "relative", display: "inline-block" }}>
  <button
    onClick={() => setShowLogout(!showLogout)}
    style={{
      background: "transparent",
      border: `1.5px solid ${G[200]}`,
      borderRadius: 8,
      padding: "6px 10px",
      fontSize: 18,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <CgProfile color={G[600]} size={22} />
  </button>

  {showLogout && (
    <div
      style={{
        position: "absolute",
        top: "110%",
        right: 0,
        background: "#fff",
        border: `1px solid ${G[200]}`,
        borderRadius: 10,
        boxShadow: `0 8px 24px rgba(22,163,74,0.15)`,
        overflow: "hidden",
        zIndex: 1000,
        minWidth: 140,
      }}
    >
      <button
        onClick={() => navigate("/")}
        style={{
          width: "100%",
          background: "transparent",
          border: "none",
          padding: "10px 16px",
          fontSize: 13,
          fontWeight: 600,
          color: "#ef4444",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 8,
          textAlign: "left",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#fef2f2")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        <span>🚪</span> Log Out
      </button>
    </div>
  )}
</div>



          </div>
        </div>

        {/* Template Panel */}
        {showTpl && (
          <TemplatePanel
            activeTpl={activeTpl}
            onSelect={setActiveTpl}
            onClose={() => setShowTpl(false)}
          />
        )}

        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* ── SIDEBAR NAV ── */}
          {viewMode !== "preview" && (
            <div
              style={{
                width: 200,
                background: "#fff",
                borderRight: `1px solid ${G[200]}`,
                overflowY: "auto",
                flexShrink: 0,
                padding: "12px 8px",
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              {NAV.map((n) => {
                const done =
                  n.id === "basics"
                    ? !!data.name
                    : n.id === "profile"
                      ? !!data.profile
                      : (() => {
                          const arr = data[n.id];
                          return (
                            Array.isArray(arr) &&
                            arr.some((i) =>
                              Object.values(i).some((v) => v && v !== i.id),
                            )
                          );
                        })();
                return (
                  <button
                    key={n.id}
                    className="nav-btn"
                    onClick={() => setActiveSection(n.id)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 9,
                      padding: "9px 11px",
                      borderRadius: 9,
                      border: "none",
                      background:
                        activeSection === n.id ? G[100] : "transparent",
                      color: activeSection === n.id ? G[800] : G[500],
                      fontWeight: activeSection === n.id ? 700 : 400,
                      fontSize: 12.5,
                      cursor: "pointer",
                      textAlign: "left",
                      borderLeft: `2px solid ${activeSection === n.id ? G[600] : "transparent"}`,
                    }}
                  >
                    <span style={{ fontSize: 13 }}>{n.icon}</span>
                    <span style={{ flex: 1 }}>{n.label}</span>
                    {done && (
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: G[500],
                          flexShrink: 0,
                        }}
                      />
                    )}
                  </button>
                );
              })}
              <div
                style={{
                  margin: "12px 4px 0",
                  padding: "12px",
                  background: G[50],
                  border: `1px solid ${G[200]}`,
                  borderRadius: 10,
                  marginTop: "auto",
                }}
              >
                <div
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: G[600],
                    marginBottom: 4,
                    fontFamily: "'Space Grotesk',sans-serif",
                  }}
                >
                  💡 Pro Tip
                </div>
                <div style={{ fontSize: 10.5, color: G[400], lineHeight: 1.6 }}>
                  Use strong action verbs: "Built", "Led", "Increased" — ATS
                  loves them.
                </div>
              </div>
            </div>
          )}

          {/* ── EDITOR ── */}
          {viewMode !== "preview" && (
            <div
              style={{
                flex: viewMode === "split" ? "0 0 430px" : 1,
                overflowY: "auto",
                padding: "22px",
                background: G[50],
                borderRight:
                  viewMode === "split" ? `1px solid ${G[200]}` : "none",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 9,
                    background: `linear-gradient(135deg,rgba(22,163,74,0.15),rgba(34,197,94,0.08))`,
                    border: `1px solid ${G[200]}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 17,
                  }}
                >
                  {currentNav?.icon}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 800,
                      color: G[900],
                      fontFamily: "'Syne',sans-serif",
                    }}
                  >
                    {currentNav?.label}
                  </div>
                  <div style={{ fontSize: 11, color: G[400] }}>
                    Fill in your details below
                  </div>
                </div>
              </div>
              {activeSection === "basics" && (
                <AccentPicker
                  value={accentOverride}
                  onChange={setAccentOverride}
                />
              )}
              {renderSection()}
            </div>
          )}

          {/* ── PREVIEW ── */}
          {(viewMode === "split" || viewMode === "preview") && (
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                background: G[100],
                padding: "22px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* Preview controls */}
              <div
                style={{
                  width: "100%",
                  maxWidth: 900,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: G[500],
                      animation: "pulse 2s ease infinite",
                    }}
                  />
                  <span
                    style={{ fontSize: 12, fontWeight: 700, color: G[800] }}
                  >
                    Live Preview
                  </span>
                  <span style={{ fontSize: 11, color: G[400] }}>
                    · {TEMPLATES.find((t) => t.id === activeTpl)?.name}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      color: G[400],
                      background: "#fff",
                      border: `1px solid ${G[200]}`,
                      borderRadius: 4,
                      padding: "2px 7px",
                    }}
                  >
                    A4
                  </span>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div
                    style={{
                      display: "flex",
                      gap: 2,
                      background: "#fff",
                      border: `1px solid ${G[200]}`,
                      borderRadius: 7,
                      padding: 2,
                    }}
                  >
                    {[0.5, 0.65, 0.8, 1].map((z) => (
                      <button
                        key={z}
                        onClick={() => setZoom(z)}
                        style={{
                          padding: "4px 9px",
                          borderRadius: 5,
                          border: "none",
                          fontSize: 10.5,
                          fontWeight: 700,
                          background: zoom === z ? G[600] : "transparent",
                          color: zoom === z ? "#fff" : G[400],
                        }}
                      >
                        {Math.round(z * 100)}%
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowTpl(true)}
                    style={{
                      background: "#fff",
                      border: `1px solid ${G[200]}`,
                      borderRadius: 7,
                      padding: "5px 12px",
                      fontSize: 11.5,
                      fontWeight: 700,
                      color: G[600],
                    }}
                  >
                    🎨 Change
                  </button>
                  <button
                    onClick={handleDownload}
                    style={{
                      background: G[600],
                      color: "#fff",
                      border: "none",
                      borderRadius: 7,
                      padding: "5px 14px",
                      fontSize: 11.5,
                      fontWeight: 800,
                    }}
                  >
                    ⬇ PDF
                  </button>
                </div>
              </div>
              {/* A4 page */}
              <div
                style={{
                  width: "210mm",
                  transformOrigin: "top center",
                  transform: `scale(${zoom})`,
                  marginBottom: `calc((${zoom} - 1) * 297mm)`,
                  flexShrink: 0,
                }}
              >
                <div
                  ref={pdfRef}
                  style={{
                    width: "210mm",
                    minHeight: "297mm",
                    background: "#fff",
                    boxShadow: `0 20px 60px rgba(22,163,74,0.15)`,
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <ResumeRender data={data} tpl={activeTpl} />
                </div>
              </div>
              {/* Completion bar */}
              <div
                style={{
                  marginTop: 24,
                  width: "100%",
                  maxWidth: 900,
                  background: "#fff",
                  border: `1px solid ${G[200]}`,
                  borderRadius: 12,
                  padding: "12px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 6,
                    }}
                  >
                    <span
                      style={{ fontSize: 11.5, fontWeight: 700, color: G[800] }}
                    >
                      Resume Completion
                    </span>
                    <span
                      style={{ fontSize: 11.5, fontWeight: 700, color: G[600] }}
                    >
                      {Math.round((completedSections / NAV.length) * 100)}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: 6,
                      background: G[100],
                      borderRadius: 99,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${(completedSections / NAV.length) * 100}%`,
                        background: `linear-gradient(90deg,${G[600]},${G[400]})`,
                        borderRadius: 99,
                        transition: "width 0.5s ease",
                      }}
                    />
                  </div>
                </div>
                <button
                  onClick={() => setShowAI(true)}
                  style={{
                    background: `rgba(22,163,74,0.08)`,
                    border: `1px solid rgba(22,163,74,0.2)`,
                    color: G[700],
                    borderRadius: 8,
                    padding: "8px 14px",
                    fontSize: 12,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  🤖 AI Score
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
