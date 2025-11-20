import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import StarsInput from "./StartsInput";

// 👉 ajustar o caminho
import { useAuth } from "../context/AuthContext";

// 👉 ajustar o caminho
import { postAvaliacao } from "../api/avaliacao";

// 👉 ajustar o caminho
import { getUserByCPF } from "../api/usuario";

import { AvaliacaoRequest, AvaliacaoResponse } from "../types/avaliacao";

export default function NewAvaliacaoForm({
  startupCNPJ,
  onSuccess,
  styles,
  colors,
}: {
  startupCNPJ: string;
  onSuccess: (a: AvaliacaoResponse & { usuario?: any | null }) => void;
  styles: any;
  colors: any;
}) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comentario, setComentario] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = useCallback(async () => {
    if (!rating) {
      Alert.alert("Atenção", "Dê uma nota antes de enviar.");
      return;
    }

    if (!user?.cpf) {
      Alert.alert("Erro", "Usuário não identificado.");
      return;
    }

    const payload: AvaliacaoRequest = {
      nota: rating,
      comentario,
      usuarioCPF: user.cpf,
      startupCNPJ,
    };

    try {
      setSending(true);
      const created = await postAvaliacao(payload);

      let autor = undefined;
      try {
        autor = await getUserByCPF(user.cpf);
      } catch {}

      onSuccess({ ...created, usuario: autor });

      setRating(0);
      setComentario("");
    } catch {
      Alert.alert("Erro", "Não foi possível enviar a avaliação.");
    } finally {
      setSending(false);
    }
  }, [rating, comentario, startupCNPJ, user]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.startupCard, { marginTop: 20, gap: 12 }]}>
        <Text style={styles.tituloHome}>Enviar Avaliação</Text>

        <View>
          <Text style={styles.dadosStartup}>Sua nota</Text>
          <StarsInput rating={rating} setRating={setRating} />
          <Text style={{ color: colors.text, fontSize: 12 }}>
            {rating} / 10
          </Text>
        </View>

        <View style={{ marginTop: 6 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              paddingHorizontal: 10,
              borderRadius: 10,
            }}
          >
            <TextInput
              style={{ flex: 1, paddingVertical: 10, color: colors.text }}
              placeholder="Adicione um comentário..."
              placeholderTextColor={colors.text}
              value={comentario}
              onChangeText={setComentario}
              multiline
            />

            <TouchableOpacity
              onPress={handleSend}
              disabled={sending}
              style={{ padding: 8 }}
            >
              <Ionicons
                name="send"
                size={22}
                color={sending ? "#aaa" : colors.text}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
