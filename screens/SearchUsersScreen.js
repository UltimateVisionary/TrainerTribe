import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

const DefaultAvatar = ({ name }) => {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <View style={styles.avatarContainer}>
      <Text style={styles.avatarText}>{initials}</Text>
    </View>
  );
};

// Dummy data - replace with actual API call
const DUMMY_USERS = [
  {
    id: '1',
    name: 'Sarah Johnson',
    type: 'Certified Trainer',
    status: 'online',
  },
  {
    id: '2',
    name: 'Mike Peterson',
    type: 'Fitness Enthusiast',
    status: 'offline',
  },
  {
    id: '3',
    name: 'Emma Wilson',
    type: 'Yoga Instructor',
    status: 'online',
  },
];

const SearchUsersScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState(DUMMY_USERS);

  const handleSearch = (text) => {
    setSearchQuery(text);
    // Filter users based on search query
    const filtered = DUMMY_USERS.filter(user => 
      user.name.toLowerCase().includes(text.toLowerCase()) ||
      user.type.toLowerCase().includes(text.toLowerCase())
    );
    setUsers(filtered);
  };

  const startChat = (user) => {
    navigation.navigate('ChatConversation', { otherUser: user });
  };

  const renderUserItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.userItem}
      onPress={() => startChat(item)}
    >
      <DefaultAvatar name={item.name} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userType}>{item.type}</Text>
      </View>
      <View style={styles.statusContainer}>
        <View style={[
          styles.statusDot,
          { backgroundColor: item.status === 'online' ? '#4CAF50' : COLORS.text.secondary }
        ]} />
        <Ionicons name="chevron-forward" size={20} color={COLORS.text.secondary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>New Chat</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.text.secondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor={COLORS.text.secondary}
          autoCapitalize="none"
        />
      </View>

      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 16,
    backgroundColor: COLORS.lightGrey,
    borderRadius: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text.primary,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  userType: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
});

export default SearchUsersScreen; 