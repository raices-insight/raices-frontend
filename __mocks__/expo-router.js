const actual = jest.requireActual('expo-router');
const React = require('react');

module.exports = {
  ...actual,
  useFocusEffect: (cb) => {
    React.useEffect(() => {
      let isActive = true;
      let cleanup;
      if (isActive) cleanup = cb();
      return () => {
        isActive = false;
        if (typeof cleanup === 'function') cleanup();
      };
    }, [cb]);
  },
  useLocalSearchParams: jest.fn().mockImplementation(() => ({})),
  useRouter: jest.fn().mockImplementation(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  })),
};
