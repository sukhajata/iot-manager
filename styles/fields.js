import { StyleSheet } from "react-native";

export const colors = {
  purple: "#781FA2",
  amber: "#FFC107",
  black: "#212121",
  indigo: "#303F9F",
  blue: "#536DFE",
  green: "#4CAF50",
  lightOrange: "orange",
  red: "#FF0000",
  white: "#FFFFFF",
  gray: "#939393",
  lightGray: "#D3D3D3",
  paleYellow: "#FFF9C4",
  lime: "#CDDC39"
};

const buttonBase = {
  padding: 15,
  marginBottom: 10,
  borderRadius: 5
};

const buttonTextBase = {
  textAlign: "center",
  fontWeight: "bold"
};

const textInputBase = {
  width: "100%",
  padding: 10,
  //height: 40,
  borderWidth: 1,
  marginTop: 5
};

export default StyleSheet.create({
  textInput: {
    ...textInputBase,
    borderColor: colors.gray,
    marginBottom: 15
  },
  searchInput: {
    padding: 10,
    borderColor: colors.gray,
    borderWidth: 1,
    marginLeft: 5,
    flex: 2
  },
  validatedTextInput: {
    ...textInputBase,
    borderColor: colors.gray
  },
  errorTextInput: {
    ...textInputBase,
    borderColor: colors.red
  },
  navigationButton: {
    ...buttonBase,
    backgroundColor: colors.indigo
  },
  whiteButton: {
    ...buttonBase
  },
  buttonDisabled: {
    ...buttonBase,
    backgroundColor: colors.lightGray
  },
  buttonText: {
    ...buttonTextBase,
    color: colors.white
  },
  buttonTextClear: {
    ...buttonTextBase,
    color: colors.indigo
  },
  errorText: {
    width: 300,
    color: colors.red,
    marginTop: 5,
    marginBottom: 15
  },
  pickerContainer: {
    borderColor: colors.gray,
    borderWidth: 1
  },
  checkBoxLabel: {
    paddingLeft: 15
  },
  map: {
    width: "100%",
    height: 300,
    marginTop: 15,
    marginBottom: 15
  },
  enclosure: {
    backgroundColor: colors.lime,
    padding: 10,
    marginBottom: 10,
    marginRight: 10,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "black",
    shadowOpacity: 1
  },
  addDeviceToEnclosure: {
    backgroundColor: colors.paleYellow,
    flex: 1,
    marginBottom: 5,
    marginRight: 10,
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: colors.gray,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  removeEnclosure: {
    backgroundColor: colors.lime,
    flex: 1,
    marginBottom: 5,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  addDeviceToSite: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: colors.paleYellow,
    padding: 5,
    flex: 1,
    marginBottom: 10,
    marginRight: 10,
    borderWidth: 2,
    borderColor: colors.black,
    borderStyle: "dashed"
  },
  addEnclosure: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: colors.lime,
    padding: 5,
    flex: 1,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: colors.black,
    borderStyle: "dashed"
  }
});
