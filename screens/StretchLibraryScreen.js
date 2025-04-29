import { useState } from "react";
import { SafeAreaView, SectionList, Text, StyleSheet, TouchableOpacity, View, TextInput, FlatList } from "react-native";
import { useTheme } from "../ThemeContext";
import Modal from "react-native-modal";

import { STRETCH_SECTIONS, STRETCH_DESCRIPTIONS, defaultDescriptionFor, CATEGORY_LIST } from './StretchLibraryScreenData';

export default function StretchLibraryScreen() {
  const { theme } = useTheme();
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStretch, setSelectedStretch] = useState(null); // { name, sectionTitle }

  const filteredSections = STRETCH_SECTIONS.map(section => {
    let data = section.data.filter(item =>
      item.toLowerCase().includes(searchText.toLowerCase())
    );
    if (selectedCategory !== "All" && section.title !== selectedCategory) {
      data = [];
    }
    return { ...section, data };
  }).filter(section => section.data.length > 0);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}> 
      <TextInput
        style={[styles.searchInput, { backgroundColor: theme.card, color: theme.text }]}
        placeholder="Search stretches..."
        placeholderTextColor={theme.textSecondary}
        value={searchText}
        onChangeText={setSearchText}
      />
      <FlatList
        data={CATEGORY_LIST}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.key}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryButton,
              { backgroundColor: selectedCategory === item.key ? theme.primary : theme.card },
            ]}
            onPress={() => setSelectedCategory(item.key)}
          >
            <Text
              style={{ color: selectedCategory === item.key ? theme.white : theme.text }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
        style={styles.categoryList}
        contentContainerStyle={{ alignItems: "center", paddingVertical: 0 }}
      />
      <SectionList
        style={styles.sectionList}
        contentContainerStyle={{ paddingTop: 0, marginTop: 0, paddingBottom: 24 }}
        sections={filteredSections}
        keyExtractor={(item, index) => item + index}
        stickySectionHeadersEnabled
        renderSectionHeader={({ section: { title } }) => (
          <View style={[styles.sectionHeader, { backgroundColor: theme.primary }]} >  
            <Text style={[styles.header, { color: theme.white }]}>{title}</Text>
          </View>
        )}
        renderItem={({ item, section }) => (
          <TouchableOpacity
            style={[styles.itemContainer, { backgroundColor: theme.card }]}
            onPress={() => setSelectedStretch({ name: item, sectionTitle: section.title })}
          >  
            <Text style={[styles.itemText, { color: theme.text }]}>{item}</Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      <Modal
        isVisible={!!selectedStretch}
        onBackdropPress={() => setSelectedStretch(null)}
      >
        <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>  
          <Text style={[styles.modalTitle, { color: theme.text }]}>{selectedStretch?.name}</Text>
          <Text style={styles.instructionsHeader}>How to do this stretch:</Text>
          {selectedStretch &&
            (STRETCH_DESCRIPTIONS[selectedStretch.name] || defaultDescriptionFor(selectedStretch.sectionTitle))
              .split("\n")
              .filter(line => line.trim() !== "" && !line.toLowerCase().startsWith("step-by-step"))
              .map((line, idx) => (
                <View key={idx} style={styles.instructionStepRow}>
                  <Text style={styles.instructionStepNumber}>{idx + 1}.</Text>
                  <Text style={styles.instructionStepText}>{line.replace(/^\d+\.\s*/, "")}</Text>
                </View>
              ))
          }
          <TouchableOpacity style={styles.modalCloseButton} onPress={() => setSelectedStretch(null)}>
            <Text style={[styles.modalCloseText, { color: theme.primary }]}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    margin: 12,
    marginBottom: 4,
  },
  categoryList: {
    minHeight: 44,
    maxHeight: 44,
    paddingHorizontal: 8,
    marginBottom: 0,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 0,
    marginTop: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionList: {
    flex: 1,
    marginTop: 0,
  },
  sectionHeader: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 12,
    marginHorizontal: 8,
  },
  header: {
    fontSize: 18,
    fontWeight: "700",
  },
  itemContainer: {
    padding: 12,
    borderRadius: 6,
    marginHorizontal: 8,
    marginTop: 6,
    marginBottom: 6,
  },
  itemText: {
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 8,
  },
  modalContainer: {
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  modalCloseButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: "600",
  },
  instructionsHeader: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 10,
    color: "#333",
    alignSelf: "flex-start",
  },
  instructionStepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
    alignSelf: "flex-start",
  },
  instructionStepNumber: {
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 6,
    color: "#4a90e2",
    marginTop: 1,
  },
  instructionStepText: {
    fontSize: 16,
    color: "#222",
    flex: 1,
    flexWrap: "wrap",
  },
});

