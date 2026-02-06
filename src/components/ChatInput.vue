<script setup lang="ts">
import { ref } from 'vue'

const message = ref('')
const emit = defineEmits(['send'])

function sendMessage() {
  if (!message.value.trim()) return
  emit('send', message.value)
  message.value = ''
}
</script>

<template>
  <div class="chat-input-container">
    <div class="input-wrapper">
      <textarea 
        v-model="message" 
        placeholder="Send a message to all models..." 
        rows="1"
      ></textarea>
      <button @click="sendMessage" class="send-btn">
        Send
      </button>
    </div>
  </div>
</template>

<style scoped>
.chat-input-container {
  height: 80px;
  background-color: white;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
}

.input-wrapper {
  width: 100%;
  max-width: 800px;
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #f5f5f5;
  padding: 10px 15px;
  border-radius: 24px;
}

textarea {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  resize: none;
  font-family: inherit;
  font-size: 14px;
  max-height: 100px;
}

.send-btn {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 18px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
}

.send-btn:hover {
  background-color: #0056b3;
}
</style>
