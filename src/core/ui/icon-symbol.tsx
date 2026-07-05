// Fallback for using MaterialCommunityIcons on Android and web.
// Icon names are SF Symbol names (iOS); this file maps them to
// MaterialCommunityIcons names which have the broadest coverage (~7000 icons).
// Browse: https://icons.expo.fyi  (filter by MaterialCommunityIcons)

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<string, ComponentProps<typeof MaterialCommunityIcons>['name']>;
export type IconSymbolName = keyof typeof MAPPING;

/**
 * SF Symbol → MaterialCommunityIcons mapping.
 * Add new entries as you use new icons in the app.
 * SF Symbols reference:    https://developer.apple.com/sf-symbols/
 * MCI reference:           https://icons.expo.fyi
 */
const MAPPING = {
  // --- Navigation ---
  'house.fill':                               'home',
  'chevron.right':                            'chevron-right',
  'chevron.left':                             'chevron-left',
  'chevron.left.forwardslash.chevron.right':  'code-tags',

  // --- Actions ---
  'paperplane.fill':                          'send',
  'play.fill':                                'play',
  'pause.fill':                               'pause',
  'stop.fill':                                'stop',
  'mic.fill':                                 'microphone',
  'mic.slash.fill':                           'microphone-off',
  'checkmark':                                'check',
  'xmark':                                    'close',
  'trash.fill':                               'trash-can',
  'trash':                                    'trash-can-outline',
  'pencil':                                   'pencil',
  'plus':                                     'plus',
  'plus.circle.fill':                         'plus-circle',
  'minus':                                    'minus',
  'ellipsis':                                 'dots-horizontal',
  'rectangle.portrait.and.arrow.right':       'logout',
  'square.and.arrow.up':                      'share-variant',

  // --- Health & Wellness ---
  'heart.fill':                               'heart',
  'figure.walk':                              'walk',
  'face.smiling':                             'emoticon-happy-outline',
  'face.smiling.inverse':                     'emoticon-happy',
  'sun.max.fill':                             'weather-sunny',
  'pills.fill':                               'pill',

  // --- People & Social ---
  'person.fill':                              'account',
  'person.2.fill':                            'account-group',
  'person.3.fill':                           'account-group',
  'person.crop.circle':                       'account-circle',

  // --- Media & Files ---
  'photo.fill':                               'image',
  'music.note':                               'music-note',
  'waveform':                                 'waveform',

  // --- System ---
  'bell.fill':                                'bell',
  'gear':                                     'cog',
  'gearshape.fill':                            'cog',
  'magnifyingglass':                          'magnify',
  'exclamationmark.triangle.fill':            'alert',
  'info.circle.fill':                         'information',
  'checkmark.circle.fill':                    'check-circle',
  'xmark.circle.fill':                        'close-circle',
  'questionmark.circle.fill':                 'help-circle',
  'lock.fill':                                'lock',
  'calendar':                                 'calendar',
  'calendar.badge.minus':                     'calendar-blank',
  'pill.fill':                                'pill',
  'stethoscope':                              'stethoscope',

  // --- Dashboard / Medical ---
  'chart.bar.fill':                           'chart-bar',
  'waveform.path.ecg':                        'heart-pulse',
  'checkmark.seal.fill':                      'check-decagram',
  'exclamationmark.octagon.fill':             'alert-octagon',

	'shield.checkered':                        'shield-check',
	'envelope.fill':                           'email',
	'camera.fill':																	'camera',
	"qrcode.viewfinder":																	'qrcode-scan',
	'keyboard':                                'keyboard-outline',
	'house.badge.plus':                        'home-plus',
	'person.badge.plus':                       'account-plus',
	'doc.on.doc':                              'content-copy',
	'arrow.clockwise':                         'refresh',
} as IconMapping;

/**
 * Universal icon component.
 *
 * - iOS:            native SF Symbols (via icon-symbol.ios.tsx)
 * - Android / Web:  MaterialCommunityIcons font (this file)
 *
 * Always reference icons by their SF Symbol name.
 * @example
 *   <IconSymbol name="mic.fill"  size={24} color="#fff" />
 *   <IconSymbol name="play.fill" size={20} color="#53815F" />
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight; // accepted but unused on Android/web
}) {
  const mappedName = MAPPING[name];
  if (!mappedName) {
    console.warn(`[IconSymbol] No Android/web mapping for SF Symbol: "${name}". Add it to MAPPING in icon-symbol.tsx`);
  }
  return (
    <MaterialCommunityIcons
      color={color}
      size={size}
      name={mappedName ?? 'help-circle-outline'}
      style={style}
    />
  );
}

