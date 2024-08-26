import { useState, useEffect, useCallback } from 'react';
import { checkIfUserIsWithinZone } from '../calculateRoute';

const useMapSetup = (hereMap, platform, mapConfig, latitude, longitude, centers, zones, defaultRadius, mode, handleZoneModalOpen) => {
    const addMarkerToMap = useCallback((map, lat, lng, type) => {
        let iconUrl;
        if (type === 'center') {
            iconUrl = '/path/to/center-icon.png';
        } else if (type === 'zone') {
            iconUrl = '/path/to/zone-icon.png';
        }

        const icon = new hereMap.map.Icon(iconUrl, { size: { w: 32, h: 32 } });
        const marker = new hereMap.map.Marker({ lat, lng }, { icon });

        map.addObject(marker);
        return marker;
    }, [hereMap]);

    const addCircleToMap = useCallback((map, lat, lng, radius = 1000) => {
        const circle = new hereMap.map.Circle(
            { lat, lng },
            radius,
            {
                style: {
                    strokeColor: 'rgba(0, 0, 0, 0.5)',
                    lineWidth: 2,
                    fillColor: 'rgba(255, 0, 0, 0.3)',
                },
            }
        );

        map.addObject(circle);
    }, [hereMap]);

    const setUpClickListener = useCallback(() => {
        if (!mapConfig || !hereMap) return;

        const clickListener = (evt) => {
            const coord = mapConfig.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY);
            if (mode === 'marker') {
                addMarkerToMap(mapConfig, coord.lat, coord.lng, 'center');
            } else if (mode === 'circle') {
                addCircleToMap(mapConfig, coord.lat, coord.lng, 500);
                handleZoneModalOpen();
            }
        };

        mapConfig.addEventListener('tap', clickListener);

        return () => {
            mapConfig.removeEventListener('tap', clickListener);
        };
    }, [mapConfig, hereMap, mode, addMarkerToMap, addCircleToMap, handleZoneModalOpen]);

    // Additional map setup logic can go here...

    return {
        setUpClickListener,
        addMarkerToMap,
        addCircleToMap,
    };
};

export default useMapSetup;