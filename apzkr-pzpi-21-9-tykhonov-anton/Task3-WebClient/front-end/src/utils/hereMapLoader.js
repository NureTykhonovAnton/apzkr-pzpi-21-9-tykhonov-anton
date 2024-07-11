// utils/hereMapLoader.js
export const hereMapLoader = () => {
    return new Promise((resolve, reject) => {
      if (window.H && window.H.service && window.H.service.Platform) {
        resolve(window.H);
        return;
      }
  
      const coreScript = document.createElement('script');
      coreScript.src = 'https://js.api.here.com/v3/3.1/mapsjs-core.js';
      coreScript.async = true;
  
      const serviceScript = document.createElement('script');
      serviceScript.src = 'https://js.api.here.com/v3/3.1/mapsjs-service.js';
      serviceScript.async = true;
  
      const uiScript = document.createElement('script');
      uiScript.src = 'https://js.api.here.com/v3/3.1/mapsjs-ui.js';
      uiScript.async = true;
  
      const eventsScript = document.createElement('script');
      eventsScript.src = 'https://js.api.here.com/v3/3.1/mapsjs-mapevents.js';
      eventsScript.async = true;
  
      const scripts = [coreScript, serviceScript, uiScript, eventsScript];
  
      let loadedCount = 0;
  
      const onScriptLoad = () => {
        loadedCount++;
        if (loadedCount === scripts.length) {
          if (window.H && window.H.service && window.H.service.Platform) {
            resolve(window.H);
          } else {
            reject(new Error('HERE Maps API did not load correctly'));
          }
        }
      };
  
      const onScriptError = (error) => reject(new Error(`Failed to load script: ${error.message}`));
  
      scripts.forEach(script => {
        script.onload = onScriptLoad;
        script.onerror = onScriptError;
        document.head.appendChild(script);
      });
    });
  };
  