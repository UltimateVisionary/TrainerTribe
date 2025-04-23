import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { useTheme } from './ThemeContext';
import { LanguageProvider, useLanguage } from './LanguageContext';
import { ThemeProvider } from './ThemeContext';
import { AuthProvider, useAuth, LoadingScreen } from './AuthContext';

// Import screens
import HomeScreen from './screens/HomeScreen';
import ExploreScreen from './screens/ExploreScreen';
import CreatePostScreen from './screens/CreatePostScreen';
import MessagesScreen from './screens/MessagesScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import ChatConversationScreen from './screens/ChatConversationScreen';
import SearchUsersScreen from './screens/SearchUsersScreen';
import TrainerDirectoryScreen from './screens/TrainerDirectoryScreen';
import CommunityScreen from './screens/CommunityScreen';
import PricingScreen from './screens/PricingScreen';
import SubscriptionScreen from './screens/SubscriptionScreen';
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen';
import TermsOfServiceScreen from './screens/TermsOfServiceScreen';
import HelpCenterScreen from './screens/HelpCenterScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();

function MessagesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MessagesMain" component={MessagesScreen} />
      <Stack.Screen name="Community" component={CommunityScreen} />
    </Stack.Navigator>
  );
}

function TabNavigator() {
  const { t, key: languageKey } = useLanguage();
  const { theme } = useTheme();
  return (
    <Tab.Navigator
      key={languageKey} // force remount on language change
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Fitness') {
            iconName = focused ? 'barbell' : 'barbell-outline';
          } else if (route.name === 'Create') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Messages') {
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.grey,
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: theme.background,
          position: 'absolute',
          borderTopWidth: 1,
          borderTopColor: theme.border,
          elevation: 0,
          marginBottom: 20,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: t('home') }} />
      <Tab.Screen name="Fitness" component={ExploreScreen} options={{ tabBarLabel: t('fitness') }} />
      <Tab.Screen name="Create" component={CreatePostScreen} options={{ tabBarLabel: t('create') }} />
      <Tab.Screen name="Messages" component={MessagesStack} options={{ tabBarLabel: t('messages') }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: t('profile') }} />
    </Tab.Navigator>
  );
}

function AuthStackNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <AuthStack.Screen name="TermsOfServiceScreen" component={TermsOfServiceScreen} />
      <AuthStack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} />
    </AuthStack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: 'modal',
      }}
    >
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Pricing" component={PricingScreen} />
      <Stack.Screen name="Language" component={require('./screens/LanguageScreen').default} />
      <Stack.Screen 
        name="ChatConversation" 
        component={ChatConversationScreen}
        options={{
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen name="SearchUsers" component={SearchUsersScreen} />
      <Stack.Screen name="TrainerDirectory" component={TrainerDirectoryScreen} />
      <Stack.Screen name="SubscriptionScreen" component={SubscriptionScreen} />
      <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} />
      <Stack.Screen name="TermsOfServiceScreen" component={TermsOfServiceScreen} />
      <Stack.Screen name="HelpCenterScreen" component={HelpCenterScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  return user ? <AppStack /> : <AuthStackNavigator />;
}

function AppContent() {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <RootNavigator />
    </View>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <SafeAreaProvider>
            <NavigationContainer>
              <StatusBar style="auto" />
              <AppContent />
            </NavigationContainer>
          </SafeAreaProvider>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
