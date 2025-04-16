/** @type {import('next').NextConfig} */
const packageJson = require('./package.json');

const nextConfig = {
  output: 'standalone',
  
  // Injecter les informations de version en tant que variables d'environnement publiques
  env: {
    APP_VERSION: packageJson.version,
    NEXT_VERSION: packageJson.dependencies.next.replace(/[\^~]/g, ''),
    REACT_VERSION: packageJson.dependencies.react.replace(/[\^~]/g, ''),
    BUILD_DATE: new Date().toISOString()
  },
  
  // Modifier la configuration webpack pour injecter les variables globales
  webpack: (config, { isServer, webpack }) => {
    // Modifications existantes du webpack (si présentes)...
    
    // Ajouter les variables globales
    if (!isServer) {
      config.plugins.push(
        new webpack.DefinePlugin({
          '__APP_VERSION__': JSON.stringify(packageJson.version),
          '__NEXT_VERSION__': JSON.stringify(packageJson.dependencies.next.replace(/[\^~]/g, '')),
          '__REACT_VERSION__': JSON.stringify(packageJson.dependencies.react.replace(/[\^~]/g, '')),
          '__BUILD_DATE__': JSON.stringify(new Date().toISOString())
        })
      );
    }
    
    return config;
  }
};

module.exports = nextConfig; 