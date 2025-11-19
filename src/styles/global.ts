import { StyleSheet } from "react-native";
import { themeColors } from "../context/ThemeContext";


export const globalStyles = StyleSheet.create({

    //----------------------------------------------------
    //                      FORMS
    //----------------------------------------------------

    pagina: {
        backgroundColor: themeColors.dark.background,
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
        color: themeColors.dark.titulo,
    },

    formCorpo: {
        gap: 5,
    },

    input: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 8,
        borderColor: themeColors.dark.borda,
        color: themeColors.dark.text,
    },

    passwordContainer: {
        borderWidth: 1,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        borderColor: themeColors.dark.borda,
        color: themeColors.dark.text,
    },

    textoSenha: {
        flex:1,
        color: themeColors.dark.text,
    },

    olho: {
        color: themeColors.dark.text,
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
        color: themeColors.dark.titulo,
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
        color: themeColors.dark.text,
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
        color: themeColors.dark.titulo,
    },
    errorText: {
        color: "red",
        fontSize: 13,
        marginTop: 4,
    },



})