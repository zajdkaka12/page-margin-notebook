import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import type { IconType } from './PrimaryButton';

type Props = {
  Icon?: IconType;
  sprite?: any;
  title: string;
  hint: string;
};

/** Every list has one of these — a blank region is a QA fail. */
function EmptyState({ Icon, sprite, title, hint }: Props) {
  return (
    <View style={styles.root}>
      {sprite ? (
        <Image source={sprite} style={styles.sprite} resizeMode="contain" />
      ) : Icon ? (
        <Icon size={56} color={theme.colors.accent.gilt} strokeWidth={1.4} />
      ) : null}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.hint}>{hint}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 32,
  },
  sprite: {
    width: 92,
    height: 92,
    opacity: 0.9,
  },
  title: {
    marginTop: 14,
    fontFamily: theme.font.serif,
    fontSize: 17,
    fontWeight: '600',
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  hint: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    color: theme.colors.text.muted,
    textAlign: 'center',
  },
});

export default React.memo(EmptyState);
