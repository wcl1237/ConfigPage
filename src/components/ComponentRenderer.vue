<template>
  <component :is="resolved" v-bind="mergedProps">
    <template v-if="hasChildren">
      <component-renderer v-for="child in normalizedChildren" :key="child.id" :schema="child" />
    </template>

    <template v-for="(slotComponents, slotName) in schema.slots || {}" :key="slotName" #[slotName]>
      <component-renderer v-for="comp in slotComponents" :key="comp.id" :schema="comp" />
    </template>
  </component>
</template>

<script lang="ts">
import { defineComponent, computed, resolveComponent } from 'vue';
import { createAsyncComponent } from '../factory/asyncComponentFactory';

export default defineComponent({
  name: 'ComponentRenderer',
  props: {
    schema: { type: Object as () => any, required: true },
  },
  components: {},
  setup(props) {
    const resolved = computed(() => {
      // schema.componentName 或 comp 字段
      const compName = props.schema.componentName || props.schema.comp || props.schema.compName;
      // 如果组件是异步配置，使用 createAsyncComponent，否则尝试全局解析
      if (props.schema.asyncConfig) {
        return createAsyncComponent(props.schema.asyncConfig);
      }
      const r = resolveComponent(compName as any);
      return r || compName;
    });

    const mergedProps = computed(() => props.schema.props || {});

    const normalizedChildren = computed(() => props.schema.children || []);
    const hasChildren = computed(
      () => normalizedChildren.value && normalizedChildren.value.length > 0,
    );

    return { resolved, mergedProps, normalizedChildren, hasChildren };
  },
});
</script>
