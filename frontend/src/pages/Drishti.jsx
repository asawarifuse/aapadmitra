import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const Drishti = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8000/api/v1/dashboard')
      .then(res => setData(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={styles.loading}>Loading Dashboard...</div>;

  const COLORS = ['#4caf50', '#ffeb3b', '#ff9800', '#f44336'];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🏠 Drishti — Command Dashboard</h1>
      <p style={styles.subtitle}>Unified Command Center · Real-Time Flood Monitoring</p>

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        <StatCard label="Total Villages" value={data.total_villages} color="#1a237e" />
        <StatCard label="High Risk" value={data.high_risk_villages} color="#f44336" />
        <StatCard label="Active Alerts" value={data.active_alerts} color="#ff9800" />
        <StatCard label="Rescue Teams" value={data.rescue_teams_deployed} color="#4caf50" />
      </div>

      {/* Charts Row */}
      <div style={styles.chartsRow}>
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Severity Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={data.severity_distribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {data.severity_distribution.map((entry, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Weekly Alerts & Rescues</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.weekly_trend}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="alerts" stroke="#f44336" strokeWidth={2} />
              <Line type="monotone" dataKey="rescues" stroke="#4caf50" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Alerts */}
      <div style={styles.alertsCard}>
        <h3 style={styles.chartTitle}>🔔 Recent Alerts</h3>
        <div style={styles.alertsList}>
          {data.recent_alerts.map((a, i) => (
            <div key={i} style={styles.alertItem}>
              <span style={styles.alertTime}>{a.time}</span>
              <span style={styles.alertVillage}>{a.village}</span>
              <span style={{...styles.severityBadge, background: getSeverityColor(a.severity)}}>
                {a.severity.toUpperCase()}
              </span>
              <span style={styles.alertStatus}>{a.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color }) => (
  <div style={{...styles.statCard, borderLeft: `4px solid ${color}`}}>
    <div style={styles.statLabel}>{label}</div>
    <div style={{...styles.statValue, color}}>{value}</div>
  </div>
);

const getSeverityColor = (s) => {
  const colors = { low: '#4caf50', medium: '#ffeb3b', high: '#ff9800', extreme: '#f44336' };
  return colors[s] || '#999';
};

const styles = {
  container: { padding: '24px' },
  title: { fontSize: '28px', color: '#1a2332', marginBottom: '4px' },
  subtitle: { color: '#5a6a7e', fontSize: '14px', marginBottom: '24px' },
  loading: { padding: '40px', textAlign: 'center' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
  statCard: { background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  statLabel: { fontSize: '13px', color: '#5a6a7e', marginBottom: '6px' },
  statValue: { fontSize: '32px', fontWeight: '700' },
  chartsRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' },
  chartCard: { background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  chartTitle: { fontSize: '16px', color: '#1a2332', marginBottom: '16px' },
  alertsCard: { background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  alertsList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  alertItem: { display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', background: '#f8f9fb', borderRadius: '8px' },
  alertTime: { fontSize: '12px', color: '#5a6a7e', minWidth: '80px' },
  alertVillage: { flex: 1, fontWeight: '500' },
  severityBadge: { fontSize: '11px', color: 'white', padding: '3px 10px', borderRadius: '10px', fontWeight: '600' },
  alertStatus: { fontSize: '12px', color: '#5a6a7e' }
};

export default Drishti;