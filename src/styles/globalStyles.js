import { StyleSheet } from "react-native";

export const createGlobalStyles = (colors) =>
  StyleSheet.create({

    //----------------------------------------------------
    //                      FORMS
    //----------------------------------------------------

    forms: {
        marginHorizontal: 20,
        paddingTop: 60,
        gap:60,
    },



    titulo: {
        color: colors.titulo,
        fontSize: 36,
        fontWeight: "bold",
    },


    input: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 8,
        borderColor: colors.borda,
    },

    passwordContainer: {
        borderWidth: 1,
        borderRadius: 8,
        borderColor: colors.borda,
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
    },

});