//expo/react imports
import React from "react";
import { ActivityIndicator, StatusBar, View } from "react-native";
import { Font } from "expo";
import { Ionicons } from "@expo/vector-icons";
//custom import
import { getToken, getUser, setUser } from "../../scripts/storageService";
import DeploymentDatabaseAPI from "../../scripts/DeploymentDatabaseAPI";
import routes from "../../routes";
const jwtDecode = require("jwt-decode");

class AuthLoadingScreen extends React.Component {
  async componentDidMount() {
    const validSession = await this.restoreSession();

    //native-base fonts
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      ...Ionicons.font
    });
    // Go to app if session is valid, otherwise go to auth
    this.props.navigation.navigate(
      validSession ? routes.USER_CONFIRMATION_SCREEN : routes.SIGN_IN_SCREEN
    );
  }

  async restoreSession() {
    let sessionValid = false;
    //Load last used token from storage
    const userToken = await getToken();
    //console.log(userToken);
    if (userToken) {
      sessionValid = true;
      //Check if token has expired
      var decoded = jwtDecode(userToken);
      let currentTimestamp = parseInt(`${Date.now()}`.substr(0, 10)); //Get current timestamp with precision of 10 digits
      if (currentTimestamp > decoded.exp) {
        //If the timestamp has expired
        sessionValid = false;
      } else {
        //If the timestamp has not expired
        try {
          DeploymentDatabaseAPI.UseAuthToken(userToken);
          //Load details of last user from storage
          getUser().then(userDetails => {
            if (userDetails) {
              //console.debug("successfully got user details");
              //Try get latest details of the user from API using the token
              DeploymentDatabaseAPI.GetUserByName(userDetails.UserName).then(
                latestUserDetails => {
                  //Store user in storage
                  console.debug(latestUserDetails);
                  setUser(latestUserDetails);
                }
              );
            }
          });
        } catch (e) {
          //If the user has proceeded to the next screen, but the token is found to be invalid - return them to login.
          this.props.navigation.navigate(routes.SIGN_IN_SCREEN);
        }
      }
    }
    return sessionValid;
  }

  // Render any loading content that you like here
  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

export default AuthLoadingScreen;
