import React from 'react';
import { View } from 'react-native';
import theme from '../constants/theme';

type Props = {
  width?: number | string;
  height?: number;
  color?: string;
  marginTop?: number;
  marginBottom?: number;
  align?: 'left' | 'center';
};

/** Gilt hairline divider — never a flat grey full-width line. */
function SectionRule({
  width = 64,
  height = 2,
  color = theme.colors.accent.gilt,
  marginTop = 14,
  marginBottom = 12,
  align = 'left',
}: Props) {
  return (
    <View
      style={{
        width: width as any,
        height,
        backgroundColor: color,
        borderRadius: height,
        marginTop,
        marginBottom,
        alignSelf: align === 'center' ? 'center' : 'flex-start',
      }}
    />
  );
}

export default React.memo(SectionRule);
