import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Sanket = () => {
  const [villages, setVillages] = useState([]);
  const [villageId, setVillageId] = useState('');
  const [horizon, setHorizon] = useState(24);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8000/api/v1/villages')
      .then(res => setVillages(res.data))
      .catch(err => console.log(err));
  }, []);

  const handlePredict = async () => {
    if (!villageId) return;
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/v1/predict', {
        village_id: parseInt(villageId),
        horizon: horizon
      });
      setPrediction(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const severityColor = (s) => {
    const colors = { low: '#4caf50', medium: '#ffeb3b', high: '#ff9800', extreme: '#f44336' };
    return colors[s] || '#999';
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📊 Sanket — Flood Risk Prediction</h1>
      <p style={styles.subtitle}>Physics-Guided, Uncertainty-Aware Prediction</p>

      <div style={styles.panel}>
        <div style={styles.group}>
          <label style={styles.label}>Select Village</label>
          <select value={villageId} onChange={(e) => setVillageId(e.target.value)} style={styles.select}>
            <option value="">Choose village...</option>
            {villages.map(v => (
              <option key={v.village_id} value={v.village_id}>
                {v.village_name} ({v.district})
              </option>
            ))}
          </select>
        </div>

        <div style={styles.group}>
          <label style={styles.label}>Forecast Horizon</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[24, 48, 72].map(h => (
              <button key={h} onClick={() => setHorizon(h)}
                style={{...styles.horizonBtn, ...(horizon === h ? styles.horizonActive : {})}}>
                {h}h
              </button>
            ))}
          </div>
        </div>

        <button onClick={handlePredict} disabled={!villageId || loading} style={styles.predictBtn}>
          {loading ? '🔄 Predicting...' : '🔮 Predict Flood Risk'}
        </button>
      </div>

      {prediction && (
        <div style={styles.results}>
          <h3 style={styles.resultTitle}>Risk Assessment</h3>
          <div style={styles.metrics}>
            <Metric label="Probability" value={`${(prediction.flood_probability * 100).toFixed(1)}%`} />
            <Metric label="Severity" value={prediction.flood_severity.toUpperCase()} color={severityColor(prediction.flood_severity)} />
            <Metric label="Expected Depth" value={`${prediction.expected_depth_m} m`} />
            <Metric label="Horizon" value={`${prediction.forecast_horizon}h`} />
          </div>

          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>95% Confidence Interval</h4>
            <div style={styles.confBar}>
              <div style={{
                ...styles.confFill,
                left: `${prediction.confidence_lower * 100}%`,
                width: `${(prediction.confidence_upper - prediction.confidence_lower) * 100}%`
              }} />
            </div>
            <div style={styles.confLabels}>
              <span>{prediction.confidence_lower}</span>
              <span>{prediction.confidence_upper}</span>
            </div>
          </div>

          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>SHAP Factors</h4>
            {Object.entries(prediction.shap_factors).map(([k, v]) => (
              <div key={k} style={styles.shapRow}>
                <span style={styles.shapLabel}>{k.replace('_', ' ').toUpperCase()}</span>
                <div style={styles.shapBar}>
                  <div style={{...styles.shapFill, width: `${v * 100}%`}} />
                </div>
                <span style={styles.shapValue}>{(v * 100).toFixed(1)}%</span>
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
    <div style={{...styles.metricValue, color: color || '#1a2332'}}>{value}</div>
  </div>
);

const styles = {
  container: { padding: '24px', maxWidth: '900px', margin: '0 auto' },
  title: { fontSize: '28px', color: '#1a2332', marginBottom: '4px' },
  subtitle: { color: '#5a6a7e', fontSize: '14px', marginBottom: '24px' },
  panel: { background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '24px' },
  group: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#1a2332' },
  select: { width: '100%', padding: '10px', border: '1px solid #d0d7e2', borderRadius: '8px', fontSize: '14px' },
  horizonBtn: { padding: '8px 20px', border: '1px solid #d0d7e2', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '13px' },
  horizonActive: { background: '#1a237e', color: 'white', borderColor: '#1a237e' },
  predictBtn: { width: '100%', padding: '12px', background: '#1a237e', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
  results: { background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  resultTitle: { fontSize: '18px', color: '#1a2332', marginBottom: '16px' },
  metrics: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' },
  metric: { textAlign: 'center', padding: '12px', background: '#f8f9fb', borderRadius: '8px' },
  metricLabel: { fontSize: '12px', color: '#5a6a7e', marginBottom: '4px' },
  metricValue: { fontSize: '20px', fontWeight: '700' },
  section: { marginBottom: '20px' },
  sectionTitle: { fontSize: '14px', color: '#5a6a7e', marginBottom: '8px' },
  confBar: { height: '8px', background: '#e8ecf1', borderRadius: '4px', position: 'relative' },
  confFill: { position: 'absolute', height: '100%', background: 'linear-gradient(90deg, #4caf50, #ff9800, #f44336)', borderRadius: '4px' },
  confLabels: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#5a6a7e', marginTop: '4px' },
  shapRow: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' },
  shapLabel: { fontSize: '11px', color: '#5a6a7e', minWidth: '130px' },
  shapBar: { flex: 1, height: '6px', background: '#e8ecf1', borderRadius: '3px', overflow: 'hidden' },
  shapFill: { height: '100%', background: 'linear-gradient(90deg, #4fc3f7, #1a237e)', borderRadius: '3px' },
  shapValue: { fontSize: '11px', fontWeight: '600', minWidth: '40px', textAlign: 'right' }
};

export default Sanket;