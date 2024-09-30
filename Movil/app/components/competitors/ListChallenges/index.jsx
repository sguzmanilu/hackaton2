import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ProgressBar, Text, List, Divider, useTheme } from 'react-native-paper';

export default function ListChallenges({ items = [] }) {

  const theme = useTheme();

  return (
    <View style={styles.container}>
      {items.map((section) => (
        <View key={section.name}>
          {/* Título de la Sección */}
          <List.Section>
            <Text style={styles.sectionTitle}>{section.name}</Text>
            <Divider style={styles.divider} />
            {/* Items dentro de la Sección */}
            {section.data.map((item) => (
              <View key={item.id} style={styles.progressItem}>
                <Text>{item.name}</Text>
                <ProgressBar
                  progress={item.score / 100}
                  style={styles.progressBar}
                  // color={theme.colors.tertiary}
                  color={item.completed ? theme.colors.primary : theme.colors.tertiary}
                />
              </View>
            ))}
          </List.Section>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  divider: {
    marginBottom: 10,
  },
  progressItem: {
    marginBottom: 15,
  },
  progressBar: {
    height: 20,
    borderRadius: 5,
    marginTop: 5,
  },
})
