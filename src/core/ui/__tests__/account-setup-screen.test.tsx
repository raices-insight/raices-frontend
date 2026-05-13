import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { AccountSetupScreen } from '../account-setup-screen';
import type { GoogleUser } from '@/features/auth/hooks/use-google-auth';

// ─── Module mocks ─────────────────────────────────────────────────────────────

jest.mock('expo-image', () => ({
  Image: () => null,
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => null,
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: require('react-native').View,
}));

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const MOCK_USER: GoogleUser = {
  id: 'profile-uuid',
  email: 'juan.perez@gmail.com',
  name: 'Juan Pérez',
  photo: null,
  role: 'user',
};

// ─── Suite ────────────────────────────────────────────────────────────────────

describe('AccountSetupScreen', () => {
  // ─── TC-001-N-003 — Caregiver option ──────────────────────────────────────

  describe('TC-001-N-003: Caregiver role selection', () => {
    it('always renders the Caregiver role card', async () => {
      await render(<AccountSetupScreen user={MOCK_USER} onComplete={jest.fn()} />);

      expect(screen.getByText('Soy Cuidador')).toBeOnTheScreen();
    });

    it('calls onComplete("caregiver") when Caregiver is selected and confirmed', async () => {
      const onComplete = jest.fn();
      await render(<AccountSetupScreen user={MOCK_USER} onComplete={onComplete} />);

      await fireEvent.press(screen.getByText('Soy Cuidador'));
      await fireEvent.press(screen.getByText('Comenzar como Cuidador'));

      expect(onComplete).toHaveBeenCalledWith('caregiver');
    });

    it('updates the submit button label after selecting Caregiver', async () => {
      await render(<AccountSetupScreen user={MOCK_USER} onComplete={jest.fn()} />);

      await fireEvent.press(screen.getByText('Soy Cuidador'));

      expect(screen.getByText('Comenzar como Cuidador')).toBeOnTheScreen();
    });
  });

  // ─── TC-001-N-004 — Older Adult option ────────────────────────────────────

  describe('TC-001-N-004: Adulto Mayor role selection', () => {
    it('renders the Older Adult role card when age >= 65 (default)', async () => {
      await render(<AccountSetupScreen user={MOCK_USER} onComplete={jest.fn()} />);

      expect(screen.getByText('Soy Persona Mayor')).toBeOnTheScreen();
    });

    it('hides the Older Adult role card when age falls below 65', async () => {
      await render(<AccountSetupScreen user={MOCK_USER} onComplete={jest.fn()} />);

      // Default age is 65 — press "−" once → 64
      await fireEvent.press(screen.getByText('−'));

      expect(screen.queryByText('Soy Persona Mayor')).toBeNull();
    });

    it('calls onComplete("older_adult") when Older Adult is selected and confirmed', async () => {
      const onComplete = jest.fn();
      await render(<AccountSetupScreen user={MOCK_USER} onComplete={onComplete} />);

      await fireEvent.press(screen.getByText('Soy Persona Mayor'));
      await fireEvent.press(screen.getByText('Comenzar como Adulto Mayor'));

      expect(onComplete).toHaveBeenCalledWith('older_adult');
    });

    it('updates the submit button label after selecting Older Adult', async () => {
      await render(<AccountSetupScreen user={MOCK_USER} onComplete={jest.fn()} />);

      await fireEvent.press(screen.getByText('Soy Persona Mayor'));

      expect(screen.getByText('Comenzar como Adulto Mayor')).toBeOnTheScreen();
    });
  });

  // ─── Submit guard ──────────────────────────────────────────────────────────

  describe('submit button state', () => {
    it('shows a placeholder and does not call onComplete before a role is selected', async () => {
      const onComplete = jest.fn();
      await render(<AccountSetupScreen user={MOCK_USER} onComplete={onComplete} />);

      await fireEvent.press(screen.getByText('Selecciona un perfil'));

      expect(onComplete).not.toHaveBeenCalled();
    });

    it('shows "Actualizando…" on the submit button when loading=true', async () => {
      await render(
        <AccountSetupScreen user={MOCK_USER} onComplete={jest.fn()} loading={true} />,
      );

      // Select a role first so the loading text is visible
      await fireEvent.press(screen.getByText('Soy Cuidador'));

      expect(screen.getByText('Actualizando...')).toBeOnTheScreen();
    });
  });

  // ─── TC-001-E-004 — Google account without display name ───────────────────

  describe('TC-001-E-004: user has no Google display name', () => {
    it('renders without crashing when user.name is an empty string', async () => {
      const userNoName: GoogleUser = { ...MOCK_USER, name: '', photo: null };

      await render(<AccountSetupScreen user={userNoName} onComplete={jest.fn()} />);

      expect(screen.getByText('Soy Cuidador')).toBeOnTheScreen();
    });

    it('still shows both role options when user has no name', async () => {
      const userNoName: GoogleUser = { ...MOCK_USER, name: '', photo: null };

      await render(<AccountSetupScreen user={userNoName} onComplete={jest.fn()} />);

      expect(screen.getByText('Soy Cuidador')).toBeOnTheScreen();
      expect(screen.getByText('Soy Persona Mayor')).toBeOnTheScreen();
    });
  });
});
