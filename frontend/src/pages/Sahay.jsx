import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Sahay = () => {
  const [villages, setVillages] = useState([]);
  const [villageId, setVillageId] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8000/api/v1/villages')
      .then(res => setVillages(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleAssign = async () => {
    if (!villageId) return;
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/v1/assign', {
        village_id: parseInt(villageId)
      });
      setData(res.data);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  return (
    <div style={s.container}>
      <div style={s.hero}>
        <div>
          <h1 style={s.heroTitle}>🚁 Sahay</h1>
          <p style={s.heroSub}>Assign rescue teams to flood-affected villages</p>
        </div>
        <div style={s.heroBadge}>⚡ Real-Time Deployment</div>
      </div>

      <div style={s.panel}>
        <div style={s.field}>
          <label style={s.label}>Select Village</label>
          <select value={villageId} onChange={e => setVillageId(e.target.value)} style={s.input}>
            <option value="">Choose a village...</option>
            {villages.slice(0, 50).map(v => (
              <option key={v.village_id} value={v.village_id}>
                {v.village_name} — {v.district}
              </option>
            ))}
          </select>
        </div>
        <button onClick={handleAssign} disabled={!villageId || loading} style={s.btn}>
          {loading ? '🔄 Assigning Teams...' : '🚁 Assign Rescue Teams'}
        </button>
      </div>

      {data && (
        <div style={s.results}>
          <div style={s.statsRow}>
            <StatCard icon="🚁" label="Teams Deployed" value={data.assigned_teams.length} color="#1a237e" />
            <StatCard icon="🚤" label="Total Boats" value={data.total_boats} color="#2196f3" />
            <StatCard icon="👥" label="Total Capacity" value={data.total_capacity} color="#4caf50" />
            <StatCard icon="⏱️" label="Max ETA" value={`${data.estimated_arrival_minutes} min`} color="#ff9800" />
          </div>

          <div style={s.section}>
            <h3 style={s.sectionTitle}>🚁 Assigned Rescue Teams</h3>
            <div style={s.teamsGrid}>
              {data.assigned_teams.map((t, i) => (
                <div key={i} style={s.teamCard}>
                  <div style={s.teamHeader}>
                    <div style={s.teamBadge}>🚁</div>
                    <div>
                      <div style={s.teamName}>{t.team_name}</div>
                      <div style={s.teamId}>Team ID: {t.team_id}</div>
                    </div>
                  </div>

                  <div style={s.teamStats}>
                    <div style={s.teamStat}>
                      <div style={s.teamStatValue}>{t.boat_count}</div>
                      <div style={s.teamStatLabel}>Boats</div>
                    </div>
                    <div style={s.teamStat}>
                      <div style={s.teamStatValue}>{t.capacity}</div>
                      <div style={s.teamStatLabel}>Capacity</div>
                    </div>
                    <div style={s.teamStat}>
                      <div style={s.teamStatValue}>{t.distance_km}</div>
                      <div style={s.teamStatLabel}>km</div>
                    </div>
                  </div>

                  <div style={s.etaBar}>
                    <div style={s.etaHeader}>
                      <span style={s.etaLabel}>ETA</span>
                      <span style={s.etaValue}>⏱️ {t.eta_minutes} min</span>
                    </div>
                    <div style={s.etaTrack}>
                      <div style={{...s.etaFill, width: `${Math.min(100, (60 - t.eta_minutes) / 60 * 100)}%`}}></div>
                    </div>
                  </div>

                  <div style={s.teamStatus}>
                    <span style={s.statusDot}></span>
                    <span style={s.statusText}>En Route</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={s.summaryBox}>
            <div style={s.summaryIcon}>✅</div>
            <div>
              <div style={s.summaryTitle}>Rescue Teams Dispatched</div>
              <div style={s.summaryText}>
                {data.assigned_teams.length} teams with {data.total_boats} boats (capacity: {data.total_capacity} people)
                will arrive within {data.estimated_arrival_minutes} minutes.
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
  field: { display: 'flex', flexDirection: 'column', marginBottom: '20px' },
  label: { fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: '#1a2332' },
  input: { padding: '12px', border: '2px solid #e8ecf1', borderRadius: '10px', fontSize: '14px', background: '#f8f9fb', color: '#1a2332' },
  btn: { width: '100%', padding: '16px', background: 'linear-gradient(135deg, #1a237e, #283593)', color: '#ffffff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(26,35,126,0.3)' },
  results: { background: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', padding: '24px' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
  statCard: { background: '#f8f9fb', padding: '18px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' },
  statIcon: { fontSize: '26px' },
  statLabel: { fontSize: '11px', color: '#1a2332', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase' },
  statValue: { fontSize: '20px', fontWeight: '800' },
  section: { marginBottom: '24px' },
  sectionTitle: { fontSize: '16px', fontWeight: '700', color: '#1a2332', marginBottom: '16px' },
  teamsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' },
  teamCard: { background: '#f8f9fb', padding: '20px', borderRadius: '12px', borderTop: '4px solid #1a237e' },
  teamHeader: { display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' },
  teamBadge: { fontSize: '32px' },
  teamName: { fontSize: '18px', fontWeight: '800', color: '#1a2332' },
  teamId: { fontSize: '12px', color: '#1a2332', fontWeight: '500' },
  teamStats: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' },
  teamStat: { textAlign: 'center', padding: '10px', background: '#ffffff', borderRadius: '8px' },
  teamStatValue: { fontSize: '18px', fontWeight: '800', color: '#1a237e' },
  teamStatLabel: { fontSize: '10px', color: '#1a2332', fontWeight: '600', textTransform: 'uppercase', marginTop: '2px' },
  etaBar: { marginBottom: '12px' },
  etaHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px' },
  etaLabel: { fontSize: '11px', color: '#1a2332', fontWeight: '600', textTransform: 'uppercase' },
  etaValue: { fontSize: '13px', fontWeight: '700', color: '#ff6f00' },
  etaTrack: { height: '6px', background: '#e8ecf1', borderRadius: '3px', overflow: 'hidden' },
  etaFill: { height: '100%', background: 'linear-gradient(90deg, #4caf50, #ff9800)', borderRadius: '3px', transition: 'width 0.8s' },
  teamStatus: { display: 'flex', alignItems: 'center', gap: '6px' },
  statusDot: { width: '8px', height: '8px', borderRadius: '50%', background: '#4caf50', animation: 'pulse 2s infinite' },
  statusText: { fontSize: '12px', fontWeight: '600', color: '#2e7d32' },
  summaryBox: { padding: '20px', background: 'linear-gradient(135deg, #e8f5e9, #f1f8e9)', borderRadius: '12px', display: 'flex', gap: '16px', alignItems: 'center' },
  summaryIcon: { fontSize: '32px' },
  summaryTitle: { fontSize: '15px', fontWeight: '700', color: '#2e7d32', marginBottom: '4px' },
  summaryText: { fontSize: '13px', color: '#1b5e20' }
};

export default Sahay;