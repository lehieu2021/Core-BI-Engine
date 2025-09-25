/**
 * Performance monitoring utilities
 */
import React from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage?: number;
  bundleSize?: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    loadTime: 0,
    renderTime: 0
  };

  private startTime: number = 0;

  /**
   * Start performance monitoring
   */
  startMonitoring(): void {
    this.startTime = performance.now();
    
    // Monitor memory usage if available
    if ('memory' in performance) {
      this.monitorMemoryUsage();
    }
  }

  /**
   * Record load time
   */
  recordLoadTime(): void {
    if (this.startTime > 0) {
      this.metrics.loadTime = performance.now() - this.startTime;
    }
  }

  /**
   * Record render time for a specific component
   */
  recordRenderTime(componentName: string): void {
    const renderTime = performance.now() - this.startTime;
    this.metrics.renderTime = renderTime;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${componentName} render time: ${renderTime.toFixed(2)}ms`);
    }
  }

  /**
   * Monitor memory usage
   */
  private monitorMemoryUsage(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.metrics.memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // MB
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] Memory usage: ${this.metrics.memoryUsage.toFixed(2)}MB`);
      }
    }
  }

  /**
   * Get current metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Log performance metrics
   */
  logMetrics(): void {
    if (process.env.NODE_ENV === 'development') {
      console.group('[Performance Metrics]');
      console.log(`Load Time: ${this.metrics.loadTime.toFixed(2)}ms`);
      console.log(`Render Time: ${this.metrics.renderTime.toFixed(2)}ms`);
      if (this.metrics.memoryUsage) {
        console.log(`Memory Usage: ${this.metrics.memoryUsage.toFixed(2)}MB`);
      }
      console.groupEnd();
    }
  }

  /**
   * Measure function execution time
   */
  measureFunction<T>(fn: () => T, name: string): T {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${name} execution time: ${(end - start).toFixed(2)}ms`);
    }
    
    return result;
  }

  /**
   * Measure async function execution time
   */
  async measureAsyncFunction<T>(fn: () => Promise<T>, name: string): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${name} execution time: ${(end - start).toFixed(2)}ms`);
    }
    
    return result;
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * React hook for measuring component render performance
 */
export const usePerformanceMonitor = (componentName: string) => {
  const startTime = React.useRef(performance.now());
  
  React.useEffect(() => {
    const renderTime = performance.now() - startTime.current;
    performanceMonitor.recordRenderTime(componentName);
  });
};

/**
 * Higher-order component for performance monitoring
 */
export const withPerformanceMonitoring = <P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) => {
  return React.memo((props: P) => {
    const startTime = React.useRef(performance.now());
    
    React.useEffect(() => {
      const renderTime = performance.now() - startTime.current;
      performanceMonitor.recordRenderTime(componentName);
    });
    
    return <Component {...props} />;
  });
};

/**
 * Bundle size analyzer utility
 */
export const analyzeBundleSize = () => {
  if (process.env.NODE_ENV === 'development') {
    // This would typically be used with webpack-bundle-analyzer
    console.log('[Bundle Analysis] Run "npm run build:analyze" to analyze bundle size');
  }
};

/**
 * Web Vitals monitoring
 */
export const monitorWebVitals = () => {
  if (typeof window !== 'undefined' && 'web-vitals' in window) {
    // This would integrate with web-vitals library
    console.log('[Web Vitals] Monitoring enabled');
  }
};

export default performanceMonitor;