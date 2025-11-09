#基于配置做页面渲染

#渲染引擎

```vue
// 渲染引擎
<template>
  <div class="low-code-renderer">
    <component-renderer
      v-for="component in normalizedComponents"
      :key="component.id"
      :schema="component"
    />
  </div>
</template>

// 渲染器renderer
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
```

#配置结构

```json
const config = {
  layout: [
    {
      id: 'input1',
      componentName: 'Ainput3',
      asyncConfig: {
        name: 'Ainput3',
        path: 'http://localhost:5173/src/assets/Ainput2.vue',
      },
      props: { placeholder: '请输入内容1' },
      slots: {
        header: [
          {
            id: 'input1-header',
            componentName: 'Ainput3',
            asyncConfig: {
              name: 'Ainput3',
              path: 'http://localhost:5173/src/assets/Ainput2.vue',
            },
            props: { placeholder: '我是头部插槽内容0' },
          },
        ],
      },
    },
    {
      id: 'input2',
      componentName: 'Ainput2',
      props: { placeholder: '请输入内容2' },
    },
    {
      id: 'input3',
      componentName: 'Ainput2',
      props: { placeholder: '请输入内容3' },
    },
    {
      id: 'input4',
      componentName: 'Ainput',
      props: { placeholder: '请输入内容4' },
      slots: {
        default: [
          {
            id: 'input4-child1',
            componentName: 'Ainput',
            asyncConfig: {
              name: 'Ainput',
              path: '../assets/Ainput.vue',
            },
            props: { placeholder: '我是子组件5' },
          },
        ],
      },
    },
  ],
};
```

#组件注册管理器 ##组件异步注册和异步（预）加载

// 高级异步组件工厂
