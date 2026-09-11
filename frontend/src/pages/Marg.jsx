import React, { useState } from 'react';
import axios from 'axios';

const Marg = () => {
  const [villageId, setVillageId] = useState('');
  const [shelterId, setShelterId] = useState('1');
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRoute = async () => {
    if (!villageId) return;
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/v1/route', {
        village_id: parseInt(villageId),
        shelter_id: parseInt(shelterId)
      });
      setRoute(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getRoadColor = (c) => {
    const colors = { good: '#4caf50', fair: '#ffeb3b', poor: '#ff9800', flooded: '#f44336' };
    return colors[c] || '#999';
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🗺️ Marg — Safe Route Finder</h1>
      <p style={styles.subtitle}>Find the safest evacuation route from village to shelter</p>

      <div style={styles.panel}>
        <div style={styles.row}>
          <div style={styles.group}>
            <label style={styles.label}>Village ID</label>
            <input 
              type="number" 
              value={villageId} 
              onChange={(e) => setVillageId(e.target.value)}
              placeholder="Enter village ID"
              style={styles.input}
            />
          </div>
          <div style={styles.group}>
            <label style={styles.label}>Shelter ID</label>
            <input 
              type="number" 
              value={shelterId} 
              onChange={(e) => setShelterId(e.target.value)}
              style={styles.input}
            />
          </div>
        </div>
        <button onClick={handleRoute} disabled={!villageId || loading} style={styles.btn}>
          {loading ? '🔄 Finding Route...' : '🗺️ Find Safe Route'}
        </button>
      </div>

      {route && (
        <div style={styles.results}>
          <div style={styles.stats}>
            <Metric label="Distance" value={`${route.route_distance_km} km`} />
            <Metric label="Est. Time" value={`${route.estimated_time_min} min`} />
            <Metric label="Flood Risk" value={route.flood_risk_score} color={
              route.flood_risk_score > 0.6 ? '#f44336' : 
              route.flood_risk_score > 0.3 ? '#ff9800' : '#4caf50'
            } />
          </div>

          <h3 style={styles.sectionTitle}>Route Waypoints</h3>
          <div style={styles.waypoints}>
            {route.safe_route.map((wp, i) => (
              <div key={i} style={styles.waypoint}>
                <div style={styles.wpNumber}>{i + 1}</div>
                <div style={styles.wpDetails}>
                  <div style={styles.wpCoord}>📍 {wp.lat.toFixed(4)}, {wp.lon.toFixed(4)}</div>
                  <div style={styles.wpMeta}>
                    <span style={{...styles.roadBadge, background: getRoadColor(wp.road_condition)}}>
                      {wp.road_condition.toUpperCase()}
                    </span>
                    <span style={styles.wpRisk}>Flood Risk: {(wp.flood_risk * 100).toFixed(0)}%</span>
                  </div>
                </div>
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
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' },
  group: { display: 'flex', flexDirection: 'column' },
  label: { fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#1a2332' },
  input: { padding: '10px', border: '1px solid #d0d7e2', borderRadius: '8px', fontSize: '14px' },
  btn: { width: '100%', padding: '12px', background: '#1a237e', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
  results: { background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' },
  metric: { textAlign: 'center', padding: '12px', background: '#f8f9fb', borderRadius: '8px' },
  metricLabel: { fontSize: '12px', color: '#5a6a7e', marginBottom: '4px' },
  metricValue: { fontSize: '20px', fontWeight: '700' },
  sectionTitle: { fontSize: '16px', color: '#1a2332', marginBottom: '12px' },
  waypoints: { display: 'flex', flexDirection: 'column', gap: '10px' },
  waypoint: { display: 'flex', gap: '12px', padding: '12px', background: '#f8f9fb', borderRadius: '8px' },
  wpNumber: { width: '32px', height: '32px', borderRadius: '50%', background: '#1a237e', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', flexShrink: 0 },
  wpDetails: { flex: 1 },
  wpCoord: { fontSize: '13px', fontWeight: '500', marginBottom: '4px' },
  wpMeta: { display: 'flex', gap: '12px', alignItems: 'center' },
  roadBadge: { fontSize: '10px', color: 'white', padding: '2px 8px', borderRadius: '10px', fontWeight: '600' },
  wpRisk: { fontSize: '11px', color: '#5a6a7e' }
};

export default Marg;