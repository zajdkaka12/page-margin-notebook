import React from 'react';
import { View } from 'react-native';
import theme from '../constants/theme';
import { MARGIN_RULE_LEFT } from '../constants/config';

type Props = {
  top?: number;
  bottom?: number;
  left?: number;
  color?: string;
};

/** The vertical margin line that runs down every paper screen. */
function MarginRule({
  top = 0,
  bottom = 0,
  left = MARGIN_RULE_LEFT,
  color = theme.colors.ui.marginRule,
}: Props) {
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left,
        top,
        bottom,
        width: 1,
        backgroundColor: color,
      }}
    />
  );
}

export default React.memo(MarginRule);
