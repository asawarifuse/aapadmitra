import React, { useState } from 'react';
import axios from 'axios';

const Sahay = () => {
  const [villageId, setVillageId] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAssign = async () => {
    if (!villageId) return;
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/v1/assign', {
        village_id: parseInt(villageId)
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
      <h1 style={styles.title}>🚁 Sahay — Rescue Assignment</h1>
      <p style={styles.subtitle}>Assign rescue teams to flood-affected villages</p>

      <div style={styles.panel}>
        <div style={styles.group}>
          <label style={styles.label}>Village ID</label>
          <input type="number" value={villageId} onChange={e => setVillageId(e.target.value)}
            placeholder="Enter village ID" style={styles.input} />
        </div>
        <button onClick={handleAssign} disabled={!villageId || loading} style={styles.btn}>
          {loading ? '🔄 Assigning...' : '🚁 Assign Rescue Teams'}
        </button>
      </div>

      {data && (
        <div style={styles.results}>
          <div style={styles.stats}>
            <Metric label="Total Teams" value={data.assigned_teams.length} />
            <Metric label="Total Boats" value={data.total_boats} />
            <Metric label="Capacity" value={data.total_capacity} />
            <Metric label="ETA" value={`${data.estimated_arrival_minutes} min`} />
          </div>

          <h3 style={styles.sectionTitle}>Assigned Teams</h3>
          <div style={styles.teams}>
            {data.assigned_teams.map((t, i) => (
              <div key={i} style={styles.teamCard}>
                <div style={styles.teamHeader}>
                  <span style={styles.teamName}>{t.team_name}</span>
                  <span style={styles.teamEta}>⏱ {t.eta_minutes} min</span>
                </div>
                <div style={styles.teamMeta}>
                  <span>📍 {t.distance_km} km away</span>
                  <span>🚤 {t.boat_count} boats</span>
                  <span>👥 {t.capacity} capacity</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Metric = ({ label, value }) => (
  <div style={styles.metric}>
    <div style={styles.metricLabel}>{label}</div>
    <div style={styles.metricValue}>{value}</div>
  </div>
);

const styles = {
  container: { padding: '24px', maxWidth: '900px', margin: '0 auto' },
  title: { fontSize: '28px', color: '#1a2332', marginBottom: '4px' },
  subtitle: { color: '#5a6a7e', fontSize: '14px', marginBottom: '24px' },
  panel: { background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '24px' },
  group: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' },
  input: { width: '100%', padding: '10px', border: '1px solid #d0d7e2', borderRadius: '8px', fontSize: '14px' },
  btn: { width: '100%', padding: '12px', background: '#1a237e', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
  results: { background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' },
  metric: { textAlign: 'center', padding: '12px', background: '#f8f9fb', borderRadius: '8px' },
  metricLabel: { fontSize: '12px', color: '#5a6a7e', marginBottom: '4px' },
  metricValue: { fontSize: '20px', fontWeight: '700', color: '#1a237e' },
  sectionTitle: { fontSize: '16px', marginBottom: '12px' },
  teams: { display: 'flex', flexDirection: 'column', gap: '12px' },
  teamCard: { padding: '16px', background: '#f8f9fb', borderRadius: '8px', borderLeft: '4px solid #1a237e' },
  teamHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
  teamName: { fontWeight: '700', color: '#1a237e' },
  teamEta: { fontSize: '13px', color: '#ff6f00', fontWeight: '600' },
  teamMeta: { display: 'flex', gap: '16px', fontSize: '13px', color: '#5a6a7e' }
};

export default Sahay;