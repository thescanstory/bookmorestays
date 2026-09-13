import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bookmorestays.app',
  appName: 'Bookmorestays',
  webDir: 'out',
  plugins: {
    CapacitorShareTarget: {
      appGroupId: 'group.com.bookmorestays.app'
    }
  }
};

export default config;
