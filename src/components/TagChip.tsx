import React from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import theme from '../constants/theme';
import { Tag } from '../game/types';
import { usePop } from '../hooks/useStagger';

type Props = {
  tag: Tag | 'all';
  label?: string;
  selected?: boolean;
  onPress?: (tag: Tag | 'all') => void;
  index?: number;
  countLabel?: string;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

export function tagColor(tag: Tag | 'all'): string {
  if (tag === 'idea') {
    return theme.colors.tag.idea;
  }
  if (tag === 'question') {
    return theme.colors.tag.question;
  }
  if (tag === 'disagreement') {
    return theme.colors.tag.disagreement;
  }
  return theme.colors.text.secondary;
}

/** 44px pill inside a 56px hit area. */
function TagChip({ tag, label, selected = false, onPress, index = 0, countLabel }: Props) {
  const pop = usePop(index);
  const color = tagColor(tag);
  const text = (label || tag).toUpperCase() + (countLabel ? '  ' + countLabel : '');

  const body = (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.pill,
        {
          backgroundColor: color + (selected ? '33' : '1F'),
          borderColor: color + (selected ? 'CC' : '61'),
          borderWidth: selected ? 2 : 1,
        },
        pop,
      ]}>
      <Text numberOfLines={1} style={[styles.label, { color }]}>
        {text}
      </Text>
    </Animated.View>
  );

  if (!onPress) {
    return body;
  }

  return (
    <Pressable
      onPress={() => onPress(tag)}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={text}
      style={styles.hitArea}>
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hitArea: {
    height: 56,
    justifyContent: 'center',
  },
  pill: {
    height: 44,
    minWidth: 64,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: theme.font.serif,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
});

export default React.memo(TagChip);
