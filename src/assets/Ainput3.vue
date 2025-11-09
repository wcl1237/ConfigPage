<template>
  <div>
    <slot name="header"></slot>
  </div>
  <div>{{ props.placeholder }}11</div>
  <div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
// 占位文件，实际组件位于 src/assets 目录下
const props = defineProps<{
  placeholder?: string;
}>();
</script>
