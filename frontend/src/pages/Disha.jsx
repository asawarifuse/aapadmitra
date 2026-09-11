import React, { useState } from 'react';
import axios from 'axios';

const Disha = () => {
  const [form, setForm] = useState({ rainfall_mm: 60, duration_hrs: 48, river_level_m: 7.5, district: 'Barpeta' });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/v1/simulate', form);
      setData(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const riskColor = (level) => {
    const colors = { low: '#4caf50', medium: '#ffeb3b', high: '#ff9800', extreme: '#f44336' };
    return colors[level] || '#999';
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎯 Disha — What-If Simulator</h1>
      <p style={styles.subtitle}>Simulate flood scenarios and see projected impact</p>

      <div style={styles.panel}>
        <div style={styles.grid}>
          <div style={styles.group}>
            <label style={styles.label}>Rainfall (mm)</label>
            <input type="number" value={form.rainfall_mm} onChange={e => setForm({...form, rainfall_mm: parseFloat(e.target.value)})} style={styles.input} />
          </div>
          <div style={styles.group}>
            <label style={styles.label}>Duration (hrs)</label>
            <input type="number" value={form.duration_hrs} onChange={e => setForm({...form, duration_hrs: parseInt(e.target.value)})} style={styles.input} />
          </div>
          <div style={styles.group}>
            <label style={styles.label}>River Level (m)</label>
            <input type="number" value={form.river_level_m} onChange={e => setForm({...form, river_level_m: parseFloat(e.target.value)})} style={styles.input} />
          </div>
          <div style={styles.group}>
            <label style={styles.label}>District</label>
            <select value={form.district} onChange={e => setForm({...form, district: e.target.value})} style={styles.input}>
              {['Barpeta', 'Bongaigaon', 'Cachar', 'Darrang', 'Dhemaji', 'Dhubri', 'Dibrugarh'].map(d => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
        <button onClick={handleSimulate} disabled={loading} style={styles.btn}>
          {loading ? '🔄 Simulating...' : '🎯 Run Simulation'}
        </button>
      </div>

      {data && (
        <div style={styles.results}>
          <div style={styles.stats}>
            <Metric label="Scenario ID" value={data.scenario_id} small />
            <Metric label="Projected Risk" value={(data.projected_risk * 100).toFixed(1) + '%'} />
            <Metric label="Risk Level" value={data.risk_level.toUpperCase()} color={riskColor(data.risk_level)} />
            <Metric label="Predicted Depth" value={data.predicted_depth_m + ' m'} />
          </div>

          <div style={styles.affectedBox}>
            <span style={styles.affectedLabel}>Affected Villages:</span>
            <span style={styles.affectedValue}>{data.affected_villages}</span>
          </div>

          <h3 style={styles.sectionTitle}>Recommended Actions</h3>
          <div style={styles.actions}>
            {Object.entries(data.recommended_actions).map(([k, v]) => (
              <div key={k} style={styles.actionItem}>
                <span style={styles.actionKey}>{k.replace('_', ' ').toUpperCase()}</span>
                <span style={styles.actionValue}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Metric = ({ label, value, color, small }) => (
  <div style={styles.metric}>
    <div style={styles.metricLabel}>{label}</div>
    <div style={{...styles.metricValue, color: color || '#1a2332', fontSize: small ? '16px' : '22px'}}>{value}</div>
  </div>
);

const styles = {
  container: { padding: '24px', maxWidth: '900px', margin: '0 auto' },
  title: { fontSize: '28px', color: '#1a2332', marginBottom: '4px' },
  subtitle: { color: '#5a6a7e', fontSize: '14px', marginBottom: '24px' },
  panel: { background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '24px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' },
  group: { display: 'flex', flexDirection: 'column' },
  label: { fontSize: '13px', fontWeight: '600', marginBottom: '6px' },
  input: { padding: '10px', border: '1px solid #d0d7e2', borderRadius: '8px', fontSize: '14px' },
  btn: { width: '100%', padding: '12px', background: '#1a237e', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
  results: { background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' },
  metric: { textAlign: 'center', padding: '12px', background: '#f8f9fb', borderRadius: '8px' },
  metricLabel: { fontSize: '11px', color: '#5a6a7e', marginBottom: '4px' },
  metricValue: { fontSize: '22px', fontWeight: '700' },
  affectedBox: { padding: '16px', background: '#fff3e0', borderRadius: '8px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  affectedLabel: { fontWeight: '600', color: '#e65100' },
  affectedValue: { fontSize: '24px', fontWeight: '700', color: '#e65100' },
  sectionTitle: { fontSize: '16px', marginBottom: '12px' },
  actions: { display: 'flex', flexDirection: 'column', gap: '8px' },
  actionItem: { display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#f8f9fb', borderRadius: '8px' },
  actionKey: { fontSize: '12px', color: '#5a6a7e', fontWeight: '600' },
  actionValue: { fontSize: '13px', fontWeight: '600', color: '#1a237e' }
};

export default Disha;