const fs = require('fs');
const file = 'src/pages/LandingPage.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replacements
content = content.replace(/bg-white/g, 'bg-transparent');
content = content.replace(/text-surface-900/g, 'text-surface-50');
content = content.replace(/text-surface-600/g, 'text-surface-200');
content = content.replace(/text-surface-500/g, 'text-surface-200');
content = content.replace(/text-surface-400/g, 'text-surface-100');
content = content.replace(/bg-primary-50/g, 'bg-primary-950/30');
content = content.replace(/text-primary-600/g, 'text-primary-400');
content = content.replace(/bg-accent-50/g, 'bg-accent-950/30');
content = content.replace(/text-accent-600/g, 'text-accent-400');
content = content.replace(/bg-green-50/g, 'bg-green-950/30');
content = content.replace(/text-green-600/g, 'text-green-400');
content = content.replace(/bg-surface-50\/50/g, 'bg-surface-800/50');
content = content.replace(/border-surface-200\/50/g, 'border-surface-700/50');
content = content.replace(/hover:border-surface-200/g, 'hover:border-surface-600');
content = content.replace(/hover:bg-white/g, 'hover:bg-surface-800');
content = content.replace(/from-surface-200/g, 'from-surface-700');
content = content.replace(/bg-gradient-to-br from-primary-50 to-accent-50/g, 'bg-surface-800/50');
content = content.replace(/border border-surface-200\/50 mb-6/g, 'border border-surface-700/50 mb-6');

fs.writeFileSync(file, content);
console.log('Fixed colors in LandingPage.tsx');
