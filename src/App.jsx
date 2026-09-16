import { useEffect, useMemo, useState } from "react";

const icon = (name) => `https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/${name}.svg`;
const initialSites = [
  ["tiktok", "TikTok", "https://www.tiktok.com"],
  ["youtube", "YouTube", "https://www.youtube.com"],
  ["github", "GitHub", "https://github.com"],
  ["discord", "Discord", "https://discord.com"],
  ["x", "Twitter", "https://x.com"],
  ["nvidia", "GeForce", "https://www.nvidia.com"],
  ["netflix", "Netflix", "https://www.netflix.com"],
  ["twitch", "Twitch", "https://www.twitch.tv"]
];

function normalize(value) {
  const candidate = value.trim();
  if (!candidate) return "https://example.com";
  if (/^[a-z][a-z\d+.-]*:/i.test(candidate)) return candidate;
  if (candidate.includes(" ")) return `https://www.google.com/search?q=${encodeURIComponent(candidate)}`;
  return `https://${candidate}`;
}

export default function App() {
  const [url, setUrl] = useState("");
  const [proxyUrl, setProxyUrl] = useState("");
  const [tab, setTab] = useState("Home");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [proxy, setProxy] = useState(localStorage.getItem("proxy") || "ultraviolet");
  const [transport, setTransport] = useState(localStorage.getItem("transport") || "libcurl");
  const [time, setTime] = useState(new Date());
  const [sites, setSites] = useState(initialSites);

  useEffect(() => { const timer = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(timer); }, []);
  useEffect(() => { localStorage.setItem("proxy", proxy); localStorage.setItem("transport", transport); }, [proxy, transport]);

  const displayedUrl = useMemo(() => proxyUrl ? `/api/proxy?url=${encodeURIComponent(proxyUrl)}` : "yuki://home", [proxyUrl]);
  const open = (raw) => {
    const target = normalize(raw);
    setUrl(target);
    setProxyUrl(target);
    setTab(new URL(target).hostname);
  };
  const submit = (event) => { event.preventDefault(); open(url); };
  const addSite = () => {
    const target = prompt("Website URL");
    if (!target) return;
    const normalized = normalize(target);
    const hostname = new URL(normalized).hostname.replace(/^www\./, "");
    setSites((items) => [...items, ["globe", hostname, normalized]]);
  };

  return <div className="app">
    <header className="chrome">
      <div className="tabs"><div className="tab active"><img src={icon("firefox")} /> <span>{tab}</span></div><button className="plus" onClick={() => { setTab("Home"); setProxyUrl(""); }}>＋</button></div>
      <div className="window-actions"><button>−</button><button>↗</button><button>□</button><button>×</button></div>
      <div className="nav-row">
        <div className="nav-buttons"><button onClick={() => history.back()}>‹</button><button onClick={() => history.forward()}>›</button><button onClick={() => location.reload()}>↻</button></div>
        <form className="address" onSubmit={submit}><span className="lock">●</span><input value={proxyUrl ? displayedUrl : url} onChange={(e) => setUrl(e.target.value)} placeholder="Search the web or enter address" aria-label="Address" /></form>
        <div className="tools"><button>◧</button><button>⌨</button><button>◫</button><button>⛶</button><button>☾</button><button>★</button><button onClick={() => setSettingsOpen(!settingsOpen)}>⚙</button><button>•••</button></div>
      </div>
    </header>

    {settingsOpen && <aside className="settings"><div><b>Settings</b><button onClick={() => setSettingsOpen(false)}>×</button></div><label>Proxy<select value={proxy} onChange={(e) => setProxy(e.target.value)}><option value="ultraviolet">Ultraviolet</option><option value="scramjet">Scramjet</option></select></label><label>Transport<select value={transport} onChange={(e) => setTransport(e.target.value)}><option value="libcurl">libcurl</option><option value="wisp">Wisp</option><option value="epoxy-tls">Epoxy TLS</option></select></label><small>Active: {proxy} + {transport}</small></aside>}

    <main className="page">{proxyUrl ? <iframe title="proxied page" src={displayedUrl} /> : <section className="home"><div className="sponsored">SPONSORED</div><div className="ad"><b>XM ULTRA LOW</b><strong>Low-Cost Trading</strong><span>Your capital is at risk.<br />*T&Cs apply.</span><button>Start Now</button></div><div className="clock">{time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}</div><div className="date">{time.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}</div><form className="search" onSubmit={submit}><span>⌕</span><input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Search the web..." /><select defaultValue="Brave"><option>Brave</option><option>Google</option><option>Bing</option></select></form><div className="shortcuts">{sites.map(([logo, name, target], index) => <button className="shortcut" key={`${name}-${index}`} onClick={() => open(target)}><span className="shortcut-icon"><img src={icon(logo)} onError={(e) => { e.currentTarget.src = icon("globe"); }} /></span><span>{name}</span></button>)}<button className="shortcut" onClick={addSite}><span className="shortcut-icon add">＋</span><span>Add</span></button></div></section>}</main>
  </div>;
}
