// Kexy Environment Variables Polyfill
// This file sets up process.env for Expo Snack (which doesn't support .env files)
// Auto-generated - do not edit manually

// Ensure global.process.env exists
if (typeof global.process === 'undefined') {
  global.process = { env: {} };
} else if (typeof global.process.env === 'undefined') {
  global.process.env = {};
}

// Inject environment variables
Object.assign(global.process.env, {

});

// Also set on process directly for direct imports
if (typeof process !== 'undefined') {
  process.env = global.process.env;
}

console.log('[Kexy] Loaded 0 environment variables');
