export type ComponentConfig = {
  name: string;
  path: string;
  loadingComponent?: string;
  errorComponent?: string;
  retryCount?: number;
  timeout?: number;
  props?: Record<string, any>;
};

export enum ComponentLoadStatus {
  LOADING = 'LOADING',
  LOADED = 'LOADED',
  ERROR = 'ERROR',
}

export type ComponentCacheItem = {
  component: any;
  status: ComponentLoadStatus;
  loadTime: number;
  lastUsed: number;
  size: number;
};

export type LowCodeConfig = {
  theme?: string;
  componentsPath?: string;
  [key: string]: any;
};

export type PageData = {
  layout: any;
  components: Array<{
    type: string;
    props: Record<string, any>;
    children?: any[];
  }>;
  [key: string]: any;
};

export type LowCodeRendererProps = {
  config: LowCodeConfig;
  pageData: PageData;
};
