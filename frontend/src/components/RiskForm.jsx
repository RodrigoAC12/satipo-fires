import { useMemo, useState } from 'react';
import { Activity } from 'lucide-react';

const FIELD_CONFIG = {
  latitude: { label: 'Latitud', step: '0.000001', min: -90, max: 90, unit: 'lat' },
  longitude: { label: 'Longitud', step: '0.000001', min: -180, max: 180, unit: 'lon' },
  temperature: { label: 'Temperatura', step: '0.1', min: 0, max: 60, unit: 'C' },
  humidity: { label: 'Humedad', step: '0.1', min: 0, max: 100, unit: '%' },
  wind: { label: 'Viento', step: '0.1', min: 0, max: 150, unit: 'km/h' },
  slope: { label: 'Pendiente', step: '0.1', min: 0, max: 90, unit: 'grados' },
  ndvi: { label: 'NDVI', step: '0.01', min: -1, max: 1, unit: 'indice' },
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

const sanitizeFormData = (data) => {
  const source = data ?? {};
  return FIELD_NAMES.reduce((acc, key) => {
    acc[key] = source[key] ?? '';
    return acc;
  }, createEmptyForm());
};

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
      <div className="card-header">
        <div>
          <h2 className="card-title">Parametros ambientales</h2>
          <p className="card-kicker">Satipo - medicion puntual</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="form-grid">
        {FIELD_LAYOUT.flatMap((row) => row.map((fieldName) => {
          const field = FIELD_CONFIG[fieldName];
          return (
            <div
              className={`form-group${row.length === 1 ? ' is-wide' : ''}`}
              key={fieldName}
            >
              <label>{field.label}</label>
              <div className="input-shell">
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
                <span className="input-unit">{field.unit}</span>
              </div>
            </div>
          );
        }))}

        <div className="form-actions">
          <button type="submit" className="btn" disabled={loading}>
            <Activity size={17} />
            {loading ? 'Evaluando' : 'Evaluar riesgo'}
          </button>
        </div>
      </form>
    </div>
  );
}
