import { useState } from "react";
import "./index.css";

const BASE = import.meta.env.BASE_URL;

function App() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div className="bb-page">
      <div className="bb-grid" aria-hidden="true" />

      <header className="bb-header">
        <div className="bb-logo-row">
          <img
            src={`${BASE}logo-mark.png`}
            alt="Build Brief mark"
            className="bb-logo-mark"
          />
          <div className="bb-logo-text">
            <span className="bb-logo-name">build brief</span>
            <span className="bb-logo-tagline">plan · build · ship · scale</span>
          </div>
        </div>
      </header>

      <main className="bb-main">
        <div className="bb-badge">
          <span className="bb-badge-dot" />
          Coming Soon
        </div>

        <h1 className="bb-heading">
          Ship a real startup
          <span className="bb-heading-accent">by Monday.</span>
        </h1>

        <p className="bb-subheading">
          Most founders spend months on ideas that die in Notion. We hand you
          one that's already validated, blueprinted, and ready to ship —
          every single Friday.
        </p>

        {!submitted ? (
          <form className="bb-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="your@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bb-input"
            />
            <button type="submit" className="bb-button">
              Get Early Access
            </button>
          </form>
        ) : (
          <div className="bb-success">
            You're in. See you Friday.
          </div>
        )}

        <p className="bb-disclaimer">
          Free, no credit card. No spam, ever.
        </p>
      </main>

      <footer className="bb-footer">
        <span className="bb-footer-text">buildbrief.club</span>
      </footer>
    </div>
  );
}

export default App;
