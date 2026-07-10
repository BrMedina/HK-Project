import React from "react";
import { StyleSheet, Text, View, TextInput, Pressable, ActivityIndicator } from "react-native";
import { Settings } from "lucide-react-native";
import { useTheme, lightColors, darkColors } from "../lib/ThemeContext";

type Props = {
  customRateInput: string;
  saving: boolean;
  onRateChange: (t: string) => void;
  onSave: () => void;
};

export default function ManualRateCard({ customRateInput, saving, onRateChange, onSave }: Props) {
  const { theme } = useTheme();
  return (
    <View style={[s.card, { backgroundColor: theme === "light" ? "#007dfe" : "#39baa6", shadowColor: theme === "light" ? "#007dfe" : "#39baa6" }]}>
      <View style={s.decor}>
        <Settings size={100} color="#fff" style={{ opacity: 0.08 }} />
      </View>

      <Text style={s.title}>Manual Rate Setup</Text>
      <Text style={[s.desc, { color: theme === "light" ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.8)" }]}>Override the current market rate for personal calculations.</Text>

      <View style={[s.inputRow, { backgroundColor: theme === "light" ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.08)", borderColor: theme === "light" ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.15)" }]}>
        <Text style={s.label}>1 HKD = </Text>
        <View style={[s.inputWrap, { borderBottomColor: theme === "light" ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.4)" }]}>
          <TextInput
            style={s.input}
            keyboardType="decimal-pad"
            value={customRateInput}
            onChangeText={onRateChange}
            placeholder="7.84"
            placeholderTextColor={theme === "light" ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.35)"}
          />
          <Text style={s.currency}>PHP</Text>
        </View>
      </View>

      <Pressable style={[s.saveBtn, saving && { opacity: 0.7 }]} onPress={onSave} disabled={saving}>
        {saving
          ? <ActivityIndicator size="small" color={theme === "light" ? "#007dfe" : "#39baa6"} />
          : <Text style={[s.saveBtnText, { color: theme === "light" ? "#007dfe" : "#39baa6" }]}>SAVE CUSTOM RATE</Text>}
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    marginHorizontal: 20, marginTop: 16, borderRadius: 12,
    padding: 22, position: "relative", overflow: "hidden",
    shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 14, elevation: 6,
  },
  decor: { position: "absolute", right: -20, bottom: -20 },
  title: { fontSize: 18, fontWeight: "700", color: "#fff", marginBottom: 8 },
  desc: { fontSize: 13, marginBottom: 18, lineHeight: 18 },
  inputRow: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 10, paddingHorizontal: 16, paddingVertical: 14,
  },
  label: { fontSize: 11, fontWeight: "800", color: "#fff", letterSpacing: 0.4, textTransform: "uppercase" },
  inputWrap: { flexDirection: "row", alignItems: "center", gap: 6 },
  input: {
    fontSize: 22, fontWeight: "700", color: "#fff", textAlign: "right", width: 90, padding: 0,
    borderBottomWidth: 1,
  },
  currency: { fontSize: 22, fontWeight: "700", color: "#fff" },
  saveBtn: { marginTop: 18, backgroundColor: "#fff", paddingVertical: 14, borderRadius: 10, alignItems: "center" },
  saveBtnText: { fontSize: 13, fontWeight: "800", letterSpacing: 0.5 },
});
