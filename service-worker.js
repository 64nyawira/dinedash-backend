self.addEventListener('install', (event) => {
    console.log('Service Worker Installed');
    self.skipWaiting();
  });
  
  self.addEventListener('activate', (event) => {
    console.log('Service Worker Activated');
  });
  
  self.addEventListener('fetch', (event) => {
    console.log('Fetching:', event.request.url);
  });
  