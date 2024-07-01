const geolib = require('geolib');
const UserLocation = require('../models/userLocation');
const Zone = require('../models/zone');

/**
 * Checks if a user is within any zone.
 * 
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Array>} - A list of zones where the user is located.
 */
async function checkUserInZones(userId) {
    try {
        // Fetch the user's current location
        const userLocation = await UserLocation.findOne({ where: { userId } });
        if (!userLocation) {
            throw new Error('User location not found');
        }

        const { latitude: userLat, longitude: userLng } = userLocation;

        // Fetch all zones
        const zones = await Zone.findAll();

        // Check which zones the user is within
        const zonesUserIsIn = zones.filter(zone => {
            const { latitude: zoneLat, longitude: zoneLng, radius } = zone;

            // Calculate the distance from the user to the zone's center
            const distance = geolib.getDistance(
                { latitude: userLat, longitude: userLng },
                { latitude: zoneLat, longitude: zoneLng }
            );

            // Check if the distance is within the zone's radius
            return distance <= radius * 1000; // Convert radius to meters (assuming radius is in kilometers)
        });

        return zonesUserIsIn;
    } catch (error) {
        console.error('Error checking user in zones:', error);
        throw error;
    }
}

async function getUsersInZone(zoneId) {
    try {
        // Fetch the zone details
        const zone = await Zone.findByPk(zoneId);
        if (!zone) {
            throw new Error('Zone not found');
        }

        const { latitude: zoneLat, longitude: zoneLng, radius } = zone;

        // Fetch all user locations
        const userLocations = await UserLocation.findAll({
            include: { model: User, as: 'user' }
        });

        // Check which users are within the zone
        const usersInZone = userLocations.filter(userLocation => {
            const { latitude: userLat, longitude: userLng } = userLocation;

            // Calculate the distance from the user to the zone's center
            const distance = geolib.getDistance(
                { latitude: userLat, longitude: userLng },
                { latitude: zoneLat, longitude: zoneLng }
            );

            // Check if the distance is within the zone's radius
            return distance <= radius * 1000; // Convert radius to meters (assuming radius is in kilometers)
        }).map(userLocation => userLocation.user); // Extract user details

        return usersInZone;
    } catch (error) {
        console.error('Error fetching users in zone:', error);
        throw error;
    }
}



module.exports = { checkUserInZones, getUsersInZone };
