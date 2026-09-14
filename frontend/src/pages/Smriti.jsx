import React, { useState } from 'react';
import axios from 'axios';

const Smriti = () => {
  const [district, setDistrict] = useState('Barpeta');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/v1/similar', {
        district: district,
        rainfall_mm: 45.5,
        water_level_m: 6.2
      });
      setData(res.data);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  const sevColor = (s) => ({ low: '#4caf50', medium: '#ffeb3b', high: '#ff9800', extreme: '#f44336' }[s] || '#999');

  return (
    <div style={s.container}>
      <div style={s.hero}>
        <div>
          <h1 style={s.heroTitle}>📚 Smriti</h1>
          <p style={s.heroSub}>Find similar historical flood events and learn from the past</p>
        </div>
        <div style={s.heroBadge}>🧠 Historical Intelligence</div>
      </div>

      <div style={s.panel}>
        <div style={s.field}>
          <label style={s.label}>Select District</label>
          <select value={district} onChange={e => setDistrict(e.target.value)} style={s.input}>
            {['Barpeta', 'Bongaigaon', 'Cachar', 'Darrang', 'Dhemaji', 'Dhubri', 'Dibrugarh', 'Goalpara'].map(d => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
        <button onClick={handleSearch} disabled={loading} style={s.btn}>
          {loading ? '🔄 Searching...' : '🔍 Find Similar Events'}
        </button>
      </div>

      {data && (
        <div style={s.results}>
          <div style={s.section}>
            <h3 style={s.sectionTitle}>📚 Similar Historical Events</h3>
            <div style={s.eventsList}>
              {data.similar_events.map((e, i) => (
                <div key={i} style={s.eventCard}>
                  <div style={s.eventYearBadge}>{e.year}</div>
                  <div style={s.eventContent}>
                    <div style={s.eventHeader}>
                      <span style={s.eventDistrict}>📍 {e.district}</span>
                      <span style={{...s.severityTag, background: sevColor(e.severity)}}>
                        {e.severity.toUpperCase()}
                      </span>
                    </div>
                    <div style={s.eventStats}>
                      <div style={s.eventStat}>
                        <div style={s.eventStatValue}>{e.villages_affected}</div>
                        <div style={s.eventStatLabel}>Villages</div>
                      </div>
                      <div style={s.eventStat}>
                        <div style={s.eventStatValue}>{e.population_affected.toLocaleString()}</div>
                        <div style={s.eventStatLabel}>Affected</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={s.recommendation}>
            <div style={s.recIcon}>💡</div>
            <div>
              <div style={s.recTitle}>Prevention Recommendation</div>
              <div style={s.recText}>{data.recommendation}</div>
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
  field: { display: 'flex', flexDirection: 'column', marginBottom: '20px' },
  label: { fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: '#1a2332' },
  input: { padding: '12px', border: '2px solid #e8ecf1', borderRadius: '10px', fontSize: '14px', background: '#f8f9fb', color: '#1a2332' },
  btn: { width: '100%', padding: '16px', background: 'linear-gradient(135deg, #1a237e, #283593)', color: '#ffffff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(26,35,126,0.3)' },
  results: { background: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', padding: '24px' },
  section: { marginBottom: '24px' },
  sectionTitle: { fontSize: '16px', fontWeight: '700', color: '#1a2332', marginBottom: '16px' },
  eventsList: { display: 'flex', flexDirection: 'column', gap: '14px' },
  eventCard: { display: 'flex', gap: '16px', padding: '16px', background: '#f8f9fb', borderRadius: '12px' },
  eventYearBadge: { width: '70px', height: '70px', background: '#1a237e', color: '#ffffff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '18px', flexShrink: 0 },
  eventContent: { flex: 1 },
  eventHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  eventDistrict: { fontSize: '14px', fontWeight: '700', color: '#1a2332' },
  severityTag: { fontSize: '10px', color: '#ffffff', padding: '3px 10px', borderRadius: '10px', fontWeight: '700' },
  eventStats: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  eventStat: { background: '#ffffff', padding: '8px 12px', borderRadius: '8px' },
  eventStatValue: { fontSize: '16px', fontWeight: '800', color: '#1a237e' },
  eventStatLabel: { fontSize: '10px', color: '#1a2332', fontWeight: '600', textTransform: 'uppercase' },
  recommendation: { padding: '20px', background: 'linear-gradient(135deg, #e8f5e9, #f1f8e9)', borderRadius: '12px', display: 'flex', gap: '16px', alignItems: 'center' },
  recIcon: { fontSize: '36px' },
  recTitle: { fontSize: '14px', fontWeight: '700', color: '#2e7d32', marginBottom: '4px' },
  recText: { fontSize: '13px', color: '#1b5e20', lineHeight: 1.5 }
};

export default Smriti;