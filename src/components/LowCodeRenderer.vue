<template>
  <div class="low-code-renderer">
    <component-renderer
      v-for="component in normalizedComponents"
      :key="component.id"
      :schema="component"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import ComponentRenderer from './ComponentRenderer.vue';

export default defineComponent({
  name: 'LowCodeRenderer',
  components: { ComponentRenderer },
  props: {
    config: { type: Object as () => any, required: true },
  },
  setup(props, { emit }) {
    const normalizedComponents = computed(() => props.config.layout || []);

    return { normalizedComponents };
  },
});
</script>
