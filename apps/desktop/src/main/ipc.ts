import { ipcMain } from 'electron';

export function registerIpcHandlers() {
  // Handler untuk mengembalikan status kesehatan engine internal
  ipcMain.handle('system:status', async () => {
    return {
      status: 'operational',
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.versions.node,
      electronVersion: process.versions.electron,
    };
  });
}