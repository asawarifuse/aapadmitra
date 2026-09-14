import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8000/api/v1/dashboard';
const REFRESH_INTERVAL_MS = 30000;
const ALERT_THRESHOLD = 10;

const DEMO_DATA = {
  total_villages: 313,
  high_risk_villages: 28,
  active_alerts: 12,
  rescue_teams_deployed: 8,
  rescue_teams_available: 4,
  shelters_occupied: 320,
  shelters_capacity: 500,
};

const MODULES = [
  { path: '/sanket',   icon: '📊', name: 'Sanket',      desc: 'Flood Risk Prediction',   color: '#1a237e' },
  { path: '/marg',     icon: '🗺️', name: 'Marg',        desc: 'Safe Route Finder',        color: '#2196f3' },
  { path: '/sahay',    icon: '🚁', name: 'Sahay',       desc: 'Rescue Assignment',        color: '#e91e63' },
  { path: '/rahat',    icon: '📦', name: 'Rahat',       desc: 'Relief Allocation',        color: '#4caf50' },
  { path: '/smriti',   icon: '📚', name: 'Smriti',      desc: 'Historical Events',        color: '#9c27b0' },
  { path: '/setucore', icon: '⚙️', name: 'SetuCore',    desc: 'Incident Engine',          color: '#ff6f00' },
  { path: '/chetna',   icon: '📝', name: 'Chetna',      desc: 'Ground Reports',           color: '#795548' },
  { path: '/sahayak',  icon: '👥', name: 'Sahayak',     desc: 'Volunteer Coordination',   color: '#009688' },
  { path: '/awaaz',    icon: '📢', name: 'Awaaz',       desc: 'Multi-Language Alerts',    color: '#ff5722' },
  { path: '/punarvas', icon: '🏗️', name: 'Punarvas',    desc: 'Recovery Tracking',        color: '#607d8b' },
  { path: '/disha',    icon: '🎯', name: 'Disha',       desc: 'What-If Simulator',        color: '#3f51b5' },
  { path: '/setucore', icon: '🖥️', name: 'Drishti Live', desc: 'Command Dashboard',       color: '#c62828' },
];

const safeNum = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};
const pct = (num, den) => {
  const n = safeNum(num); const d = safeNum(den);
  if (d <= 0) return 0;
  return Math.min(100, Math.round((n / d) * 100));
};

const Drishti = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataMode, setDataMode] = useState('demo');
  const [lastUpdated, setLastUpdated] = useState(null);
  const navigate = useNavigate();
  const mountedRef = useRef(true);

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await axios.get(API_URL, { timeout: 8000 });
      if (!mountedRef.current) return;
      if (res?.data && typeof res.data === 'object') {
        setData(res.data);
        setDataMode('live');
      } else throw new Error('Malformed');
    } catch (err) {
      if (!mountedRef.current) return;
      setData((prev) => prev ?? DEMO_DATA);
      setDataMode('demo');
    } finally {
      if (mountedRef.current) {
        setLastUpdated(new Date());
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchDashboard();
    const id = setInterval(fetchDashboard, REFRESH_INTERVAL_MS);
    return () => { mountedRef.current = false; clearInterval(id); };
  }, [fetchDashboard]);

  const totalVillages = safeNum(data?.total_villages);
  const highRisk = safeNum(data?.high_risk_villages);
  const activeAlerts = safeNum(data?.active_alerts);
  const rescueDeployed = safeNum(data?.rescue_teams_deployed);
  const rescueAvailable = data?.rescue_teams_available != null ? safeNum(data.rescue_teams_available) : null;
  const sheltersOccupied = safeNum(data?.shelters_occupied);
  const sheltersCapacity = safeNum(data?.shelters_capacity);
  const shelterPct = pct(sheltersOccupied, sheltersCapacity);
  const highRiskPct = pct(highRisk, totalVillages);

  if (loading) return <div style={S.loading}>Loading Command Center…</div>;

  const time = lastUpdated ? lastUpdated.toLocaleTimeString() : '—';

  return (
    <div style={S.container}>
      {/* HEADER */}
      <div style={S.header}>
        <div>
          <div style={S.eyebrow}>OPERATIONAL COMMAND CENTER</div>
          <h1 style={S.title}>Drishti Dashboard</h1>
          <p style={S.subtitle}>Real-time flood monitoring · 12 integrated modules · TRL-4 Prototype</p>
        </div>
        <div style={S.headerRight}>
          <div style={S.livePill}>
            <span style={S.liveDot}></span>
            LIVE · {time}
          </div>
          <div style={{ ...S.modePill, ...(dataMode === 'live' ? S.modeLive : S.modeDemo) }}>
            {dataMode === 'live' ? '● API Connected' : '● Demo Data'}
          </div>
        </div>
      </div>

      {/* CRITICAL BANNER */}
      {(highRisk >= ALERT_THRESHOLD || activeAlerts >= ALERT_THRESHOLD) && (
        <div style={S.banner}>
          <div style={S.bannerIcon}>⚠️</div>
          <div style={S.bannerContent}>
            <strong>Immediate Attention Required</strong>
            <span>{activeAlerts} active alerts · {highRisk} high-risk villages require monitoring</span>
          </div>
          <button style={S.bannerBtn} onClick={() => navigate('/sanket')}>Review Alerts →</button>
        </div>
      )}

      {/* PRIMARY METRICS */}
      <div style={S.metricsGrid}>
        <MetricCard icon="🏘️" label="Total Villages" value={totalVillages} sub="Monitored" color="#1a237e" />
        <MetricCard icon="⚠️" label="High Risk" value={highRisk} sub={`${highRiskPct}% of total`} color="#f44336" alert />
        <MetricCard icon="🔔" label="Active Alerts" value={activeAlerts} sub="Needs action" color="#ff9800" alert />
        <MetricCard icon="🚁" label="Rescue Teams" value={rescueDeployed}
          sub={rescueAvailable != null ? `${rescueAvailable} available` : 'Deployed'} color="#4caf50" />
        <MetricCard icon="🏕️" label="Shelters" value={`${sheltersOccupied}/${sheltersCapacity}`}
          sub={`${shelterPct}% occupied`} color="#2196f3" progress={shelterPct} />
      </div>

      {/* MODULES GRID */}
      <div style={S.sectionHeader}>
        <h2 style={S.sectionTitle}>🧩 System Modules</h2>
        <span style={S.sectionCount}>12 Operational</span>
      </div>

      <div style={S.modulesGrid}>
        {MODULES.map((m) => (
          <div key={m.path + m.name}
            style={{ ...S.moduleCard, borderTop: `4px solid ${m.color}` }}
            onClick={() => navigate(m.path)}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
            }}>
            <div style={{ ...S.moduleIcon, background: `${m.color}15`, color: m.color }}>{m.icon}</div>
            <div style={S.moduleName}>{m.name}</div>
            <div style={S.moduleDesc}>{m.desc}</div>
            <div style={S.moduleStatus}>
              <span style={{ ...S.moduleStatusDot, background: m.color }}></span>
              Active
            </div>
          </div>
        ))}
      </div>

      {/* ANIMATION */}
      <style>{`
        @keyframes drishtiPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.5; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
};

const MetricCard = ({ icon, label, value, sub, color, progress, alert }) => (
  <div style={{ ...S.metricCard, borderLeft: `4px solid ${color}` }}>
    <div style={S.metricIcon}>{icon}</div>
    <div style={S.metricBody}>
      <div style={S.metricLabel}>{label}</div>
      <div style={{ ...S.metricValue, color }}>
        {value}
        {alert && value > 0 && <span style={S.metricAlertDot} />}
      </div>
      <div style={S.metricSub}>{sub}</div>
      {progress != null && (
        <div style={S.metricProgress}>
          <div style={{ ...S.metricProgressFill, width: `${progress}%`, background: color }} />
        </div>
      )}
    </div>
  </div>
);

// ---------- STYLES ----------
const S = {
  container: { padding: '28px 32px', background: '#f5f7fa', minHeight: '100vh', color: '#1a2332', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
  loading: { padding: '80px', textAlign: 'center', fontSize: '20px', color: '#1a2332', fontWeight: 600 },

  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '24px', flexWrap: 'wrap', marginBottom: '24px' },
  eyebrow: { fontSize: '13px', fontWeight: 800, letterSpacing: '2.5px', color: '#4fc3f7', marginBottom: '8px' },
  title: { fontSize: '42px', fontWeight: 800, margin: '0 0 8px 0', color: '#1a2332', letterSpacing: '-0.7px' },
  subtitle: { fontSize: '16px', color: '#5a6a7e', margin: 0, fontWeight: 500 },
  headerRight: { display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' },
  livePill: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 20px', background: '#fff', borderRadius: '22px', fontSize: '14px', fontWeight: 700, color: '#2e7d32', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  liveDot: { width: '10px', height: '10px', borderRadius: '50%', background: '#4caf50', animation: 'drishtiPulse 1.5s infinite' },
  modePill: { padding: '10px 20px', borderRadius: '22px', fontSize: '14px', fontWeight: 700 },
  modeLive: { background: '#e8f5e9', color: '#2e7d32' },
  modeDemo: { background: '#fff3e0', color: '#e65100' },

  banner: { display: 'flex', alignItems: 'center', gap: '20px', padding: '18px 26px', background: 'linear-gradient(90deg, #ffebee, #fff)', borderLeft: '6px solid #f44336', borderRadius: '14px', marginBottom: '24px', flexWrap: 'wrap', boxShadow: '0 2px 8px rgba(244,67,54,0.1)' },
  bannerIcon: { fontSize: '32px' },
  bannerContent: { flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' },
  bannerBtn: { padding: '12px 22px', background: '#f44336', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '15px', cursor: 'pointer' },

  metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '18px', marginBottom: '36px' },
  metricCard: { background: '#fff', padding: '22px 20px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', gap: '14px' },
  metricIcon: { fontSize: '32px' },
  metricBody: { flex: 1, minWidth: 0 },
  metricLabel: { fontSize: '13px', textTransform: 'uppercase', fontWeight: 800, color: '#5a6a7e', letterSpacing: '0.6px', marginBottom: '6px' },
  metricValue: { fontSize: '32px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', lineHeight: 1.1 },
  metricAlertDot: { width: '10px', height: '10px', borderRadius: '50%', background: '#f44336', animation: 'drishtiPulse 1.5s infinite' },
  metricSub: { fontSize: '13px', color: '#5a6a7e', fontWeight: 600, marginTop: '4px' },
  metricProgress: { marginTop: '8px', height: '6px', background: '#e8ecf1', borderRadius: '3px', overflow: 'hidden' },
  metricProgressFill: { height: '100%', transition: 'width 0.5s' },

  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  sectionTitle: { fontSize: '30px', fontWeight: 800, margin: 0, color: '#1a2332', letterSpacing: '-0.5px' },
  sectionCount: { fontSize: '14px', fontWeight: 700, background: '#e8eaf6', color: '#1a237e', padding: '8px 18px', borderRadius: '22px' },

  modulesGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '20px' },
  moduleCard: { background: '#fff', padding: '22px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', cursor: 'pointer', transition: 'all 0.2s' },
  moduleIcon: { width: '56px', height: '56px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', marginBottom: '14px' },
  moduleName: { fontSize: '19px', fontWeight: 800, color: '#1a2332', marginBottom: '4px' },
  moduleDesc: { fontSize: '14px', color: '#5a6a7e', fontWeight: 500, marginBottom: '14px' },
  moduleStatus: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 700, color: '#2e7d32', textTransform: 'uppercase' },
  moduleStatusDot: { width: '8px', height: '8px', borderRadius: '50%' },
};

export default Drishti;