// StartupDetails/index.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParams } from "../../types/navigation";
import { StartupResponse } from "../../types/startup";
import { AvaliacaoResponse, AvaliacaoRequest } from "../../types/avaliacao";
import { getStartupByCNPJ } from "../../api/startup";
import { getUserByCPF } from "../../api/usuario";
import { postAvaliacao } from "../../api/avaliacao";
import {
  getPossuiByStartup,
  createPossui,
  deletePossui,
} from "../../api/possui";
import { getAllHabilidades } from "../../api/habilidade";
import { SafeAreaView } from "react-native-safe-area-context";
import YoutubePlayer from "react-native-youtube-iframe";

import { useTheme } from "../../context/ThemeContext";
import { globalStyles } from "../../styles/global";
import { useAuth } from "../../context/AuthContext";

type Props = NativeStackScreenProps<AppStackParams, "StartupDetails">;

/* -------------------------
 * Helpers
 * ------------------------- */
function extractYT(url?: string | null) {
  if (!url) return null;
  const regex =
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

/* -------------------------
 * Hooks locais (data fetching)
 * ------------------------- */
function useStartupDetails(cnpj?: string | null) {
  const [startup, setStartup] = useState<StartupResponse | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<
    Array<AvaliacaoResponse & { usuario?: any | null }>
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    if (!cnpj) {
      setLoading(false);
      setStartup(null);
      setAvaliacoes([]);
      return;
    }

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getStartupByCNPJ(cnpj!);
        if (!mounted) return;
        setStartup(data || null);

        const evals = data?.avaliacoes ?? [];
        if (evals.length > 0) {
          const attached = await Promise.all(
            evals.map(async (a) => {
              try {
                if (!a.usuarioCPF) return { ...a, usuario: undefined };
                const u = await getUserByCPF(a.usuarioCPF);
                return { ...a, usuario: u };
              } catch {
                return { ...a, usuario: undefined };
              }
            })
          );
          if (!mounted) return;
          setAvaliacoes(
            attached as Array<AvaliacaoResponse & { usuario?: any | null }>
          );
        } else {
          setAvaliacoes([]);
        }
      } catch (err: any) {
        if (mounted) setError(err?.message || "Erro ao carregar startup");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [cnpj]);

  const prependAvaliacao = useCallback(
    (a: AvaliacaoResponse & { usuario?: any | null }) =>
      setAvaliacoes((prev) => [a, ...prev]),
    []
  );

  return {
    startup,
    avaliacoes,
    loading,
    error,
    setStartup,
    setAvaliacoes,
    prependAvaliacao,
  };
}

function useStartupHabilidades(cnpj?: string | null) {
  const [possuiList, setPossuiList] = useState<any[]>([]);
  const [allHabilidades, setAllHabilidades] = useState<any[]>([]);
  const [loadingHab, setLoadingHab] = useState<boolean>(true);
  const [errorHab, setErrorHab] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    if (!cnpj) {
      setPossuiList([]);
      setAllHabilidades([]);
      setLoadingHab(false);
      return;
    }

    async function load() {
      setLoadingHab(true);
      setErrorHab(null);
      try {
        const p = await getPossuiByStartup(cnpj!);
        if (!mounted) return;
        setPossuiList(p);

        const habs = await getAllHabilidades(20);
        if (!mounted) return;
        const items = (habs && (habs.items ?? habs)) || [];
        setAllHabilidades(
          items.map((h: any) => ({
            idHabilidade: h.idHabilidade,
            nomeHabilidade: h.nomeHabilidade,
            tipoHabilidade: h.tipoHabilidade,
          }))
        );
      } catch (err: any) {
        if (mounted) setErrorHab(err?.message || "Erro ao carregar habilidades");
      } finally {
        if (mounted) setLoadingHab(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [cnpj]);

  const addHabilidade = useCallback(
    async (idHabilidade: number) => {
      if (!cnpj) throw new Error("cnpj ausente");
      await createPossui(cnpj, idHabilidade);
      const updated = await getPossuiByStartup(cnpj);
      setPossuiList(updated);
    },
    [cnpj]
  );

  const removeHabilidade = useCallback(
    async (idPossui: number) => {
      await deletePossui(idPossui);
      if (cnpj) {
        const updated = await getPossuiByStartup(cnpj);
        setPossuiList(updated);
      }
    },
    [cnpj]
  );

  return {
    possuiList,
    allHabilidades,
    loadingHab,
    errorHab,
    addHabilidade,
    removeHabilidade,
  };
}

function StarsDisplay({ value, size = 18 }: { value: number; size?: number }) {
  const full = Math.floor(value);
  const half = value % 1 >= 0.5;
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= full) stars.push(<Ionicons key={i} name="star" size={size} color="#FFD700" />);
    else if (i === full + 1 && half) stars.push(<Ionicons key={i} name="star-half" size={size} color="#FFD700" />);
    else stars.push(<Ionicons key={i} name="star-outline" size={size} color="#FFD700" />);
  }
  return <View style={{ flexDirection: "row" }}>{stars}</View>;
}

function StarsInput({ rating, setRating, max = 10 }: { rating: number; setRating: (n: number) => void; max?: number }) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
      {[...Array(max)].map((_, i) => {
        const filled = i < rating;
        return (
          <TouchableOpacity key={i} onPress={() => setRating(i + 1)} style={{ padding: 4 }}>
            <Ionicons name={filled ? "star" : "star-outline"} size={22} color="#FFD700" />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function NewAvaliacaoForm({
  startupCNPJ,
  onSuccess,
  styles,
  colors,
}: {
  startupCNPJ: string;
  onSuccess: (newAvaliacao: AvaliacaoResponse & { usuario?: any | null }) => void;
  styles: ReturnType<typeof globalStyles>;
  colors: ReturnType<typeof useTheme>["colors"];
}) {
  const { user } = useAuth();
  const [rating, setRating] = useState<number>(0);
  const [comentario, setComentario] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false);

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
      } catch {
        autor = undefined;
      }

      const newAvaliacao = { ...created, usuario: autor };
      onSuccess(newAvaliacao);

      setRating(0);
      setComentario("");
    } catch (err) {
      console.error("Erro ao enviar avaliacao:", err);
      Alert.alert("Erro", "Não foi possível enviar a avaliação.");
    } finally {
      setSending(false);
    }
  }, [rating, comentario, startupCNPJ, user, onSuccess]);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={[styles.startupCard, { marginTop: 20, gap: 12 }]}>
        <Text style={styles.tituloHome}>Enviar Avaliação</Text>

        <View>
          <Text style={styles.dadosStartup}>Sua nota</Text>
          <StarsInput rating={rating} setRating={setRating} />
          <Text style={{ color: colors.text, fontSize: 12 }}>{rating} / 10</Text>
        </View>

        <View style={{ marginTop: 6 }}>
          <View style={{ flexDirection: "row", alignItems: "center", borderWidth: 1, paddingHorizontal: 10, borderRadius: 10 }}>
            <TextInput
              style={{ flex: 1, paddingVertical: 10, color: colors.text }}
              placeholder="Adicione um comentário..."
              placeholderTextColor={colors.text}
              value={comentario}
              onChangeText={setComentario}
              multiline
            />
            <TouchableOpacity onPress={handleSend} disabled={sending} style={{ padding: 8 }}>
              <Ionicons name="send" size={22} color={sending ? "#aaa" : colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

export default function StartupDetails({ route, navigation }: Props) {
  const { colors } = useTheme();
  const styles = globalStyles(colors);

  const cnpj = route.params?.cnpj;
  const { startup, avaliacoes, loading, error, prependAvaliacao } = useStartupDetails(cnpj);
  const { possuiList, allHabilidades, loadingHab, errorHab, addHabilidade, removeHabilidade } = useStartupHabilidades(cnpj);

  const { user } = useAuth();
  const isOwner = !!(startup?.usuarioCPF && user?.cpf && startup.usuarioCPF === user.cpf);

  const [showSkillPicker, setShowSkillPicker] = useState<boolean>(false);
  const [selectedSkillId, setSelectedSkillId] = useState<number | null>(null);
  const [expandedAval, setExpandedAval] = useState<boolean>(false);

  useEffect(() => {
    console.log("DEBUG StartupDetails:", { cnpj });
  }, [cnpj]);

  useEffect(() => {
    console.log("DEBUG habilidades:", {
      isOwner,
      showSkillPicker,
      selectedSkillId,
      possuiCount: possuiList?.length ?? 0,
      allHabilidadesCount: allHabilidades?.length ?? 0,
      loadingHab,
      errorHab,
    });
  }, [isOwner, showSkillPicker, selectedSkillId, possuiList, allHabilidades, loadingHab, errorHab]);

  const videoId = useMemo(() => extractYT(startup?.video ?? ""), [startup?.video]);

  const media = useMemo(() => {
    if (!avaliacoes || avaliacoes.length === 0) return 0;
    return avaliacoes.reduce((acc, a) => acc + (a.nota ?? 0), 0) / avaliacoes.length;
  }, [avaliacoes]);

  const openLink = useCallback(async (url?: string | null) => {
    if (!url) return;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) await Linking.openURL(url);
    } catch (err) {
      console.warn("Erro abrindo link:", err);
    }
  }, []);

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text style={styles.textButton}>Erro: {error}</Text>
      </View>
    );
  }

  if (!startup) {
    return (
      <View>
        <Text style={styles.textButton}>Startup não encontrada.</Text>
      </View>
    );
  }

  const visibleAvaliacoes = expandedAval ? avaliacoes : avaliacoes.slice(0, 1);

  const handleOpenPicker = useCallback(() => {
    setSelectedSkillId(null);
    setShowSkillPicker(true);
  }, []);

  const handleCancelPicker = useCallback(() => {
    setSelectedSkillId(null);
    setShowSkillPicker(false);
  }, []);

  const handleConfirmAdd = useCallback(async () => {
    if (!selectedSkillId) {
      Alert.alert("Atenção", "Selecione uma habilidade para adicionar.");
      return;
    }
    try {
      await addHabilidade(selectedSkillId);
      Alert.alert("Sucesso", "Habilidade adicionada.");
      setShowSkillPicker(false);
      setSelectedSkillId(null);
    } catch (err) {
      console.error("Erro ao adicionar habilidade:", err);
      Alert.alert("Erro", "Não foi possível adicionar a habilidade.");
    }
  }, [selectedSkillId, addHabilidade]);

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.pagina}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
  
        {videoId ? (
          <View style={styles.videoContainer}>
            <YoutubePlayer height={220} play={false} videoId={videoId} />
          </View>
        ) : (
          <Image source={require("../../../assets/placeholders/video.png")} style={{ width: "100%", height: 200 }} />
        )}

        {/* Header */}
        <View style={styles.startupCard}>
          <Text style={styles.tituloHome}>{startup.nomeStartup}</Text>
          <Text style={styles.dadosStartup}>Email: {startup.emailStartup}</Text>
          <Text style={styles.dadosStartup}>CNPJ: {startup.cnpj}</Text>

          {startup.site && (
            <TouchableOpacity style={styles.buttonProfile} onPress={() => openLink(startup.site)}>
              <Text style={styles.textOutroButton}>Visitar Site</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Descrição */}
        <View style={[styles.startupCard, { paddingBottom: 30, gap: 30 }]}>
          <Text style={styles.dadosStartup}>Descrição do projeto</Text>
          <Text style={styles.textButton}>{startup.descricao}</Text>

          <Text style={styles.dadosStartup}>Nome Responsável</Text>
          <Text style={styles.textButton}>{startup.nomeResponsavel}</Text>
        </View>

        {/* Habilidades */}
        <View style={[styles.startupCard, { gap: 16, paddingBottom: 20 }]}>
          <Text style={styles.dadosStartup}>Habilidades</Text>

          {loadingHab ? (
            <ActivityIndicator size="small" />
          ) : possuiList.length === 0 ? (
            <Text style={styles.textButton}>Nenhuma habilidade cadastrada.</Text>
          ) : (
            possuiList.map((p) => (
              <View key={p.idPossui} style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 }}>
                <View>
                  <Text style={styles.textButton}>{p.habilidade.nomeHabilidade}</Text>
                  <Text style={styles.textButton}>{p.habilidade.tipoHabilidade}</Text>
                </View>

                {isOwner && (
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert(
                        "Remover habilidade",
                        `Remover ${p.habilidade.nomeHabilidade}?`,
                        [
                          { text: "Cancelar", style: "cancel" },
                          {
                            text: "Remover",
                            style: "destructive",
                            onPress: async () => {
                              try {
                                await removeHabilidade(p.idPossui);
                              } catch (err) {
                                console.error(err);
                                Alert.alert("Erro", "Não foi possível remover a habilidade.");
                              }
                            },
                          },
                        ]
                      );
                    }}
                  >
                    <Ionicons name="trash-outline" size={22} color="red" />
                  </TouchableOpacity>
                )}
              </View>
            ))
          )}

          {/* botão adicionar (visível ao owner) */}
          {isOwner && (
            <View>
              <TouchableOpacity onPress={handleOpenPicker}>
                <Text style={styles.textOutroButton}>{showSkillPicker ? "Escolher outra habilidade" : "Adicionar nova habilidade"}</Text>
              </TouchableOpacity>

              {showSkillPicker && (
                <View style={{ marginTop: 10, padding: 8, borderRadius: 8, backgroundColor: "#f5f5f5" }}>
                  {allHabilidades.length === 0 ? (
                    <Text style={styles.textButton}>Nenhuma habilidade disponível para adicionar.</Text>
                  ) : (
                    <>
                      <Text style={[styles.dadosStartup, { marginBottom: 8 }]}>Escolha uma habilidade</Text>
                      {allHabilidades.map((hab) => {
                        const already = possuiList.some((p) => p.habilidade?.idHabilidade === hab.idHabilidade);
                        return (
                          <TouchableOpacity
                            key={hab.idHabilidade}
                            onPress={() => setSelectedSkillId(hab.idHabilidade)}
                            disabled={already}
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                              paddingVertical: 10,
                              paddingHorizontal: 8,
                              borderRadius: 8,
                              backgroundColor: selectedSkillId === hab.idHabilidade ? "#e0e0e0" : "transparent",
                              opacity: already ? 0.5 : 1,
                              marginBottom: 6,
                            }}
                          >
                            <View>
                              <Text style={styles.textButton}>{hab.nomeHabilidade}</Text>
                              <Text style={styles.textButton}>{hab.tipoHabilidade}</Text>
                            </View>
                            {already ? (
                              <Text style={[styles.textButton, { fontSize: 12 }]}>Vinculada</Text>
                            ) : selectedSkillId === hab.idHabilidade ? (
                              <Ionicons name="checkmark-circle" size={20} />
                            ) : null}
                          </TouchableOpacity>
                        );
                      })}

                      <View style={{ flexDirection: "row", gap: 12, marginTop: 8 }}>
                        <TouchableOpacity onPress={handleConfirmAdd} style={{ padding: 10 }}>
                          <Text style={styles.textOutroButton}>Adicionar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleCancelPicker} style={{ padding: 10 }}>
                          <Text style={[styles.textOutroButton, { color: "#888" }]}>Cancelar</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </View>
              )}
            </View>
          )}
        </View>

        {/* Notas e média */}
        <View style={[styles.startupCard]}>
          <Text style={styles.tituloHome}>Notas e avaliações</Text>
          <Text style={styles.dadosStartup}>Avaliações criadas por usuários cadastrados no aplicativo.</Text>
        </View>

        <View style={[styles.startupCard, { marginTop: 0, borderBottomWidth: 0 }]}>
          <Text style={[styles.tituloHome]}>{media.toFixed(1)} / 10</Text>
          <StarsDisplay value={media / 2} />
        </View>

        {avaliacoes && avaliacoes.length > 0 ? (
          <>
            {visibleAvaliacoes.map((a) => (
              <View key={a.idAvaliacao}>
                <View style={[styles.startupCard, { marginTop: 10, borderBottomWidth: 0 }]}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <Ionicons name="person-circle-outline" size={28} style={styles.iconUserHome} />
                    <Text style={styles.textButton}>{a.usuario?.nome ?? "Usuário"}</Text>
                  </View>
                  <View style={{ marginTop: 6 }}>
                    <StarsDisplay value={(a.nota ?? 0) / 2} />
                  </View>
                  <Text style={[styles.textButton, { marginTop: 6 }]}>{a.comentario || "Sem comentário"}</Text>
                </View>
              </View>
            ))}

            {avaliacoes.length > 1 && (
              <TouchableOpacity style={[styles.buttonProfile, { marginVertical: 20 }]} onPress={() => setExpandedAval((prev) => !prev)}>
                <Text style={styles.textOutroButton}>{expandedAval ? "Ver menos" : "Ver todas"}</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <Text style={styles.textButton}>Nenhuma avaliação ainda.</Text>
        )}

        <NewAvaliacaoForm startupCNPJ={startup.cnpj} styles={styles} colors={colors} onSuccess={(newA) => prependAvaliacao(newA as any)} />

        <TouchableOpacity style={[styles.buttonProfile, { marginBottom: 40, marginTop: 10 }]} onPress={() => navigation.goBack()}>
          <Text style={styles.textOutroButton}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
