import React, { useEffect, useState } from 'react';
import MapComponent from './MapComponent';
const GeolocationComponent = () => {
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);

    useEffect(() => {
        // Example of setting coordinates
        const fetchGeolocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setLatitude(position.coords.latitude);
                        setLongitude(position.coords.longitude);
                    },
                    (error) => {
                        console.error('Error getting geolocation:', error);
                    }
                );
            } else {
                console.error('Geolocation is not supported by this browser.');
            }
        };

        fetchGeolocation();
    }, []);

    return (
        <div>
            <h1>Map</h1>
            <div>
            <h3>Current Loction</h3>
                <p>Longitude: {longitude}</p>
                <p>Latitude: {latitude}</p>
            </div>
            {latitude && longitude ? (
                <MapComponent latitude={latitude} longitude={longitude} />
            ) : (
                <p>Loading map...</p>
            )}
        </div>
    );
};

export default GeolocationComponent;