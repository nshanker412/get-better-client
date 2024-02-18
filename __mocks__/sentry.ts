// __mocks__/sentry.js
export const init = jest.fn();
export const captureException = jest.fn();
export const addBreadcrumb = jest.fn();
export const setTag = jest.fn();
export const setUser = jest.fn();
export const wrap = jest.fn().mockImplementation((app) => app); // mock wrap to return the input function/component
export const withScope = jest.fn((callback) => {
  const scope = {
    setTag: jest.fn(),
    setUser: jest.fn(),
    setContext: jest.fn(),
  };
  callback(scope);
});

export class ReactNavigationInstrumentation {
  registerRoutingInstrumentation = jest.fn();
  onRouteWillChange = jest.fn();
}

export class ReactNativeTracing {
  constructor(options) {}
}

const Sentry = {
  init,
  captureException,
  addBreadcrumb,
  setTag,
  setUser,
  wrap, // Add the wrap mock here
  withScope,
  ReactNavigationInstrumentation,
  ReactNativeTracing,
};

export default Sentry;
