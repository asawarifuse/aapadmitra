import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Chetna = () => {
  const [villages, setVillages] = useState([]);
  const [form, setForm] = useState({
    village_id: '',
    description: 'Water level rising rapidly',
    location_lat: 26.5,
    location_lon: 91.5
  });
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8000/api/v1/villages')
      .then(res => setVillages(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleSubmit = async () => {
    if (!form.village_id) return;
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/v1/submit', {
        ...form,
        village_id: parseInt(form.village_id)
      });
      setReport(res.data);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  const sevColor = (s) => ({ low: '#4caf50', medium: '#ffeb3b', high: '#ff9800', extreme: '#f44336' }[s] || '#999');

  return (
    <div style={s.container}>
      <div style={s.hero}>
        <div>
          <h1 style={s.heroTitle}>📝 Chetna</h1>
          <p style={s.heroSub}>Submit and verify community ground reports</p>
        </div>
        <div style={s.heroBadge}>👥 Crowd-Sourced Intelligence</div>
      </div>

      <div style={s.panel}>
        <div style={s.field}>
          <label style={s.label}>Select Village</label>
          <select value={form.village_id} onChange={e => setForm({...form, village_id: e.target.value})} style={s.input}>
            <option value="">Choose a village...</option>
            {villages.slice(0, 50).map(v => (
              <option key={v.village_id} value={v.village_id}>{v.village_name} — {v.district}</option>
            ))}
          </select>
        </div>

        <div style={s.field}>
          <label style={s.label}>Location (Latitude, Longitude)</label>
          <div style={s.row}>
            <input type="number" step="0.1" value={form.location_lat} onChange={e => setForm({...form, location_lat: parseFloat(e.target.value)})} style={s.input} />
            <input type="number" step="0.1" value={form.location_lon} onChange={e => setForm({...form, location_lon: parseFloat(e.target.value)})} style={s.input} />
          </div>
        </div>

        <div style={s.field}>
          <label style={s.label}>Report Description</label>
          <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows="3" style={s.textarea} />
        </div>

        <button onClick={handleSubmit} disabled={!form.village_id || loading} style={s.btn}>
          {loading ? '🔄 Submitting Report...' : '📝 Submit Ground Report'}
        </button>
      </div>

      {report && (
        <div style={s.results}>
          <div style={s.header}>
            <div>
              <div style={s.reportId}>Report #{report.report_id}</div>
              <div style={s.reportTime}>Submitted at {report.timestamp}</div>
            </div>
            <span style={{...s.severityBadge, background: sevColor(report.severity)}}>
              {report.severity.toUpperCase()}
            </span>
          </div>

          <div style={s.metaGrid}>
            <div style={s.metaCard}>
              <div style={s.metaIcon}>{report.verified ? '✅' : '⏳'}</div>
              <div style={s.metaLabel}>Verification</div>
              <div style={{...s.metaValue, color: report.verified ? '#2e7d32' : '#ff6f00'}}>
                {report.verified ? 'Verified' : 'Pending'}
              </div>
            </div>
            <div style={s.metaCard}>
              <div style={s.metaIcon}>🔄</div>
              <div style={s.metaLabel}>Resolution Status</div>
              <div style={s.metaValue}>{report.resolution_status.replace('_', ' ').toUpperCase()}</div>
            </div>
            <div style={s.metaCard}>
              <div style={s.metaIcon}>📍</div>
              <div style={s.metaLabel}>Location</div>
              <div style={s.metaValue}>{form.location_lat}, {form.location_lon}</div>
            </div>
          </div>

          <div style={s.summaryBox}>
            <div style={s.summaryIcon}>📝</div>
            <div>
              <div style={s.summaryTitle}>Report Submitted Successfully</div>
              <div style={s.summaryText}>
                Your ground report has been recorded. Verification status: {report.verified ? 'Verified' : 'Under Review'}.
                Current resolution: {report.resolution_status.replace('_', ' ')}.
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
  field: { display: 'flex', flexDirection: 'column', marginBottom: '16px' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  label: { fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: '#1a2332' },
  input: { padding: '12px', border: '2px solid #e8ecf1', borderRadius: '10px', fontSize: '14px', background: '#f8f9fb', color: '#1a2332' },
  textarea: { padding: '12px', border: '2px solid #e8ecf1', borderRadius: '10px', fontSize: '14px', background: '#f8f9fb', color: '#1a2332', fontFamily: 'inherit', resize: 'vertical' },
  btn: { width: '100%', padding: '16px', background: 'linear-gradient(135deg, #1a237e, #283593)', color: '#ffffff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(26,35,126,0.3)' },
  results: { background: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', padding: '24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' },
  reportId: { fontSize: '20px', fontWeight: '800', color: '#1a237e', marginBottom: '4px' },
  reportTime: { fontSize: '12px', color: '#1a2332', fontWeight: '500' },
  severityBadge: { fontSize: '12px', color: '#ffffff', padding: '6px 14px', borderRadius: '12px', fontWeight: '700' },
  metaGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' },
  metaCard: { padding: '18px', background: '#f8f9fb', borderRadius: '12px', textAlign: 'center' },
  metaIcon: { fontSize: '28px', marginBottom: '8px' },
  metaLabel: { fontSize: '11px', color: '#1a2332', fontWeight: '600', textTransform: 'uppercase', marginBottom: '6px' },
  metaValue: { fontSize: '14px', fontWeight: '700', color: '#1a2332' },
  summaryBox: { padding: '20px', background: 'linear-gradient(135deg, #e8f5e9, #f1f8e9)', borderRadius: '12px', display: 'flex', gap: '16px', alignItems: 'center' },
  summaryIcon: { fontSize: '32px' },
  summaryTitle: { fontSize: '15px', fontWeight: '700', color: '#2e7d32', marginBottom: '4px' },
  summaryText: { fontSize: '13px', color: '#1b5e20', lineHeight: 1.5 }
};

export default Chetna;