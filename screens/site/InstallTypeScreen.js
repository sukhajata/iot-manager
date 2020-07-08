import React from "react";
import { Text } from "react-native";

import routes from "../../routes";
import { getInstallationTypes } from "../../scripts/deviceSummaryService";
import Skeleton from "../../components/Skeleton";
import RadioGroup from "../../components/RadioGroup";
import styles from "../../styles/fields";
import { Site } from "../../scripts/DeploymentData";

class InstallTypeScreen extends React.Component {
  static navigationOptions = {
    title: "Type of Install"
  };
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: null,
      installationType: 0
    };
  }

  _onChange = value => {
    this.setState({
      installationType: value,
      errorMessage: null
    });
  };

  async _handleSubmit() {
    const { installationType } = this.state;
    if (installationType > 0) {
      Site.InstallType = installationType;

      this.props.navigation.navigate(routes.SITE_DETAILS_SCREEN);
    } else {
      this.setState({ errorMessage: "Please select a type " });
    }
  }

  render() {
    const installationTypes = getInstallationTypes();
    const { errorMessage, installationType } = this.state;

    return (
      <Skeleton handleSubmit={() => this._handleSubmit()}>
        <RadioGroup
          options={installationTypes}
          onValueChange={this._onChange}
          selected={installationType}
        />
        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
      </Skeleton>
    );
  }
}

export default InstallTypeScreen;
