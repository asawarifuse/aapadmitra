import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Punarvas = () => {
  const [villages, setVillages] = useState([]);
  const [villageId, setVillageId] = useState('');
  const [damage, setDamage] = useState('medium');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8000/api/v1/villages')
      .then(res => setVillages(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleAssess = async () => {
    if (!villageId) return;
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/v1/assess', {
        village_id: parseInt(villageId),
        estimated_damage: damage
      });
      setData(res.data);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  const statusColor = (s) => ({ just_started: '#f44336', in_progress: '#ff9800', mostly_complete: '#4caf50' }[s] || '#999');

  return (
    <div style={s.container}>
      <div style={s.hero}>
        <div>
          <h1 style={s.heroTitle}>🏗️ Punarvas</h1>
          <p style={s.heroSub}>Post-flood damage assessment and recovery monitoring</p>
        </div>
        <div style={s.heroBadge}>🔄 Recovery Tracking</div>
      </div>

      <div style={s.panel}>
        <div style={s.grid}>
          <div style={s.field}>
            <label style={s.label}>Select Village</label>
            <select value={villageId} onChange={e => setVillageId(e.target.value)} style={s.input}>
              <option value="">Choose a village...</option>
              {villages.slice(0, 50).map(v => (
                <option key={v.village_id} value={v.village_id}>{v.village_name} — {v.district}</option>
              ))}
            </select>
          </div>
          <div style={s.field}>
            <label style={s.label}>Estimated Damage</label>
            <select value={damage} onChange={e => setDamage(e.target.value)} style={s.input}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="extreme">Extreme</option>
            </select>
          </div>
        </div>
        <button onClick={handleAssess} disabled={!villageId || loading} style={s.btn}>
          {loading ? '🔄 Assessing...' : '🏗️ Assess Damage'}
        </button>
      </div>

      {data && (
        <div style={s.results}>
          <div style={s.statsRow}>
            <div style={s.statCard}>
              <div style={s.statIcon}>🏠</div>
              <div style={s.statValue}>{data.homes_damaged}</div>
              <div style={s.statLabel}>Homes Damaged</div>
            </div>
            <div style={{...s.statCard, background: '#ffebee'}}>
              <div style={s.statIcon}>💔</div>
              <div style={{...s.statValue, color: '#c62828'}}>{data.homes_destroyed}</div>
              <div style={s.statLabel}>Homes Destroyed</div>
            </div>
            <div style={s.statCard}>
              <div style={s.statIcon}>🛣️</div>
              <div style={{...s.statValue, fontSize: '16px'}}>{data.infrastructure_damaged}</div>
              <div style={s.statLabel}>Infrastructure</div>
            </div>
            <div style={s.statCard}>
              <div style={s.statIcon}>💰</div>
              <div style={{...s.statValue, fontSize: '18px'}}>₹{data.aid_provided.toLocaleString()}</div>
              <div style={s.statLabel}>Aid Provided</div>
            </div>
          </div>

          <div style={s.section}>
            <h3 style={s.sectionTitle}>📊 Recovery Status</h3>
            <div style={s.recoveryCard}>
              <div style={s.recoveryRow}>
                <span style={s.recoveryLabel}>Current Phase</span>
                <span style={{...s.statusBadge, background: statusColor(data.recovery_status)}}>
                  {data.recovery_status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <div style={s.recoveryRow}>
                <span style={s.recoveryLabel}>Estimated Recovery Time</span>
                <span style={s.recoveryValue}>{data.estimated_recovery_days} days</span>
              </div>
              <div style={s.recoveryRow}>
                <span style={s.recoveryLabel}>Total Aid Provided</span>
                <span style={s.recoveryValue}>₹{data.aid_provided.toLocaleString()}</span>
              </div>
            </div>

            <div style={s.progressSection}>
              <div style={s.progressHeader}>
                <span style={s.progressLabel}>Recovery Progress</span>
                <span style={s.progressValue}>
                  {data.recovery_status === 'just_started' ? '25%' : data.recovery_status === 'in_progress' ? '60%' : '90%'}
                </span>
              </div>
              <div style={s.progressTrack}>
                <div style={{
                  ...s.progressFill,
                  width: data.recovery_status === 'just_started' ? '25%' : data.recovery_status === 'in_progress' ? '60%' : '90%',
                  background: statusColor(data.recovery_status)
                }}></div>
              </div>
            </div>
          </div>

          <div style={s.summaryBox}>
            <div style={s.summaryIcon}>🏗️</div>
            <div>
              <div style={s.summaryTitle}>Recovery Assessment Complete</div>
              <div style={s.summaryText}>
                {data.homes_damaged} homes damaged, {data.homes_destroyed} destroyed. Recovery expected in {data.estimated_recovery_days} days.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const s = {
  container: { padding: '24px', background: '#f5f7fa', minHeight: '100vh' },
  hero: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' },
  heroTitle: { fontSize: '32px', fontWeight: '800', color: '#1a2332', marginBottom: '4px' },
  heroSub: { fontSize: '14px', color: '#1a2332', fontWeight: '500' },
  heroBadge: { padding: '8px 16px', background: 'linear-gradient(135deg, #1a237e, #4fc3f7)', color: '#ffffff', borderRadius: '20px', fontSize: '12px', fontWeight: '700' },
  panel: { background: '#ffffff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', marginBottom: '24px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' },
  field: { display: 'flex', flexDirection: 'column' },
  label: { fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: '#1a2332' },
  input: { padding: '12px', border: '2px solid #e8ecf1', borderRadius: '10px', fontSize: '14px', background: '#f8f9fb', color: '#1a2332' },
  btn: { width: '100%', padding: '16px', background: 'linear-gradient(135deg, #1a237e, #283593)', color: '#ffffff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(26,35,126,0.3)' },
  results: { background: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', padding: '24px' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
  statCard: { padding: '20px', background: '#f8f9fb', borderRadius: '12px', textAlign: 'center' },
  statIcon: { fontSize: '28px', marginBottom: '8px' },
  statValue: { fontSize: '24px', fontWeight: '800', color: '#1a237e', marginBottom: '4px' },
  statLabel: { fontSize: '11px', color: '#1a2332', fontWeight: '600', textTransform: 'uppercase' },
  section: { marginBottom: '24px' },
  sectionTitle: { fontSize: '16px', fontWeight: '700', color: '#1a2332', marginBottom: '16px' },
  recoveryCard: { padding: '20px', background: '#f8f9fb', borderRadius: '12px', marginBottom: '20px' },
  recoveryRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #e8ecf1' },
  recoveryLabel: { fontSize: '13px', color: '#1a2332', fontWeight: '600' },
  recoveryValue: { fontSize: '15px', fontWeight: '800', color: '#1a237e' },
  statusBadge: { fontSize: '11px', color: '#ffffff', padding: '5px 12px', borderRadius: '12px', fontWeight: '700' },
  progressSection: { padding: '20px', background: '#f8f9fb', borderRadius: '12px' },
  progressHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
  progressLabel: { fontSize: '13px', color: '#1a2332', fontWeight: '600' },
  progressValue: { fontSize: '14px', fontWeight: '800', color: '#1a237e' },
  progressTrack: { height: '12px', background: '#e8ecf1', borderRadius: '6px', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: '6px', transition: 'width 0.8s' },
  summaryBox: { padding: '20px', background: 'linear-gradient(135deg, #e8f5e9, #f1f8e9)', borderRadius: '12px', display: 'flex', gap: '16px', alignItems: 'center' },
  summaryIcon: { fontSize: '32px' },
  summaryTitle: { fontSize: '15px', fontWeight: '700', color: '#2e7d32', marginBottom: '4px' },
  summaryText: { fontSize: '13px', color: '#1b5e20', lineHeight: 1.5 }
};

export default Punarvas;