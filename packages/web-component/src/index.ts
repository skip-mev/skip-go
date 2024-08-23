function loadScript(src: string) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.type = 'module';
    script.onload = () => resolve(src);
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

async function loadDependencies() {
  try {
    await Promise.all([
      loadScript('https://unpkg.com/react@18/umd/react.production.min.js'),
      loadScript(
        'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js'
      ),
      // loadScript('https://unpkg.com/chain-registry@1.63.68/index.js'),
      loadScript('https://unpkg.com/cosmwasm/dist/bundle.js'),
    ]);
    console.log('loaded all deps');
    console.log(window);
    
    // Dynamically import the WebComponent module
    const { initializeSwapWidget } = await import("./WebComponent");
    
    // Call initializeSwapWidget after it's imported
    initializeSwapWidget();
  } catch (error) {
    console.error(error);
  }
}

loadDependencies();