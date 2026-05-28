const round = (value, decimals) => Number(value.toFixed(decimals));

const coordinateNoise = (lat, lon, salt) => {
    const raw = Math.sin((lat * 12.9898) + (lon * 78.233) + salt) * 43758.5453;
    return raw - Math.floor(raw);
};

export const fetchEnvironmentalData = async (lat, lon) => {
    const latitude = Number(lat);
    const longitude = Number(lon);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        throw new Error('Coordenadas invalidas');
    }

    return {
        temperature: round(22 + coordinateNoise(latitude, longitude, 1) * 13, 1),
        humidity: round(55 + coordinateNoise(latitude, longitude, 2) * 35, 1),
        wind: round(3 + coordinateNoise(latitude, longitude, 3) * 22, 1),
        slope: round(coordinateNoise(latitude, longitude, 4) * 45, 1),
        ndvi: round(0.3 + coordinateNoise(latitude, longitude, 5) * 0.6, 2),
        latitude: round(latitude, 6),
        longitude: round(longitude, 6),
    };
};
