import { useEffect, useMemo, useState } from "react";

const icon = (name) => `https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/${name}.svg`;
const sites = [
  ["youtube", "YouTube", "https://www.youtube.com"],
  ["github", "GitHub", "https://github.com"],
  ["discord", "Discord", "https://discord.com"],
  ["x", "Twitter", "https://x.com"],
  ["netflix", "Netflix", "https://www.netflix.com"],
  ["twitch", "Twitch", "https://www.twitch.tv"]
];

function normalize(value) {
  const text = value.trim();
  if (!text) return "https://example.com";
  if (text.includes(" ")) return `https://www.google.com/search?q=${encodeURIComponent(text)}`;
  return /^[a-z][a-z\d+.-]*:/i.test(text) ? text : `https://${text}`;
}

export default function App() {
  const [address, setAddress] = useState("");
  const [target, setTarget] = useState("");
  const [tab, setTab] = useState("Home");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [proxy, setProxy] = useState(() => localStorage.getItem("proxy") || "ultraviolet");
  const [transport, setTransport] = useState(() => localStorage.getItem("transport") || "libcurl");
  const [now, setNow] = useState(new Date());

  useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);
  useEffect(() => { localStorage.setItem("proxy", proxy); localStorage.setItem("transport", transport); }, [proxy, transport]);

  const proxiedUrl = useMemo(() => target ? `/api/proxy?proxy=${proxy}&transport=${transport}&url=${encodeURIComponent(target)}` : "", [target, proxy, transport]);
  const open = (value) => {
    try {
      const url = normalize(value);
      const parsed = new URL(url);
      setAddress(url);
      setTarget(url);
      setTab(parsed.hostname.replace(/^www\./, ""));
    } catch {
      setAddress(value);
    }
  };

  const submit = (event) => { event.preventDefault(); open(address); };
  const home = () => { setTarget(""); setAddress(""); setTab("Home"); };
  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  const date = now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="app">
      <header className="chrome">
        <div className="tab-row">
          <button className="tab active" onClick={home}><img src={icon("firefox")} alt="" /> <span>{tab}</span></button>
          <button className="new-tab" onClick={home} aria-label="New tab">+</button>
          <div className="window-actions"><button>−</button><button>↗</button><button>□</button><button>×</button></div>
        </div>
        <div className="navigation-row">
          <div className="nav-group"><button onClick={() => window.history.back()}>‹</button><button onClick={() => window.history.forward()}>›</button><button onClick={() => window.location.reload()}>↻</button></div>
          <form className="address-bar" onSubmit={submit}>
            <span className="lock">●</span>
            <input value={target ? proxiedUrl : address} onChange={(event) => setAddress(event.target.value)} placeholder="Search the web or enter address" aria-label="Address" />
          </form>
          <div className="tool-group"><button>◧</button><button>⌨</button><button>◫</button><button>⛶</button><button>☾</button><button>★</button><button onClick={() => setSettingsOpen((value) => !value)}>⚙</button><button>•••</button></div>
        </div>
      </header>

      {settingsOpen && <aside className="settings"><div className="settings-title"><strong>Settings</strong><button onClick={() => setSettingsOpen(false)}>×</button></div><label>Proxy<select value={proxy} onChange={(event) => setProxy(event.target.value)}><option value="ultraviolet">Ultraviolet</option><option value="scramjet">Scramjet</option></select></label><label>Transport<select value={transport} onChange={(event) => setTransport(event.target.value)}><option value="libcurl">libcurl</option><option value="wisp">Wisp</option><option value="epoxy-tls">Epoxy TLS</option></select></label><span className="active-mode">Active: {proxy} / {transport}</span></aside>}

      <main className="content">
        {target ? <iframe title="Proxied website" src={proxiedUrl} /> : <section className="home-page">
          <div className="sponsored">SPONSORED</div>
          <div className="ad-banner"><strong>Low-Cost Trading</strong><span>XM ULTRA LOW</span><button>Start Now</button></div>
          <div className="clock">{time}</div><div className="date">{date}</div>
          <form className="home-search" onSubmit={submit}><span>⌕</span><input value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Search the web..." /><select defaultValue="Brave"><option>Brave</option><option>Google</option><option>Bing</option></select></form>
          <div className="shortcuts">{sites.map(([logo, name, url]) => <button className="shortcut" key={name} onClick={() => open(url)}><span className="shortcut-icon"><img src={icon(logo)} alt="" /></span><span>{name}</span></button>)}</div>
        </section>}
      </main>
    </div>
  );
}
