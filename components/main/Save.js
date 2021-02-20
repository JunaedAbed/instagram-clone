import firebase from "firebase";
import "firebase/firestore";
import React, { useState } from "react";
import { Button, Image, TextInput, View } from "react-native";
require("firebase/firestore");
require("firebase/firebase-storage");

export default function Save(props, { navigation }) {
  const [caption, setCaption] = useState("");

  const uploadImage = async () => {
    //store the picture link
    const uri = props.route.params.capturedImage;

    //fetch uri
    const res = await fetch(uri);

    //create blob of the uri
    const blob = await res.blob();

    //store in the database
    const task = firebase
      .storage()
      .ref()
      .child(
        `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`
      )
      .put(blob);

    const taksProgress = (snapshot) => {
      console.log(`transferred: ${snapshot.bytesTransferred}`);
    };

    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        //create post inside firestore
        savePostData(snapshot);

        console.log(snapshot);
      });
    };

    const taskError = (snapshot) => {
      console.log(snapshot);
    };

    task.on("state_changed", taksProgress, taskError, taskCompleted);
  };

  const savePostData = (downloadURL) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(firebase.auth().currentUser.uid)
      .collection("userPosts")
      .add({
        downloadURL,
        caption,
        creation: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(function () {
        //beginning route of navigator i.e mainScreen
        props.navigation.popToTop();
      });
  };

  return (
    <View style={{ flex: 1 }}>
      <Image source={{ uri: props.route.params.capturedImage }} />

      <TextInput
        placeholder="Write a caption . . ."
        onChangeText={(caption) => setCaption(caption)}
      />

      <Button title="Save" onPress={() => uploadImage()} />
    </View>
  );
}
