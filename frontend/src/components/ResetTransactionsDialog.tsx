import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { AlertTriangle } from "lucide-react-native";

type Props = {
  visible: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  busy?: boolean;
};

export default function ResetTransactionsDialog({
  visible,
  title,
  message,
  onCancel,
  onConfirm,
  busy = false,
}: Props) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} />
        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <AlertTriangle size={22} color="#ef4444" />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.actions}>
            <Pressable style={styles.cancelBtn} onPress={onCancel} disabled={busy}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable style={[styles.resetBtn, busy && styles.resetBtnDisabled]} onPress={onConfirm} disabled={busy}>
              <Text style={styles.resetText}>{busy ? "Resetting..." : "Reset"}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(11, 28, 48, 0.55)",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(193,198,215,0.2)",
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(239,68,68,0.1)",
    marginBottom: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0b1c30",
  },
  message: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: "#6d7a76",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  cancelBtn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f1f3fe",
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0b1c30",
  },
  resetBtn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ef4444",
  },
  resetBtnDisabled: {
    opacity: 0.7,
  },
  resetText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#fff",
  },
});