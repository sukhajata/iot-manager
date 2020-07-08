import React from "react";
import { View, Text, TextInput } from "react-native";

import routes from "../../routes";
import Skeleton from "../../components/Skeleton";
import styles from "../../styles/fields";

import { InstallationDeployment, DeviceInfo} from "../../scripts/DeploymentData";
import DeploymentDatabaseAPI from "../../scripts/DeploymentDatabaseAPI";

class CommentsScreen extends React.Component {
  static navigationOptions = {
    title: "Installation type"
  };
  state = {
    errorMessage: null
  };

  _handleSubmit() {
    let newNote = {deviceFK:DeviceInfo.Id}
    DeploymentDatabaseAPI.CreateNote()
  }

  render() {
    const { errorMessage } = this.state;

    return (
      <Skeleton handleSubmit={() => this._handleSubmit()}>
        <Text>Comments</Text>
        <TextInput style={styles.textInput} />
      </Skeleton>
    );
  }
}

export default CommentsScreen;
