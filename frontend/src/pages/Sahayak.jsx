import React, { useState } from 'react';
import axios from 'axios';

const Sahayak = () => {
  const [villageId, setVillageId] = useState('');
  const [skill, setSkill] = useState('rescue');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAssign = async () => {
    if (!villageId) return;
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/v1/assign-volunteers', {
        village_id: parseInt(villageId),
        skill_needed: skill
      });
      setData(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>👥 Sahayak — Volunteer Coordination</h1>
      <p style={styles.subtitle}>Match volunteers to villages based on skills</p>

      <div style={styles.panel}>
        <div style={styles.grid}>
          <div style={styles.group}>
            <label style={styles.label}>Village ID</label>
            <input type="number" value={villageId} onChange={e => setVillageId(e.target.value)} placeholder="Village ID" style={styles.input} />
          </div>
          <div style={styles.group}>
            <label style={styles.label}>Skill Needed</label>
            <select value={skill} onChange={e => setSkill(e.target.value)} style={styles.input}>
              <option value="rescue">Rescue</option>
              <option value="medical">Medical</option>
              <option value="logistics">Logistics</option>
              <option value="communication">Communication</option>
              <option value="shelter">Shelter</option>
            </select>
          </div>
        </div>
        <button onClick={handleAssign} disabled={!villageId || loading} style={styles.btn}>
          {loading ? '🔄 Assigning...' : '👥 Assign Volunteers'}
        </button>
      </div>

      {data && (
        <div style={styles.results}>
          <div style={styles.summary}>
            <Metric label="Total Volunteers" value={data.volunteers.length} />
            <Metric label="Available" value={data.total_available} color="#4caf50" />
          </div>

          <h3 style={styles.sectionTitle}>Volunteer List</h3>
          <div style={styles.list}>
            {data.volunteers.map((v, i) => (
              <div key={i} style={styles.volCard}>
                <div style={styles.volAvatar}>{v.name.charAt(0)}</div>
                <div style={styles.volInfo}>
                  <div style={styles.volName}>{v.name}</div>
                  <div style={styles.volSkills}>
                    {v.skills.map((s, j) => (
                      <span key={j} style={styles.skillTag}>{s}</span>
                    ))}
                  </div>
                </div>
                <div style={styles.volStatus}>
                  <span style={{
                    ...styles.statusDot,
                    background: v.availability ? '#4caf50' : '#f44336'
                  }} />
                  <span style={styles.statusText}>
                    {v.availability ? 'Available' : 'Busy'}
                  </span>
                </div>
                <div style={styles.volAssigned}>
                  {v.assigned_to === 'standby' ? '⏸ Standby' : `✅ ${v.assigned_to}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Metric = ({ label, value, color }) => (
  <div style={styles.metric}>
    <div style={styles.metricLabel}>{label}</div>
    <div style={{...styles.metricValue, color: color || '#1a237e'}}>{value}</div>
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
  summary: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' },
  metric: { textAlign: 'center', padding: '16px', background: '#f8f9fb', borderRadius: '8px' },
  metricLabel: { fontSize: '12px', color: '#5a6a7e', marginBottom: '4px' },
  metricValue: { fontSize: '24px', fontWeight: '700' },
  sectionTitle: { fontSize: '16px', marginBottom: '12px' },
  list: { display: 'flex', flexDirection: 'column', gap: '10px' },
  volCard: { display: 'flex', alignItems: 'center', gap: '16px', padding: '14px', background: '#f8f9fb', borderRadius: '8px' },
  volAvatar: { width: '40px', height: '40px', borderRadius: '50%', background: '#1a237e', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '16px', flexShrink: 0 },
  volInfo: { flex: 1 },
  volName: { fontSize: '14px', fontWeight: '600', marginBottom: '4px' },
  volSkills: { display: 'flex', gap: '4px', flexWrap: 'wrap' },
  skillTag: { fontSize: '10px', background: '#e8eaf6', color: '#1a237e', padding: '2px 8px', borderRadius: '10px', fontWeight: '600' },
  volStatus: { display: 'flex', alignItems: 'center', gap: '6px' },
  statusDot: { width: '8px', height: '8px', borderRadius: '50%' },
  statusText: { fontSize: '12px', color: '#5a6a7e' },
  volAssigned: { fontSize: '12px', color: '#5a6a7e', minWidth: '80px', textAlign: 'right' }
};

export default Sahayak;