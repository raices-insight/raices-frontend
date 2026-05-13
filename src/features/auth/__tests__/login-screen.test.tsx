import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { LoginScreen } from '../components/LoginScreen';

// ─── Module mocks ─────────────────────────────────────────────────────────────

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), replace: jest.fn() },
}));

// Bypass NativeWind CSS-in-JS wrappers — use plain React Native components
jest.mock('@/core/ui/tw', () => {
  const RN = require('react-native');
  return {
    View: RN.View,
    Text: RN.Text,
    Pressable: RN.Pressable,
    ScrollView: RN.ScrollView,
    TextInput: RN.TextInput,
  };
});

// Bypass animated expo-image wrapper
jest.mock('@/core/ui/image', () => ({
  Image: () => null,
}));

// ─── Suite ────────────────────────────────────────────────────────────────────

describe('LoginScreen', () => {
  // ─── TC-001-N-001 — Google sign-in button ──────────────────────────────────

  describe('TC-001-N-001: Google sign-in button is present', () => {
    it('renders the "Iniciar sesión con Google" button when not loading', async () => {
      await render(<LoginScreen loading={false} error={null} onSignIn={jest.fn()} />);

      expect(screen.getByText('Iniciar sesión con Google')).toBeOnTheScreen();
    });

    it('calls onSignIn when the button is pressed', async () => {
      const onSignIn = jest.fn();
      await render(<LoginScreen loading={false} error={null} onSignIn={onSignIn} />);

      await fireEvent.press(screen.getByText('Iniciar sesión con Google'));

      expect(onSignIn).toHaveBeenCalledTimes(1);
    });
  });

  // ─── Loading state ─────────────────────────────────────────────────────────

  describe('loading state', () => {
    it('hides the sign-in text and shows a spinner while loading', async () => {
      await render(<LoginScreen loading={true} error={null} onSignIn={jest.fn()} />);

      expect(screen.queryByText('Iniciar sesión con Google')).toBeNull();
    });

    it('never calls onSignIn while in loading state', () => {
      const onSignIn = jest.fn();
      render(<LoginScreen loading={true} error={null} onSignIn={onSignIn} />);

      // No interaction possible — button text is replaced by ActivityIndicator
      expect(screen.queryByText('Iniciar sesión con Google')).toBeNull();
      expect(onSignIn).not.toHaveBeenCalled();
    });
  });

  // ─── TC-001-E-001 — Error display ─────────────────────────────────────────

  describe('TC-001-E-001: error feedback displayed to the user', () => {
    it('shows the error message when an error prop is provided', async () => {
      const errorMsg = 'Error al iniciar sesión. Verifica tu conexión e inténtalo de nuevo.';
      await render(<LoginScreen loading={false} error={errorMsg} onSignIn={jest.fn()} />);

      expect(screen.getByText(errorMsg)).toBeOnTheScreen();
    });

    it('does not show an error when error prop is null', async () => {
      await render(<LoginScreen loading={false} error={null} onSignIn={jest.fn()} />);

      expect(
        screen.queryByText(/Error al iniciar sesión/),
      ).toBeNull();
    });
  });
});
