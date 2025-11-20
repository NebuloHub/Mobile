import { StyleSheet } from "react-native";
import { themeColors } from "../context/ThemeContext";


export const globalStyles= (colors: typeof themeColors.light) => StyleSheet.create({

    //----------------------------------------------------
    //                      FORMS
    //----------------------------------------------------

    pagina: {
        backgroundColor: colors.background,
        minHeight: "100%",
    },


    forms: {
        marginHorizontal: 20,
        paddingTop: 60,
        gap:60,
    },

    titulo: {
        fontSize: 36,
        fontWeight: "bold",
        color: colors.titulo,
    },

    formCorpo: {
        gap: 5,
    },

    input: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 8,
        borderColor: colors.borda,
        color: colors.text,
    },

    passwordContainer: {
        borderWidth: 1,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        borderColor: colors.borda,
        color: colors.text,
    },

    textoSenha: {
        flex:1,
        color: colors.text,
    },

    olho: {
        color: colors.text,
    },

    button: {
      marginTop: 10,
      backgroundColor: "#FFB100",
      padding: 12,
      borderRadius: 20,
      alignItems: "center",
    },

    outroButton: {
      marginTop: 170,
      marginBottom: 30,
      borderWidth: 2,
      borderColor: "#FFB100",
      padding: 12,
      borderRadius: 20,
      alignItems: "center",

    },

    textButton: {
        fontSize: 15,
        fontWeight: "500",
        color: colors.titulo,
    },

    textOutroButton: {
        fontSize: 15,
        fontWeight: "500",
        color: "#FFB100",
    },


    //----------------------------------------------------
    //                      Linguagem
    //----------------------------------------------------

    corpoLinguagem: {
        alignItems: "center",
    },

    linguagem: {
        flexDirection: "row",
        gap: 10,
    },

    textLinguagem: {
        color: colors.text,
        fontSize: 15,
        fontWeight: "bold",
    },

    caixaLinguagem: {
        gap: 10,
    },


    //----------------------------------------------------
    //                  Componente Field
    //----------------------------------------------------

    caixa: {
        marginBottom: 16,
    },

    label: {
        fontSize: 15,
        fontWeight: "500",
        marginBottom: 6,
        color: colors.titulo,
    },

    errorText: {
        color: "red",
        fontSize: 13,
        marginTop: 4,
    },


    //----------------------------------------------------
    //                  Resgisto Startup
    //----------------------------------------------------

    textArea: {
        height: 120,
        borderWidth: 1,
        padding: 10,
        borderRadius: 8,
        textAlignVertical: "top",
        borderColor: colors.borda,
        color: colors.text,
    },


    //----------------------------------------------------
    //                      Home
    //----------------------------------------------------

    headerHome: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        color: colors.text,
        justifyContent: "space-between",
    },

    tituloHome: {
        fontSize: 30,
        fontWeight: "bold",
        color: colors.titulo,
    },

    botaoHeader: {
        color: colors.titulo,
    },


    //----------------------------------------------------
    //                    StartupCard
    //----------------------------------------------------


    card: {
        paddingHorizontal: 10,
        paddingVertical: 25, 
        borderBottomWidth: 2, 
        borderColor: colors.borda,
        marginBottom: 15,
    },

    headerCard: {
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 10,
    },

    userCard: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    thumbnail: {
        width: "80%",
        height: 180,
        borderRadius: 20,
        alignSelf: "center",
        marginVertical: 10,
    },

    stars: {
        flexDirection: "row",
    },

    iconUserHome: {
        color: colors.titulo,
    },

    nomeCard: {
        fontSize: 15,
        fontWeight: "500",
        color: colors.titulo,
    },

    sobreCard: {
        fontSize: 15,
        fontWeight: "500",
        color: "#FFB100",
    },


    //----------------------------------------------------
    //                    Profile
    //----------------------------------------------------

    profile: {
        paddingTop: 60,
        gap:10,
    },


    // De preferencias deixa esses estilos aqui, eles são do ícone do perfil, do zoom da foto e das opções da foto
    // Mas pode alterar eles como quiser
    profileImage: {
        width: 130,
        height: 130,
        borderRadius: 65,
        borderWidth: 3,
        borderColor: "#fff",
        elevation: 4,
    },

    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "flex-end",
    },

    overlayBackground: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.3)",
    },

    zoomContainer: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.95)",
        justifyContent: "center",
        alignItems: "center",
    },

    zoomImage: {
        width: "100%",
        height: "80%",
    },

    closeText: {
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
    },

    profileCard: {

        borderBottomWidth: 2, 
        borderBottomColor: colors.borda, 
        paddingBottom: 15, 
        marginBottom: 15 
    },

    dadosCard: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingBottom: 15, 
        marginBottom: 15 
    },

    nomeCardProfile: {
        fontSize: 20,
        fontWeight: "500",
        color: colors.titulo,
    },

    buttonProfile: {
      marginBottom: 10,
      borderWidth: 2,
      borderColor: "#FFB100",
      padding: 12,
      borderRadius: 20,
      alignItems: "center",
      marginHorizontal: 15,
    },


    //----------------------------------------------------
    //                    Startup
    //----------------------------------------------------

    videoContainer: {
        width: "100%",
        borderBottomEndRadius: 20,
        borderBottomStartRadius: 20,
        overflow: "hidden", // importante para arredondar o player
        marginTop: 10,
    },

    dadosStartup: {
        color: "#5D5D5D", 
        fontSize: 15, 
        fontWeight: "bold",
    },

    startupCard: {
        borderBottomWidth: 2, 
        borderBottomColor: colors.borda, 
        paddingBottom: 15, 
        marginBottom: 15,
        marginTop: 50, 
        paddingHorizontal: 15, 
        gap:10,

    },

})