import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import theme from '../constants/theme';

type Props = {
  label: string;
  value: number;
  onChange: (next: number) => void;
  max: number;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

/** 72x52 numeric field with ASCII -/+ steppers (no glyph characters). */
function PageNumberField({ label, value, onChange, max }: Props) {
  const clamp = useCallback(
    (n: number) => Math.max(0, Math.min(max, n)),
    [max],
  );

  const onText = useCallback(
    (t: string) => {
      const digits = t.replace(/[^0-9]/g, '');
      onChange(clamp(digits.length ? parseInt(digits, 10) : 0));
    },
    [clamp, onChange],
  );

  const dec = useCallback(() => onChange(clamp(value - 1)), [clamp, onChange, value]);
  const inc = useCallback(() => onChange(clamp(value + 1)), [clamp, onChange, value]);

  return (
    <View style={styles.root}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <TextInput
          value={String(value)}
          onChangeText={onText}
          keyboardType="number-pad"
          maxLength={5}
          selectTextOnFocus
          accessibilityLabel={label}
          style={styles.input}
          placeholderTextColor={theme.colors.text.placeholder}
        />
        <Pressable
          onPress={dec}
          hitSlop={HIT}
          accessibilityRole="button"
          accessibilityLabel={label + ' minus one'}
          style={({ pressed }) => [styles.step, pressed ? styles.stepPressed : null]}>
          <Text style={styles.stepText}>-</Text>
        </Pressable>
        <Pressable
          onPress={inc}
          hitSlop={HIT}
          accessibilityRole="button"
          accessibilityLabel={label + ' plus one'}
          style={({ pressed }) => [styles.step, pressed ? styles.stepPressed : null]}>
          <Text style={styles.stepText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.accent.gilt,
    marginBottom: 7,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    width: 72,
    height: 52,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(107,45,62,0.25)',
    backgroundColor: theme.colors.surface.card,
    textAlign: 'center',
    fontFamily: theme.font.serif,
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.text.primary,
    paddingVertical: 0,
  },
  step: {
    width: 48,
    height: 52,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(107,45,62,0.18)',
    backgroundColor: 'rgba(107,45,62,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepPressed: {
    opacity: 0.7,
  },
  stepText: {
    fontFamily: theme.font.serif,
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '700',
    color: theme.colors.accent.burgundy,
  },
});

export default React.memo(PageNumberField);
