import React from "react";
import { View, Text, StyleSheet } from "react-native";
//custom
import NiceButton from "../../components/NiceButton";
import WhiteButton from "../../components/WhiteButton";
import Loading from "../../components/Loading";
import {
  getUser,
  removeToken,
  removeUserJSON
} from "../../scripts/storageService";
import routes from "../../routes";

class UserConfirmationScreen extends React.Component {
  static navigationOptions = {
    title: "Confirm user"
  };
  state = {
    user: null
  };

  async componentDidMount() {
    const user = await getUser();
    this.setState({
      user
    });
  }

  async _signOutAsync() {
    await removeToken();
    await removeUserJSON();
    this.props.navigation.navigate(routes.SIGN_IN_SCREEN);
  }

  render() {
    const { user } = this.state;
    const { navigation } = this.props;
    return (
      <View style={{ margin: 20 }}>
        {user ? (
          <>
            <Text style={styles.text}>You are logged in as </Text>
            <Text style={[styles.text, { fontWeight: "bold" }]}>
              {user.UserName}
            </Text>
            <Text style={styles.text}>Is this correct?</Text>
            <NiceButton
              title="Yes, that's me."
              onPress={() => navigation.navigate(routes.HOME_SCREEN)}
            />
            <WhiteButton
              title="No, sign out"
              onPress={() => this._signOutAsync()}
            />
          </>
        ) : (
          <Loading />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: { marginBottom: 15, fontSize: 20, textAlign: "center" }
});

export default UserConfirmationScreen;
