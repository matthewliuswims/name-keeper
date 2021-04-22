import * as React from "react";
import { Text, Button } from "react-native-paper";
import { View } from "react-native";
import { useSelector } from "react-redux";
import ModalRNM from "react-native-modal";
import Title from "../../elements/Title";

const Modal = () => {
  const modal = useSelector((state) => state.modalState.modal);

  // destructuring of undefined - https://stackoverflow.com/a/48433029
  const { props = {}, type, actionCB, declineCB } = { ...modal };
  console.log("props is", props);
  const containerStyle = { backgroundColor: "white", padding: 20 };
  if (!modal) {
    return null;
  }
  const showModal = !!modal;

  let content = null;
  if (type === "warning") {
    content = (
      <View style={{ justifyContent: "space-between" }}>
        <View>
          <Title style={{ margin: 0, marginBottom: 10 }}>
            Something went wrong
          </Title>
          <Text>{props.text}</Text>
        </View>
        <View style={{ alignSelf: "flex-end", marginTop: 50 }}>
          <Button onPress={actionCB}>OK</Button>
        </View>
      </View>
    );
  }

  return (
    <ModalRNM
      isVisible={showModal}
      onBackdropPress={() => {
        console.log("modal will hide");
        declineCB();
      }}
      style={{ justifyContent: "center", alignItems: "center" }}
    >
      <View
        style={{
          backgroundColor: "white",
          alignSelf: "center",
          borderRadius: 4,
          padding: 20,
        }}
      >
        {content}
      </View>
    </ModalRNM>
  );
};

export default Modal;
