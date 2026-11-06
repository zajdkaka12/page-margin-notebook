import React from 'react';
import { StyleSheet, View } from 'react-native';
import StatCard from './StatCard';

export type StatItem = {
  key: string;
  value: string;
  label: string;
  valueColor: string;
};

type Props = {
  items: StatItem[];
  dark?: boolean;
  style?: any;
};

/**
 * Renders a stat row only when at least two pills have something to say —
 * a lone pill or an empty rounded box reads as a broken skeleton loader.
 */
function StatRow({ items, dark = false, style }: Props) {
  const visible = items.filter(i => i.value.length > 0 && i.value !== '0');
  if (visible.length < 2) {
    return null;
  }
  return (
    <View style={[styles.row, style]}>
      {visible.map(item => (
        <View key={item.key} style={styles.slot}>
          <StatCard
            value={item.value}
            label={item.label}
            valueColor={item.valueColor}
            dark={dark}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  slot: {
    flex: 1,
  },
});

export default React.memo(StatRow);
