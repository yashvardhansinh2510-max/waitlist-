import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, Link } from "wouter";
import { supabase } from "../lib/supabase";

const BASE = import.meta.env.BASE_URL;

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setLocation("/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert("Check your email for the confirmation link!");
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bb-page">
      <div className="bb-grid" aria-hidden="true" />

      <header className="bb-header">
        <Link href="/">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bb-logo-row"
            style={{ cursor: "pointer" }}
          >
            <img
              src={`${BASE}launchplan-logo.png`}
              alt="LaunchPlan mark"
              className="bb-logo-mark"
            />
            <div className="bb-logo-text">
              <span className="bb-logo-name">launchplan</span>
            </div>
          </motion.div>
        </Link>
      </header>

      <main className="bb-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bb-auth-card"
        >
          <h2 className="bb-auth-title">{isLogin ? "Welcome Back" : "Join LaunchPlan"}</h2>
          <p className="bb-auth-subtitle">
            {isLogin 
              ? "Enter your details to access your portal." 
              : "Create an account to start building."}
          </p>

          <form className="bb-auth-form" onSubmit={handleAuth}>
            <div className="bb-input-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bb-auth-input"
              />
            </div>

            <div className="bb-input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bb-auth-input"
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bb-auth-error"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button type="submit" className="bb-auth-button" disabled={loading}>
              {loading ? "Processing..." : (isLogin ? "Sign In" : "Create Account")}
            </button>
          </form>

          <div className="bb-auth-footer">
            <span>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </span>
            <button 
              className="bb-auth-toggle"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign Up" : "Log In"}
            </button>
          </div>
        </motion.div>
      </main>

      <footer className="bb-footer">
        <span className="bb-footer-text">launchplan.dev</span>
      </footer>
    </div>
  );
}
