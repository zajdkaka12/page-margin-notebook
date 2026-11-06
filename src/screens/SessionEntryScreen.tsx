import React, { useCallback, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Timer } from 'lucide-react-native';
import AppShell from '../components/AppShell';
import ScreenHeader from '../components/ScreenHeader';
import MarginRule from '../components/MarginRule';
import PageNumberField from '../components/PageNumberField';
import PrimaryButton from '../components/PrimaryButton';
import StatRow, { StatItem } from '../components/StatRow';
import theme from '../constants/theme';
import { MINUTE_PRESETS } from '../constants/config';
import { Book } from '../game/types';
import { validateSession } from '../game/notebook';
import { pagesPerMinute } from '../utils/format';

type Props = {
  book: Book;
  onBack: () => void;
  onLog: (startPage: number, endPage: number, minutes: number) => void;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

function SessionEntryScreen({ book, onBack, onLog }: Props) {
  const [startPage, setStartPage] = useState<number>(book.currentPage);
  const [endPage, setEndPage] = useState<number>(
    Math.min(book.totalPages, book.currentPage + 24),
  );
  const [minutes, setMinutes] = useState<number>(30);
  const [error, setError] = useState<string | null>(null);

  const pages = Math.max(0, endPage - startPage);

  const stats = useMemo<StatItem[]>(
    () => [
      {
        key: 'pages',
        value: String(pages),
        label: 'pages read',
        valueColor: theme.colors.accent.burgundy,
      },
      {
        key: 'rate',
        value: pagesPerMinute(pages, minutes),
        label: 'pages / min',
        valueColor: theme.colors.accent.gilt,
      },
    ],
    [pages, minutes],
  );

  const handleLog = useCallback(() => {
    const problem = validateSession(startPage, endPage, minutes, book.totalPages);
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    onLog(startPage, endPage, minutes);
  }, [startPage, endPage, minutes, book.totalPages, onLog]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <AppShell variant="compose">
        <MarginRule top={150} bottom={0} left={26} />

        <ScreenHeader
          title="READING SESSION"
          subtitle={book.title}
          onBack={onBack}
          rightSlot={
            <View style={styles.mark}>
              <Timer
                size={24}
                color={theme.colors.accent.gilt}
                strokeWidth={1.8}
              />
            </View>
          }
        />

        <KeyboardAvoidingView
          style={styles.body}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.pageRow}>
            <PageNumberField
              label="START PAGE"
              value={startPage}
              onChange={setStartPage}
              max={book.totalPages}
            />
            <View style={styles.vDivider} />
            <PageNumberField
              label="END PAGE"
              value={endPage}
              onChange={setEndPage}
              max={book.totalPages}
            />
          </View>

          <Text style={styles.sectionLabel}>MINUTES</Text>
          <View style={styles.minuteRow}>
            {MINUTE_PRESETS.map(m => {
              const active = m === minutes;
              return (
                <Pressable
                  key={m}
                  onPress={() => setMinutes(m)}
                  hitSlop={HIT}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  accessibilityLabel={m + ' minutes'}
                  style={styles.minuteHit}>
                  <View
                    style={[
                      styles.minuteChip,
                      active ? styles.minuteChipActive : null,
                    ]}>
                    <Text
                      style={[
                        styles.minuteText,
                        active ? styles.minuteTextActive : null,
                      ]}>
                      {m}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          <StatRow items={stats} style={styles.stats} />

          {error ? <Text style={styles.error}>{error}</Text> : null}
        </KeyboardAvoidingView>

        <View style={styles.footer}>
          <Text style={styles.hint}>WHERE YOU STOPPED  ·  HOW LONG IT TOOK</Text>
          <PrimaryButton label="LOG SESSION" onPress={handleLog} Icon={Timer} />
        </View>
      </AppShell>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg.primary,
  },
  mark: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  pageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  vDivider: {
    width: 1,
    height: 52,
    marginHorizontal: 12,
    backgroundColor: theme.colors.ui.giltBorder,
  },
  sectionLabel: {
    marginTop: 20,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.accent.gilt,
  },
  minuteRow: {
    flexDirection: 'row',
    gap: 8,
  },
  minuteHit: {
    flex: 1,
    height: 56,
    justifyContent: 'center',
  },
  minuteChip: {
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(107,45,62,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(107,45,62,0.18)',
  },
  minuteChipActive: {
    backgroundColor: 'rgba(107,45,62,0.18)',
    borderColor: theme.colors.accent.burgundy,
    borderWidth: 2,
  },
  minuteText: {
    fontFamily: theme.font.serif,
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text.secondary,
  },
  minuteTextActive: {
    color: theme.colors.accent.burgundy,
  },
  stats: {
    marginTop: 18,
  },
  error: {
    marginTop: 14,
    fontSize: 12,
    lineHeight: 18,
    color: theme.colors.accent.terracotta,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 10,
  },
  hint: {
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2,
    color: theme.colors.text.muted,
  },
});

export default SessionEntryScreen;
