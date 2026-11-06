import React, { useCallback, useMemo } from 'react';
import {
  Animated,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BookOpen, Feather, Library } from 'lucide-react-native';
import AppShell from '../components/AppShell';
import ScreenHeader from '../components/ScreenHeader';
import MarginRule from '../components/MarginRule';
import SectionRule from '../components/SectionRule';
import ResurfacedCard from '../components/ResurfacedCard';
import BookSpine from '../components/BookSpine';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import theme from '../constants/theme';
import { BOOK_SPINE_H, BOOK_SPINE_W, COMPACT } from '../constants/config';
import { Book, Note } from '../game/types';
import { useStagger } from '../hooks/useStagger';

type Props = {
  books: Book[];
  resurfaced: Note | null;
  resurfacedBookLabel: string;
  onStart: () => void;
  onOpenBook: (id: string) => void;
  onTags: () => void;
  onShelf: () => void;
};

function MenuScreen({
  books,
  resurfaced,
  resurfacedBookLabel,
  onStart,
  onOpenBook,
  onTags,
  onShelf,
}: Props) {
  const heroEntry = useStagger(0, 14, 380);
  const ctaEntry = useStagger(8, 16, 360);

  const renderSpine = useCallback(
    ({ item, index }: { item: Book; index: number }) => (
      <BookSpine book={item} index={index} onPress={onOpenBook} />
    ),
    [onOpenBook],
  );

  const keyExtractor = useCallback((item: Book) => item.id, []);

  const getItemLayout = useCallback(
    (_data: ArrayLike<Book> | null | undefined, index: number) => ({
      length: BOOK_SPINE_W + 12,
      offset: (BOOK_SPINE_W + 12) * index,
      index,
    }),
    [],
  );

  const badge = useMemo(
    () => (
      <View style={styles.badge}>
        <BookOpen size={16} color={theme.colors.accent.burgundy} strokeWidth={2} />
        <Text style={styles.badgeText}>{books.length + ' OPEN'}</Text>
      </View>
    ),
    [books.length],
  );

  const deskMark = useMemo(
    () => (
      <View style={styles.deskMark}>
        <Library
          size={24}
          color={theme.colors.accent.burgundy}
          strokeWidth={1.8}
        />
      </View>
    ),
    [],
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <AppShell variant="paper">
        <MarginRule top={150} bottom={120} left={28} />

        <ScreenHeader title="READING DESK" leftSlot={deskMark} rightSlot={badge} />

        <View style={styles.body}>
          <Animated.View pointerEvents="box-none" style={[styles.hero, heroEntry]}>
            <View pointerEvents="none" style={styles.heroSprite}>
              <Feather
                size={COMPACT ? 58 : 70}
                color={theme.colors.accent.gilt}
                strokeWidth={1.1}
              />
            </View>
            <Text style={styles.heroLine}>PAGE MARGIN</Text>
            <Text style={[styles.heroLine, styles.heroAccent]}>NOTEBOOK</Text>
            <SectionRule width={64} height={2} marginTop={12} marginBottom={10} />
            <Text numberOfLines={COMPACT ? 1 : 2} style={styles.tagline}>
              A private commonplace book for readers. Everything stays on this phone.
            </Text>
          </Animated.View>

          <View style={styles.resurfacedWrap}>
            <ResurfacedCard note={resurfaced} bookLabel={resurfacedBookLabel} />
          </View>

          <View style={styles.stripBlock}>
            <Text style={styles.stripLabel}>CURRENTLY OPEN</Text>
            <FlatList
              data={books}
              horizontal
              renderItem={renderSpine}
              keyExtractor={keyExtractor}
              getItemLayout={getItemLayout}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.stripContent}
              style={styles.strip}
            />
          </View>
        </View>

        <Animated.View pointerEvents="box-none" style={[styles.footer, ctaEntry]}>
          <Text style={styles.hint}>PICK A BOOK  ·  ADD MARGIN NOTES</Text>
          <PrimaryButton label="START READING" onPress={onStart} Icon={BookOpen} />
          <View style={styles.secondaryRow}>
            <SecondaryButton label="TAGS" onPress={onTags} height={46} />
            <SecondaryButton label="SHELF" onPress={onShelf} height={46} tone="gilt" />
            <SecondaryButton label="SEARCH" onPress={onTags} height={46} />
          </View>
        </Animated.View>
      </AppShell>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg.primary,
  },
  body: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: COMPACT ? 6 : 18,
  },
  hero: {
    paddingLeft: 24,
    paddingRight: 24,
  },
  heroSprite: {
    position: 'absolute',
    right: 10,
    top: 8,
    width: COMPACT ? 72 : 88,
    height: COMPACT ? 72 : 88,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.95,
  },
  heroLine: {
    fontFamily: theme.font.serif,
    fontSize: COMPACT ? 32 : 40,
    lineHeight: COMPACT ? 36 : 44,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: theme.colors.text.primary,
  },
  heroAccent: {
    color: theme.colors.accent.burgundy,
  },
  tagline: {
    fontFamily: theme.font.serif,
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.text.secondary,
    maxWidth: 270,
  },
  resurfacedWrap: {
    marginLeft: 48,
    marginRight: 16,
    marginTop: COMPACT ? 6 : 16,
  },
  stripBlock: {
    marginTop: COMPACT ? 6 : 16,
  },
  stripLabel: {
    paddingHorizontal: 24,
    marginBottom: 8,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2.4,
    color: theme.colors.text.muted,
  },
  strip: {
    height: BOOK_SPINE_H + 8,
  },
  stripContent: {
    paddingHorizontal: 24,
    gap: 12,
    alignItems: 'center',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 26,
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
  secondaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  badge: {
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(107,45,62,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(107,45,62,0.18)',
  },
  badgeText: {
    fontFamily: theme.font.serif,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: theme.colors.accent.burgundy,
  },
  deskMark: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MenuScreen;
