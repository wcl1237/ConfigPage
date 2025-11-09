import { defineAsyncComponent, resolveComponent, h, defineComponent } from 'vue';
import type { ComponentConfig } from '../types';
import { componentLoader } from '../loader/advancedComponentLoader';

export function createAsyncComponent(config: ComponentConfig) {
  const {
    name,
    loadingComponent = 'LoadingSpinner',
    errorComponent = 'ErrorDisplay',
    timeout = 30000,
    retryCount = 3,
  } = config;

  return defineAsyncComponent({
    loader: () => componentLoader.loadComponent(config),
    loadingComponent: defineComponent({
      name: `${name}Loading`,
      setup() {
        return () => h(resolveComponent(loadingComponent as any));
      },
    }),
    errorComponent: defineComponent({
      name: `${name}Error`,
      props: { error: { type: Object, required: true }, retry: { type: Function, required: true } },
      setup(props) {
        const handleRetry = () => props.retry();
        return () =>
          h(resolveComponent(errorComponent as any), { error: props.error, onRetry: handleRetry });
      },
    }),
    delay: 200,
    timeout,
    onError(err, retry, fail, attempts) {
      if ((err?.message || '').includes('Failed to fetch') && attempts <= retryCount) {
        retry();
      } else {
        fail();
      }
    },
  });
}
