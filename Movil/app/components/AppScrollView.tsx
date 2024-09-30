import type { PropsWithChildren } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedRef,
} from 'react-native-reanimated';
import { Appbar } from 'react-native-paper';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';


type Props = PropsWithChildren<{
  title: string;
}>;

export default function AppScrollView({
  children, title
}: Props) {
  const router = useRouter();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  return (
    <ThemedView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => { router.back() }} />
        <Appbar.Content title={title || 'App'} />
        {/* <Appbar.Action icon="calendar" onPress={() => { }} /> */}
        {/* <Appbar.Action icon="magnify" onPress={() => { }} /> */}
      </Appbar.Header>

      <ThemedView style={styles.content}>{children}</ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 250,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: 16,
    gap: 16,
    overflow: 'hidden',
  },
});
