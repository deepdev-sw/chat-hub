export interface ElectronAPI {
  sendMessage: (message: string) => void
  resetChat: () => void
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
