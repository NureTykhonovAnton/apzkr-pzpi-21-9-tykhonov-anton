export const hereMapLoader = () => {
  return new Promise((resolve, reject) => {
    // Check if the HERE Maps API is already loaded
    if (window.H && window.H.service && window.H.service.Platform) {
      resolve(window.H);
      return;
    }

    const coreScriptSrc = 'https://js.api.here.com/v3/3.1/mapsjs-core.js';
    const serviceScriptSrc = 'https://js.api.here.com/v3/3.1/mapsjs-service.js';
    const uiScriptSrc = 'https://js.api.here.com/v3/3.1/mapsjs-ui.js';
    const eventsScriptSrc = 'https://js.api.here.com/v3/3.1/mapsjs-mapevents.js';

    const scripts = [
      coreScriptSrc,
      serviceScriptSrc,
      uiScriptSrc,
      eventsScriptSrc
    ];

    let currentScriptIndex = 0;

    const loadNextScript = () => {
      if (currentScriptIndex >= scripts.length) {
        if (window.H && window.H.service && window.H.service.Platform) {
          resolve(window.H);
        } else {
          reject(new Error('HERE Maps API did not load correctly'));
        }
        return;
      }

      const scriptSrc = scripts[currentScriptIndex];

      // Helper function to check if a script is already present in the document
      const isScriptLoaded = (src) => {
        return document.querySelector(`script[src="${src}"]`) !== null;
      };

      if (isScriptLoaded(scriptSrc)) {
        console.log(`Script already loaded: ${scriptSrc}`);
        currentScriptIndex++;
        loadNextScript();
        return;
      }

      const script = document.createElement('script');
      script.src = scriptSrc;
      script.async = true;

      script.onload = () => {
        console.log(`Loaded script: ${scriptSrc}`);
        currentScriptIndex++;
        loadNextScript();
      };

      script.onerror = (error) => {
        console.error('Script load error:', error);
        reject(new Error(`Failed to load script: ${error.message}`));
      };

      console.log(`Appending script: ${scriptSrc}`);
      document.head.appendChild(script);
    };

    loadNextScript();
  });
};
