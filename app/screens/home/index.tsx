import { fetchMarketData } from "@/apis/coingecko.api";
import { formatToMoney } from "@/utils/string-formatter";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Coin } from "../../../types/coin.type";

const HomeScreen = () => {
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    const loadData = async () => {
      try {
        const coins = await fetchMarketData();
        setCoins(coins);
      } catch {
        setError("Error fetching coins! Try in a few minutes");
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

  if (error) {
    return (
      <View style={styles.loader}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      {coins.map((c, index) => (
        <TouchableOpacity
          key={index}
          style={styles.rowContainer}
          onPress={() =>
            router.push({
              pathname: "/screens/coin-detail",
              params: { coinId: c.id },
            })
          }
        >
          <Image source={{ uri: c.image }} style={styles.icon} />
          <View style={styles.info}>
            <Text style={styles.name}>
              {c.name} ({c.symbol.toUpperCase()})
            </Text>
            <Text style={styles.price}>
              $
              {formatToMoney(c.current_price, {
                minDecimals: 2,
                maxDecimals: 2,
              })}
            </Text>
          </View>
          <Text
            style={[
              styles.change,
              {
                color: c.price_change_percentage_24h >= 0 ? "green" : "red",
              },
            ]}
          >
            {formatToMoney(c.price_change_percentage_24h, {
              minDecimals: 2,
              maxDecimals: 2,
            })}
            %
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

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
