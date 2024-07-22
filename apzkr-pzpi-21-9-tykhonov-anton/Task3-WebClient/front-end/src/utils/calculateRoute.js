export const decodePolyline = (encoded) => {
    let index = 0, len = encoded.length;
    let lat = 0, lng = 0;
    const coordinates = [];

    while (index < len) {
        let b, shift = 0, result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        const deltaLat = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lat += deltaLat;

        shift = 0;
        result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        const deltaLng = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lng += deltaLng;

        coordinates.push([lat * 1e-5, lng * 1e-5]);
    }

    return coordinates;
};

export const calculateDistance = (coord1, coord2) => {
    const R = 6371000; // Radius of the Earth in meters
    const rad = Math.PI / 180;
    const lat1 = coord1[0] * rad;
    const lon1 = coord1[1] * rad;
    const lat2 = coord2[0] * rad;
    const lon2 = coord2[1] * rad;
    const dlat = lat2 - lat1;
    const dlon = lon2 - lon1;
    const a = Math.sin(dlat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

export const calculateRouteLength = (sections) => {
    let totalLength = 0;
    sections.forEach((section) => {
        const coordinates = decodePolyline(section.polyline);
        for (let i = 0; i < coordinates.length - 1; i++) {
            totalLength += calculateDistance(coordinates[i], coordinates[i + 1]);
        }
    });
    return totalLength / 10000; // Convert to kilometers
};

export default {
    decodePolyline,
    calculateDistance,
    calculateRouteLength
};
