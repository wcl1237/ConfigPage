import type { ComponentConfig } from '../types';
import { componentLoader } from '../loader/advancedComponentLoader';

class ComponentRegistry {
  private registry = new Map<string, ComponentConfig>();
  private dependencies = new Map<string, string[]>();

  registerComponent(config: ComponentConfig): void {
    this.registry.set(config.name, config);
  }

  registerDependency(componentName: string, deps: string[]): void {
    this.dependencies.set(componentName, deps);
  }

  getComponentConfig(name: string): ComponentConfig | undefined {
    return this.registry.get(name);
  }

  async preloadComponentWithDependencies(name: string): Promise<void> {
    const config = this.getComponentConfig(name);
    if (!config) return;
    const deps = this.dependencies.get(name) || [];
    await Promise.all(deps.map((dep) => this.preloadComponent(dep)));
    await this.preloadComponent(name);
  }

  private async preloadComponent(name: string): Promise<void> {
    const cfg = this.getComponentConfig(name);
    if (cfg) {
      componentLoader.preloadComponent(cfg);
    }
  }

  setupIntelligentPreloading(router: any): void {
    if (router?.afterEach) {
      router.afterEach((to: any) => {
        this.preloadRouteComponents(to);
      });
    }
    this.setupHoverPreloading();
  }

  private preloadRouteComponents(route: any): void {
    const routeComponents = this.getComponentsForRoute(route);
    const critical = routeComponents.slice(0, 2);
    critical.forEach((c) => this.preloadComponent(c));
    setTimeout(() => {
      routeComponents.slice(2).forEach((c) => this.preloadComponent(c));
    }, 1000);
  }

  private setupHoverPreloading(): void {
    document.addEventListener('mouseover', this.handleHover.bind(this), {
      capture: true,
      passive: true,
    });
  }

  private handleHover(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const componentName = this.detectComponentFromElement(target);
    if (componentName) {
      const cfg = this.getComponentConfig(componentName);
      if (cfg) componentLoader.preloadComponent(cfg);
    }
  }

  private detectComponentFromElement(el: HTMLElement): string | null {
    // 可根据 data-component 属性或类名映射
    return el.getAttribute?.('data-component') || null;
  }

  private getComponentsForRoute(route: any): string[] {
    // 项目需要按路由配置返回组件名数组
    return [];
  }
}

export const componentRegistry = new ComponentRegistry();
export default componentRegistry;
