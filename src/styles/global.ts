import { StyleSheet } from "react-native";
import { themeColors } from "../context/ThemeContext";


export const globalStyles = StyleSheet.create({

    //----------------------------------------------------
    //                      FORMS
    //----------------------------------------------------

    pagina: {
        backgroundColor: themeColors.dark.background,
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

    input: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 8,
        borderColor: themeColors.dark.borda,
    },

    passwordContainer: {
        borderWidth: 1,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        borderColor: themeColors.dark.borda,
    },



    button: {
      backgroundColor: "#FFB100",
      padding: 12,
      borderRadius: 20,
      alignItems: "center",
    },

    outroButton: {
      borderWidth: 2,
      borderColor: "#FFB100",
      padding: 12,
      borderRadius: 20,
      alignItems: "center",
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
        fontSize: 15,
        fontWeight: "bold",
    },

    //----------------------------------------------------
    //                  Componete Field
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