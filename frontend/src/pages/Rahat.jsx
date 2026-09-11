import React, { useState } from 'react';
import axios from 'axios';

const Rahat = () => {
  const [villageId, setVillageId] = useState('');
  const [population, setPopulation] = useState('1000');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAllocate = async () => {
    if (!villageId) return;
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/v1/allocate', {
        village_id: parseInt(villageId),
        affected_population: parseInt(population)
      });
      setData(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const supplies = data ? [
    { icon: '🍚', label: 'Food Packets', value: data.food_packets, color: '#4caf50' },
    { icon: '💧', label: 'Water Units', value: data.water_units, color: '#2196f3' },
    { icon: '💊', label: 'Medical Kits', value: data.medical_kits, color: '#f44336' },
    { icon: '⛺', label: 'Tarpaulins', value: data.tarpaulins, color: '#ff9800' },
    { icon: '🛏️', label: 'Blankets', value: data.blankets, color: '#9c27b0' },
  ] : [];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📦 Rahat — Relief Allocation</h1>
      <p style={styles.subtitle}>Allocate relief supplies based on affected population</p>

      <div style={styles.panel}>
        <div style={styles.row}>
          <div style={styles.group}>
            <label style={styles.label}>Village ID</label>
            <input type="number" value={villageId} onChange={e => setVillageId(e.target.value)}
              placeholder="Enter village ID" style={styles.input} />
          </div>
          <div style={styles.group}>
            <label style={styles.label}>Affected Population</label>
            <input type="number" value={population} onChange={e => setPopulation(e.target.value)} style={styles.input} />
          </div>
        </div>
        <button onClick={handleAllocate} disabled={!villageId || loading} style={styles.btn}>
          {loading ? '🔄 Allocating...' : '📦 Allocate Relief'}
        </button>
      </div>

      {data && (
        <div style={styles.results}>
          <div style={styles.summary}>
            <Metric label="Total Weight" value={`${data.total_weight_kg} kg`} />
            <Metric label="Delivery Vehicles" value={data.delivery_vehicles} />
          </div>

          <h3 style={styles.sectionTitle}>Supplies</h3>
          <div style={styles.supplies}>
            {supplies.map((s, i) => (
              <div key={i} style={{...styles.supplyCard, borderLeft: `4px solid ${s.color}`}}>
                <div style={styles.supplyIcon}>{s.icon}</div>
                <div style={styles.supplyValue}>{s.value.toLocaleString()}</div>
                <div style={styles.supplyLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Metric = ({ label, value }) => (
  <div style={styles.metric}>
    <div style={styles.metricLabel}>{label}</div>
    <div style={styles.metricValue}>{value}</div>
  </div>
);

const styles = {
  container: { padding: '24px', maxWidth: '900px', margin: '0 auto' },
  title: { fontSize: '28px', color: '#1a2332', marginBottom: '4px' },
  subtitle: { color: '#5a6a7e', fontSize: '14px', marginBottom: '24px' },
  panel: { background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '24px' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' },
  group: { display: 'flex', flexDirection: 'column' },
  label: { fontSize: '13px', fontWeight: '600', marginBottom: '6px' },
  input: { padding: '10px', border: '1px solid #d0d7e2', borderRadius: '8px', fontSize: '14px' },
  btn: { width: '100%', padding: '12px', background: '#1a237e', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
  results: { background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  summary: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' },
  metric: { textAlign: 'center', padding: '16px', background: '#f8f9fb', borderRadius: '8px' },
  metricLabel: { fontSize: '12px', color: '#5a6a7e', marginBottom: '4px' },
  metricValue: { fontSize: '24px', fontWeight: '700', color: '#1a237e' },
  sectionTitle: { fontSize: '16px', marginBottom: '12px' },
  supplies: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' },
  supplyCard: { padding: '16px', background: '#f8f9fb', borderRadius: '8px', textAlign: 'center' },
  supplyIcon: { fontSize: '28px', marginBottom: '8px' },
  supplyValue: { fontSize: '20px', fontWeight: '700', color: '#1a2332', marginBottom: '4px' },
  supplyLabel: { fontSize: '12px', color: '#5a6a7e' }
};

export default Rahat;