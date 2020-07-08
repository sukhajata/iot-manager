import React from "react";
import { View, Text, ScrollView } from "react-native";
//custom components
import NiceButton from "../../components/NiceButton";
import SiteCard from "../../components/SiteCard";
import Loading from "../../components/Loading";
//custom scripts
import routes from "../../routes";
import { getUser } from "../../scripts/storageService";
import DeploymentDatabaseAPI from "../../scripts/DeploymentDatabaseAPI";
import styles from "../../styles/fields";
import { withCurrentSite } from "../../context/CurrentSiteContext";
import { TextInput } from "react-native-gesture-handler";

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSite: null,
      recentSites: [],
      filteredSites: [],
      errorMessage: null,
      modalVisible: false,
      filterText: "",
      loading: false,
      addressesLoading: false,
      typingTimeout: 0
    };
  }

  async componentDidMount() {
    try {
      const user = await getUser();
      if (user) {
        this.setState({
          loading: true,
          addressesLoading: true
        });
        //load data
        const recentSites = await DeploymentDatabaseAPI.GetSites();
        if (recentSites && recentSites[0]) {
          this.setState({
            recentSites,
            filteredSites: recentSites,
            loading: false
          });
          //get addresses
          this.mounted = true;
          this.count = 0;
          this.asyncForEach(recentSites, async site => {
            const fullSite = await DeploymentDatabaseAPI.GetSite(site.Id);
            const updatedSites = this.state.recentSites.map(item => {
              if (item.Id === site.Id) {
                return fullSite;
              }
              return item;
            });
            if (this.mounted) {
              this.count++;
              if (this.count === recentSites.length) {
                this.setState({
                  addressesLoading: false,
                  recentSites: updatedSites,
                  filteredSites: updatedSites
                });
              } else {
                this.setState({
                  recentSites: updatedSites,
                  filteredSites: updatedSites
                });
              }
            }
          });
        } else {
          this.setState({
            loading: false
          });
        }
      }
    } catch (error) {
      console.log(error);
      this.setState({
        errorMessage: error.message ? error.message : JSON.stringify(error)
      });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  _testDevice() {
    this.setState({ modalVisible: false });
    this.props.navigation.navigate(routes.DEVICE_TEST_SCREEN);
  }

  _addNewSite() {
    this.props.navigation.navigate(routes.INSTALL_TYPE_SCREEN);
  }

  _selectSite = async site => {
    this.setState({ loading: true });
    await this.props.siteContext.loadSite(site.Id);
    this.setState({ loading: false });
    this.props.navigation.navigate(routes.INSTALL_HOME_SCREEN, {
      siteId: site.Id
    });
  };

  _onFilterChanged = text => {
    const { typingTimeout } = this.state;
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    this.setState({
      typingTimeout: setTimeout(() => this._updateSiteList(), 500),
      filterText: text
    });
  };

  _updateSiteList = () => {
    const filterText = this.state.filterText.toLowerCase();
    let filteredSites = [];
    this.state.recentSites.forEach(site => {
      let match = false;

      if (site.Enclosures && site.Enclosures.length > 0) {
        site.Enclosures.forEach(enclosure => {
          if (
            enclosure.DetailsOfInstalls &&
            enclosure.DetailsOfInstalls.length > 0
          ) {
            enclosure.DetailsOfInstalls.forEach(detail => {
              if (
                detail.MeteredPremiseLocation &&
                detail.MeteredPremiseLocation.AddressLine1.toLowerCase().indexOf(
                  filterText
                ) >= 0
              ) {
                match = true;
              }
            });
          }
        });
      }

      if (site.DetailsOfInstalls && site.DetailsOfInstalls.length > 0) {
        site.DetailsOfInstalls.forEach(detail => {
          if (
            detail.MeteredPremiseLocation &&
            detail.MeteredPremiseLocation.AddressLine1.toLowerCase().indexOf(
              filterText
            ) >= 0
          ) {
            match = true;
          }
        });
      }

      if (match) {
        filteredSites.push(site);
      }
    });

    this.setState({ filteredSites });
  };

  render() {
    const {
      filteredSites,
      errorMessage,
      loading,
      addressesLoading,
      filterText
    } = this.state;
    return (
      <ScrollView style={{ margin: 10 }}>
        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
        <View>
          {!addressesLoading && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start"
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  marginBottom: 5,
                  flex: 1,
                  textAlign: "center"
                }}
                value={filterText}
              >
                Filter address
              </Text>
              <TextInput
                style={styles.searchInput}
                onChangeText={text => this._onFilterChanged(text)}
              />
            </View>
          )}

          {loading && <Loading />}
          {filteredSites.map((site, i) => (
            <SiteCard
              key={i}
              siteInfo={site}
              onSelect={() => this._selectSite(site)}
            />
          ))}
        </View>
      </ScrollView>
    );
  }
}

const Wrapped = withCurrentSite(HomeScreen);
Wrapped.navigationOptions = ({ navigation }) => ({
  title: "Home"
});
export default Wrapped;
