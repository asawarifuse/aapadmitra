import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';

const Sanket = () => {
  const [villages, setVillages] = useState([]);
  const [villageId, setVillageId] = useState('');
  const [horizon, setHorizon] = useState(24);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8000/api/v1/villages')
      .then(res => setVillages(res.data))
      .catch(() => console.log('err'));
  }, []);

  const handlePredict = async () => {
    if (!villageId) return;
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/v1/predict', {
        village_id: parseInt(villageId), horizon
      });
      setPrediction(res.data);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  const sevColor = (s) => ({ low: '#4caf50', medium: '#ffeb3b', high: '#ff9800', extreme: '#f44336' }[s] || '#999');

  const gaugeData = prediction ? [{ name: 'Risk', value: prediction.flood_probability * 100, fill: sevColor(prediction.flood_severity) }] : [];

  return (
    <div style={s.container}>
      <div style={s.hero}>
        <div>
          <h1 style={s.heroTitle}>📊 Sanket</h1>
          <p style={s.heroSub}>Physics-Guided Flood Risk Prediction with Confidence</p>
        </div>
        <div style={s.heroBadge}>🧠 Physics-Guided MLP</div>
      </div>

      <div style={s.panel}>
        <div style={s.row}>
          <div style={s.field}>
            <label style={s.label}>Select Village</label>
            <select value={villageId} onChange={e => setVillageId(e.target.value)} style={s.select}>
              <option value="">Choose a village...</option>
              {villages.slice(0, 50).map(v => (
                <option key={v.village_id} value={v.village_id}>{v.village_name} — {v.district}</option>
              ))}
            </select>
          </div>
          <div style={s.field}>
            <label style={s.label}>Forecast Horizon</label>
            <div style={s.horizonRow}>
              {[24, 48, 72].map(h => (
                <button key={h} onClick={() => setHorizon(h)}
                  style={{...s.horizonBtn, ...(horizon === h ? s.horizonActive : {})}}>
                  {h} hours
                </button>
              ))}
            </div>
          </div>
        </div>
        <button onClick={handlePredict} disabled={!villageId || loading} style={s.btn}>
          {loading ? '🔄 Analyzing...' : '🔮 Predict Flood Risk'}
        </button>
      </div>

      {prediction && (
        <div style={s.results}>
          <div style={{...s.resultHeader, background: `linear-gradient(135deg, ${sevColor(prediction.flood_severity)}22, ${sevColor(prediction.flood_severity)}05)`}}>
            <div>
              <div style={s.villageName}>{prediction.village_name} · {prediction.district}</div>
              <div style={s.villageMeta}>Forecast: Next {prediction.forecast_horizon} hours · {prediction.timestamp}</div>
            </div>
            <div style={{...s.severityBadge, background: sevColor(prediction.flood_severity)}}>
              {prediction.flood_severity.toUpperCase()} RISK
            </div>
          </div>

          <div style={s.metricsRow}>
            <div style={s.gaugeCard}>
              <ResponsiveContainer width="100%" height={200}>
                <RadialBarChart innerRadius="70%" outerRadius="100%" data={gaugeData} startAngle={90} endAngle={-270}>
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar background dataKey="value" cornerRadius={20} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div style={s.gaugeLabel}>
                <div style={{...s.gaugeValue, color: sevColor(prediction.flood_severity)}}>
                  {(prediction.flood_probability * 100).toFixed(1)}%
                </div>
                <div style={s.gaugeText}>Flood Probability</div>
              </div>
            </div>

            <div style={s.infoGrid}>
              <div style={s.infoCard}>
                <div style={s.infoIcon}>🌊</div>
                <div style={s.infoLabel}>Expected Depth</div>
                <div style={s.infoValue}>{prediction.expected_depth_m} m</div>
              </div>
              <div style={s.infoCard}>
                <div style={s.infoIcon}>🎯</div>
                <div style={s.infoLabel}>Confidence Range</div>
                <div style={s.infoValue}>{(prediction.confidence_lower * 100).toFixed(0)}% – {(prediction.confidence_upper * 100).toFixed(0)}%</div>
              </div>
              <div style={s.infoCard}>
                <div style={s.infoIcon}>⏱️</div>
                <div style={s.infoLabel}>Horizon</div>
                <div style={s.infoValue}>{prediction.forecast_horizon} hrs</div>
              </div>
              <div style={s.infoCard}>
                <div style={s.infoIcon}>📈</div>
                <div style={s.infoLabel}>Uncertainty</div>
                <div style={s.infoValue}>±{((prediction.confidence_upper - prediction.confidence_lower) * 50).toFixed(1)}%</div>
              </div>
            </div>
          </div>

          <div style={s.section}>
            <h3 style={s.sectionTitle}>📊 95% Confidence Interval</h3>
            <div style={s.confTrack}>
              <div style={{
                ...s.confRange,
                left: `${prediction.confidence_lower * 100}%`,
                width: `${(prediction.confidence_upper - prediction.confidence_lower) * 100}%`
              }}></div>
              <div style={{...s.confPoint, left: `${prediction.flood_probability * 100}%`}}></div>
            </div>
            <div style={s.confLabels}>
              <span>0%</span>
              <span>{(prediction.confidence_lower * 100).toFixed(1)}%</span>
              <span><b>{(prediction.flood_probability * 100).toFixed(1)}%</b></span>
              <span>{(prediction.confidence_upper * 100).toFixed(1)}%</span>
              <span>100%</span>
            </div>
          </div>

          <div style={s.section}>
            <h3 style={s.sectionTitle}>🧠 Key Contributing Factors (SHAP)</h3>
            <div style={s.shapList}>
              {Object.entries(prediction.shap_factors).map(([k, v]) => (
                <div key={k} style={s.shapRow}>
                  <span style={s.shapName}>{k.replace('_', ' ').toUpperCase()}</span>
                  <div style={s.shapTrack}>
                    <div style={{...s.shapFill, width: `${v * 100}%`}}></div>
                  </div>
                  <span style={s.shapVal}>{(v * 100).toFixed(1)}%</span>
                </div>
              ))}
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
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' },
  field: { display: 'flex', flexDirection: 'column' },
  label: { fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: '#1a2332' },
  select: { padding: '12px', border: '2px solid #e8ecf1', borderRadius: '10px', fontSize: '14px', background: '#f8f9fb', color: '#1a2332' },
  horizonRow: { display: 'flex', gap: '8px' },
  horizonBtn: { flex: 1, padding: '12px', border: '2px solid #e8ecf1', borderRadius: '10px', background: '#ffffff', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#1a2332' },
  horizonActive: { background: '#1a237e', color: '#ffffff', borderColor: '#1a237e' },
  btn: { width: '100%', padding: '16px', background: 'linear-gradient(135deg, #1a237e, #283593)', color: '#ffffff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(26,35,126,0.3)' },
  results: { background: '#ffffff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' },
  resultHeader: { padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' },
  villageName: { fontSize: '20px', fontWeight: '800', color: '#1a2332', marginBottom: '4px' },
  villageMeta: { fontSize: '12px', color: '#1a2332', fontWeight: '500' },
  severityBadge: { padding: '10px 20px', color: '#ffffff', borderRadius: '12px', fontSize: '14px', fontWeight: '800', letterSpacing: '1px' },
  metricsRow: { display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', padding: '24px' },
  gaugeCard: { position: 'relative', background: '#f8f9fb', borderRadius: '16px', padding: '16px' },
  gaugeLabel: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' },
  gaugeValue: { fontSize: '32px', fontWeight: '800' },
  gaugeText: { fontSize: '11px', color: '#1a2332', marginTop: '2px', fontWeight: '600' },
  infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  infoCard: { background: '#f8f9fb', padding: '18px', borderRadius: '12px' },
  infoIcon: { fontSize: '24px', marginBottom: '6px' },
  infoLabel: { fontSize: '11px', color: '#1a2332', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '700' },
  infoValue: { fontSize: '18px', fontWeight: '800', color: '#1a2332' },
  section: { padding: '0 24px 24px' },
  sectionTitle: { fontSize: '15px', fontWeight: '700', color: '#1a2332', marginBottom: '16px' },
  confTrack: { position: 'relative', height: '14px', background: '#e8ecf1', borderRadius: '7px', marginBottom: '8px' },
  confRange: { position: 'absolute', height: '100%', background: 'linear-gradient(90deg, #4caf50, #ff9800, #f44336)', borderRadius: '7px', opacity: 0.7 },
  confPoint: { position: 'absolute', width: '20px', height: '20px', background: '#1a237e', border: '3px solid #ffffff', borderRadius: '50%', top: '-3px', transform: 'translateX(-50%)', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' },
  confLabels: { display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#1a2332', fontWeight: '600' },
  shapList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  shapRow: { display: 'flex', alignItems: 'center', gap: '12px' },
  shapName: { fontSize: '12px', fontWeight: '700', color: '#1a2332', minWidth: '140px' },
  shapTrack: { flex: 1, height: '8px', background: '#e8ecf1', borderRadius: '4px', overflow: 'hidden' },
  shapFill: { height: '100%', borderRadius: '4px', background: 'linear-gradient(90deg, #4fc3f7, #1a237e)', transition: 'width 0.8s' },
  shapVal: { fontSize: '12px', fontWeight: '700', color: '#1a2332', minWidth: '45px', textAlign: 'right' }
};

export default Sanket;