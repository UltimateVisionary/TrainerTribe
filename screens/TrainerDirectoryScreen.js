import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '../LanguageContext';
import { useTheme } from '../ThemeContext';
import { useNavigation } from '@react-navigation/native';

const MOCK_TRAINERS = [
  {
    id: '1',
    name: 'Ava Strong',
    title: 'Certified HIIT & Strength Coach',
    avatar: require('../assets/trainer1.jpg'),
    mutual: 'Emily and 14 other mutuals',
  },
  {
    id: '2',
    name: 'Marcus Flex',
    title: 'Bodybuilding Specialist • 200+ Programs Sold',
    avatar: require('../assets/trainer2.jpg'),
    mutual: 'Jake and 9 other mutuals',
  },
  {
    id: '3',
    name: 'Sophia Zen',
    title: 'Yoga & Mobility Creator • 150+ Subscribers',
    avatar: require('../assets/trainer1.jpg'),
    mutual: 'Maya and 11 other mutuals',
  },
  {
    id: '4',
    name: 'Tyler Blaze',
    title: 'Functional Fitness Coach • 120 Sales',
    avatar: require('../assets/trainer2.jpg'),
    mutual: 'Chris and 7 other mutuals',
  },
  {
    id: '5',
    name: 'Lila Peak',
    title: 'Mountain Athlete & Endurance Trainer',
    avatar: require('../assets/trainer1.jpg'),
    mutual: 'Sam and 10 other mutuals',
  },
  {
    id: '6',
    name: 'Derek Power',
    title: 'Online Fitness Content Creator',
    avatar: require('../assets/trainer2.jpg'),
    mutual: 'Alex and 5 other mutuals',
  },
  {
    id: '7',
    name: 'Megan Pulse',
    title: 'Cardio Bootcamp Instructor • 80+ Programs',
    avatar: require('../assets/trainer1.jpg'),
    mutual: 'Tina and 12 other mutuals',
  },
  {
    id: '8',
    name: 'Noah Forge',
    title: 'Strength & Conditioning Coach',
    avatar: require('../assets/trainer2.jpg'),
    mutual: 'Jordan and 8 other mutuals',
  },
  {
    id: '9',
    name: 'Chloe Sprint',
    title: 'Track & Speed Training Specialist',
    avatar: require('../assets/trainer1.jpg'),
    mutual: 'Liam and 6 other mutuals',
  },
  {
    id: '10',
    name: 'Grant Boulder',
    title: 'Climbing & Grip Strength Coach',
    avatar: require('../assets/trainer2.jpg'),
    mutual: 'Olivia and 4 other mutuals',
  },
  {
    id: '11',
    name: 'Jenna Flow',
    title: 'Pilates & Barre Instructor',
    avatar: require('../assets/trainer1.jpg'),
    mutual: 'Ava and 7 other mutuals',
  },
  {
    id: '12',
    name: 'Victor Power',
    title: 'Olympic Weightlifting Coach',
    avatar: require('../assets/trainer2.jpg'),
    mutual: 'Sophia and 8 other mutuals',
  },
  {
    id: '13',
    name: 'Natalie Zen',
    title: 'Meditation & Recovery Specialist',
    avatar: require('../assets/trainer1.jpg'),
    mutual: 'Lucas and 3 other mutuals',
  },
  {
    id: '14',
    name: 'Ethan Swift',
    title: 'HIIT & Agility Coach',
    avatar: require('../assets/trainer2.jpg'),
    mutual: 'Megan and 5 other mutuals',
  },
  {
    id: '15',
    name: 'Brielle Peak',
    title: 'Ultra Runner & Trail Coach',
    avatar: require('../assets/trainer1.jpg'),
    mutual: 'Ella and 6 other mutuals',
  },
  {
    id: '16',
    name: 'Damon Forge',
    title: 'Powerlifting & Strength Creator',
    avatar: require('../assets/trainer2.jpg'),
    mutual: 'Ryan and 9 other mutuals',
  },
];

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 64) / 2;

const TrainerCard = ({ trainer, onRemove, index, themedStyles, theme }) => {
  // Dynamically adjust font size for long names
  let nameFontSize = 16;
  if (trainer.name.length > 18) nameFontSize = 14;
  if (trainer.name.length > 28) nameFontSize = 12;
  const isLeft = index % 2 === 0;

  return (
    <View style={[themedStyles.card, { marginTop: isLeft ? 22 : 0, minHeight: 230, maxHeight: 230, height: 230, flexDirection: 'column' }]}>  
      <View style={themedStyles.cardHeader}>
        <Image source={trainer.avatar} style={themedStyles.avatar} />
        <TouchableOpacity style={themedStyles.closeButton} onPress={() => onRemove(trainer.id)}>
          <Ionicons name="close" size={22} color={theme.text} />
        </TouchableOpacity>
      </View>
      <Text style={[themedStyles.name, { fontSize: nameFontSize }]} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.8}>{trainer.name}</Text>
      <Text style={themedStyles.title} numberOfLines={2}>{trainer.title}</Text>
      <View style={themedStyles.mutualRow}>
        <Ionicons name="person" size={18} color={theme.textSecondary} />
        <Text style={themedStyles.mutualText} numberOfLines={1}>{trainer.mutual}</Text>
      </View>
      <View style={{ flex: 1 }} />
      <TouchableOpacity style={themedStyles.connectButton}>
        <LinearGradient
          colors={theme.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={themedStyles.connectContent}>
          <Ionicons name="person" size={18} color="#fff" />
          <Text style={themedStyles.connectText}>View Profile</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default function TrainerDirectoryScreen() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [trainers, setTrainers] = useState(MOCK_TRAINERS);
  const [isPressed, setIsPressed] = useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      gestureEnabled: true,
    });
  }, [navigation]);

  const handleRemove = (id) => {
    setTrainers(trainers.filter(tr => tr.id !== id));
  };

  const themedStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      marginTop: 20,
      marginBottom: 18,
      marginLeft: 18,
    },
    headerTitle: {
      color: theme.primary,
      fontWeight: 'bold',
      fontSize: 28,
      marginBottom: 2,
    },
    headerTagline: {
      color: theme.textSecondary,
      fontSize: 15,
      marginLeft: 2,
      marginBottom: 2,
    },
    list: {
      paddingBottom: 32,
      paddingTop: 28,
      paddingHorizontal: 24,
    },
    card: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 12,
      marginBottom: 24,
      width: CARD_WIDTH,
      height: 230,
      flexDirection: 'column',
      alignSelf: 'center',
      marginHorizontal: 8,
      shadowColor: theme.grey,
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    avatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      borderWidth: 2,
      borderColor: theme.card,
      marginRight: 8,
      marginTop: -28,
      backgroundColor: theme.greyDark,
    },
    closeButton: {
      position: 'absolute',
      top: 2,
      right: 2,
      backgroundColor: theme.card,
      borderRadius: 14,
      padding: 2,
      zIndex: 2,
      elevation: 3,
    },
    name: {
      fontWeight: 'bold',
      fontSize: 16,
      marginBottom: 2,
      color: theme.text,
    },
    title: {
      fontSize: 13,
      color: theme.textSecondary,
      marginBottom: 6,
    },
    mutualRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    mutualText: {
      marginLeft: 6,
      color: theme.textSecondary,
      fontSize: 12,
      flex: 1,
    },
    connectButton: {
      marginTop: 6,
      borderWidth: 1,
      borderColor: theme.primary,
      borderRadius: 22,
      overflow: 'hidden',
      height: 36,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
    },
    connectContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: 36,
      zIndex: 2,
    },
    connectText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 15,
      marginLeft: 8,
    },
  });

  return (
    <SafeAreaView style={themedStyles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, marginHorizontal: 18 }}>
        <View>
          <Text style={themedStyles.headerTitle}>TrainerTribe</Text>
          <Text style={themedStyles.headerTagline}>Find the perfect trainer,</Text>
          <Text style={themedStyles.headerTagline}>or training partner.</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ padding: 8, marginTop: -10 }}
          activeOpacity={0.7}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
        >
          <Ionicons
            name="close"
            size={32}
            color={isPressed ? theme.primary : theme.text}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={trainers}
        renderItem={({ item, index }) => <TrainerCard trainer={item} onRemove={handleRemove} index={index} themedStyles={themedStyles} theme={theme} />}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={[themedStyles.list, { paddingTop: 28 }]}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
