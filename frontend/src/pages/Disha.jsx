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
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  const riskColor = (level) => ({ low: '#4caf50', medium: '#ffeb3b', high: '#ff9800', extreme: '#f44336' }[level] || '#999');

  return (
    <div style={s.container}>
      <div style={s.hero}>
        <div>
          <h1 style={s.heroTitle}>🎯 Disha</h1>
          <p style={s.heroSub}>What-if simulator — test flood scenarios and see impact</p>
        </div>
        <div style={s.heroBadge}>🔬 Scenario Simulator</div>
      </div>

      <div style={s.panel}>
        <div style={s.grid}>
          <div style={s.field}>
            <label style={s.label}>Rainfall (mm)</label>
            <input type="number" value={form.rainfall_mm} onChange={e => setForm({...form, rainfall_mm: parseFloat(e.target.value)})} style={s.input} />
          </div>
          <div style={s.field}>
            <label style={s.label}>Duration (hrs)</label>
            <input type="number" value={form.duration_hrs} onChange={e => setForm({...form, duration_hrs: parseInt(e.target.value)})} style={s.input} />
          </div>
          <div style={s.field}>
            <label style={s.label}>River Level (m)</label>
            <input type="number" value={form.river_level_m} onChange={e => setForm({...form, river_level_m: parseFloat(e.target.value)})} style={s.input} />
          </div>
          <div style={s.field}>
            <label style={s.label}>District</label>
            <select value={form.district} onChange={e => setForm({...form, district: e.target.value})} style={s.input}>
              {['Barpeta', 'Bongaigaon', 'Cachar', 'Darrang', 'Dhemaji', 'Dhubri', 'Dibrugarh'].map(d => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
        <button onClick={handleSimulate} disabled={loading} style={s.btn}>
          {loading ? '🔄 Simulating...' : '🎯 Run Simulation'}
        </button>
      </div>

      {data && (
        <div style={s.results}>
          <div style={s.resultHeader}>
            <div>
              <div style={s.scenarioId}>{data.scenario_id}</div>
              <div style={s.scenarioSub}>Simulation complete</div>
            </div>
            <div style={{...s.riskBadge, background: riskColor(data.risk_level)}}>
              {data.risk_level.toUpperCase()} RISK
            </div>
          </div>

          <div style={s.statsRow}>
            <StatCard icon="📊" label="Projected Risk" value={`${(data.projected_risk * 100).toFixed(1)}%`} color={riskColor(data.risk_level)} />
            <StatCard icon="🌊" label="Predicted Depth" value={`${data.predicted_depth_m} m`} color="#2196f3" />
            <StatCard icon="🏘️" label="Affected Villages" value={data.affected_villages} color="#f44336" />
            <StatCard icon="⚠️" label="Risk Level" value={data.risk_level.toUpperCase()} color={riskColor(data.risk_level)} />
          </div>

          <div style={s.section}>
            <h3 style={s.sectionTitle}>⚡ Recommended Actions</h3>
            <div style={s.actionsGrid}>
              {Object.entries(data.recommended_actions).map(([k, v]) => (
                <div key={k} style={s.actionCard}>
                  <div style={s.actionIcon}>
                    {k === 'evacuation' ? '🏃' : k === 'rescue_teams' ? '🚁' : k === 'relief_supplies' ? '📦' : '🏕️'}
                  </div>
                  <div style={s.actionLabel}>{k.replace('_', ' ').toUpperCase()}</div>
                  <div style={s.actionValue}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={s.summaryBox}>
            <div style={s.summaryIcon}>🎯</div>
            <div>
              <div style={s.summaryTitle}>Simulation Complete</div>
              <div style={s.summaryText}>
                If {form.rainfall_mm}mm rainfall occurs over {form.duration_hrs} hours with river level at {form.river_level_m}m,
                approximately {data.affected_villages} villages will be affected with projected risk of {(data.projected_risk * 100).toFixed(1)}%.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div style={{...s.statCard, borderLeft: `4px solid ${color}`}}>
    <div style={s.statIcon}>{icon}</div>
    <div>
      <div style={s.statLabel}>{label}</div>
      <div style={{...s.statValue, color}}>{value}</div>
    </div>
  </div>
);

const s = {
  container: { padding: '24px', background: '#f5f7fa', minHeight: '100vh' },
  hero: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' },
  heroTitle: { fontSize: '32px', fontWeight: '800', color: '#1a2332', marginBottom: '4px' },
  heroSub: { fontSize: '14px', color: '#1a2332', fontWeight: '500' },
  heroBadge: { padding: '8px 16px', background: 'linear-gradient(135deg, #1a237e, #4fc3f7)', color: '#ffffff', borderRadius: '20px', fontSize: '12px', fontWeight: '700' },
  panel: { background: '#ffffff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', marginBottom: '24px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' },
  field: { display: 'flex', flexDirection: 'column' },
  label: { fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: '#1a2332' },
  input: { padding: '12px', border: '2px solid #e8ecf1', borderRadius: '10px', fontSize: '14px', background: '#f8f9fb', color: '#1a2332' },
  btn: { width: '100%', padding: '16px', background: 'linear-gradient(135deg, #1a237e, #283593)', color: '#ffffff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(26,35,126,0.3)' },
  results: { background: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', padding: '24px' },
  resultHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' },
  scenarioId: { fontSize: '20px', fontWeight: '800', color: '#1a2332', marginBottom: '4px' },
  scenarioSub: { fontSize: '12px', color: '#1a2332', fontWeight: '500' },
  riskBadge: { padding: '10px 20px', color: '#ffffff', borderRadius: '12px', fontSize: '14px', fontWeight: '800', letterSpacing: '1px' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
  statCard: { background: '#f8f9fb', padding: '18px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' },
  statIcon: { fontSize: '26px' },
  statLabel: { fontSize: '11px', color: '#1a2332', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase' },
  statValue: { fontSize: '20px', fontWeight: '800' },
  section: { marginBottom: '24px' },
  sectionTitle: { fontSize: '16px', fontWeight: '700', color: '#1a2332', marginBottom: '16px' },
  actionsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' },
  actionCard: { padding: '18px', background: '#f8f9fb', borderRadius: '12px', textAlign: 'center' },
  actionIcon: { fontSize: '28px', marginBottom: '8px' },
  actionLabel: { fontSize: '11px', color: '#1a2332', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' },
  actionValue: { fontSize: '14px', fontWeight: '700', color: '#1a237e', lineHeight: 1.4 },
  summaryBox: { padding: '20px', background: 'linear-gradient(135deg, #e8eaf6, #f0f2f5)', borderRadius: '12px', display: 'flex', gap: '16px', alignItems: 'center' },
  summaryIcon: { fontSize: '32px' },
  summaryTitle: { fontSize: '15px', fontWeight: '700', color: '#1a237e', marginBottom: '4px' },
  summaryText: { fontSize: '13px', color: '#1a2332', lineHeight: 1.5 }
};

export default Disha;