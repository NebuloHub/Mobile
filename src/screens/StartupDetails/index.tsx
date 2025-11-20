import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { SafeAreaView } from "react-native-safe-area-context";
import YoutubePlayer from "react-native-youtube-iframe";
import { Ionicons } from "@expo/vector-icons";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParams } from "../../types/navigation";

import { getStartupByCNPJ } from "../../api/startup";
import { getUserByCPF } from "../../api/usuario";
import { AvaliacaoResponse } from "../../types/avaliacao";
import {
  getPossuiByStartup,
  createPossui,
  deletePossui,
} from "../../api/possui";
import { getAllHabilidades } from "../../api/habilidade";

import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { globalStyles } from "../../styles/global";

import StarsDisplay from "../../components/StarsDisplay";
import NewAvaliacaoForm from "../../components/NewAvaliacaoForm";

type Props = NativeStackScreenProps<AppStackParams, "StartupDetails">;

function extractYT(url?: string | null) {
  if (!url) return null;
  const regex =
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function useStartupDetails(cnpj?: string | null) {
  const [startup, setStartup] = useState<any>(null);
  const [avaliacoes, setAvaliacoes] = useState<
    Array<AvaliacaoResponse & { usuario?: any | null }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    if (!cnpj) {
      setStartup(null);
      setAvaliacoes([]);
      setLoading(false);
      return;
    }

    async function load() {
      setLoading(true);
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

          if (mounted) setAvaliacoes(attached);
        } else {
          setAvaliacoes([]);
        }
      } catch (err: any) {
        if (mounted) setError(err.message || "Erro ao carregar startup");
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
    (a: AvaliacaoResponse & { usuario?: any | null }) => {
      setAvaliacoes((prev) => [a, ...prev]);
    },
    []
  );

  return {
    startup,
    avaliacoes,
    loading,
    error,
    prependAvaliacao,
  };
}

function useStartupHabilidades(cnpj?: string | null) {
  const [possuiList, setPossuiList] = useState<any[]>([]);
  const [allHabilidades, setAllHabilidades] = useState<any[]>([]);
  const [loadingHab, setLoadingHab] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!cnpj) {
        setPossuiList([]);
        setAllHabilidades([]);
        setLoadingHab(false);
        return;
      }

      setLoadingHab(true);

      try {
        const p = await getPossuiByStartup(cnpj);
        if (!mounted) return;
        setPossuiList(p);

        const all = await getAllHabilidades(1);
        if (!mounted) return;

        const items = all.items ?? all;
        setAllHabilidades(
          items.map((i: any) => ({
            idHabilidade: i.idHabilidade,
            nomeHabilidade: i.nomeHabilidade,
            tipoHabilidade: i.tipoHabilidade,
          }))
        );
      } catch {
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
      if (!cnpj) return;

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
    addHabilidade,
    removeHabilidade,
  };
}

export default function StartupDetails({ route, navigation }: Props) {
  const { colors } = useTheme();
  const styles = globalStyles(colors);

  const { user } = useAuth();

  const cnpj = route.params?.cnpj;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedHab, setSelectedHab] = useState<number | null>(null);

  const { startup, avaliacoes, loading, error, prependAvaliacao } =
    useStartupDetails(cnpj);

  const {
    possuiList,
    allHabilidades,
    loadingHab,
    addHabilidade,
    removeHabilidade,
  } = useStartupHabilidades(cnpj);

  const isOwner =
    startup?.usuarioCPF && user?.cpf && startup.usuarioCPF === user.cpf;

  const [expanded, setExpanded] = useState(false);

  const videoId = useMemo(
    () => extractYT(startup?.video ?? ""),
    [startup?.video]
  );

  const media = useMemo(() => {
    if (!avaliacoes.length) return 0;
    return (
      avaliacoes.reduce((acc, a) => acc + (a.nota ?? 0), 0) / avaliacoes.length
    );
  }, [avaliacoes]);

  const openLink = useCallback(async (url?: string | null) => {
    if (!url) return;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) await Linking.openURL(url);
    } catch {}
  }, []);

  if (loading)
    return (
      <View style={{ padding: 20 }}>
        <ActivityIndicator size="large" />
      </View>
    );

  if (error)
    return (
      <View>
        <Text style={styles.textButton}>Erro: {error}</Text>
      </View>
    );

  if (!startup)
    return (
      <View>
        <Text style={styles.textButton}>Startup não encontrada.</Text>
      </View>
    );

  const visible = expanded ? avaliacoes : avaliacoes.slice(0, 1);

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.pagina}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {videoId ? (
          <View style={styles.videoContainer}>
            <YoutubePlayer height={220} play={false} videoId={videoId} />
          </View>
        ) : (
          <Image
            source={require("../../../assets/placeholders/video.png")}
            style={{ width: "100%", height: 200 }}
          />
        )}

        <View style={styles.startupCard}>
          <Text style={styles.tituloHome}>{startup.nomeStartup}</Text>
          <Text style={styles.dadosStartup}>Email: {startup.emailStartup}</Text>
          <Text style={styles.dadosStartup}>CNPJ: {startup.cnpj}</Text>

          {startup.site && (
            <TouchableOpacity
              style={styles.buttonProfile}
              onPress={() => openLink(startup.site)}
            >
              <Text style={styles.textOutroButton}>Visitar Site</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={[styles.startupCard, { paddingBottom: 30, gap: 30 }]}>
          <Text style={styles.dadosStartup}>Descrição do projeto</Text>
          <Text style={styles.textButton}>{startup.descricao}</Text>

          <Text style={styles.dadosStartup}>Nome Responsável</Text>
          <Text style={styles.textButton}>{startup.nomeResponsavel}</Text>
        </View>

        <View style={[styles.startupCard, { gap: 16, paddingBottom: 20, marginBottom: 0, }]}>
          <Text style={styles.dadosStartup}>Habilidades</Text>

          {loadingHab ? (
            <ActivityIndicator size="small" />
          ) : possuiList.length === 0 ? (
            <Text style={styles.textButton}>
              Nenhuma habilidade cadastrada.
            </Text>
          ) : (
            possuiList.map((p) => (
              <View
                key={p.idPossui}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 8,
                }}
              >
                <View>
                  <Text style={styles.textButton}>
                    {p.habilidade.nomeHabilidade}
                  </Text>
                  <Text style={styles.olho}>
                    {p.habilidade.tipoHabilidade}
                  </Text>
                </View>

                {isOwner && (
                  <TouchableOpacity
                    onPress={() =>
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
                              } catch {
                                Alert.alert(
                                  "Erro",
                                  "Não foi possível remover a habilidade."
                                );
                              }
                            },
                          },
                        ]
                      )
                    }
                  >
                    <Ionicons name="trash-outline" size={22} color="red" />
                  </TouchableOpacity>
                )}
              </View>
            ))
          )}

          {isOwner && (
            <TouchableOpacity
              onPress={() => {
                console.log("Abrindo modal de habilidades...");
                if (allHabilidades.length === 0) {
                  Alert.alert("Ops", "Nenhuma habilidade disponível.");
                  return;
                }
                setSelectedHab(allHabilidades[0]?.idHabilidade ?? null);
                setModalVisible(true);
              }}
            >
              <Text style={styles.textOutroButton}>
                Adicionar nova habilidade...
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={[styles.startupCard, {gap:10, paddingBottom:30, marginBottom:0, marginTop:30 }]}>
          <Text style={styles.tituloHome}>Notas e avaliações</Text>
          <Text style={styles.dadosStartup}>
            Avaliações criadas por usuários cadastrados no app.
          </Text>
          <Text style={[styles.tituloHome, {color: colors.text, fontSize: 50}]}>{media.toFixed(1)}</Text>
          <StarsDisplay value={media / 2} />

        </View>

        <NewAvaliacaoForm
          startupCNPJ={startup.cnpj}
          styles={styles}
          colors={colors}
          onSuccess={(newA) => prependAvaliacao(newA)}
        />

        {avaliacoes.length ? (
          <>
            {visible.map((a) => (
              <View key={a.idAvaliacao}>
                <View
                  style={[
                    styles.startupCard,
                    { marginTop: 10, borderBottomWidth: 0 },
                  ]}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <Ionicons
                      name="person-circle-outline"
                      size={28}
                      style={styles.iconUserHome}
                    />
                    <Text style={styles.textButton}>
                      {a.usuario?.nome ?? "Usuário"}
                    </Text>
                  </View>

                  <View style={{ marginTop: 6 }}>
                    <StarsDisplay value={(a.nota ?? 0) / 2} />
                  </View>

                  <Text style={[styles.textButton, { marginTop: 6 }]}>
                    {a.comentario || "Sem comentário"}
                  </Text>
                </View>
              </View>
            ))}

            {avaliacoes.length > 1 && (
              <TouchableOpacity
                style={{ marginVertical: 20, padding: 12 }}
                onPress={() => setExpanded((prev) => !prev)}
              >
                <Text style={[styles.sobreCard, { textDecorationLine: "underline" }]}>
                  {expanded ? "Ver menos" : "Ver todas"}
                </Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <Text style={styles.textButton}>Nenhuma avaliação ainda.</Text>
        )}

        {/* MODAL PARA ESCOLHER HABILIDADE */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <View
              style={{
                width: "100%",
                padding: 20,
                borderRadius: 12,
                gap: 16,
              }}
            >
              <Text style={[styles.dadosStartup, { fontSize: 18 }]}>
                Selecione a habilidade
              </Text>

              <View
                style={{
                  borderWidth: 1,
                  borderRadius: 8,
                }}
              >
                <Picker
                  selectedValue={selectedHab}
                  onValueChange={(v) => {
                    console.log("Habilidade selecionada:", v);
                    setSelectedHab(v);
                  }}
                >
                  {allHabilidades.map((h) => (
                    <Picker.Item
                      key={h.idHabilidade}
                      label={`${h.nomeHabilidade} (${h.tipoHabilidade})`}
                      value={h.idHabilidade}
                    />
                  ))}
                </Picker>
              </View>

              {/* BOTÃO ADICIONAR */}
              <TouchableOpacity
                style={styles.buttonProfile}
                onPress={async () => {
                  if (!selectedHab) return;

                  try {
                    console.log("Adicionando habilidade:", selectedHab);
                    await addHabilidade(selectedHab);
                    console.log("Habilidade adicionada!");

                    setModalVisible(false);
                  } catch (err) {
                    console.log("Erro ao adicionar habilidade:", err);
                    Alert.alert(
                      "Erro",
                      "Não foi possível adicionar a habilidade."
                    );
                  }
                }}
              >
                <Text style={styles.textOutroButton}>Adicionar</Text>
              </TouchableOpacity>

              {/* BOTÃO PARA CRIAR NOVA HABILIDADE */}
              <TouchableOpacity
                style={[styles.buttonProfile, { borderColor: "#13E600FF" }]}
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate('RegisterAbility')
                }}
              >
                <Text style={[styles.textOutroButton, { color: "#13E600" }]}>
                  Criar nova habilidade
                </Text>
              </TouchableOpacity>

              {/* CANCELAR */}
              <TouchableOpacity
                style={[styles.buttonProfile, { borderColor: "#E60000" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.textOutroButton, { color: "#E60000" }]}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>



        <TouchableOpacity
          style={[styles.buttonProfile, { marginTop: 10, marginBottom: 40 }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.textOutroButton}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
