// Check if Service Workers are supported
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('✅ Service Worker Registered:', registration);
        })
        .catch(error => {
          console.error('❌ Service Worker Registration Failed:', error);
        });
    });
  } else {
    console.warn('⚠️ Service Workers are not supported in this browser.');
  }
  