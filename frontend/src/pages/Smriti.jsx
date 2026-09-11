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
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const sevColor = (s) => {
    const colors = { low: '#4caf50', medium: '#ffeb3b', high: '#ff9800', extreme: '#f44336' };
    return colors[s] || '#999';
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📚 Smriti — Historical Events</h1>
      <p style={styles.subtitle}>Find similar historical flood events and recommendations</p>

      <div style={styles.panel}>
        <div style={styles.group}>
          <label style={styles.label}>District</label>
          <select value={district} onChange={e => setDistrict(e.target.value)} style={styles.input}>
            {['Barpeta', 'Bongaigaon', 'Cachar', 'Darrang', 'Dhemaji', 'Dhubri', 'Dibrugarh', 'Goalpara'].map(d => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
        <button onClick={handleSearch} disabled={loading} style={styles.btn}>
          {loading ? '🔄 Searching...' : '🔍 Find Similar Events'}
        </button>
      </div>

      {data && (
        <div style={styles.results}>
          <h3 style={styles.sectionTitle}>Similar Historical Events</h3>
          <div style={styles.events}>
            {data.similar_events.map((e, i) => (
              <div key={i} style={styles.eventCard}>
                <div style={styles.eventHeader}>
                  <span style={styles.eventYear}>{e.year}</span>
                  <span style={{...styles.severityBadge, background: sevColor(e.severity)}}>
                    {e.severity.toUpperCase()}
                  </span>
                </div>
                <div style={styles.eventMeta}>
                  <span>📍 {e.district}</span>
                  <span>🏘️ {e.villages_affected} villages</span>
                  <span>👥 {e.population_affected.toLocaleString()} affected</span>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.recommendation}>
            <div style={styles.recTitle}>💡 Recommendation</div>
            <div style={styles.recText}>{data.recommendation}</div>
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
  group: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' },
  input: { width: '100%', padding: '10px', border: '1px solid #d0d7e2', borderRadius: '8px', fontSize: '14px' },
  btn: { width: '100%', padding: '12px', background: '#1a237e', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
  results: { background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  sectionTitle: { fontSize: '16px', marginBottom: '12px' },
  events: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' },
  eventCard: { padding: '16px', background: '#f8f9fb', borderRadius: '8px', borderLeft: '4px solid #1a237e' },
  eventHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  eventYear: { fontSize: '18px', fontWeight: '700', color: '#1a237e' },
  severityBadge: { fontSize: '11px', color: 'white', padding: '3px 10px', borderRadius: '10px', fontWeight: '600' },
  eventMeta: { display: 'flex', gap: '16px', fontSize: '13px', color: '#5a6a7e' },
  recommendation: { padding: '16px', background: '#e8f5e9', borderRadius: '8px', borderLeft: '4px solid #4caf50' },
  recTitle: { fontSize: '13px', fontWeight: '700', color: '#2e7d32', marginBottom: '6px' },
  recText: { fontSize: '14px', color: '#1b5e20' }
};

export default Smriti;