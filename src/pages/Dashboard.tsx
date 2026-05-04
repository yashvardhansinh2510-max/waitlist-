import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { supabase } from "../lib/supabase";

const BASE = import.meta.env.BASE_URL;

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLocation("/auth");
      } else {
        setUser(session.user);
      }
      setLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setLocation("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [setLocation]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setLocation("/");
  };

  if (loading) return null;

  return (
    <div className="bb-page">
      <div className="bb-grid" aria-hidden="true" />

      <header className="bb-header">
        <div className="bb-header-container">
          <div className="bb-logo-row">
            <img
              src={`${BASE}launchplan-logo.png`}
              alt="LaunchPlan mark"
              className="bb-logo-mark"
            />
            <div className="bb-logo-text">
              <span className="bb-logo-name">launchplan</span>
            </div>
          </div>

          <button onClick={handleLogout} className="bb-nav-link">
            Sign Out
          </button>
        </div>
      </header>

      <main className="bb-main">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bb-dashboard-card"
        >
          <div className="bb-badge">Dashboard</div>
          <h1 className="bb-heading">Welcome back,</h1>
          <p className="bb-dashboard-user">{user?.email}</p>

          <div className="bb-dashboard-content">
            <p>You're successfully authenticated. This is your private portal for LaunchPlan.</p>
            <div className="bb-dashboard-placeholder">
              {/* Future features like referral links, blueprints, etc. could go here */}
              Coming Soon: Early Access Blueprints
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="bb-footer">
        <span className="bb-footer-text">launchplan.dev</span>
      </footer>
    </div>
  );
}
