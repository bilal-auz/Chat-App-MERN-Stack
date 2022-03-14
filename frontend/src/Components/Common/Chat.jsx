import {
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  Box,
  Button,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import ProfileModel from "./ProfileModel";
import { ChatState } from "./../../Context/ChatProvider";
import { getSenderName, getSenderProfile } from "../../config/chatLogics";
import UpdateGroupChatModal from "./UpdateGroupChatModal";

function Chat({ fetchMessages, fetchAgain, setFetchAgain }) {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const { loading, setLoading } = useState(false);
  //   const { messages, setMessages } = useState();

  //   {console.log("ssss")}

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <Button
              d={{ base: "flex", md: "none" }}
              //   icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            >
              Back
            </Button>

            {true &&
              (!selectedChat.isGroupChat ? (
                <>
                  {getSenderName(user, selectedChat.users)}
                  <ProfileModel
                    user={getSenderProfile(user, selectedChat.users)}
                  >
                    <button>&#128065;</button>
                  </ProfileModel>
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  >
                    <button>&#128065;</button>
                  </UpdateGroupChatModal>
                </>
              ))}
          </Text>
          {/* <Box
            d="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    // height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box> */}
        </>
      ) : (
        // to get socket.io on same page
        <Box d="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
}

export default Chat;
