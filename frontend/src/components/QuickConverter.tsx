import React from "react";
import { StyleSheet, Text, View, TextInput, Pressable } from "react-native";
import { ArrowDownUp, Info, RefreshCw } from "lucide-react-native";

type Props = {
  isSwapped: boolean;
  phpValue: string;
  hkdValue: string;
  onPhpChange: (t: string) => void;
  onHkdChange: (t: string) => void;
  onSwap: () => void;
};

export default function QuickConverter({
  isSwapped, phpValue, hkdValue, onPhpChange, onHkdChange, onSwap,
}: Props) {
  const topLabel = isSwapped ? "HONG KONG DOLLAR (HKD)" : "PHILIPPINE PESO (PHP)";
  const topSymbol = isSwapped ? "$" : "₱";
  const topValue = isSwapped ? hkdValue : phpValue;
  const topHandler = isSwapped ? onHkdChange : onPhpChange;

  const botLabel = isSwapped ? "PHILIPPINE PESO (PHP)" : "HONG KONG DOLLAR (HKD)";
  const botSymbol = isSwapped ? "₱" : "$";
  const botValue = isSwapped ? phpValue : hkdValue;
  const botHandler = isSwapped ? onPhpChange : onHkdChange;

  return (
    <View style={s.card}>
      <View style={s.connectorLineTop} />
      <View style={s.connectorLineBottom} />
      <View style={s.titleRow}>
        <RefreshCw size={18} color="#39baa6" />
        <Text style={s.title}>Quick Converter</Text>
      </View>

      <CurrencyInput label={topLabel} symbol={topSymbol} value={topValue} onChange={topHandler} />

      <View style={s.swapRow}>
        <Pressable style={s.swapBtn} onPress={onSwap}>
          <ArrowDownUp size={20} color="#fff" />
        </Pressable>
      </View>

      <CurrencyInput label={botLabel} symbol={botSymbol} value={botValue} onChange={botHandler} />

      {/* Info banner */}
      <View style={s.infoBanner}>
        <View style={s.infoBannerLeft}>
          <Info size={16} color="#39baa6" />
          <Text style={s.infoText}>Rates are updated every 15 minutes based on market data.</Text>
        </View>
        <Pressable>
          <Text style={s.refreshLink}>REFRESH</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Internal sub-component
// ---------------------------------------------------------------------------

function CurrencyInput({ label, symbol, value, onChange }: {
  label: string; symbol: string; value: string; onChange: (t: string) => void;
}) {
  return (
    <View style={s.inputGroup}>
      <Text style={s.inputLabel}>{label}</Text>
      <View style={s.inputRow}>
        <Text style={s.currencySymbol}>{symbol}</Text>
        <TextInput
          style={s.input}
          keyboardType="decimal-pad"
          value={value}
          onChangeText={onChange}
          placeholder="0.00"
          placeholderTextColor="#c1c6d7"
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
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(193,198,215,0.25)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 3,
  },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 20 },
  title: { fontSize: 18, fontWeight: "700", color: "#181c23", flex: 1 },

  inputGroup: { marginBottom: 4 },
  inputLabel: { fontSize: 11, fontWeight: "800", letterSpacing: 0.5, color: "#717786", marginBottom: 8, textTransform: "uppercase" },
  inputRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#e5eefc", borderRadius: 10, paddingHorizontal: 16, paddingVertical: 14 },
  currencySymbol: { fontSize: 22, fontWeight: "700", color: "#717786", marginRight: 10, minWidth: 20 },
  input: { flex: 1, fontSize: 22, fontWeight: "700", color: "#181c23", padding: 0 },

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
    width: 44, height: 44, borderRadius: 22, backgroundColor: "#007dfe",
    alignItems: "center", justifyContent: "center",
    shadowColor: "#007dfe", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },

  infoBanner: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 20,
    backgroundColor: "rgba(211,242,238,0.35)", borderWidth: 1, borderColor: "rgba(162,230,219,0.5)",
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12,
  },
  infoBannerLeft: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1, marginRight: 10 },
  infoText: { fontSize: 12, color: "#004b42", flex: 1 },
  refreshLink: { fontSize: 11, fontWeight: "800", color: "#39baa6", letterSpacing: 0.4 },
});
