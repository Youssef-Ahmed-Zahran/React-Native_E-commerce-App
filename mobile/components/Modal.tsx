import React from "react";
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import type { ModalProps } from "../types/components.types";

export default function Modal({
  visible,
  onClose,
  title,
  children,
}: ModalProps) {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          className="flex-1 justify-end"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          <TouchableWithoutFeedback onPress={() => {}}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              <View
                className="rounded-t-3xl px-5 pt-4 pb-8 border-t border-white/10"
                style={{ backgroundColor: "#0f172a", maxHeight: "90%" }}
              >
                {/* ── Header ── */}
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-white text-xl font-bold">
                    {title || ""}
                  </Text>
                  <TouchableOpacity
                    onPress={onClose}
                    className="w-8 h-8 rounded-full items-center justify-center"
                    style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                    activeOpacity={0.7}
                  >
                    <Text className="text-white text-base">✕</Text>
                  </TouchableOpacity>
                </View>

                {/* ── Content ── */}
                {children}
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
}
