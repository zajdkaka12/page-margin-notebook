import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { BookOpen } from 'lucide-react-native';
import AppShell from '../components/AppShell';
import ScreenHeader from '../components/ScreenHeader';
import StatRow, { StatItem } from '../components/StatRow';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import SectionRule from '../components/SectionRule';
import theme from '../constants/theme';
import { COMPACT, HERO_SPRING } from '../constants/config';
import { Book, SessionResult } from '../game/types';

type Props = {
  result: SessionResult | null;
  book: Book;
  onReadAgain: () => void;
  onMenu: () => void;
  onSaveVerdict: (verdict: string) => void;
};

function GameOverScreen({
  result,
  book,
  onReadAgain,
  onMenu,
  onSaveVerdict,
}: Props) {
  const scale = useRef(new Animated.Value(0.7)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [verdict, setVerdict] = useState<string>('');

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        tension: HERO_SPRING.tension,
        friction: HERO_SPRING.friction,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 320,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scale, opacity]);

  const pages = result ? result.pages : 0;
  const minutes = result ? result.minutes : 0;
  const notesAdded = result ? result.notesAdded : 0;
  const finished = !!result && result.finished;

  const stats = useMemo<StatItem[]>(
    () => [
      {
        key: 'pages',
        value: String(pages),
        label: 'pages',
        valueColor: theme.colors.accent.gilt,
      },
      {
        key: 'minutes',
        value: String(minutes),
        label: 'minutes',
        valueColor: '#E9DFC8',
      },
      {
        key: 'notes',
        value: notesAdded > 0 ? '+' + notesAdded : '',
        label: 'notes',
        valueColor: theme.colors.accent.sage,
      },
    ],
    [pages, minutes, notesAdded],
  );

  // The replay CTA always reads READ AGAIN. When the book just ended, the
  // verdict is committed first and the shelf takes over.
  const handlePrimary = () => {
    if (finished) {
      if (verdict.trim().length > 1) {
        onSaveVerdict(verdict);
      }
      onMenu();
      return;
    }
    onReadAgain();
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <AppShell variant="summary">
        <View pointerEvents="none" style={styles.giltFrame} />

        <ScreenHeader title="SESSION SUMMARY" dark onBack={onMenu} />

        <View style={styles.body}>
          <Animated.View
            pointerEvents="none"
            style={{ opacity, transform: [{ scale }] }}>
            <View style={styles.hero}>
              <BookOpen
                size={COMPACT ? 64 : 78}
                color={theme.colors.accent.gilt}
                strokeWidth={1.2}
              />
            </View>
          </Animated.View>

          <Text style={styles.headline}>SESSION LOGGED</Text>
          <SectionRule
            width={80}
            height={2}
            marginTop={10}
            marginBottom={10}
            align="center"
          />
          <Text numberOfLines={2} style={styles.bookLine}>
            {book.title + '  ·  p. ' + book.currentPage + ' / ' + book.totalPages}
          </Text>

          <StatRow items={stats} dark style={styles.stats} />

          {finished ? (
            <View style={styles.verdictBlock}>
              <Text style={styles.verdictLabel}>ONE LINE FOR THE SHELF</Text>
              <TextInput
                value={verdict}
                onChangeText={setVerdict}
                placeholder="What will you remember about it?"
                placeholderTextColor="rgba(233,223,200,0.42)"
                maxLength={90}
                accessibilityLabel="Verdict"
                style={styles.verdictInput}
              />
            </View>
          ) : null}
        </View>

        <View style={styles.footer}>
          <Text style={styles.hint}>KEEP GOING  ·  OR CLOSE THE BOOK</Text>
          <PrimaryButton label="READ AGAIN" onPress={handlePrimary} Icon={BookOpen} />
          <View style={styles.secondaryRow}>
            <SecondaryButton label="DESK" onPress={onMenu} height={48} tone="onDark" />
          </View>
        </View>
      </AppShell>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg.dark,
  },
  giltFrame: {
    position: 'absolute',
    left: 16,
    right: 16,
    top: 16,
    bottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(184,134,47,0.30)',
    borderRadius: 6,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  hero: {
    width: COMPACT ? 80 : 96,
    height: COMPACT ? 80 : 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headline: {
    marginTop: 16,
    fontFamily: theme.font.serif,
    fontSize: COMPACT ? 26 : 30,
    fontWeight: '700',
    letterSpacing: 1,
    textAlign: 'center',
    color: theme.colors.text.onDark,
  },
  bookLine: {
    fontFamily: theme.font.serif,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    color: theme.colors.text.onDarkMuted,
  },
  stats: {
    marginTop: 24,
    alignSelf: 'stretch',
  },
  verdictBlock: {
    marginTop: 20,
    alignSelf: 'stretch',
  },
  verdictLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.accent.gilt,
    marginBottom: 7,
  },
  verdictInput: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(184,134,47,0.35)',
    backgroundColor: 'rgba(250,245,233,0.07)',
    paddingHorizontal: 14,
    fontFamily: theme.font.serif,
    fontSize: 14,
    color: theme.colors.text.onDark,
  },
  footer: {
    paddingHorizontal: 28,
    paddingBottom: 28,
    paddingTop: 10,
  },
  hint: {
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2,
    color: theme.colors.text.onDarkMuted,
  },
  secondaryRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
});

export default GameOverScreen;
