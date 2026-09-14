import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Rahat = () => {
  const [villages, setVillages] = useState([]);
  const [villageId, setVillageId] = useState('');
  const [population, setPopulation] = useState('1000');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8000/api/v1/villages')
      .then(res => setVillages(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleAllocate = async () => {
    if (!villageId) return;
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/v1/allocate', {
        village_id: parseInt(villageId),
        affected_population: parseInt(population)
      });
      setData(res.data);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  const supplies = data ? [
    { icon: '🍚', label: 'Food Packets', value: data.food_packets, color: '#4caf50' },
    { icon: '💧', label: 'Water Units', value: data.water_units, color: '#2196f3' },
    { icon: '💊', label: 'Medical Kits', value: data.medical_kits, color: '#f44336' },
    { icon: '⛺', label: 'Tarpaulins', value: data.tarpaulins, color: '#ff9800' },
    { icon: '🛏️', label: 'Blankets', value: data.blankets, color: '#9c27b0' },
  ] : [];

  return (
    <div style={s.container}>
      <div style={s.hero}>
        <div>
          <h1 style={s.heroTitle}>📦 Rahat</h1>
          <p style={s.heroSub}>Allocate relief supplies based on affected population</p>
        </div>
        <div style={s.heroBadge}>📦 Smart Allocation</div>
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
            <label style={s.label}>Affected Population</label>
            <input type="number" value={population} onChange={e => setPopulation(e.target.value)} style={s.input} />
          </div>
        </div>
        <button onClick={handleAllocate} disabled={!villageId || loading} style={s.btn}>
          {loading ? '🔄 Allocating...' : '📦 Allocate Relief'}
        </button>
      </div>

      {data && (
        <div style={s.results}>
          <div style={s.statsRow}>
            <StatCard icon="⚖️" label="Total Weight" value={`${data.total_weight_kg.toLocaleString()} kg`} color="#1a237e" />
            <StatCard icon="🚛" label="Delivery Vehicles" value={data.delivery_vehicles} color="#2196f3" />
            <StatCard icon="👥" label="Population Served" value={parseInt(population).toLocaleString()} color="#4caf50" />
            <StatCard icon="📦" label="Total Items" value={(data.food_packets + data.water_units + data.medical_kits + data.tarpaulins + data.blankets).toLocaleString()} color="#ff9800" />
          </div>

          <div style={s.section}>
            <h3 style={s.sectionTitle}>📦 Relief Supplies Allocation</h3>
            <div style={s.suppliesGrid}>
              {supplies.map((sup, i) => (
                <div key={i} style={{...s.supplyCard, borderTop: `4px solid ${sup.color}`}}>
                  <div style={s.supplyIcon}>{sup.icon}</div>
                  <div style={s.supplyValue}>{sup.value.toLocaleString()}</div>
                  <div style={s.supplyLabel}>{sup.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={s.section}>
            <h3 style={s.sectionTitle}>🚛 Delivery Plan</h3>
            <div style={s.deliveryCard}>
              <div style={s.deliveryRow}>
                <span style={s.deliveryLabel}>Vehicles Required</span>
                <span style={s.deliveryValue}>{data.delivery_vehicles} trucks</span>
              </div>
              <div style={s.deliveryRow}>
                <span style={s.deliveryLabel}>Total Cargo Weight</span>
                <span style={s.deliveryValue}>{data.total_weight_kg.toLocaleString()} kg</span>
              </div>
              <div style={s.deliveryRow}>
                <span style={s.deliveryLabel}>Estimated Delivery</span>
                <span style={s.deliveryValue}>24-36 hours</span>
              </div>
              <div style={s.deliveryRow}>
                <span style={s.deliveryLabel}>Priority Level</span>
                <span style={{...s.deliveryValue, color: '#f44336'}}>HIGH</span>
              </div>
            </div>
          </div>

          <div style={s.summaryBox}>
            <div style={s.summaryIcon}>✅</div>
            <div>
              <div style={s.summaryTitle}>Relief Package Ready</div>
              <div style={s.summaryText}>
                Supplies for {parseInt(population).toLocaleString()} people are ready.
                Total weight: {data.total_weight_kg.toLocaleString()} kg across {data.delivery_vehicles} vehicles.
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
  suppliesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' },
  supplyCard: { background: '#f8f9fb', padding: '20px', borderRadius: '12px', textAlign: 'center' },
  supplyIcon: { fontSize: '36px', marginBottom: '10px' },
  supplyValue: { fontSize: '24px', fontWeight: '800', color: '#1a2332', marginBottom: '4px' },
  supplyLabel: { fontSize: '12px', color: '#1a2332', fontWeight: '600' },
  deliveryCard: { background: '#f8f9fb', padding: '20px', borderRadius: '12px' },
  deliveryRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #e8ecf1' },
  deliveryLabel: { fontSize: '13px', color: '#1a2332', fontWeight: '600' },
  deliveryValue: { fontSize: '14px', fontWeight: '700', color: '#1a237e' },
  summaryBox: { padding: '20px', background: 'linear-gradient(135deg, #e8f5e9, #f1f8e9)', borderRadius: '12px', display: 'flex', gap: '16px', alignItems: 'center' },
  summaryIcon: { fontSize: '32px' },
  summaryTitle: { fontSize: '15px', fontWeight: '700', color: '#2e7d32', marginBottom: '4px' },
  summaryText: { fontSize: '13px', color: '#1b5e20' }
};

export default Rahat;