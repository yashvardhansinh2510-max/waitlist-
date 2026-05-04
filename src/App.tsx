import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "./lib/supabase";
import "./index.css";

const BASE = import.meta.env.BASE_URL;

function App() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [alreadyExists, setAlreadyExists] = useState(false);
  const [loading, setLoading] = useState(false);

  const playSuccessSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      // Tone 1 (C6)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1046.50, ctx.currentTime);
      gain1.gain.setValueAtTime(0, ctx.currentTime);
      gain1.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.02);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.15);

      // Tone 2 (E6)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.1);
      gain2.gain.setValueAtTime(0, ctx.currentTime + 0.1);
      gain2.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.1);
      osc2.stop(ctx.currentTime + 0.4);
    } catch (e) {
      // Audio not supported
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    if (!supabase) {
      alert("Supabase is not configured. Please add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to the .env file.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("waitlist")
        .insert([{ email: email.trim() }]);

      if (error) {
        if (error.code === "23505") {
          setAlreadyExists(true);
        } else {
          throw error;
        }
      }

      // Artificial delay for better UX feel
      await new Promise(resolve => setTimeout(resolve, 600));
      playSuccessSound();
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error("Error submitting email:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bb-page">
      <div className="bb-grid" aria-hidden="true" />

      <header className="bb-header">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bb-logo-row"
        >
          <img
            src={`${BASE}launchplan-logo.png`}
            alt="LaunchPlan mark"
            className="bb-logo-mark"
          />
          <div className="bb-logo-text">
            <span className="bb-logo-name">launchplan</span>
            <span className="bb-logo-tagline">plan · build · ship · scale</span>
          </div>
        </motion.div>
      </header>

      <main className="bb-main">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
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
        </motion.div>

        <div className="bb-form-container">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                transition={{ duration: 0.4 }}
                className="bb-form"
                onSubmit={handleSubmit}
              >
                <input
                  type="email"
                  placeholder="your@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="bb-input"
                />
                <button
                  type="submit"
                  className="bb-button"
                  disabled={loading}
                >
                  {loading ? (
                    <motion.span
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      Joining...
                    </motion.span>
                  ) : "Get Early Access"}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20
                }}
                className="bb-success-card"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 30,
                    delay: 0.1 
                  }}
                  className="bb-success-icon"
                >
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <motion.path 
                      d="M6 16L13 23L26 9" 
                      stroke="#E84520" 
                      strokeWidth="3.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      initial={{ pathLength: 0, opacity: 0 }} 
                      animate={{ pathLength: 1, opacity: 1 }} 
                      transition={{ 
                        duration: 0.6, 
                        delay: 0.2, 
                        ease: [0.23, 1, 0.32, 1] 
                      }} 
                    />
                  </svg>
                </motion.div>
                <h3 className="bb-success-title">
                  {alreadyExists ? "You're already in!" : "You're in the inner circle!"}
                </h3>
                <p className="bb-success-text">
                  {alreadyExists 
                    ? "We've already got your email on the list." 
                    : "Check your inbox for your confirmation email."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="bb-disclaimer">
          Free, no credit card. No spam, ever.
        </p>
      </main>

      <footer className="bb-footer">
        <span className="bb-footer-text">launchplan.dev</span>
      </footer>
    </div>
  );
}

export default App;
