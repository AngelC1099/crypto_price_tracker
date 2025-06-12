import { fetchCoinDetail, fetchCoinMarketChart } from "@/apis/coingecko.api";
import { ChartDataPoint } from "@/types/chart-data-point.type";
import { Coin } from "@/types/coin.type";
import { formatToMoney } from "@/utils/string-formatter";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  LayoutChangeEvent,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";

const CoinDetailScreen = () => {
  const { coinId } = useLocalSearchParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [coin, setCoin] = useState<Coin | undefined>(undefined);
  const [coinChartData, setCoinChartData] = useState<ChartDataPoint[]>([]);
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  useEffect(() => {
    const getCoinData = async () => {
      try {
        const coin = await fetchCoinDetail(coinId as string);
        setCoin(coin);
        const coinChartData = await fetchCoinMarketChart(coinId as string);
        setCoinChartData(coinChartData);
      } catch {
        setError("Error fetching coins! Try in a few minutes.");
      } finally {
        setLoading(false);
      }
    };
    getCoinData();
  }, [coinId]);

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setDimensions({ width, height });
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!coin) {
    return (
      <View style={styles.loader}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.coinId}>
          <Image source={{ uri: coin.image }} style={styles.icon} />
          <Text style={styles.coinName}>{coin.name}</Text>
        </View>
        <View>
          <Text style={styles.coinSymbol}>{coin.symbol.toUpperCase()}</Text>
        </View>
      </View>
      <View style={styles.bodyContainer}>
        <View>
          <Text style={styles.price}>
            $
            {formatToMoney(coin.current_price, {
              minDecimals: 2,
              maxDecimals: 2,
            })}
          </Text>
          <Text
            style={[
              styles.change,
              {
                color: coin.price_change_percentage_24h >= 0 ? "green" : "red",
              },
            ]}
          >
            {formatToMoney(coin.price_change_percentage_24h, {
              minDecimals: 2,
              maxDecimals: 2,
            })}
            % in last 24h
          </Text>
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.statsRow}>
            <View style={styles.statContainer}>
              <Text style={styles.statLabel}>Market Cap</Text>
              <Text style={styles.statValue}>
                $
                {formatToMoney(coin.market_cap, {
                  minDecimals: 2,
                  maxDecimals: 2,
                })}
              </Text>
            </View>
            <View style={styles.statContainer}>
              <Text style={styles.statLabel}>Volume 24h: </Text>
              <Text style={styles.statValue}>
                $
                {formatToMoney(coin.total_volume, {
                  minDecimals: 2,
                  maxDecimals: 2,
                })}
              </Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statContainer}>
              <Text style={styles.statLabel}>High 24h</Text>
              <Text style={styles.statValue}>
                $
                {formatToMoney(coin.high_24h, {
                  minDecimals: 2,
                  maxDecimals: 2,
                })}
              </Text>
            </View>
            <View style={styles.statContainer}>
              <Text style={styles.statLabel}>Low 24h</Text>
              <Text style={styles.statValue}>
                $
                {formatToMoney(coin.low_24h, {
                  minDecimals: 2,
                  maxDecimals: 2,
                })}
              </Text>
            </View>
          </View>
        </View>
        <View style={[styles.infoContainer, { flex: 1 }]}>
          <View style={[styles.statContainer, { gap: 8 }]}>
            <Text style={styles.statLabel}>Chart</Text>
            <View style={{ flex: 1 }} onLayout={onLayout}>
              <LineChart
                data={{
                  labels: coinChartData.map((d, i) =>
                    i % Math.floor(coinChartData.length / 4) === 0 ? d.date : ""
                  ),
                  datasets: [{ data: coinChartData.map((d) => d.price) }],
                }}
                width={dimensions.width}
                height={dimensions.height}
                yAxisLabel="$"
                yAxisSuffix=""
                chartConfig={{
                  backgroundGradientFrom: "#ced4d4",
                  backgroundGradientTo: "#c8ceda",
                  decimalPlaces: 2,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: "#7e8baa",
                  },
                }}
                bezier
                style={{
                  borderRadius: 16,
                }}
                verticalLabelRotation={30}
                horizontalLabelRotation={-55}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: {
    padding: 24,
    flex: 1,
    gap: 24,
    paddingTop: StatusBar.currentHeight! + 24,
    backgroundColor: "#eff1f1",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  coinId: { flexDirection: "row", alignItems: "center", gap: 8 },
  icon: { width: 48, height: 48 },
  coinName: { fontSize: 32, fontWeight: "bold" },
  coinSymbol: { fontSize: 18, fontWeight: "bold" },
  price: { fontSize: 40, fontWeight: "bold", marginBottom: 8 },
  change: { fontSize: 16, marginBottom: 24 },
  bodyContainer: { flex: 1, gap: 16 },
  infoContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    gap: 16,
  },
  statsRow: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  statContainer: { flex: 1 },
  statLabel: { fontSize: 14, color: "#88968f", fontWeight: "300" },
  statValue: { fontSize: 14, fontWeight: "600" },
});

export default CoinDetailScreen;
