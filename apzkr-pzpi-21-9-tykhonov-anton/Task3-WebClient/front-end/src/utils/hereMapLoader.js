/**
 * Dynamically loads HERE Maps API scripts.
 * 
 * This function checks if the HERE Maps API is already loaded on the `window` object. If not, it sequentially 
 * loads the required scripts for the HERE Maps API and resolves with the `window.H` object once all scripts 
 * are successfully loaded. If any script fails to load, or if the HERE Maps API is not available after loading 
 * all scripts, it rejects with an appropriate error message.
 * 
 * @returns {Promise<Object>} A promise that resolves with the `window.H` object if the HERE Maps API is successfully 
 *                            loaded, or rejects with an error if the API fails to load.
 * 
 * @example
 * hereMapLoader().then((H) => {
 *   // HERE Maps API is loaded and available as 'H'
 * }).catch((error) => {
 *   // Handle error if HERE Maps API fails to load
 *   console.error('Error loading HERE Maps API:', error);
 * });
 */
export const hereMapLoader = () => {
  return new Promise((resolve, reject) => {
    // Check if HERE Maps API is already loaded
    if (window.H && window.H.service && window.H.service.Platform) {
      console.log('HERE Maps API already loaded');
      resolve(window.H);
      return;
    }

    // Array of script URLs required for HERE Maps API
    const scripts = [
      'https://js.api.here.com/v3/3.1/mapsjs-core.js',
      'https://js.api.here.com/v3/3.1/mapsjs-service.js',
      'https://js.api.here.com/v3/3.1/mapsjs-ui.js',
      'https://js.api.here.com/v3/3.1/mapsjs-mapevents.js'
    ];

    let currentScriptIndex = 0; // Index to keep track of current script

    // Function to load scripts sequentially
    const loadNextScript = () => {
      // Check if all scripts are loaded
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

      // Load the next script
      const scriptSrc = scripts[currentScriptIndex];
      console.log(`Loading script: ${scriptSrc}`);

      const script = document.createElement('script');
      script.src = scriptSrc;
      script.async = true;

      // Handle successful script load
      script.onload = () => {
        console.log(`Script loaded: ${scriptSrc}`);
        currentScriptIndex++;
        loadNextScript(); // Load next script
      };

      // Handle script load error
      script.onerror = (error) => {
        console.error(`Failed to load script: ${scriptSrc}`, error);
        reject(new Error(`Failed to load script: ${scriptSrc}`));
      };

      document.head.appendChild(script); // Append script to document head
    };

    loadNextScript(); // Start loading scripts
  });
};
