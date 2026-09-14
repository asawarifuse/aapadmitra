import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Marg = () => {
  const [villages, setVillages] = useState([]);
  const [villageId, setVillageId] = useState('');
  const [shelterId, setShelterId] = useState('1');
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8000/api/v1/villages')
      .then(res => setVillages(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleRoute = async () => {
    if (!villageId) return;
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/v1/route', {
        village_id: parseInt(villageId),
        shelter_id: parseInt(shelterId)
      });
      setRoute(res.data);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  const roadColor = (c) => ({ good: '#4caf50', fair: '#ffeb3b', poor: '#ff9800', flooded: '#f44336' }[c] || '#999');
  const riskColor = (r) => r > 0.6 ? '#f44336' : r > 0.3 ? '#ff9800' : '#4caf50';

  return (
    <div style={s.container}>
      <div style={s.hero}>
        <div>
          <h1 style={s.heroTitle}>🗺️ Marg</h1>
          <p style={s.heroSub}>Find the safest evacuation route from village to shelter</p>
        </div>
        <div style={s.heroBadge}>🛣️ Real-Time Risk Routing</div>
      </div>

      <div style={s.panel}>
        <div style={s.row}>
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
          <div style={s.field}>
  <label style={s.label}>Select Shelter</label>
  <select value={shelterId} onChange={e => setShelterId(e.target.value)} style={s.input}>
    <option value="1">Shelter A — Barpeta</option>
    <option value="2">Shelter B — Barpeta</option>
    <option value="3">Shelter C — Barpeta</option>
    <option value="4">Shelter D — Barpeta</option>
    <option value="5">Shelter E — Barpeta</option>
  </select>
</div>
        </div>
        <button onClick={handleRoute} disabled={!villageId || loading} style={s.btn}>
          {loading ? '🔄 Computing Route...' : '🗺️ Find Safe Route'}
        </button>
      </div>

      {route && (
        <div style={s.results}>
          <div style={s.statsRow}>
            <StatCard icon="📍" label="Distance" value={`${route.route_distance_km} km`} color="#1a237e" />
            <StatCard icon="⏱️" label="Estimated Time" value={`${route.estimated_time_min} min`} color="#2196f3" />
            <StatCard icon="⚠️" label="Flood Risk" value={route.flood_risk_score} color={riskColor(route.flood_risk_score)} />
            <StatCard icon="🛤️" label="Waypoints" value={route.safe_route.length} color="#4caf50" />
          </div>

          <div style={s.section}>
            <h3 style={s.sectionTitle}>🗺️ Route Waypoints</h3>
            <div style={s.timeline}>
              {route.safe_route.map((wp, i) => (
                <div key={i} style={s.wpItem}>
                  <div style={s.wpLine}>
                    <div style={s.wpDot}>{i + 1}</div>
                    {i < route.safe_route.length - 1 && <div style={s.wpConnector}></div>}
                  </div>
                  <div style={s.wpCard}>
                    <div style={s.wpHeader}>
                      <span style={s.wpCoord}>📍 {wp.lat.toFixed(4)}, {wp.lon.toFixed(4)}</span>
                      <span style={{...s.roadBadge, background: roadColor(wp.road_condition)}}>
                        {wp.road_condition.toUpperCase()}
                      </span>
                    </div>
                    <div style={s.wpRiskRow}>
                      <span style={s.wpRiskLabel}>Flood Risk</span>
                      <div style={s.wpRiskTrack}>
                        <div style={{...s.wpRiskFill, width: `${wp.flood_risk * 100}%`, background: riskColor(wp.flood_risk)}}></div>
                      </div>
                      <span style={s.wpRiskValue}>{(wp.flood_risk * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={s.summaryBox}>
            <div style={s.summaryIcon}>✅</div>
            <div>
              <div style={s.summaryTitle}>Route Recommended</div>
              <div style={s.summaryText}>
                This route avoids {route.safe_route.filter(w => w.road_condition === 'flooded').length} flooded sections.
                Estimated travel time is {route.estimated_time_min} minutes.
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
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' },
  field: { display: 'flex', flexDirection: 'column' },
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
  timeline: { display: 'flex', flexDirection: 'column', gap: '12px' },
  wpItem: { display: 'flex', gap: '16px' },
  wpLine: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  wpDot: { width: '36px', height: '36px', borderRadius: '50%', background: '#1a237e', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', flexShrink: 0, fontSize: '14px' },
  wpConnector: { width: '3px', flex: 1, background: '#e8ecf1', marginTop: '4px' },
  wpCard: { flex: 1, background: '#f8f9fb', padding: '14px', borderRadius: '10px', marginBottom: '8px' },
  wpHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  wpCoord: { fontSize: '14px', fontWeight: '600', color: '#1a2332' },
  roadBadge: { fontSize: '10px', color: '#ffffff', padding: '4px 10px', borderRadius: '10px', fontWeight: '700' },
  wpRiskRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  wpRiskLabel: { fontSize: '12px', color: '#1a2332', fontWeight: '600', minWidth: '80px' },
  wpRiskTrack: { flex: 1, height: '6px', background: '#e8ecf1', borderRadius: '3px', overflow: 'hidden' },
  wpRiskFill: { height: '100%', borderRadius: '3px', transition: 'width 0.5s' },
  wpRiskValue: { fontSize: '12px', fontWeight: '700', color: '#1a2332', minWidth: '40px', textAlign: 'right' },
  summaryBox: { padding: '20px', background: 'linear-gradient(135deg, #e8f5e9, #f1f8e9)', borderRadius: '12px', display: 'flex', gap: '16px', alignItems: 'center' },
  summaryIcon: { fontSize: '32px' },
  summaryTitle: { fontSize: '15px', fontWeight: '700', color: '#2e7d32', marginBottom: '4px' },
  summaryText: { fontSize: '13px', color: '#1b5e20' }
};

export default Marg;