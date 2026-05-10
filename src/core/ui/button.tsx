import React from 'react';
import { ActivityIndicator, type ViewStyle } from 'react-native';
import { IconSymbol } from './icon-symbol';
import { Pressable, Text } from '@/core/ui/tw';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize    = 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps {
  // --- Content ---
  /** Label text — omit when using iconOnly */
  label?: string;
  /** Name of the SF Symbol to render before the label (e.g., "play.fill") */
  icon?: string;
  /** Node rendered before the label (e.g. <IconSymbol name="play.fill" />) */
  iconLeft?: React.ReactNode;
  /** Node rendered after the label */
  iconRight?: React.ReactNode;
  /** Renders only the icon in a square/circle button — label is ignored */
  iconOnly?: React.ReactNode;

  // --- Style ---
  variant?:  ButtonVariant;
  size?:     ButtonSize;
  /** Full width (default: false) */
  fullWidth?: boolean;
  /** Pill shape (default: true). false → rounded-2xl */
  pill?: boolean;
  /** Inline style override applied to the Pressable container */
  style?: ViewStyle;

  // --- Behavior ---
  onPress?:  () => void;
  disabled?: boolean;
  loading?:  boolean;
}

// ---------------------------------------------------------------------------
// Style maps
// ---------------------------------------------------------------------------

const BASE = 'flex-row items-center justify-center active:opacity-80';

const VARIANT_CONTAINER: Record<ButtonVariant, string> = {
  primary:   'bg-raices-primary',
  secondary: 'bg-raices-secondary',
  outline:   'bg-transparent border-2 border-raices-primary',
  ghost:     'bg-transparent',
  danger:    'bg-raices-error',
};

const VARIANT_TEXT: Record<ButtonVariant, string> = {
  primary:   'text-white',
  secondary: 'text-white',
  outline:   'text-raices-primary',
  ghost:     'text-raices-primary',
  danger:    'text-white',
};

const VARIANT_SPINNER: Record<ButtonVariant, string> = {
  primary:   '#FFFFFF',
  secondary: '#FFFFFF',
  outline:   '#325F3F',
  ghost:     '#325F3F',
  danger:    '#FFFFFF',
};

/**
 * Icon-only dimensions (width = height).
 * sm → 36px  md → 48px  lg → 64px  xl → 100px
 */
const ICON_ONLY_SIZE: Record<ButtonSize, ViewStyle> = {
  sm: { width: 36,  height: 36  },
  md: { width: 48,  height: 48  },
  lg: { width: 64,  height: 64  },
  xl: { width: 100, height: 100 },
};

const SIZE_CONTAINER: Record<ButtonSize, string> = {
  sm: 'py-2  px-4  gap-2',
  md: 'py-4  px-8  gap-3',
  lg: 'py-5  px-10 gap-4',
  xl: 'py-6  px-12 gap-4',
};

const SIZE_TEXT: Record<ButtonSize, string> = {
  sm: 'text-sm  font-medium',
  md: 'text-base font-bold',
  lg: 'text-lg  font-bold',
  xl: 'text-xl  font-bold',
};

const SIZE_ICON: Record<ButtonSize, number> = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

const SIZE_SPINNER: Record<ButtonSize, 'small' | 'large'> = {
  sm: 'small',
  md: 'small',
  lg: 'large',
  xl: 'large',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Global Button component for Raíces.
 *
 * @example
 * // Primary — full width
 * <Button label="Continuar" variant="primary" fullWidth onPress={...} />
 *
 * // With left icon
 * <Button label="Escuchar" iconLeft={<IconSymbol name="play.fill" size={18} color="#fff" />} onPress={...} />
 *
 * // Outline
 * <Button label="Cancelar" variant="outline" onPress={...} />
 *
 * // Ghost small
 * <Button label="Ver más" variant="ghost" size="sm" onPress={...} />
 *
 * // Icon-only mic button (xl = 100×100px)
 * <Button
 *   variant="primary"
 *   iconOnly={<IconSymbol name="mic.fill" size={40} color="#fff" />}
 *   size="xl"
 *   onPress={...}
 * />
 *
 * // Danger + loading
 * <Button label="Eliminar" variant="danger" loading={deleting} onPress={...} />
 */
export function Button({
  label,
  icon,
  iconLeft,
  iconRight,
  iconOnly,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  pill = true,
  style,
  onPress,
  disabled = false,
  loading = false,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const rounded = pill ? 'rounded-full' : 'rounded-2xl';

  const finalIconLeft = icon ? (
    <IconSymbol
      name={icon}
      size={SIZE_ICON[size]}
      color={VARIANT_TEXT[variant]}
      className="-translate-y-px" // Minor optical adjustment
    />
  ) : (
    iconLeft
  );

  // ---- Icon-only layout ----
  if (iconOnly !== undefined) {
    return (
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        className={[
          BASE,
          VARIANT_CONTAINER[variant],
          rounded,
          isDisabled ? 'opacity-50' : '',
        ].join(' ')}
        // Use explicit pixel dimensions so Tailwind class conflicts don't
        // interfere with the fixed button size
        style={[ICON_ONLY_SIZE[size], style]}
      >
        {loading ? (
          <ActivityIndicator
            color={VARIANT_SPINNER[variant]}
            size={SIZE_SPINNER[size]}
          />
        ) : (
          iconOnly
        )}
      </Pressable>
    );
  }

  // ---- Label layout ----
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={[
        BASE,
        SIZE_CONTAINER[size],
        VARIANT_CONTAINER[variant],
        rounded,
        fullWidth ? 'w-full' : '',
        isDisabled ? 'opacity-50' : '',
      ].join(' ')}
      style={style}
    >
      {loading ? (
        <ActivityIndicator
          color={VARIANT_SPINNER[variant]}
          size={SIZE_SPINNER[size]}
        />
      ) : (
        <>
          {finalIconLeft}
          {label && (
            <Text
              className={`font-headline ${SIZE_TEXT[size]} ${VARIANT_TEXT[variant]}`}
            >
              {label}
            </Text>
          )}
          {iconRight}
        </>
      )}
    </Pressable>
  );
}
