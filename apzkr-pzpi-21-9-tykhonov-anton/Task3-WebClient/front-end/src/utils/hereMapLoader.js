export const hereMapLoader = () => {
  return new Promise((resolve, reject) => {
    // Check if the HERE Maps API is already loaded
    if (window.H && window.H.service && window.H.service.Platform) {
      resolve(window.H);
      return;
    }

    // Helper function to check if a script is already present in the document
    const isScriptLoaded = (src) => {
      return document.querySelector(`script[src="${src}"]`) !== null;
    };

    const coreScriptSrc = 'https://js.api.here.com/v3/3.1/mapsjs-core.js';
    const serviceScriptSrc = 'https://js.api.here.com/v3/3.1/mapsjs-service.js';
    const uiScriptSrc = 'https://js.api.here.com/v3/3.1/mapsjs-ui.js';
    const eventsScriptSrc = 'https://js.api.here.com/v3/3.1/mapsjs-mapevents.js';

    const scripts = [
      { src: coreScriptSrc, async: true },
      { src: serviceScriptSrc, async: true },
      { src: uiScriptSrc, async: true },
      { src: eventsScriptSrc, async: true }
    ];

    let loadedCount = 0;

    const onScriptLoad = () => {
      loadedCount++;
      console.log(`Loaded script ${loadedCount}/${scripts.length}`);
      if (loadedCount === scripts.length) {
        if (window.H && window.H.service && window.H.service.Platform) {
          resolve(window.H);
        } else {
          reject(new Error('HERE Maps API did not load correctly'));
        }
      }
    };

    const onScriptError = (error) => {
      console.error('Script load error:', error);
      reject(new Error(`Failed to load script: ${error.message}`));
    };

    scripts.forEach(scriptInfo => {
      if (isScriptLoaded(scriptInfo.src)) {
        console.log(`Script already loaded: ${scriptInfo.src}`);
        onScriptLoad();
      } else {
        const script = document.createElement('script');
        script.src = scriptInfo.src;
        script.async = scriptInfo.async;
        script.onload = onScriptLoad;
        script.onerror = onScriptError;
        document.head.appendChild(script);
        console.log(`Appending script: ${scriptInfo.src}`);
      }
    });
  });
};
