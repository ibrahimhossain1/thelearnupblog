try {
  const lucide = require('lucide-react');
  console.log('lucide-react version:', require('lucide-react/package.json').version);
  const icons = ['MessageSquare', 'Send', 'User', 'Clock', 'CheckCircle2', 'AlertCircle'];
  icons.forEach(icon => {
    if (lucide[icon]) {
      console.log(`Icon ${icon} exists`);
    } else {
      console.log(`Icon ${icon} DOES NOT exist!`);
    }
  });
} catch (err) {
  console.error('Error importing lucide-react:', err);
}
