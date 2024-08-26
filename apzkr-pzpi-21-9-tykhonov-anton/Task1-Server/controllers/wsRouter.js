/**
 * WebSocket message handling module.
 * 
 * @module wsRouter
 */

const User = require('../models/user');
const IoTDevice = require('../models/iotDevice');
const { checkIfUserWithinZone } = require('../middlewares/geolocationCheck');
const WebSocket = require('ws');
const { where } = require('sequelize');

/**
 * Defines the handlers for different WebSocket message types.
 * 
 * @type {Object}
 * @property {Function} userLocationUpdate - Handles updates to user location.
 * @property {Function} init - Handles initialization of IoT devices.
 */
const wsRouter = {
    /**
     * Handles updates to user location.
     * 
     * @param {Object} data - The data sent with the WebSocket message.
     * @param {WebSocket} connection - The WebSocket connection object.
     * @async
     * @throws {Error} Throws error if updating user location fails.
     */
    'userLocationUpdate': async (data, connection) => {
        try {
            const { userId, latitude, longitude } = data;

            // Validate latitude and longitude
            if (typeof latitude !== 'number' || typeof longitude !== 'number') {
                console.error('Invalid latitude or longitude');
                connection.send(JSON.stringify({ error: 'Invalid latitude or longitude' }));
                return;
            }

            console.log(`Received location: Latitude - ${latitude}, Longitude - ${longitude} from user: ${userId}`);

            // Find the user by ID
            const foundUser = await User.findByPk(userId);

            if (!foundUser) {
                console.error('User not found');
                connection.send(JSON.stringify({ error: 'User not found' }));
                return;
            }

            // Update user location
            await foundUser.update({ longitude, latitude });

            // Check if the user is within a zone
            checkIfUserWithinZone(foundUser);

            console.log('User location updated successfully');
            connection.send(JSON.stringify({ success: 'User location updated successfully' }));

        } catch (error) {
            console.error('Error updating user location:', error);
            connection.send(JSON.stringify({ error: 'Error updating user location' }));
        }
    },

    /**
     * Handles initialization of IoT devices.
     * 
     * @param {Object} data - The data sent with the WebSocket message.
     * @param {WebSocket} connection - The WebSocket connection object.
     * @async
     * @throws {Error} Throws error if initialization fails.
     */
    'init': async (data, connection) => {
        console.log('IoT device init received!');

        const { MACADDR } = data;

        try {
            // Find the IoT device by MACADDR
            const foundIot = await IoTDevice.findOne({ where: { MACADDR } });

            if (foundIot) {
                console.log(`IoT device with MACADDR: ${MACADDR} found!`);
                connection.send(JSON.stringify(foundIot));
            } else {
                console.error('IoT device not found');
                connection.send(JSON.stringify({ error: 'IoT device not found' }));
            }

        } catch (error) {
            console.error('Error during initialization:', error);
            connection.send(JSON.stringify({ error: 'Error during initialization' }));
        }
    },
    /**
 * Handles emergency alert from IoT devices and creates a corresponding Zone.
 * 
 * @param {Object} data - The data sent with the WebSocket message.
 * @param {WebSocket} connection - The WebSocket connection object.
 * @async
 * @throws {Error} Throws error if Zone creation fails.
 */
'emergencyAlert': async (data, connection) => {
    console.log('Emergency alert received from IoT device!');

    const { MACADDR } = data;

    try {
        // Find the IoT device by MACADDR
        const foundIot = await IoTDevice.findOne({ where: { MACADDR } });

        if (foundIot) {
            console.log(`IoT device with MACADDR: ${MACADDR} found! Creating Zone...`);

            // Create a new Zone based on the IoT device's parameters
            const newZone = await Zone.create({
                startedAt: new Date(),
                emergencyTypeId: 1,
                name: "IoT created Zone",
                longitude: foundIot.longitude,
                latitude: foundIot.latitude,
                radius: foundIot.defaultZoneRaduis || 500, // Default to 100 if not specified
            });

            console.log('Zone successfully created:', newZone);
            connection.send(JSON.stringify(newZone));
        } else {
            console.error('IoT device not found');
            connection.send(JSON.stringify({ error: 'IoT device not found' }));
        }

    } catch (error) {
        console.error('Error during emergency alert handling:', error);
        connection.send(JSON.stringify({ error: 'Error during emergency alert handling' }));
    }
},
};

/**
 * Routes WebSocket messages to appropriate handlers based on message type.
 * 
 * @param {string} message - The raw WebSocket message.
 * @param {WebSocket} connection - The WebSocket connection object.
 * @throws {Error} Throws error if message parsing or routing fails.
 */
const routeMessage = (message, connection) => {
    try {
        console.log('Raw Message:', message); // Log raw message data
        const parsedMessage = JSON.parse(message);
        console.log('Parsed Message:', parsedMessage);

        const { type, data } = parsedMessage;

        // Validate that data is not null or undefined
        if (!data) {
            console.error('Data is missing in the message');
            connection.send(JSON.stringify({ error: 'Data is missing in the message' }));
            return;
        }

        if (wsRouter[type]) {
            wsRouter[type](data, connection);
        } else {
            console.error(`No handler for message type: ${type}`);
            connection.send(JSON.stringify({ error: 'Unrecognized message type' }));
        }
    } catch (error) {
        console.error('Error parsing message:', error);
        connection.send(JSON.stringify({ error: 'Invalid data format' }));
    }
};

module.exports = routeMessage;
