import { useCallback } from 'react';
import { calculateRouteDistance } from '../calculateRoute';

export const useRouteCalculation = (hereMap, map, platform, setRouteLength, convertDistance, unit) => {
  const calculateRoute = useCallback(async (start, end) => {
    console.log('Starting route calculation');

    try {
      const router = platform.getRoutingService(null, 8);

      const routingParameters = {
        routingMode: 'fast',
        transportMode: 'car',
        origin: `${start.lat},${start.lng}`,
        destination: `${end.lat},${end.lng}`,
        return: 'polyline'
      };

      console.log('Routing parameters:', routingParameters);

      const onResult = (result) => {
        console.log('API result:', result);

        if (result.routes && result.routes.length > 0) {
          const route = result.routes[0];

          if (route.sections && route.sections.length > 0) {
            const lineStrings = route.sections.map(section =>
              hereMap.geo.LineString.fromFlexiblePolyline(section.polyline)
            );

            const lines = lineStrings.map(lineString => new hereMap.map.Polyline(lineString, {
              style: { strokeColor: 'blue', lineWidth: 5 }
            }));

            lines.forEach(line => map.addObject(line));

            const routeLengthMeters = calculateRouteDistance(route);
            setRouteLength(convertDistance(routeLengthMeters, 'm', unit));
          }
        }
      };

      const onError = (error) => {
        console.error('Error calculating route:', error);
      };

      router.calculateRoute(routingParameters, onResult, onError);
    } catch (error) {
      console.error('Error in calculateRoute function:', error);
    }
  }, [map, hereMap]);

  return { calculateRoute };
};
