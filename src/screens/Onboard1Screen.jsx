import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View } from "react-native";

// Components
import ButtonPrimary from "../components/ButtonPrimary";
import ProgressBar from "../components/ProgressBar";
import ViewContainer from "../components/ViewContainer";

// Elements
import Title from "../elements/Title";
import Paragraph from "../elements/Paragraph";
import Toasting from "../elements/svgs/Toasting";

function Onboard1Screen({ navigation }) {
  return (
    <ViewContainer>
      <View style={styles.top}>
        <Toasting />
        <Title style={styles.title}>Welcome</Title>
        <Paragraph>
          We remember names by associating people with descriptions and a group.
          For our first step, we will create a group.
        </Paragraph>
      </View>
      <View style={styles.bottom}>
        <ProgressBar progress={0} />
        <ButtonPrimary
          onPress={() =>
            navigation.navigate("Onboarding", { screen: "Onboard2" })
          }
        >
          Create a Group
        </ButtonPrimary>
      </View>
    </ViewContainer>
  );
}

export default Onboard1Screen;

const styles = StyleSheet.create({
  top: {
    alignItems: "center",
    justifyContent: "center",
    flex: 2,
  },
  bottom: {
    justifyContent: "flex-end",
    flex: 1,
  },
  title: {
    marginBottom: 20,
  },
});
