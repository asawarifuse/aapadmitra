import React, { useState } from 'react';
import axios from 'axios';

const SetuCore = () => {
  const [form, setForm] = useState({
    village_id: '',
    rainfall_mm: 35,
    water_level_m: 5.5,
    road_status: 'normal'
  });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!form.village_id) return;
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/v1/update', {
        ...form,
        village_id: parseInt(form.village_id),
        rainfall_mm: parseFloat(form.rainfall_mm),
        water_level_m: parseFloat(form.water_level_m)
      });
      setData(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const riskColor = (l) => {
    const colors = { low: '#4caf50', medium: '#ffeb3b', high: '#ff9800', extreme: '#f44336' };
    return colors[l] || '#999';
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>⚙️ SetuCore — Incident Engine</h1>
      <p style={styles.subtitle}>Adaptive incident response — updates all modules in real time</p>

      <div style={styles.panel}>
        <div style={styles.grid}>
          <div style={styles.group}>
            <label style={styles.label}>Village ID</label>
            <input type="number" value={form.village_id} onChange={e => setForm({...form, village_id: e.target.value})} placeholder="Village ID" style={styles.input} />
          </div>
          <div style={styles.group}>
            <label style={styles.label}>Rainfall (mm)</label>
            <input type="number" value={form.rainfall_mm} onChange={e => setForm({...form, rainfall_mm: e.target.value})} style={styles.input} />
          </div>
          <div style={styles.group}>
            <label style={styles.label}>Water Level (m)</label>
            <input type="number" value={form.water_level_m} onChange={e => setForm({...form, water_level_m: e.target.value})} style={styles.input} />
          </div>
          <div style={styles.group}>
            <label style={styles.label}>Road Status</label>
            <select value={form.road_status} onChange={e => setForm({...form, road_status: e.target.value})} style={styles.input}>
              <option value="normal">Normal</option>
              <option value="poor">Poor</option>
              <option value="flooded">Flooded</option>
            </select>
          </div>
        </div>
        <button onClick={handleUpdate} disabled={!form.village_id || loading} style={styles.btn}>
          {loading ? '🔄 Updating...' : '⚙️ Update Incident'}
        </button>
      </div>

      {data && (
        <div style={styles.results}>
          <div style={styles.header}>
            <span style={{...styles.riskBadge, background: riskColor(data.risk_level)}}>
              {data.risk_level.toUpperCase()}
            </span>
            <span style={styles.riskScore}>Risk Score: {(data.risk_score * 100).toFixed(1)}%</span>
            {data.alert_triggered && <span style={styles.alertBadge}>🚨 ALERT TRIGGERED</span>}
          </div>

          <div style={styles.infoGrid}>
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>Route Recommendation</div>
              <div style={styles.infoValue}>{data.route_recommendation}</div>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>Rescue Priority</div>
              <div style={{...styles.infoValue, color: data.rescue_priority === 'URGENT' ? '#f44336' : '#1a2332'}}>
                {data.rescue_priority}
              </div>
            </div>
          </div>

          <h3 style={styles.sectionTitle}>Auto Relief Allocation</h3>
          <div style={styles.supplies}>
            {Object.entries(data.relief_allocation).map(([k, v]) => (
              <div key={k} style={styles.supplyCard}>
                <div style={styles.supplyValue}>{v}</div>
                <div style={styles.supplyLabel}>{k.replace('_', ' ').toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

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
  header: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' },
  riskBadge: { fontSize: '13px', color: 'white', padding: '6px 16px', borderRadius: '12px', fontWeight: '700' },
  riskScore: { fontSize: '14px', color: '#5a6a7e', fontWeight: '600' },
  alertBadge: { fontSize: '11px', background: '#ffebee', color: '#c62828', padding: '4px 10px', borderRadius: '10px', fontWeight: '700' },
  infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' },
  infoCard: { padding: '16px', background: '#f8f9fb', borderRadius: '8px' },
  infoLabel: { fontSize: '12px', color: '#5a6a7e', marginBottom: '6px' },
  infoValue: { fontSize: '15px', fontWeight: '600' },
  sectionTitle: { fontSize: '16px', marginBottom: '12px' },
  supplies: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' },
  supplyCard: { padding: '16px', background: '#f8f9fb', borderRadius: '8px', textAlign: 'center' },
  supplyValue: { fontSize: '22px', fontWeight: '700', color: '#1a237e', marginBottom: '4px' },
  supplyLabel: { fontSize: '11px', color: '#5a6a7e' }
};

export default SetuCore;