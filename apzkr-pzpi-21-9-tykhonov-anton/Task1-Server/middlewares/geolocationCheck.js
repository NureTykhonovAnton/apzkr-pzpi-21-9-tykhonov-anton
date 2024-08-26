const { Op } = require('sequelize');
const haversine = require('haversine-distance');
const Zone = require('../models/zone');
const User = require('../models/user');
const Evacuation = require('../models/evacuation');
const Center = require('../models/center');
const sendDangerAlertEmail = require('./sendEmail');
const EmergencyType = require('../models/emergencyType');

/**
 * Checks if a user is within any active emergency zone and handles evacuation if necessary.
 * 
 * @param {Object} user - The user object containing user details.
 * @param {Object} websocket - The WebSocket connection object to send notifications.
 * 
 * @returns {Promise<void>} A promise that resolves when the check and notifications are complete.
 * 
 * @throws {Error} Throws an error if there's an issue finding the user, zones, or handling evacuation.
 * 
 * @example
 * const { checkIfUserWithinZone } = require('./path/to/this/module');
 * 
 * checkIfUserWithinZone(user, websocket);
 */
const checkIfUserWithinZone = async (user, websocket) => {
    try {
        const foundUser = await User.findByPk(user.id);
        if (!foundUser) {
            throw new Error('User not found');
        }

        // Fetch all active emergency zones
        const activeZones = await Zone.findAll({
            where: {
                endedAt: {
                    [Op.is]: null,
                },
            },
            include: [{ model: EmergencyType, as: 'emergencyType' }],
        });

        // Iterate through each zone and check if the user is within any zone
        for (const zone of activeZones) {
            const userLocation = { latitude: user.latitude, longitude: user.longitude };
            const zoneLocation = { latitude: zone.latitude, longitude: zone.longitude };
            const distance = haversine(userLocation, zoneLocation);

            // Check if user is within the zone's radius
            if (distance <= zone.radius) {
                // Check if there is already an evacuation for the user in this zone
                const existingEvacuation = await Evacuation.findOne({
                    where: {
                        userId: user.id,
                        startZoneId: zone.id,
                        endCenterId: {
                            [Op.not]: null,
                        },
                    },
                });

                // If there's already an evacuation, skip further processing
                if (existingEvacuation) {
                    console.log(`Evacuation already exists for user ${user.username} in zone ${zone.name}.`);
                    break;
                }

                // Create an evacuation record for the user
                const nearestCenter = await findNearestCenter(user.latitude, user.longitude);
                const evacuation = await Evacuation.create({
                    startZoneId: zone.id,
                    endCenterId: nearestCenter.id,
                    userId: user.id,
                });

                // Send a warning to the frontend via WebSocket
                const warningMessage = {
                    type: 'warning',
                    message: `User ${user.username} is within an emergency zone! Evacuation initiated.`,
                    evacuationDetails: evacuation,
                };
                websocket.send(JSON.stringify(warningMessage));

                // Send an email alert to the user
                await sendDangerAlertEmail(user, zone);

                break; // Stop checking other zones since user is already within one
            }
        }
    } catch (error) {
        console.error('Error checking user within zone:', error);
    }
};

/**
 * Finds the nearest evacuation center to the given latitude and longitude.
 * 
 * @param {number} latitude - The latitude of the user or location to compare.
 * @param {number} longitude - The longitude of the user or location to compare.
 * 
 * @returns {Promise<Object>} A promise that resolves with the nearest center object.
 * 
 * @throws {Error} Throws an error if there's an issue finding the centers.
 * 
 * @example
 * const nearestCenter = await findNearestCenter(user.latitude, user.longitude);
 */
const findNearestCenter = async (latitude, longitude) => {
    const centers = await Center.findAll();
    let nearestCenter = null;
    let minDistance = Infinity;

    centers.forEach(center => {
        const centerLocation = { latitude: center.latitude, longitude: center.longitude };
        const userLocation = { latitude, longitude };
        const distance = haversine(userLocation, centerLocation);

        if (distance < minDistance) {
            nearestCenter = center;
            minDistance = distance;
        }
    });

    return nearestCenter;
};

/**
 * Checks if a user is within 50 meters of the nearest evacuation center and updates evacuation status.
 * 
 * @param {Object} user - The user object containing user details.
 * @param {Object} websocket - The WebSocket connection object to send notifications.
 * 
 * @returns {Promise<void>} A promise that resolves when the check and notifications are complete.
 * 
 * @throws {Error} Throws an error if there's an issue finding the nearest center or updating evacuation.
 * 
 * @example
 * const { checkUserProximityToCenter } = require('./path/to/this/module');
 * 
 * checkUserProximityToCenter(user, websocket);
 */
const checkUserProximityToCenter = async (user, websocket) => {
    try {
        const nearestCenter = await findNearestCenter(user.latitude, user.longitude);

        if (!nearestCenter) {
            console.log('No centers found.');
            return;
        }

        const userLocation = { latitude: user.latitude, longitude: user.longitude };
        const centerLocation = { latitude: nearestCenter.latitude, longitude: nearestCenter.longitude };
        const distance = haversine(userLocation, centerLocation);

        // Check if the user is within 50 meters of the nearest center
        if (distance <= 50) {
            // Send a WebSocket message to notify about proximity
            try {
                // Check if an evacuation record exists for the user and nearest center
                const existingEvacuation = await Evacuation.findOne({
                    where: { endCenterId: nearestCenter.id, userId: user.id }
                });

                if (existingEvacuation) {

                    const proximityMessage = {
                        type: 'proximityToCenter',
                        message: `User ${user.username} is within 50 meters of the nearest center. End evacuation?`,
                        centerDetails: nearestCenter,
                    };
                    websocket.send(JSON.stringify(proximityMessage));

                    // Proceed with deletion if an evacuation record exists
                    await Evacuation.destroy({
                        where: { endCenterId: nearestCenter.id, userId: user.id }
                    });
                    console.log(`User ${user.username} is within 50 meters of the nearest center. Evacuation completed.`);
                } else {
                    // Log a message if no evacuation record is found
                    console.log(`No evacuation record found for user ${user.username} at the nearest center.`);
                }
            } catch (error) {
                console.error('Error handling evacuation:', error);
            }


        }
    } catch (error) {
        console.error('Error checking user proximity to center:', error);
    }
};

module.exports = {
    checkIfUserWithinZone,
    checkUserProximityToCenter
};
