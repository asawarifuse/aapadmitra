import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Awaaz = () => {
  const [villages, setVillages] = useState([]);
  const [villageId, setVillageId] = useState('');
  const [riskLevel, setRiskLevel] = useState('high');
  const [language, setLanguage] = useState('english');
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  console.log('Fetching villages...');
  axios.get('http://localhost:8000/api/v1/villages')
    .then(res => {
      console.log('Villages received:', res.data);
      setVillages(res.data || []);
    })
    .catch(err => {
      console.error('Villages fetch FAILED:', err);
    });
}, []);

  const handleGenerate = async () => {
    if (!villageId) return;
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/v1/generate', {
        village_id: parseInt(villageId),
        risk_level: riskLevel,
        language
      });
      setAlert(res.data);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  const riskColor = (l) => ({ low: '#4caf50', medium: '#ffeb3b', high: '#ff9800', extreme: '#f44336' }[l] || '#999');

  return (
    <div style={s.container}>
      <div style={s.hero}>
        <div>
          <h1 style={s.heroTitle}>📢 Awaaz</h1>
          <p style={s.heroSub}>Multi-language flood alerts for villages</p>
        </div>
        <div style={s.heroBadge}>🌐 Multi-Language</div>
      </div>

      <div style={s.panel}>
        <div style={s.grid}>
          <div style={s.field}>
            <label style={s.label}>Select Village</label>
            <select value={villageId} onChange={e => setVillageId(e.target.value)} style={s.input}>
              <option value="">Choose a village...</option>
              {villages.map(v => (
                <option key={v.village_id} value={v.village_id}>
                  {v.village_name} — {v.district}
                </option>
              ))}
            </select>
          </div>
          <div style={s.field}>
            <label style={s.label}>Risk Level</label>
            <select value={riskLevel} onChange={e => setRiskLevel(e.target.value)} style={s.input}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="extreme">Extreme</option>
            </select>
          </div>
          <div style={s.field}>
            <label style={s.label}>Language</label>
            <select value={language} onChange={e => setLanguage(e.target.value)} style={s.input}>
              <option value="english">English</option>
              <option value="hindi">हिंदी (Hindi)</option>
              <option value="assamese">অসমীয়া (Assamese)</option>
            </select>
          </div>
        </div>
        <button onClick={handleGenerate} disabled={!villageId || loading} style={s.btn}>
          {loading ? '🔄 Generating...' : '📢 Generate Alert'}
        </button>
      </div>

      {alert && (
        <div style={s.results}>
          <div style={{...s.alertCard, borderLeft: `6px solid ${riskColor(riskLevel)}`}}>
            <div style={s.alertHeader}>
              <div style={{...s.severityBadge, background: riskColor(riskLevel)}}>
                {riskLevel.toUpperCase()}
              </div>
              <div style={s.alertId}>Alert #{alert.alert_id}</div>
            </div>

            <div style={s.alertMessage}>{alert.message}</div>

            <div style={s.alertFooter}>
              <div style={s.footerItem}>
                <span style={s.footerLabel}>Language</span>
                <span style={s.footerValue}>🌐 {alert.language}</span>
              </div>
              <div style={s.footerItem}>
                <span style={s.footerLabel}>Delivery Status</span>
                <span style={{...s.footerValue, color: alert.delivery_status === 'delivered' ? '#2e7d32' : '#ff6f00'}}>
                  📤 {alert.delivery_status.toUpperCase()}
                </span>
              </div>
              <div style={s.footerItem}>
                <span style={s.footerLabel}>Timestamp</span>
                <span style={s.footerValue}>🕐 {alert.timestamp}</span>
              </div>
            </div>
          </div>

          <div style={s.summaryBox}>
            <div style={s.summaryIcon}>📢</div>
            <div>
              <div style={s.summaryTitle}>Alert Generated & Sent</div>
              <div style={s.summaryText}>
                Alert #{alert.alert_id} has been generated in {alert.language}.
                Delivery status: {alert.delivery_status}. Villagers will receive this alert via SMS/Voice.
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
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' },
  field: { display: 'flex', flexDirection: 'column' },
  label: { fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: '#1a2332' },
  input: { padding: '12px', border: '2px solid #e8ecf1', borderRadius: '10px', fontSize: '14px', background: '#f8f9fb', color: '#1a2332' },
  btn: { width: '100%', padding: '16px', background: 'linear-gradient(135deg, #1a237e, #283593)', color: '#ffffff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(26,35,126,0.3)' },
  results: { background: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', padding: '24px' },
  alertCard: { padding: '24px', background: '#f8f9fb', borderRadius: '12px', marginBottom: '20px' },
  alertHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  severityBadge: { fontSize: '12px', color: '#ffffff', padding: '6px 14px', borderRadius: '12px', fontWeight: '800', letterSpacing: '1px' },
  alertId: { fontSize: '13px', color: '#1a2332', fontWeight: '600' },
  alertMessage: { fontSize: '18px', fontWeight: '600', color: '#1a2332', padding: '24px', background: '#ffffff', borderRadius: '12px', marginBottom: '20px', lineHeight: 1.6, textAlign: 'center', border: '2px solid #e8ecf1' },
  alertFooter: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
  footerItem: { textAlign: 'center', padding: '12px', background: '#ffffff', borderRadius: '8px' },
  footerLabel: { fontSize: '11px', color: '#1a2332', fontWeight: '600', textTransform: 'uppercase', display: 'block', marginBottom: '6px' },
  footerValue: { fontSize: '13px', fontWeight: '700', color: '#1a237e' },
  summaryBox: { padding: '20px', background: 'linear-gradient(135deg, #e8f5e9, #f1f8e9)', borderRadius: '12px', display: 'flex', gap: '16px', alignItems: 'center' },
  summaryIcon: { fontSize: '32px' },
  summaryTitle: { fontSize: '15px', fontWeight: '700', color: '#2e7d32', marginBottom: '4px' },
  summaryText: { fontSize: '13px', color: '#1b5e20', lineHeight: 1.5 }
};

export default Awaaz;