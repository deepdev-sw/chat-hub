<script setup lang="ts">
defineEmits(['new-chat', 'show-history'])
</script>

<template>
  <div class="sidebar">
    <div class="logo">
      ChatHub
    </div>
    <div class="menu">
      <button @click="$emit('new-chat')" class="menu-item" title="New Chat">
        <span>+</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  width: 60px;
  height: 100vh;
  background-color: #f0f2f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  border-right: 1px solid #e0e0e0;
}

.logo {
  font-weight: bold;
  font-size: 12px;
  margin-bottom: 20px;
  color: #333;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu-item {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s;
}

.menu-item:hover {
  background-color: #e6e6e6;
  transform: translateY(-1px);
}
</style>
