import { View, type ViewProps } from '@/core/ui/tw';

export type ThemedViewProps = ViewProps;

export function ThemedView({ style, ...otherProps }: ThemedViewProps) {
  return <View className="bg-raices-bg" style={style} {...otherProps} />;
}
