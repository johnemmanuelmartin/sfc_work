import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'in.salemfellowship.app',
  appName: 'Salem Fellowship Church',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#141210",
      showSpinner: false,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#141210',
    }
  }
};

export default config;
