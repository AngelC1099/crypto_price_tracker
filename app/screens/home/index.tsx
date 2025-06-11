import { useEffect, useState } from "react";
import { ActivityIndicator, View, StyleSheet, Text, Image, ScrollView } from "react-native";
import { Coin } from "../../types/coin.type";
import { fetchMarketData } from "@/app/apis/coingecko.api";

const HomeScreen = () => {
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState<Coin[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const coins = await fetchMarketData();
        setCoins(coins);
      } catch (error) {
        console.error("Error fetching coins:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView>
      {coins.map((c, index) => (
        <View key={index} style={styles.rowContainer}>
          <Image source={{ uri: c.image }} style={styles.icon} />
          <View style={styles.info}>
            <Text style={styles.name}>
              {c.name} ({c.symbol.toUpperCase()})
            </Text>
            <Text style={styles.price}>${c.current_price.toFixed(2)}</Text>
          </View>
          <Text
            style={[
              styles.change,
              {
                color: c.price_change_percentage_24h >= 0 ? "green" : "red",
              },
            ]}
          >
            {c.price_change_percentage_24h.toFixed(2)}%
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 16,
    borderBottomWidth: 0.3,
    borderColor: "#ccc",
  },
  icon: { width: 32, height: 32 },
  info: { flex: 1 },
  name: { fontWeight: "bold" },
  price: { fontSize: 14, color: "#555" },
  change: { fontWeight: "600" },
});

export default HomeScreen;