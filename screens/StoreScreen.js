
import React, { useRef, useEffect } from "react";
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions, Image, Animated, Easing } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useHealth } from "../components/HealthContext";
import { useTheme } from "../ThemeContext";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

let STORE_ITEMS = [
  {
    id: "badge-beginner",
    title: "Beginner Badge",
    description: "Earned for completing your first workout",
    cost: 10,
    icon: "ribbon-outline",
  },
  {
    id: "community-shoutout",
    title: "Shoutout in Community Feed",
    description: "Get recognized in the community feed!",
    cost: 30,
    icon: "megaphone",
  },
  {
    id: "mat-discount",
    title: "10% Off Yoga Mat",
    description: "Get a discount on our partner yoga mat",
    cost: 50,
    icon: "cart-outline",
  },
  {
    id: "avatar-frame",
    title: "Custom Avatar Frame",
    description: "Personalize your profile with a unique frame.",
    cost: 75,
    icon: "color-palette",
  },
  {
    id: "ebook-download",
    title: "Fitness Ebook Download",
    description: "Download our exclusive fitness ebook.",
    cost: 120,
    icon: "book",
  },
  {
    id: "premium-week",
    title: "1 Week Premium Access",
    description: "Unlock premium features for 7 days!",
    cost: 200,
    icon: "star",
  },
  {
    id: "mystery-box",
    title: "Mystery Box",
    description: "Redeem for a surprise reward!",
    cost: 250,
    icon: "gift",
  },
];
STORE_ITEMS = STORE_ITEMS.sort((a, b) => a.cost - b.cost);

function SpinningToken() {
  const spinAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    spinAnim.setValue(0);
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 5000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [spinAnim]);

  const rotateY = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View style={{
      alignItems: "center",
      justifyContent: "center",
      transform: [
        { perspective: 800 },
        { rotateY },
      ],
    }}>
      <Image source={require("../assets/TribeTokens.jpg")} style={styles.spinningToken} />
    </Animated.View>
  );
}

export default function StoreScreen() {
  const navigation = useNavigation();
  const { tokens, redeemTokens } = useHealth();
  const themeContext = useTheme();
  const theme = themeContext.theme;

  const handleRedeem = (item) => {
    if (redeemTokens(item.cost, item.id)) {
      Toast.show({ type: "success", text1: "Redeemed successfully!" });
    } else {
      Toast.show({ type: "error", text1: "Not enough Tribe Tokens." });
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}> 
      {/* Back Arrow Icon */}
      <View style={{ position: "absolute", top: 0, left: 0, zIndex: 99 }}>
        <TouchableOpacity
          style={{ padding: 16 }}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={28} color={theme.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.spinningTokenSectionSmall}>
        <SpinningToken />
        <Text style={styles.tokenBalanceTextSmall}>You have {tokens ?? 0} Tribe Tokens</Text>
      </View>
      <View style={styles.infoBox}>
        <View style={{flexDirection: "row", alignItems: "center", marginBottom: 6}}>
          <Image source={require("../assets/TribeTokens.jpg")} style={styles.tokenImageInfo} />
          <Text style={styles.infoTitle}>How Gamification Rewards Work</Text>
        </View>
        <Text style={styles.infoText}>
          Earn <Text style={{fontWeight:"bold", color: theme.primary}}>Tribe Tokens</Text> by completing workouts, daily challenges, and fitness goals. Redeem your Tribe Tokens here for exclusive badges, discounts, and other rewards! Stay active, level up, and enjoy the journey!
        </Text>
      </View>
      <FlatList
        data={STORE_ITEMS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <LinearGradient colors={[theme.primaryLight, theme.primary]} style={styles.gradientBorder}>
            <View style={[styles.itemContainer, { backgroundColor: theme.card }]}> 
              <View style={styles.itemHeader}>
                <View style={[styles.iconCircle, { backgroundColor: theme.primaryLight, borderWidth: 2, borderColor: theme.primary }]}> 
                  <Ionicons name={item.icon} size={24} color={theme.primary} />
                </View>
                <Text style={[styles.itemTitle, { color: theme.text }]}>{item.title}</Text>
              </View>
              <Text style={[styles.itemDescription, { color: theme.textSecondary }]}>{item.description}</Text>
              <View style={styles.itemFooter}>
                <Text style={[styles.itemCost, { color: theme.primary }]}>{item.cost} Tribe Tokens</Text>
                <TouchableOpacity style={[styles.redeemButton, { backgroundColor: theme.primary }]} onPress={() => handleRedeem(item)}>
                  <Text style={styles.redeemText}>Redeem</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerGradient: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    margin: 16,
    marginBottom: 8,
  },
  titleGradient: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
  },
  balanceBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  balanceBadgeText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 6,
  },
  list: {
    paddingBottom: 16,
  },
  gradientBorder: {
    width: width - 32,  // full width minus container padding
    alignSelf: "center",
    borderRadius: 12,
    padding: 2,
    marginBottom: 16,
  },
  itemContainer: {
    borderRadius: 12,
    padding: 16,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 0,
  },
  itemDescription: {
    fontSize: 14,
    marginBottom: 12,
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemCost: {
    fontSize: 16,
    fontWeight: "600",
  },
  redeemButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  redeemText: {
    color: "#fff",
    fontWeight: "600",
  },
  infoBox: {
    backgroundColor: "#f0f6ff",
    borderRadius: 10,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#4a90e2",
  },
  infoTitle: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 4,
    color: "#225",
  },
  infoText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  tokenImageHeader: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
  },
  tokenImageInfo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
  },
  spinningToken: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
  },
  spinningTokenSectionSmall: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  tokenBalanceTextSmall: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: "600",
    color: "#225",
    textAlign: "center",
  },
});
