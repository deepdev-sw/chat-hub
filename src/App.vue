<script setup lang="ts">
import Sidebar from './components/Sidebar.vue'
import ChatInput from './components/ChatInput.vue'

// Logic to send message via IPC will go here later
const handleSend = (msg: string) => {
  console.log('Sending message:', msg)
  if (window.electronAPI) {
    window.electronAPI.sendMessage(msg)
  }
}

const handleNewChat = () => {
  console.log('New chat')
  if (window.electronAPI) {
    window.electronAPI.resetChat()
  }
  
}
</script>

<template>
  <div class="app-container">
    <Sidebar @new-chat="handleNewChat" />
    <div class="main-column">
      <div class="content-area">
        <!-- Electron BrowserViews will be overlayed here -->
        <div class="placeholder-text">
          <p>Models loading...</p>
        </div>
      </div>
      <ChatInput @send="handleSend" />
    </div>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.main-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.content-area {
  flex: 1;
  position: relative;
  /* Make sure background is transparent so BrowserView (if under) shows? 
     Actually BrowserView is usually ON TOP. 
     So this area is just a placeholder. 
  */
  background-color: transparent; 
  display: flex;
  justify-content: center;
  align-items: center;
  color: #888;
}
</style>
