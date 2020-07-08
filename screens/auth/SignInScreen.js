//react/expo imports
import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
//custom imports
import DeploymentDatabaseAPI from "../../scripts/DeploymentDatabaseAPI";
import { setToken, setUser } from "../../scripts/storageService";
import styles from "../../styles/fields";
import Skeleton from "../../components/Skeleton";

class SignInScreen extends React.Component {
  static navigationOptions = {
    title: "Sign In",
    headerLeft: null
  };

  constructor(props) {
    super(props);
    this.state = {
      statusMessage: "",
      username: "",
      password: "",
      submitDisabled: false
    };
  }

  signInAsync = async () => {
    const { username, password } = this.state;
    if (username.length > 1 && password.length > 1) {
      this.setState({
        submitDisabled: true,
        statusMessage: "Authenticating..."
      });
      try {
        const details = {
          username,
          password
        };
        //Get token using username and password
        const token = await DeploymentDatabaseAPI.GetAuthToken(details);
        console.log("token", token);
        const user = await DeploymentDatabaseAPI.GetUserByName(username);
        console.log("user", user);
        //Store token in storage
        await setToken(token);
        //Store user in storage
        await setUser(user);
        this.props.navigation.navigate("App");
      } catch (e) {
        let message = "";
        if (e.name == "Permission Error") {
          message = "Invalid username or password.";
        } else {
          message = e.message.length > 0 ? e.name + ": " + e.message : e.name;
        }
        this.setState({
          statusMessage: message,
          submitDisabled: false
        });
      }
    }
  };

  render() {
    const { statusMessage, submitDisabled } = this.state;
    return (
      <Skeleton submitDisabled={submitDisabled} handleSubmit={this.signInAsync}>
        <Text style={styles.errorText}>{statusMessage}</Text>
        <Text>Username</Text>
        <TextInput
          testID="username"
          style={styles.textInput}
          autoCapitalize={"none"}
          onChangeText={username => this.setState({ username })}
        />
        <Text>Password</Text>
        <TextInput
          testID="password"
          style={styles.textInput}
          secureTextEntry={true}
          onChangeText={password => this.setState({ password })}
        />
      </Skeleton>
    );
  }
}

export default SignInScreen;
