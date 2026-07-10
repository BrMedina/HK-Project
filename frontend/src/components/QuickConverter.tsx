import React from "react";
import { StyleSheet, Text, View, TextInput, Pressable } from "react-native";
import { ArrowDownUp, Info, RefreshCw } from "lucide-react-native";
import { useTheme, lightColors, darkColors } from "../lib/ThemeContext";

type Props = {
  isSwapped: boolean;
  phpValue: string;
  hkdValue: string;
  onPhpChange: (t: string) => void;
  onHkdChange: (t: string) => void;
  onSwap: () => void;
  onRefresh: () => void;
};

export default function QuickConverter({
  isSwapped, phpValue, hkdValue, onPhpChange, onHkdChange, onSwap, onRefresh,
}: Props) {
  const { theme } = useTheme();
  const colors = theme === "light" ? lightColors : darkColors;
  const topLabel = isSwapped ? "HONG KONG DOLLAR (HKD)" : "PHILIPPINE PESO (PHP)";
  const topSymbol = isSwapped ? "$" : "₱";
  const topValue = isSwapped ? hkdValue : phpValue;
  const topHandler = isSwapped ? onHkdChange : onPhpChange;

  const botLabel = isSwapped ? "PHILIPPINE PESO (PHP)" : "HONG KONG DOLLAR (HKD)";
  const botSymbol = isSwapped ? "₱" : "$";
  const botValue = isSwapped ? phpValue : hkdValue;
  const botHandler = isSwapped ? onPhpChange : onHkdChange;

  return (
    <View style={[s.card, { backgroundColor: colors.bg, borderColor: theme === "light" ? "rgba(193,198,215,0.25)" : "rgba(100, 110, 108, 0.2)" }]}>
      <View style={s.connectorLineTop} />
      <View style={s.connectorLineBottom} />
      <View style={s.titleRow}>
        <RefreshCw size={18} color="#39baa6" />
        <Text style={[s.title, { color: colors.text }]}>Quick Converter</Text>
      </View>

      <CurrencyInput label={topLabel} symbol={topSymbol} value={topValue} onChange={topHandler} theme={theme} />

      <View style={s.swapRow}>
        <Pressable style={s.swapBtn} onPress={onSwap}>
          <ArrowDownUp size={20} color="#fff" />
        </Pressable>
      </View>

      <CurrencyInput label={botLabel} symbol={botSymbol} value={botValue} onChange={botHandler} theme={theme} />

      {/* Info banner */}
      <View style={[s.infoBanner, { borderTopColor: theme === "light" ? "rgba(193,198,215,0.15)" : "rgba(100, 110, 108, 0.1)" }]}>
        <View style={s.infoBannerLeft}>
          <Info size={16} color="#39baa6" />
          <Text style={[s.infoText, { color: theme === "light" ? "#717786" : "#7d8a87" }]}>Rates are updated every 15 minutes based on market data.</Text>
        </View>
        <Pressable onPress={onRefresh}>
          <Text style={[s.refreshLink, { color: "#39baa6" }]}>REFRESH</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Internal sub-component
// ---------------------------------------------------------------------------

function CurrencyInput({ label, symbol, value, onChange, theme }: {
  label: string; symbol: string; value: string; onChange: (t: string) => void; theme: string;
}) {
  const colors = theme === "light" ? lightColors : darkColors;
  return (
    <View style={s.inputGroup}>
      <Text style={[s.inputLabel, { color: theme === "light" ? "#717786" : "#7d8a87" }]}>{label}</Text>
      <View style={[s.inputRow, { backgroundColor: theme === "light" ? "#e5eefc" : "#2d3d3a" }]}>
        <Text style={[s.currencySymbol, { color: theme === "light" ? "#717786" : "#8b94a3" }]}>{symbol}</Text>
        <TextInput
          style={[s.input, { color: colors.text }]}
          keyboardType="decimal-pad"
          value={value}
          onChangeText={onChange}
          placeholder="0.00"
          placeholderTextColor={theme === "light" ? "#c1c6d7" : "#3d4d4a"}
        />
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const s = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 3,
  },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 20 },
  title: { fontSize: 18, fontWeight: "700", flex: 1 },

  inputGroup: { marginBottom: 4 },
  inputLabel: { fontSize: 11, fontWeight: "800", letterSpacing: 0.5, marginBottom: 8, textTransform: "uppercase" },
  inputRow: { flexDirection: "row", alignItems: "center", borderRadius: 10, paddingHorizontal: 16, paddingVertical: 14 },
  currencySymbol: { fontSize: 22, fontWeight: "700", marginRight: 10, minWidth: 20 },
  input: { flex: 1, fontSize: 22, fontWeight: "700", padding: 0 },

  swapRow: { alignItems: "flex-end", marginVertical: 2, zIndex: 1 },
  connectorLineTop: {
    position: "absolute",
    right: 41,
    top: 92,
    height: 28,
    width: 2,
    backgroundColor: "#39baa6",
    zIndex: 0,
  },
  connectorLineBottom: {
    position: "absolute",
    right: 41,
    top: 164,
    height: 28,
    width: 2,
    backgroundColor: "#39baa6",
    zIndex: 0,
  },
  swapBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: "#39baa6",
    alignItems: "center", justifyContent: "center",
    shadowColor: "#39baa6", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },

  infoBanner: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 20,
    borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12,
  },
  infoBannerLeft: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1, marginRight: 10 },
  infoText: { fontSize: 12, flex: 1 },
  refreshLink: { fontSize: 11, fontWeight: "800", letterSpacing: 0.4 },
});
