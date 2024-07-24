import haversine from 'haversine-distance';

/**
 * Decode an encoded polyline string into an array of latitude and longitude coordinates.
 * @param {string} encoded - The encoded polyline string.
 * @returns {Array<Array<number>>} - The decoded coordinates.
 */
export const decodePolyline = (encoded) => {
    let index = 0, lat = 0, lng = 0;
    const coordinates = [];
    const len = encoded.length;

    const decodeValue = () => {
        let b, shift = 0, result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        return (result & 1) ? ~(result >> 1) : (result >> 1);
    };

    while (index < len) {
        lat += decodeValue();
        lng += decodeValue();
        coordinates.push([lat * 1e-5, lng * 1e-5]);
    }

    return coordinates;
};

/**
 * Calculate the total length of a route composed of multiple polyline sections.
 * @param {Array<Object>} sections - The route sections, each with a polyline property.
 * @returns {number} - The total length of the route in kilometers.
 */
export const calculateRouteLength = (sections) => {
    let totalLength = 0;

    sections.forEach((section) => {
        const coordinates = decodePolyline(section.polyline);
        console.log(coordinates);
        for (let i = 0; i < coordinates.length - 1; i++) {
            const coord1 = { lat: coordinates[i][0], lon: coordinates[i][1] };
            const coord2 = { lat: coordinates[i + 1][0], lon: coordinates[i + 1][1] };
            totalLength += haversine(coord1, coord2);
        }
    });

    return totalLength / 1000; // Convert to kilometers
};

// Exporting functions for use in other modules
export default {
    decodePolyline,
    calculateRouteLength
};
