import React, { useState, useEffect } from 'react';
import { fetchCenters, createCenter, updateCenter, deleteCenter } from '../api/centerRequests';
import { fetchZones, createZone, updateZone, deleteZone } from '../api/zoneRequests';
import { createIotDevice, deleteIotDevice, fetchIotDevices, updateIotDevice } from '../api/iotDeviceRequests';

/**
 * Custom hook to manage static location data, including centers, zones, and IoT devices.
 *
 * @returns {Object} An object containing state, CRUD operations, and other functionalities related to static locations.
 *
 * @example
 * const { centers, zones, devices, addCenter, editZone, loadGeoJSON } = useStaticLocations();
 */
const useStaticLocations = () => {
  const [centers, setCenters] = useState([]);
  const [zones, setZones] = useState([]);
  const [devices, setDevices] = useState([]);
  const [defaultRadius, setDefaultRadius] = useState(500); // Default radius for zones or other purposes
  const [loading, setLoading] = useState(true); // Loading state to indicate data is being fetched
  const [error, setError] = useState(null); // Error state to store any errors encountered

  // Load initial data for centers, zones, and devices on component mount
  useEffect(() => {
    const loadData = async () => {
      setError(null); // Clear previous errors
      try {
        const centersData = await fetchCenters();
        const zonesData = await fetchZones();
        const devicesData = await fetchIotDevices();

        // Log the successful loading of each type of data
        if (centersData) console.log("Center Data loaded");
        if (zonesData) console.log("Zone Data loaded");
        if (devicesData) console.log("Devices Data loaded");

        // Update state with the fetched data
        setCenters(centersData);
        setZones(zonesData);
        setDevices(devicesData);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.log("Error in useStaticLocations loading: ", error);
        setError(error);
        setLoading(false); // Set loading to false if an error occurs
      }
    };
    loadData();
  }, []);

  /**
   * Adds a new center and updates the state.
   *
   * @param {Object} newCenter - The new center to be added.
   */
  const addCenter = async (newCenter) => {
    setError(null); // Clear previous errors
    try {
      const createdCenter = await createCenter(newCenter);
      setCenters((prevCenters) => [...prevCenters, createdCenter]);
    } catch (error) {
      console.log("Error creating center: ", error);
      setError(error);
    }
  };

  /**
   * Adds a new IoT device and updates the state.
   *
   * @param {Object} newDevice - The new device to be added.
   */
  const addDevice = async (newDevice) => {
    setError(null); // Clear previous errors
    try {
      const createdDevice = await createIotDevice(newDevice);
      setDevices((prevDevices) => [...prevDevices, createdDevice]);
    } catch (error) {
      console.log("Error creating IoT Device: ", error);
      setError(error);
    }
  };

  /**
   * Updates an existing IoT device and updates the state.
   *
   * @param {Object} updatedDevice - The updated device object.
   */
  const editDevice = async (updatedDevice) => {
    setError(null); // Clear previous errors
    try {
      await updateIotDevice(updatedDevice);
      setDevices((prevDevices) =>
        prevDevices.map((device) => (device.id === updatedDevice.id ? updatedDevice : device))
      );
    } catch (error) {
      console.log("Error updating device: ", error);
      setError(error);
    }
  };

  /**
   * Deletes an IoT device and updates the state.
   *
   * @param {number|string} deviceId - The ID of the device to be deleted.
   */
  const removeDevice = async (deviceId) => {
    setError(null); // Clear previous errors
    try {
      await deleteIotDevice(deviceId);
      setDevices((prevDevices) => prevDevices.filter((device) => device.id !== deviceId));
    } catch (error) {
      console.log("Error deleting IoT Device: ", error);
      setError(error);
    }
  };

  /**
   * Updates an existing center and updates the state.
   *
   * @param {Object} updatedCenter - The updated center object.
   */
  const editCenter = async (updatedCenter) => {
    setError(null); // Clear previous errors
    try {
      await updateCenter(updatedCenter);
      setCenters((prevCenters) =>
        prevCenters.map((center) => (center.id === updatedCenter.id ? updatedCenter : center))
      );
    } catch (error) {
      console.log("Error updating center: ", error);
      setError(error);
    }
  };

  /**
   * Deletes a center and updates the state.
   *
   * @param {number|string} centerId - The ID of the center to be deleted.
   */
  const removeCenter = async (centerId) => {
    setError(null); // Clear previous errors
    try {
      await deleteCenter(centerId);
      setCenters((prevCenters) => prevCenters.filter((center) => center.id !== centerId));
    } catch (error) {
      console.log("Error deleting center: ", error);
      setError(error);
    }
  };

  /**
   * Adds a new zone and updates the state.
   *
   * @param {Object} newZone - The new zone to be added.
   */
  const addZone = async (newZone) => {
    setError(null); // Clear previous errors
    try {
      const createdZone = await createZone(newZone);
      setZones((prevZones) => [...prevZones, createdZone]);
    } catch (error) {
      console.log("Error creating zone: ", error);
      setError(error);
    }
  };

  /**
   * Updates an existing zone and updates the state.
   *
   * @param {Object} updatedZone - The updated zone object.
   */
  const editZone = async (updatedZone) => {
    setError(null); // Clear previous errors
    try {
      await updateZone(updatedZone);
      setZones((prevZones) =>
        prevZones.map((zone) => (zone.id === updatedZone.id ? updatedZone : zone))
      );
    } catch (error) {
      console.log("Error updating zone: ", error);
      setError(error);
    }
  };

  /**
   * Deletes a zone and updates the state.
   *
   * @param {number|string} zoneId - The ID of the zone to be deleted.
   */
  const removeZone = async (zoneId) => {
    setError(null); // Clear previous errors
    try {
      await deleteZone(zoneId);
      setZones((prevZones) => prevZones.filter((zone) => zone.id !== zoneId));
    } catch (error) {
      console.log("Error deleting zone: ", error);
      setError(error);
    }
  };

  /**
   * Loads a GeoJSON file from a given URL and adds it to a map.
   * Styles polygons according to properties defined in the GeoJSON.
   *
   * @param {Object} hereMap - The HERE map instance to add the objects to.
   * @param {Object} map - The map object where the GeoJSON will be rendered.
   * @param {string} url - The URL of the GeoJSON file.
   */
  const loadGeoJSON = async (hereMap, map, url) => {
    setError(null); // Clear previous errors
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const geojson = await response.json();

      console.log('Fetched GeoJSON:', geojson); // Debugging info

      if (!geojson || typeof geojson !== 'object') {
        throw new Error('Fetched data is not a valid JSON object');
      }

      const reader = new hereMap.data.geojson.Reader();
      reader.parse(geojson);
      reader.getParsedObjects().forEach((object) => {
        if (object instanceof hereMap.map.Polygon) {
          const style = geojson.features[0].properties;
          object.setStyle({
            fillColor: style.fill,
            strokeColor: style.stroke,
            lineWidth: style["stroke-width"],
            fillOpacity: style["fill-opacity"]
          });
        }
        map.addObject(object);
      });
    } catch (error) {
      console.error('Error loading GeoJSON:', error);
      setError(error);
    }
  };

  return {
    centers,
    zones,
    devices,
    defaultRadius,
    loading,
    error,
    addCenter,
    editCenter,
    removeCenter,
    addZone,
    editZone,
    removeZone,
    addDevice,
    editDevice,
    removeDevice,
    loadGeoJSON,
  };
};

export default useStaticLocations;
