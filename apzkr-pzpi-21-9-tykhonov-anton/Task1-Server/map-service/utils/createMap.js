require('dotenv').config();

export default createMap = (longitude, latitude, apiKey, zoom) => { 
  var platform = new H.service.Platform({
      apikey: apiKey
    });
    
    var defaultLayers = platform.createDefaultLayers();
  
    // Step 2: initialize a map - this map is centered over the provided coordinates
    var map = new H.Map(document.getElementById('map'),
      defaultLayers.vector.normal.map, {
        center: { lat: latitude, lng: longitude },
        zoom: zoom,
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