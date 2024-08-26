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
 * Calculate the distance between two geographic points.
 * @param {Object} start - The starting point with latitude and longitude.
 * @param {Object} end - The ending point with latitude and longitude.
 * @returns {string} - The distance in kilometers, or 'N/A' if inputs are invalid.
 */
export const calculatePointToPointDistance = (start, end) => {
    if (!start || !end) return 'N/A';
    const distance = haversine(start, end);
    return (distance / 1000).toFixed(2); // Convert to kilometers and round to 2 decimal places
};

/**
 * Calculate the total length of a route composed of multiple polyline sections.
 * @param {Array<Object>} sections - The route sections, each with a polyline property.
 * @returns {number} - The total length of the route in kilometers.
 */
export const calculateRouteDistance = (sections) => {
    let totalLength = 0;

    sections.forEach((section) => {
        const coordinates = decodePolyline(section.polyline);
        for (let i = 0; i < coordinates.length - 1; i++) {
            const coord1 = { lat: coordinates[i][0], lon: coordinates[i][1] };
            const coord2 = { lat: coordinates[i + 1][0], lon: coordinates[i + 1][1] };
            totalLength += haversine(coord1, coord2);
        }
    });

    return totalLength / 1000; // Convert to kilometers
};

/**
 * Check if a user's current location is within a specific zone.
 * @param {Object} user - The user object containing latitude and longitude.
 * @param {Object} zone - The zone object containing center latitude, longitude, and radius.
 * @returns {boolean} - True if the user is within the zone, false otherwise.
 */
export const checkIfUserIsWithinZone = (user, zone) => {
    const userCoords = { latitude: user.latitude, longitude: user.longitude };
    const zoneCenterCoords = { latitude: zone.latitude, longitude: zone.longitude };

    try {
        // Calculate distance using haversine
        const distance = haversine(userCoords, zoneCenterCoords, { unit: 'km' }); // Ensure unit is correct

        // Check if user is within the zone
        const isWithinZone = distance <= zone.radius;
        
        if (isWithinZone) {
            console.log(`User ${user.username || 'Unknown User'} is within the Zone!`);
        } else {
            console.log(`User ${user.username || 'Unknown User'} is outside the Zone.`);
        }
        
        return isWithinZone;
    } catch (error) {
        console.error('Error checking if user is within zone:', error);
        return false; // Or handle the error as needed
    }
};

// Exporting functions for use in other modules
export default {
    decodePolyline,
    calculatePointToPointDistance,
    calculateRouteDistance,
    checkIfUserIsWithinZone
};
