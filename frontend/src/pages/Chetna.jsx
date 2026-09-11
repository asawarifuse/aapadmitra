import React, { useState } from 'react';
import axios from 'axios';

const Chetna = () => {
  const [form, setForm] = useState({
    village_id: '',
    description: 'Water level rising rapidly',
    location_lat: 26.5,
    location_lon: 91.5
  });
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.village_id) return;
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/v1/submit', {
        ...form,
        village_id: parseInt(form.village_id)
      });
      setReport(res.data);
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
      <h1 style={styles.title}>📝 Chetna — Ground Reports</h1>
      <p style={styles.subtitle}>Submit and verify community ground reports</p>

      <div style={styles.panel}>
        <div style={styles.grid}>
          <div style={styles.group}>
            <label style={styles.label}>Village ID</label>
            <input type="number" value={form.village_id} onChange={e => setForm({...form, village_id: e.target.value})} placeholder="Village ID" style={styles.input} />
          </div>
          <div style={styles.group}>
            <label style={styles.label}>Location (Lat, Lon)</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="number" step="0.1" value={form.location_lat} onChange={e => setForm({...form, location_lat: parseFloat(e.target.value)})} style={styles.input} />
              <input type="number" step="0.1" value={form.location_lon} onChange={e => setForm({...form, location_lon: parseFloat(e.target.value)})} style={styles.input} />
            </div>
          </div>
        </div>
        <div style={styles.group}>
          <label style={styles.label}>Description</label>
          <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows="3" style={{...styles.input, resize: 'vertical'}} />
        </div>
        <button onClick={handleSubmit} disabled={!form.village_id || loading} style={styles.btn}>
          {loading ? '🔄 Submitting...' : '📝 Submit Report'}
        </button>
      </div>

      {report && (
        <div style={styles.results}>
          <div style={styles.header}>
            <span style={styles.reportId}>Report #{report.report_id}</span>
            <span style={{...styles.severityBadge, background: sevColor(report.severity)}}>
              {report.severity.toUpperCase()}
            </span>
          </div>
          <div style={styles.metaGrid}>
            <div style={styles.metaCard}>
              <div style={styles.metaLabel}>Verification</div>
              <div style={{...styles.metaValue, color: report.verified ? '#4caf50' : '#ff9800'}}>
                {report.verified ? '✅ Verified' : '⏳ Pending'}
              </div>
            </div>
            <div style={styles.metaCard}>
              <div style={styles.metaLabel}>Status</div>
              <div style={styles.metaValue}>{report.resolution_status.replace('_', ' ').toUpperCase()}</div>
            </div>
            <div style={styles.metaCard}>
              <div style={styles.metaLabel}>Timestamp</div>
              <div style={styles.metaValue}>{report.timestamp}</div>
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
  group: { display: 'flex', flexDirection: 'column', marginBottom: '16px' },
  label: { fontSize: '13px', fontWeight: '600', marginBottom: '6px' },
  input: { padding: '10px', border: '1px solid #d0d7e2', borderRadius: '8px', fontSize: '14px', width: '100%', fontFamily: 'inherit' },
  btn: { width: '100%', padding: '12px', background: '#1a237e', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
  results: { background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  reportId: { fontSize: '16px', fontWeight: '700', color: '#1a237e' },
  severityBadge: { fontSize: '12px', color: 'white', padding: '4px 12px', borderRadius: '10px', fontWeight: '600' },
  metaGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' },
  metaCard: { padding: '16px', background: '#f8f9fb', borderRadius: '8px', textAlign: 'center' },
  metaLabel: { fontSize: '12px', color: '#5a6a7e', marginBottom: '6px' },
  metaValue: { fontSize: '14px', fontWeight: '600' }
};

export default Chetna;