import firebase from "firebase";
import "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Button, FlatList, Text, TextInput, View } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchUsersData } from "../../redux/actions/index";
require("firebase/firestore");

function Comment(props) {
  const [comments, setComments] = useState([]);
  const [postId, setPostId] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    function matchUserToComment(comments) {
      for (let i = 0; i < comments.length; i++) {
        // if the comment has the user attribute already
        if (comments[i].hasOwnProperty("user")) {
          continue;
        }

        const user = props.users.find((x) => x.uid === comments[i].creator);

        if (user == undefined) {
          // dont fetch the comments of the uid that dooesnt match
          props.fetchUsersData(comments[i].creator, false);
        } else {
          comments[i].user = user;
        }
      }

      setComments(comments);
    }

    if (props.route.params.postId !== postId) {
      firebase
        .firestore()
        .collection("posts")
        .doc(props.route.params.uid)
        .collection("userPosts")
        .doc(props.route.params.postId)
        .collection("comments")
        .get()
        .then((snapshot) => {
          let comments = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;

            return { id, ...data };
          });
          matchUserToComment(comments);
        });
      setPostId(props.route.params.postId);
    } else {
      matchUserToComment(comments);
    }
  }, [props.route.params.postId, props.users]);

  const onCommentSend = () => {
    firebase
      .firestore()
      .collection("posts")
      .doc(props.route.params.uid)
      .collection("userPosts")
      .doc(props.route.params.postId)
      .collection("comments")
      .add({
        creator: firebase.auth().currentUser.uid,
        text,
      });
  };

  return (
    <View style={{ flex: 1, paddingTop: 5 }}>
      <View style={{ flex: 1, paddingLeft: 15 }}>
        <FlatList
          numColumns={1}
          horizontal={false}
          data={comments}
          renderItem={({ item }) => (
            <View style={{ flexDirection: "row" }}>
              {item.user !== undefined ? (
                <View>
                  <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                    {item.user.name}{" "}
                  </Text>
                </View>
              ) : null}
              <Text style={{ fontSize: 15 }}>{item.text}</Text>
            </View>
          )}
        />
      </View>

      <View style={{ alignSelf: "stretch" }}>
        <TextInput
          placeholder="comment..."
          onChangeText={(text) => setText(text)}
        />
        <Button onPress={() => onCommentSend()} title="comment" />
      </View>
    </View>
  );
}

const mapStateToProps = (store) => ({
  users: store.usersState.users,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators({ fetchUsersData }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Comment);
