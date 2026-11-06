import React, { useCallback, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Check, Feather } from 'lucide-react-native';
import AppShell from '../components/AppShell';
import ScreenHeader from '../components/ScreenHeader';
import MarginRule from '../components/MarginRule';
import PageNumberField from '../components/PageNumberField';
import PrimaryButton from '../components/PrimaryButton';
import TagChip from '../components/TagChip';
import UnderlineStroke from '../components/UnderlineStroke';
import theme from '../constants/theme';
import { COMPACT, MAX_NOTE_LEN, UNDERLINE_MS } from '../constants/config';
import { Book, Tag, TAGS } from '../game/types';

type Props = {
  book: Book;
  onBack: () => void;
  onSave: (page: number, tag: Tag, text: string) => void;
};

function NewMarginNoteScreen({ book, onBack, onSave }: Props) {
  const [page, setPage] = useState<number>(book.currentPage);
  const [tag, setTag] = useState<Tag>('idea');
  const [text, setText] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);

  const canSave = text.trim().length > 1 && !saving;

  const handleTag = useCallback((next: Tag | 'all') => {
    if (next !== 'all') {
      setTag(next);
    }
  }, []);

  const handleSave = useCallback(() => {
    if (!canSave) {
      return;
    }
    setSaving(true);
    const payload = text;
    setTimeout(() => {
      onSave(page, tag, payload);
    }, UNDERLINE_MS);
  }, [canSave, onSave, page, tag, text]);

  const bookLine = useMemo(
    () => book.title + '  ·  ' + book.author,
    [book.title, book.author],
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <AppShell variant="compose">
        <MarginRule top={150} bottom={0} left={26} />

        <ScreenHeader title="NEW MARGIN NOTE" onBack={onBack} />
        <View style={styles.strokeWrap}>
          <UnderlineStroke active={saving} width={180} />
        </View>

        <KeyboardAvoidingView
          style={styles.body}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <Text numberOfLines={1} style={styles.bookLine}>
            {bookLine}
          </Text>

          <View style={styles.pageRow}>
            <PageNumberField
              label="PAGE"
              value={page}
              onChange={setPage}
              max={book.totalPages}
            />
            <View style={styles.nib}>
              <Feather
                size={40}
                color={theme.colors.accent.gilt}
                strokeWidth={1.3}
              />
            </View>
          </View>

          <Text style={styles.sectionLabel}>HOW DOES IT READ</Text>
          <View style={styles.tagRow}>
            {TAGS.map((t, i) => (
              <TagChip
                key={t}
                tag={t}
                index={i}
                selected={t === tag}
                onPress={handleTag}
              />
            ))}
          </View>

          <View style={styles.field}>
            <View style={[styles.fieldRule, { backgroundColor: 'rgba(107,45,62,0.35)' }]} />
            <TextInput
              value={text}
              onChangeText={setText}
              multiline
              maxLength={MAX_NOTE_LEN}
              textAlignVertical="top"
              placeholder="What did you think here?"
              placeholderTextColor={theme.colors.text.placeholder}
              accessibilityLabel="Note text"
              style={styles.input}
            />
          </View>

          <Text style={styles.counter}>
            {text.trim().length + ' / ' + MAX_NOTE_LEN}
          </Text>
        </KeyboardAvoidingView>

        <View style={styles.footer}>
          <Text style={styles.hint}>ONE THOUGHT  ·  ONE PAGE  ·  ONE TAG</Text>
          <PrimaryButton
            label="SAVE NOTE"
            onPress={handleSave}
            Icon={Check}
            disabled={!canSave}
          />
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
  strokeWrap: {
    height: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  bookLine: {
    fontFamily: theme.font.serif,
    fontSize: 13,
    fontStyle: 'italic',
    color: theme.colors.text.muted,
  },
  pageRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  nib: {
    width: 56,
    height: 56,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.92,
  },
  sectionLabel: {
    marginTop: 16,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.accent.gilt,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
  },
  field: {
    marginTop: 6,
    flex: 1,
    minHeight: COMPACT ? 110 : 150,
    backgroundColor: theme.colors.surface.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    paddingLeft: 20,
    paddingRight: 12,
    paddingVertical: 10,
  },
  fieldRule: {
    position: 'absolute',
    left: 9,
    top: 12,
    bottom: 12,
    width: 2,
    borderRadius: 1,
  },
  input: {
    flex: 1,
    fontFamily: theme.font.serif,
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.text.primary,
    padding: 0,
  },
  counter: {
    marginTop: 6,
    textAlign: 'right',
    fontSize: 10,
    letterSpacing: 1,
    color: theme.colors.text.muted,
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

export default NewMarginNoteScreen;
