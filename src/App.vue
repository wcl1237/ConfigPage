<script setup lang="ts">
import LowCodeRenderer from './components/LowCodeRenderer.vue';

const config = {
  layout: [
    {
      id: 'input1',
      componentName: 'Ainput3',
      asyncConfig: {
        name: 'Ainput3',
        path: 'http://localhost:3000/resources/Ainput3-B7fOjmr-.js',
      },
      props: { placeholder: '请输入内容1' },
      slots: {
        header: [
          {
            id: 'input1-header',
            componentName: 'Ainput3',
            asyncConfig: {
              name: 'Ainput3',
              path: 'http://localhost:3000/resources/Ainput3-B7fOjmr-.js',
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
      asyncConfig: {
        name: 'Ainput',
        path: '../assets/Ainput.vue',
      },
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
          {
            id: 'input4-child2',
            componentName: 'Ainput',
            asyncConfig: {
              name: 'Ainput',
              path: '../assets/Ainput.vue',
            },
            props: { placeholder: '我是子组件6' },
          },
          {
            id: 'input4-child3',
            componentName: 'Ainput',
            asyncConfig: {
              name: 'Ainput',
              path: '../assets/Ainput.vue',
            },
            props: { placeholder: '我是子组件7' },
          },
        ],
      },
    },
  ],
};
</script>

<template>
  <header>
    <div class="wrapper">
      <LowCodeRenderer :config="config" />
    </div>
  </header>
</template>

<style scoped></style>
