import { StyleSheet } from "react-native";
import { themeColors } from "../context/ThemeContext";


export const globalStyles = StyleSheet.create({

    //----------------------------------------------------
    //                      FORMS
    //----------------------------------------------------

    forms: {
        marginHorizontal: 20,
        paddingTop: 60,

        // Importa assim meu mano
        backgroundColor: themeColors.dark.background,
        gap:60,
    },


    input: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 8,
    },

    passwordContainer: {
        borderWidth: 1,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
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
    }
})