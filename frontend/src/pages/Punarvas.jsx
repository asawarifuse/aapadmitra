import React, { useState } from 'react';
import axios from 'axios';

const Punarvas = () => {
  const [villageId, setVillageId] = useState('');
  const [damage, setDamage] = useState('medium');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAssess = async () => {
    if (!villageId) return;
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/v1/assess', {
        village_id: parseInt(villageId),
        estimated_damage: damage
      });
      setData(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (s) => {
    const colors = { just_started: '#f44336', in_progress: '#ff9800', mostly_complete: '#4caf50' };
    return colors[s] || '#999';
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🏗️ Punarvas — Recovery Tracking</h1>
      <p style={styles.subtitle}>Post-flood damage assessment and recovery monitoring</p>

      <div style={styles.panel}>
        <div style={styles.grid}>
          <div style={styles.group}>
            <label style={styles.label}>Village ID</label>
            <input type="number" value={villageId} onChange={e => setVillageId(e.target.value)} placeholder="Village ID" style={styles.input} />
          </div>
          <div style={styles.group}>
            <label style={styles.label}>Estimated Damage</label>
            <select value={damage} onChange={e => setDamage(e.target.value)} style={styles.input}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="extreme">Extreme</option>
            </select>
          </div>
        </div>
        <button onClick={handleAssess} disabled={!villageId || loading} style={styles.btn}>
          {loading ? '🔄 Assessing...' : '🏗️ Assess Damage'}
        </button>
      </div>

      {data && (
        <div style={styles.results}>
          <div style={styles.damageGrid}>
            <div style={styles.damageCard}>
              <div style={styles.damageIcon}>🏠</div>
              <div style={styles.damageValue}>{data.homes_damaged}</div>
              <div style={styles.damageLabel}>Homes Damaged</div>
            </div>
            <div style={{...styles.damageCard, background: '#ffebee'}}>
              <div style={styles.damageIcon}>💔</div>
              <div style={{...styles.damageValue, color: '#c62828'}}>{data.homes_destroyed}</div>
              <div style={styles.damageLabel}>Homes Destroyed</div>
            </div>
            <div style={styles.damageCard}>
              <div style={styles.damageIcon}>🛣️</div>
              <div style={{...styles.damageValue, fontSize: '16px'}}>{data.infrastructure_damaged}</div>
              <div style={styles.damageLabel}>Infrastructure</div>
            </div>
          </div>

          <div style={styles.recoveryBox}>
            <div style={styles.recoveryRow}>
              <span style={styles.recoveryLabel}>Recovery Status</span>
              <span style={{...styles.statusBadge, background: statusColor(data.recovery_status)}}>
                {data.recovery_status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <div style={styles.recoveryRow}>
              <span style={styles.recoveryLabel}>Aid Provided</span>
              <span style={styles.recoveryValue}>₹{data.aid_provided.toLocaleString()}</span>
            </div>
            <div style={styles.recoveryRow}>
              <span style={styles.recoveryLabel}>Est. Recovery Time</span>
              <span style={styles.recoveryValue}>{data.estimated_recovery_days} days</span>
            </div>
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
  damageGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' },
  damageCard: { padding: '20px', background: '#f8f9fb', borderRadius: '8px', textAlign: 'center' },
  damageIcon: { fontSize: '28px', marginBottom: '8px' },
  damageValue: { fontSize: '24px', fontWeight: '700', color: '#1a237e', marginBottom: '4px' },
  damageLabel: { fontSize: '12px', color: '#5a6a7e' },
  recoveryBox: { padding: '20px', background: '#f8f9fb', borderRadius: '8px' },
  recoveryRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #e8ecf1' },
  recoveryLabel: { fontSize: '14px', color: '#5a6a7e' },
  recoveryValue: { fontSize: '15px', fontWeight: '700', color: '#1a237e' },
  statusBadge: { fontSize: '11px', color: 'white', padding: '4px 12px', borderRadius: '12px', fontWeight: '700' }
};

export default Punarvas;