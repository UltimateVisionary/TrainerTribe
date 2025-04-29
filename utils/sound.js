import { Audio } from 'expo-av';

export async function playChatbotSound() {
  try {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/CBButtonSound.mp3'),
      { shouldPlay: true }
    );
    // Optionally unload the sound after playing
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch (error) {
    console.error('Error playing chatbot sound:', error);
  }
}
