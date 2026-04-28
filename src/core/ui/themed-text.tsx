import { Text } from '@/core/ui/tw';
import { type TextProps } from 'react-native';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  let className = '';
  switch (type) {
    case 'default':
      className = 'text-raices-text font-body text-base leading-6';
      break;
    case 'defaultSemiBold':
      className = 'text-raices-text font-headline font-semibold text-base leading-6';
      break;
    case 'title':
      className = 'text-raices-text font-headline font-bold text-3xl leading-8';
      break;
    case 'subtitle':
      className = 'text-raices-text font-headline font-bold text-xl';
      break;
    case 'link':
      className = 'text-raices-secondary font-headline text-base leading-7';
      break;
  }

  return <Text className={className} style={style} {...rest} />;
}
