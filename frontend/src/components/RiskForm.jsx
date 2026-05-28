import { useMemo, useState } from 'react';

const FIELD_CONFIG = {
  latitude: { label: 'Latitud', step: '0.000001', min: -90, max: 90 },
  longitude: { label: 'Longitud', step: '0.000001', min: -180, max: 180 },
  temperature: { label: 'Temperatura (C)', step: '0.1', min: 0, max: 60 },
  humidity: { label: 'Humedad (%)', step: '0.1', min: 0, max: 100 },
  wind: { label: 'Viento (km/h)', step: '0.1', min: 0, max: 150 },
  slope: { label: 'Pendiente (grados)', step: '0.1', min: 0, max: 90 },
  ndvi: { label: 'Indice de Vegetacion (NDVI)', step: '0.01', min: -1, max: 1 },
};

const FIELD_NAMES = Object.keys(FIELD_CONFIG);
const FIELD_LAYOUT = [
  ['latitude', 'longitude'],
  ['temperature', 'humidity'],
  ['wind', 'slope'],
  ['ndvi'],
];

const createEmptyForm = () => ({
  temperature: '',
  humidity: '',
  wind: '',
  slope: '',
  ndvi: '',
  latitude: '',
  longitude: '',
});

const sanitizeFormData = (data = {}) => FIELD_NAMES.reduce((acc, key) => {
  acc[key] = data[key] ?? '';
  return acc;
}, createEmptyForm());

export default function RiskForm({ onEvaluate, loading, initialData }) {
  const initialDataKey = useMemo(
    () => FIELD_NAMES.map((key) => initialData?.[key] ?? '').join('|'),
    [initialData],
  );
  const initialFormData = useMemo(() => sanitizeFormData(initialData), [initialData]);
  const [draftState, setDraftState] = useState({ key: null, data: null });

  const formData = draftState.key === initialDataKey && draftState.data
    ? draftState.data
    : initialFormData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDraftState({
      key: initialDataKey,
      data: { ...formData, [name]: value },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const numericData = FIELD_NAMES.reduce((acc, key) => {
      const rawValue = formData[key];
      const normalizedValue = typeof rawValue === 'string' ? rawValue.trim() : rawValue;
      const value = normalizedValue === '' ? NaN : Number(normalizedValue);
      acc[key] = value;
      return acc;
    }, {});

    const invalidField = FIELD_NAMES.find((key) => {
      const value = numericData[key];
      const { min, max } = FIELD_CONFIG[key];
      return !Number.isFinite(value) || value < min || value > max;
    });

    if (invalidField) {
      const { label, min, max } = FIELD_CONFIG[invalidField];
      alert(`${label} debe estar entre ${min} y ${max}.`);
      return;
    }

    onEvaluate(numericData);
  };

  return (
    <div className="card">
      <h2>Parametros Ambientales (Satipo)</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        {FIELD_LAYOUT.flatMap((row) => row.map((fieldName) => {
          const field = FIELD_CONFIG[fieldName];
          return (
            <div
              className="form-group"
              key={fieldName}
              style={row.length === 1 ? { gridColumn: '1 / -1' } : undefined}
            >
              <label>{field.label}</label>
              <input
                type="number"
                step={field.step}
                min={field.min}
                max={field.max}
                name={fieldName}
                value={formData[fieldName]}
                onChange={handleChange}
                required
              />
            </div>
          );
        }))}

        <div style={{ gridColumn: '1 / -1' }}>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Evaluando...' : 'Evaluar Riesgo'}
          </button>
        </div>
      </form>
    </div>
  );
}
