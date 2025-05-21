function switchStyle() {
  const link = document.getElementById('theme-link');
  const current = link.getAttribute('href');

  if (current === 'css/style1.css') {
    link.setAttribute('href', 'css/style2.css');
  } else {
    link.setAttribute('href', 'css/style1.css');
  }
}
