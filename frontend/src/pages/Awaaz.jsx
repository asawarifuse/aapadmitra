import React, { useState } from 'react';
import axios from 'axios';

const Awaaz = () => {
  const [villageId, setVillageId] = useState('');
  const [riskLevel, setRiskLevel] = useState('high');
  const [language, setLanguage] = useState('english');
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!villageId) return;
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/v1/generate', {
        village_id: parseInt(villageId),
        risk_level: riskLevel,
        language: language
      });
      setAlert(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const riskColor = (l) => {
    const colors = { low: '#4caf50', medium: '#ffeb3b', high: '#ff9800', extreme: '#f44336' };
    return colors[l] || '#999';
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📢 Awaaz — Alert System</h1>
      <p style={styles.subtitle}>Generate multi-language flood alerts</p>

      <div style={styles.panel}>
        <div style={styles.grid}>
          <div style={styles.group}>
            <label style={styles.label}>Village ID</label>
            <input type="number" value={villageId} onChange={e => setVillageId(e.target.value)}
              placeholder="Enter village ID" style={styles.input} />
          </div>
          <div style={styles.group}>
            <label style={styles.label}>Risk Level</label>
            <select value={riskLevel} onChange={e => setRiskLevel(e.target.value)} style={styles.input}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="extreme">Extreme</option>
            </select>
          </div>
          <div style={styles.group}>
            <label style={styles.label}>Language</label>
            <select value={language} onChange={e => setLanguage(e.target.value)} style={styles.input}>
              <option value="english">English</option>
              <option value="hindi">हिंदी</option>
              <option value="assamese">অসমীয়া</option>
            </select>
          </div>
        </div>
        <button onClick={handleGenerate} disabled={!villageId || loading} style={styles.btn}>
          {loading ? '🔄 Generating...' : '📢 Generate Alert'}
        </button>
      </div>

      {alert && (
        <div style={styles.results}>
          <div style={{...styles.alertCard, borderLeft: `6px solid ${riskColor(riskLevel)}`}}>
            <div style={styles.alertHeader}>
              <span style={{...styles.severityBadge, background: riskColor(riskLevel)}}>
                {riskLevel.toUpperCase()}
              </span>
              <span style={styles.alertId}>Alert #{alert.alert_id}</span>
            </div>
            <div style={styles.alertMessage}>{alert.message}</div>
            <div style={styles.alertFooter}>
              <span>🌐 {alert.language}</span>
              <span>📤 {alert.delivery_status}</span>
              <span>🕐 {alert.timestamp}</span>
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
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' },
  group: { display: 'flex', flexDirection: 'column' },
  label: { fontSize: '13px', fontWeight: '600', marginBottom: '6px' },
  input: { padding: '10px', border: '1px solid #d0d7e2', borderRadius: '8px', fontSize: '14px' },
  btn: { width: '100%', padding: '12px', background: '#1a237e', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
  results: { background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  alertCard: { padding: '20px', background: '#f8f9fb', borderRadius: '8px' },
  alertHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  severityBadge: { fontSize: '11px', color: 'white', padding: '4px 12px', borderRadius: '12px', fontWeight: '700' },
  alertId: { fontSize: '12px', color: '#5a6a7e' },
  alertMessage: { fontSize: '16px', fontWeight: '500', color: '#1a2332', padding: '16px', background: 'white', borderRadius: '8px', marginBottom: '12px' },
  alertFooter: { display: 'flex', gap: '16px', fontSize: '12px', color: '#5a6a7e' }
};

export default Awaaz;