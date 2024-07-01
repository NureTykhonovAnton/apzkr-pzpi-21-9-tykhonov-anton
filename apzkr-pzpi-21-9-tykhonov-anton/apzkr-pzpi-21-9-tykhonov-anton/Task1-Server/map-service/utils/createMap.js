require('dotenv').config();
const apiKey = process.env.APIKEY;

export default function createMap(longitude, latitude) {
    var platform = new H.service.Platform({
      apikey: apiKey
    });
    var defaultLayers = platform.createDefaultLayers();
  
    // Step 2: initialize a map - this map is centered over the provided coordinates
    var map = new H.Map(document.getElementById('map'),
      defaultLayers.vector.normal.map, {
        center: { lat: latitude, lng: longitude },
        zoom: 14,
        pixelRatio: window.devicePixelRatio || 1
      });
  
    // Add a resize listener to make sure that the map occupies the whole container
    window.addEventListener('resize', () => map.getViewPort().resize());
  
    // Step 3: make the map interactive
    // MapEvents enables the event system
    // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
  
    // Create the default UI components
    var ui = H.ui.UI.createDefault(map, defaultLayers);
  }