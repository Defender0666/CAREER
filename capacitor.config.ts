import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.maccycreations.careerosultimate',
  appName: 'CareerOS Ultimate',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  android: {
    backgroundColor: '#07111f'
  }
};

export default config;
