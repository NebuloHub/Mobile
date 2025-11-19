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

})