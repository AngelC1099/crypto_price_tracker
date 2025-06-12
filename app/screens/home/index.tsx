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
    <ScrollView style={styles.container}>
      <View style={{ gap: 8 }}>
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
            <View style={styles.infoContainer}>
              <Text style={styles.name}>{c.name}</Text>
              <Text style={styles.symbol}>({c.symbol.toUpperCase()})</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>
                $
                {formatToMoney(c.current_price, {
                  minDecimals: 2,
                  maxDecimals: 2,
                })}
              </Text>
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
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { flex: 1, backgroundColor: "#eff1f1", padding: 8 },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
  },
  icon: { width: 48, height: 48 },
  infoContainer: { flex: 1 },
  priceContainer: { flex: 1, alignItems: "flex-end" },
  name: { fontWeight: "bold", fontSize: 18 },
  symbol: { fontWeight: "500" },
  price: { fontWeight: "bold", fontSize: 18 },
  change: { fontWeight: "600" },
});

export default HomeScreen;
