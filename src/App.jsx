import { useState } from "react";

const startingUrl = "https://example.com";
const tabs = ["Home", "README.md", "Yuki Browser"];

export default function App() {
  const [address, setAddress] = useState(startingUrl);
  const [activeTab, setActiveTab] = useState("Yuki Browser");
  const [pageUrl, setPageUrl] = useState(startingUrl);

  const open = (event) => {
    event.preventDefault();
    const value = address.trim();
    if (!value) return;
    const next = /^[a-z][a-z\d+.-]*:/i.test(value) ? value : `https://${value}`;
    setAddress(next);
    setPageUrl(next);
  };

  return (
    <div className="browser-shell">
      <div className="browser-window">
        <div className="browser-topbar">
          <div className="tab-strip">
            {tabs.map((tab) => (
              <button className={`tab ${activeTab === tab ? "active" : ""}`} key={tab} onClick={() => setActiveTab(tab)}>
                <span className="tab-icon">●</span><span>{tab}</span><span className="tab-close">×</span>
              </button>
            ))}
            <button className="new-tab">+</button>
          </div>
          <div className="browser-actions"><button>—</button><button>□</button><button>×</button></div>
        </div>
        <div className="address-row">
          <div className="nav-buttons"><button>←</button><button>→</button><button onClick={() => setPageUrl(pageUrl)}>↻</button></div>
          <form className="address-bar" onSubmit={open}><span>●</span><input value={address} onChange={(event) => setAddress(event.target.value)} aria-label="Address" /></form>
          <div className="utility-buttons"><button>☆</button><button>◉</button><button>⋯</button></div>
        </div>
        <main className="browser-page"><iframe title="Browser content" src={pageUrl} /></main>
      </div>
    </div>
  );
}
