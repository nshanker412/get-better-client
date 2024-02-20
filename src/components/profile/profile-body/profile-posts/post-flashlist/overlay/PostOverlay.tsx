import { ConnectedProfileAvatar } from "@components/profile-avatar/ConnectedProfileAvatar";
import { Ionicons } from "@expo/vector-icons";
import { PostMetadata } from "@models/posts";
import React, { useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { throttle } from "throttle-debounce";
import { setPostLiked } from "../service/post";


interface PostOverlayProps {
    user: string;
    postData: PostMetadata;
    myUsername: string;
    }

/**
 * Function that renders a component meant to be overlapped on
 * top of the post with the post info like user's display name and avatar
 * and the post's description
 *
 * @param {Object} user that created the post
 * @param {Object} post object
 */
export const PostOverlay: React.FC<PostOverlayProps> = ({ user, postData, myUsername }) => {
  const [currentLikeState, setCurrentLikeState] = useState({
    state: false,
    counter: postData.likes.length,
  });


  /**
   * Handles the like button action.
   *
   * In order to make the action more snappy the like action
   * is optimistic, meaning we don't wait for a response from the
   * server and always assume the write/delete action is successful
   */
  const handleUpdateLike = useMemo(
    () =>
          throttle(500, true, (currentLikeStateInst) => {
              setCurrentLikeState({
                  state: !currentLikeStateInst.state,
                  counter:
                      currentLikeStateInst.counter +
                      (currentLikeStateInst.state ? -1 : 1),
              });
              setPostLiked(`${postData.timestamp}`, myUsername, currentLikeStateInst.state);
      }),
    []
  );

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.displayName}>{user}</Text>
        <Text style={styles.description}>{postData.caption}</Text>
      </View>

      <View style={styles.leftContainer}>
        <ConnectedProfileAvatar
          key={`${user}-avatar`}
                username={user}
                size={50}
            />

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleUpdateLike(currentLikeState)}
        >
          <Ionicons
            color="white"
            size={40}
            name={currentLikeState.state ? "heart" : "heart-outline"}
          />
          <Text style={styles.actionButtonText}>
            {currentLikeState.counter}
          </Text>
        </TouchableOpacity>


        <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => { console.log('commentOpen') }}
        >
          <Ionicons
            color="white"
            size={40}
            name={"chatbubble"}
          />
          <Text style={styles.actionButtonText}>
            {postData?.comments?.length ?? 0}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

import { Dimensions, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        position: 'absolute',
        zIndex: 999,
        bottom: 0,
        paddingLeft: 20,
        paddingBottom: 80,
        paddingRight: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },
    displayName: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    },
    description: {
        marginTop: 10,
        color: 'white',
    },
    avatar: {
        height: 50,
        width: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: 'white',
        marginBottom: 30
    },
    leftContainer: {
        alignItems: 'center'
    },
    actionButton: {
        paddingBottom: 16
    },
    actionButtonText: {
        color: 'white',
        textAlign: 'center',
        marginTop: 4
    }
})

