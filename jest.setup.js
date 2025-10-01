// Only load jest-dom matchers in jsdom environment (not in node environment tests)
// This prevents "Node is not defined" errors in tests with @jest-environment node
if (typeof window !== 'undefined') {
  // Dynamically import jest-dom only in browser environment
  import('@testing-library/jest-dom');
}

// Provide matchMedia mock for responsive component tests
if (typeof window !== 'undefined' && !window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}

// Provide a minimal ResizeObserver implementation for layout-related tests
if (typeof window !== 'undefined' && !window.ResizeObserver) {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  Object.defineProperty(window, 'ResizeObserver', {
    writable: true,
    configurable: true,
    value: ResizeObserver,
  });
}
