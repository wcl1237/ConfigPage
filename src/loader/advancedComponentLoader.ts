import { type ComponentConfig, type ComponentCacheItem, ComponentLoadStatus } from '../types';

class AdvancedComponentLoader {
  private componentCache: Map<string, ComponentCacheItem> = new Map();
  private loadingQueue: Map<string, Promise<any>> = new Map();
  private preloadQueue: Set<string> = new Set();
  private observer: IntersectionObserver;
  private maxCacheSize = 50;
  private cacheSize = 0;

  constructor() {
    this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
      rootMargin: '100px 0px',
      threshold: 0.1,
    });
  }

  async loadComponent(config: ComponentConfig): Promise<any> {
    const { name, path, retryCount = 3, timeout = 30000 } = config;

    if (this.componentCache.has(name)) {
      const cached = this.componentCache.get(name)!;
      cached.lastUsed = Date.now();
      return cached.component;
    }

    if (this.loadingQueue.has(name)) {
      return this.loadingQueue.get(name)!;
    }

    const loadPromise = this.loadWithRetry(path, retryCount, timeout)
      .then((component) => {
        this.cacheComponent(name, component);
        this.loadingQueue.delete(name);
        return component;
      })
      .catch((err) => {
        this.loadingQueue.delete(name);
        throw err;
      });

    this.loadingQueue.set(name, loadPromise);
    return loadPromise;
  }

  private async loadWithRetry(path: string, retryCount: number, timeout: number): Promise<any> {
    for (let attempt = 1; attempt <= retryCount; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const component = await this.importComponent(path, controller.signal);
        clearTimeout(timeoutId);
        return component;
      } catch (error) {
        if (attempt === retryCount) throw error;
        await this.delay(Math.pow(2, attempt) * 300);
      }
    }
  }

  private async importComponent(path: string, signal?: AbortSignal): Promise<any> {
    // 这里使用相对路径约定：src/components/...
    // 根据项目构建工具调整 import 路径
    const module = await import(/* webpackChunkName: "[request]" */ path);
    if (signal?.aborted) throw new Error('加载被取消');
    return module.default || module;
  }

  private cacheComponent(name: string, component: any): void {
    const item: ComponentCacheItem = {
      component,
      status: ComponentLoadStatus.LOADED,
      loadTime: Date.now(),
      lastUsed: Date.now(),
      size: this.estimateSize(component),
    };

    if (this.cacheSize + item.size > this.maxCacheSize) this.evictCache();
    this.componentCache.set(name, item);
    this.cacheSize += item.size;
  }

  private estimateSize(component: any): number {
    try {
      return JSON.stringify(component).length;
    } catch {
      return 1;
    }
  }

  private evictCache(): void {
    const entries = Array.from(this.componentCache.entries());
    const sorted = entries.sort((a, b) => a[1].lastUsed - b[1].lastUsed);
    const removeCount = Math.max(1, Math.floor(sorted.length * 0.2));
    const toRemove = sorted.slice(0, removeCount);
    toRemove.forEach(([name]) => {
      const it = this.componentCache.get(name);
      if (it) this.cacheSize -= it.size;
      this.componentCache.delete(name);
    });
  }

  preloadComponent(config: ComponentConfig): void {
    const { name } = config;
    if (this.componentCache.has(name) || this.loadingQueue.has(name)) return;

    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        this.loadComponent(config).catch(() => {});
      });
    } else {
      setTimeout(() => {
        this.loadComponent(config).catch(() => {});
      }, 1000);
    }
  }

  observeElement(element: HTMLElement, config: ComponentConfig): void {
    this.observer.observe(element);
    this.preloadQueue.add(config.name);
    // 将元素和配置映射逻辑可按需扩展
  }

  private handleIntersection(entries: IntersectionObserverEntry[]): void {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        this.observer.unobserve(entry.target);
        // 简化：对队列内所有预加载项进行触发
        this.preloadQueue.forEach((name) => {
          // 实际项目可通过 name->config 映射加载精确项
        });
      }
    });
  }

  clearCache(): void {
    this.componentCache.clear();
    this.loadingQueue.clear();
    this.preloadQueue.clear();
    this.cacheSize = 0;
  }

  getCacheStats() {
    return { size: this.cacheSize, count: this.componentCache.size, hitRate: 0 };
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const componentLoader = new AdvancedComponentLoader();
export default componentLoader;
