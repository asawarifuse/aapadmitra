import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Sahayak = () => {
  const [villages, setVillages] = useState([]);
  const [villageId, setVillageId] = useState('');
  const [skill, setSkill] = useState('rescue');
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
      const res = await axios.post('http://localhost:8000/api/v1/assign-volunteers', {
        village_id: parseInt(villageId),
        skill_needed: skill
      });
      setData(res.data);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  return (
    <div style={s.container}>
      <div style={s.hero}>
        <div>
          <h1 style={s.heroTitle}>👥 Sahayak</h1>
          <p style={s.heroSub}>Match volunteers to villages based on skills</p>
        </div>
        <div style={s.heroBadge}>🤝 Volunteer Network</div>
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
            <label style={s.label}>Skill Needed</label>
            <select value={skill} onChange={e => setSkill(e.target.value)} style={s.input}>
              <option value="rescue">Rescue</option>
              <option value="medical">Medical</option>
              <option value="logistics">Logistics</option>
              <option value="communication">Communication</option>
              <option value="shelter">Shelter</option>
            </select>
          </div>
        </div>
        <button onClick={handleAssign} disabled={!villageId || loading} style={s.btn}>
          {loading ? '🔄 Matching...' : '👥 Assign Volunteers'}
        </button>
      </div>

      {data && (
        <div style={s.results}>
          <div style={s.statsRow}>
            <StatCard icon="👥" label="Total Volunteers" value={data.volunteers.length} color="#1a237e" />
            <StatCard icon="✅" label="Available" value={data.total_available} color="#4caf50" />
            <StatCard icon="🔴" label="Busy" value={data.volunteers.length - data.total_available} color="#f44336" />
          </div>

          <div style={s.section}>
            <h3 style={s.sectionTitle}>👥 Volunteer List</h3>
            <div style={s.volunteerList}>
              {data.volunteers.map((v, i) => (
                <div key={i} style={s.volCard}>
                  <div style={s.volAvatar}>{v.name.split('_')[1] || 'V'}</div>
                  <div style={s.volInfo}>
                    <div style={s.volName}>{v.name}</div>
                    <div style={s.volSkills}>
                      {v.skills.map((sk, j) => (
                        <span key={j} style={s.skillTag}>{sk}</span>
                      ))}
                    </div>
                  </div>
                  <div style={s.volRight}>
                    <div style={{...s.statusIndicator, background: v.availability ? '#4caf50' : '#f44336'}}>
                      {v.availability ? '● Available' : '● Busy'}
                    </div>
                    <div style={s.volAssignment}>
                      {v.assigned_to === 'standby' ? '⏸ Standby' : `✅ ${v.assigned_to}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={s.summaryBox}>
            <div style={s.summaryIcon}>🤝</div>
            <div>
              <div style={s.summaryTitle}>Volunteer Matching Complete</div>
              <div style={s.summaryText}>
                {data.total_available} of {data.volunteers.length} volunteers are available for {skill} tasks at this village.
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
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' },
  field: { display: 'flex', flexDirection: 'column' },
  label: { fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: '#1a2332' },
  input: { padding: '12px', border: '2px solid #e8ecf1', borderRadius: '10px', fontSize: '14px', background: '#f8f9fb', color: '#1a2332' },
  btn: { width: '100%', padding: '16px', background: 'linear-gradient(135deg, #1a237e, #283593)', color: '#ffffff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(26,35,126,0.3)' },
  results: { background: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', padding: '24px' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' },
  statCard: { background: '#f8f9fb', padding: '18px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' },
  statIcon: { fontSize: '26px' },
  statLabel: { fontSize: '11px', color: '#1a2332', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase' },
  statValue: { fontSize: '20px', fontWeight: '800' },
  section: { marginBottom: '24px' },
  sectionTitle: { fontSize: '16px', fontWeight: '700', color: '#1a2332', marginBottom: '16px' },
  volunteerList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  volCard: { display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: '#f8f9fb', borderRadius: '12px' },
  volAvatar: { width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #1a237e, #4fc3f7)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '18px', flexShrink: 0 },
  volInfo: { flex: 1 },
  volName: { fontSize: '15px', fontWeight: '700', color: '#1a2332', marginBottom: '6px' },
  volSkills: { display: 'flex', gap: '6px', flexWrap: 'wrap' },
  skillTag: { fontSize: '10px', background: '#e8eaf6', color: '#1a237e', padding: '3px 10px', borderRadius: '10px', fontWeight: '700', textTransform: 'uppercase' },
  volRight: { textAlign: 'right' },
  statusIndicator: { fontSize: '11px', color: '#ffffff', padding: '4px 10px', borderRadius: '10px', fontWeight: '700', marginBottom: '6px' },
  volAssignment: { fontSize: '11px', color: '#1a2332', fontWeight: '600' },
  summaryBox: { padding: '20px', background: 'linear-gradient(135deg, #e8f5e9, #f1f8e9)', borderRadius: '12px', display: 'flex', gap: '16px', alignItems: 'center' },
  summaryIcon: { fontSize: '32px' },
  summaryTitle: { fontSize: '15px', fontWeight: '700', color: '#2e7d32', marginBottom: '4px' },
  summaryText: { fontSize: '13px', color: '#1b5e20' }
};

export default Sahayak;