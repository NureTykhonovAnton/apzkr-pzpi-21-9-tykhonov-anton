export const hereMapLoader = () => {
  return new Promise((resolve, reject) => {
    if (window.H && window.H.service && window.H.service.Platform) {
      console.log('HERE Maps API already loaded');
      resolve(window.H);
      return;
    }

    const scripts = [
      'https://js.api.here.com/v3/3.1/mapsjs-core.js',
      'https://js.api.here.com/v3/3.1/mapsjs-service.js',
      'https://js.api.here.com/v3/3.1/mapsjs-ui.js',
      'https://js.api.here.com/v3/3.1/mapsjs-mapevents.js'
    ];

    let currentScriptIndex = 0;

    const loadNextScript = () => {
      if (currentScriptIndex >= scripts.length) {
        if (window.H && window.H.service && window.H.service.Platform) {
          console.log('All scripts loaded, HERE Maps API available');
          resolve(window.H);
        } else {
          console.error('HERE Maps API did not load correctly');
          reject(new Error('HERE Maps API did not load correctly'));
        }
        return;
      }

      const scriptSrc = scripts[currentScriptIndex];
      console.log(`Loading script: ${scriptSrc}`);

      const script = document.createElement('script');
      script.src = scriptSrc;
      script.async = true;

      script.onload = () => {
        console.log(`Script loaded: ${scriptSrc}`);
        currentScriptIndex++;
        loadNextScript();
      };

      script.onerror = (error) => {
        console.error(`Failed to load script: ${scriptSrc}`, error);
        reject(new Error(`Failed to load script: ${scriptSrc}`));
      };

      document.head.appendChild(script);
    };

    loadNextScript();
  });
  
};
