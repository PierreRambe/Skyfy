(() => {
  const key = 'skyfy-studio-theme';
  let saved;
  try { saved = localStorage.getItem(key); } catch { /* Preference storage may be unavailable. */ }
  const preferred = saved === 'light' || saved === 'dark'
    ? saved
    : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.dataset.theme = preferred;
  document.querySelector('meta[name="theme-color"]').content = preferred === 'dark' ? '#111a16' : '#f5f6f2';
})();
