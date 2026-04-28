export const fetchEnvironmentalData = async (lat, lon) => {
    try {
        const mockData = {
            temperature: (22 + Math.random() * 13).toFixed(1),
            humidity: (55 + Math.random() * 35).toFixed(1),
            wind: (3 + Math.random() * 22).toFixed(1),
            slope: (Math.random() * 45).toFixed(1),
            ndvi: (0.3 + Math.random() * 0.6).toFixed(2),
            latitude: parseFloat(lat.toFixed(6)),
            longitude: parseFloat(lon.toFixed(6))
        };
        console.log("📍 Datos generados para Satipo:", mockData);
        return mockData;
    } catch (error) {
        console.error("❌ Error en apiService:", error);
        return null;
    }
};