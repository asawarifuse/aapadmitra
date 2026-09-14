import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SetuCore = () => {
  const [villages, setVillages] = useState([]);
  const [form, setForm] = useState({ village_id: '', rainfall_mm: 35, water_level_m: 5.5, road_status: 'normal' });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8000/api/v1/villages')
      .then(res => setVillages(res.data))
      .catch(err => console.log(err));
  }, []);

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
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  const riskColor = (l) => ({ low: '#4caf50', medium: '#ffeb3b', high: '#ff9800', extreme: '#f44336' }[l] || '#999');

  return (
    <div style={s.container}>
      <div style={s.hero}>
        <div>
          <h1 style={s.heroTitle}>⚙️ SetuCore</h1>
          <p style={s.heroSub}>Adaptive incident engine — triggers all modules in real time</p>
        </div>
        <div style={s.heroBadge}>⚡ Central Controller</div>
      </div>

      <div style={s.panel}>
        <div style={s.grid}>
          <div style={s.field}>
            <label style={s.label}>Select Village</label>
            <select value={form.village_id} onChange={e => setForm({...form, village_id: e.target.value})} style={s.input}>
              <option value="">Choose a village...</option>
              {villages.slice(0, 50).map(v => (
                <option key={v.village_id} value={v.village_id}>{v.village_name} — {v.district}</option>
              ))}
            </select>
          </div>
          <div style={s.field}>
            <label style={s.label}>Rainfall (mm)</label>
            <input type="number" value={form.rainfall_mm} onChange={e => setForm({...form, rainfall_mm: e.target.value})} style={s.input} />
          </div>
          <div style={s.field}>
            <label style={s.label}>Water Level (m)</label>
            <input type="number" value={form.water_level_m} onChange={e => setForm({...form, water_level_m: e.target.value})} style={s.input} />
          </div>
          <div style={s.field}>
            <label style={s.label}>Road Status</label>
            <select value={form.road_status} onChange={e => setForm({...form, road_status: e.target.value})} style={s.input}>
              <option value="normal">Normal</option>
              <option value="poor">Poor</option>
              <option value="flooded">Flooded</option>
            </select>
          </div>
        </div>
        <button onClick={handleUpdate} disabled={!form.village_id || loading} style={s.btn}>
          {loading ? '🔄 Processing...' : '⚙️ Trigger Incident Response'}
        </button>
      </div>

      {data && (
        <div style={s.results}>
          <div style={s.statusHeader}>
            <div style={{...s.riskBadge, background: riskColor(data.risk_level)}}>
              {data.risk_level.toUpperCase()}
            </div>
            <div style={s.riskScore}>
              Risk Score: <b>{(data.risk_score * 100).toFixed(1)}%</b>
            </div>
            {data.alert_triggered && (
              <div style={s.alertActive}>🚨 ALERT TRIGGERED</div>
            )}
          </div>

          <div style={s.infoGrid}>
            <div style={s.infoCard}>
              <div style={s.infoIcon}>🛣️</div>
              <div style={s.infoLabel}>Route Recommendation</div>
              <div style={s.infoValue}>{data.route_recommendation}</div>
            </div>
            <div style={s.infoCard}>
              <div style={s.infoIcon}>🚁</div>
              <div style={s.infoLabel}>Rescue Priority</div>
              <div style={{...s.infoValue, color: data.rescue_priority === 'URGENT' ? '#f44336' : '#1a2332'}}>
                {data.rescue_priority}
              </div>
            </div>
          </div>

          <div style={s.section}>
            <h3 style={s.sectionTitle}>⚡ Auto-Triggered Modules</h3>
            <div style={s.modulesGrid}>
              <ModuleCard icon="📊" name="Sanket" status="Updated" />
              <ModuleCard icon="🗺️" name="Marg" status="Route Ready" />
              <ModuleCard icon="🚁" name="Sahay" status="Teams Assigned" />
              <ModuleCard icon="📦" name="Rahat" status="Supplies Allocated" />
              <ModuleCard icon="📢" name="Awaaz" status="Alert Sent" />
              <ModuleCard icon="🏠" name="Drishti" status="Dashboard Updated" />
            </div>
          </div>

          <div style={s.section}>
            <h3 style={s.sectionTitle}>📦 Auto Relief Allocation</h3>
            <div style={s.suppliesGrid}>
              {Object.entries(data.relief_allocation).map(([k, v]) => (
                <div key={k} style={s.supplyCard}>
                  <div style={s.supplyValue}>{v.toLocaleString()}</div>
                  <div style={s.supplyLabel}>{k.replace('_', ' ').toUpperCase()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ModuleCard = ({ icon, name, status }) => (
  <div style={s.moduleCard}>
    <div style={s.moduleIcon}>{icon}</div>
    <div style={s.moduleName}>{name}</div>
    <div style={s.moduleStatus}>✅ {status}</div>
  </div>
);

const s = {
  container: { padding: '24px', background: '#f5f7fa', minHeight: '100vh' },
  hero: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' },
  heroTitle: { fontSize: '32px', fontWeight: '800', color: '#1a2332', marginBottom: '4px' },
  heroSub: { fontSize: '14px', color: '#1a2332', fontWeight: '500' },
  heroBadge: { padding: '8px 16px', background: 'linear-gradient(135deg, #1a237e, #4fc3f7)', color: '#ffffff', borderRadius: '20px', fontSize: '12px', fontWeight: '700' },
  panel: { background: '#ffffff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', marginBottom: '24px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '20px' },
  field: { display: 'flex', flexDirection: 'column' },
  label: { fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: '#1a2332' },
  input: { padding: '12px', border: '2px solid #e8ecf1', borderRadius: '10px', fontSize: '14px', background: '#f8f9fb', color: '#1a2332' },
  btn: { width: '100%', padding: '16px', background: 'linear-gradient(135deg, #1a237e, #283593)', color: '#ffffff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(26,35,126,0.3)' },
  results: { background: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', padding: '24px' },
  statusHeader: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' },
  riskBadge: { padding: '10px 20px', color: '#ffffff', borderRadius: '12px', fontSize: '14px', fontWeight: '800', letterSpacing: '1px' },
  riskScore: { fontSize: '14px', color: '#1a2332', fontWeight: '600' },
  alertActive: { padding: '6px 14px', background: '#ffebee', color: '#c62828', borderRadius: '10px', fontSize: '11px', fontWeight: '800', animation: 'pulse 2s infinite' },
  infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' },
  infoCard: { padding: '18px', background: '#f8f9fb', borderRadius: '12px' },
  infoIcon: { fontSize: '24px', marginBottom: '8px' },
  infoLabel: { fontSize: '11px', color: '#1a2332', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' },
  infoValue: { fontSize: '14px', fontWeight: '600', color: '#1a2332', lineHeight: 1.4 },
  section: { marginBottom: '24px' },
  sectionTitle: { fontSize: '16px', fontWeight: '700', color: '#1a2332', marginBottom: '16px' },
  modulesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' },
  moduleCard: { padding: '16px', background: 'linear-gradient(135deg, #e8eaf6, #f0f2f5)', borderRadius: '12px', textAlign: 'center' },
  moduleIcon: { fontSize: '28px', marginBottom: '6px' },
  moduleName: { fontSize: '13px', fontWeight: '700', color: '#1a2332', marginBottom: '4px' },
  moduleStatus: { fontSize: '11px', color: '#2e7d32', fontWeight: '600' },
  suppliesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' },
  supplyCard: { padding: '16px', background: '#f8f9fb', borderRadius: '12px', textAlign: 'center' },
  supplyValue: { fontSize: '22px', fontWeight: '800', color: '#1a237e', marginBottom: '4px' },
  supplyLabel: { fontSize: '11px', color: '#1a2332', fontWeight: '600', textTransform: 'uppercase' }
};

export default SetuCore;