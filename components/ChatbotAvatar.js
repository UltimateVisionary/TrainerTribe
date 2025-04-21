import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Hologram-style robot avatar, facing left (towards chat)
export default function ChatbotAvatar({ size = 32 }) {
  return (
    <View style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: 'rgba(96,165,250,0.12)', // blue hologram glow
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 8,
      shadowColor: '#60A5FA',
      shadowOpacity: 0.35,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 2 },
      elevation: 5,
      borderWidth: 2,
      borderColor: 'rgba(96,165,250,0.22)',
      transform: [{ scaleX: -1 }], // flip horizontally to face left
    }}>
      <MaterialCommunityIcons name="robot-happy-outline" size={size * 0.7} color="#60A5FA" style={{ opacity: 0.82 }} />
    </View>
  );
}
