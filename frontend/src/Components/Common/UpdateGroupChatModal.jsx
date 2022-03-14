import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import UserListItem from "../User/UserListItem";
import { ChatState } from "./../../Context/ChatProvider";
import UserBadgeList from "./../User/UserBadgeList";

function UpdateGroupChatModal({
  fetchMessages,
  fetchAgain,
  setFetchAgain,
  children,
}) {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState(selectedChat.chatName);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState(selectedChat.users);
  const toast = useToast();

  const handleRemoveFromGroup = async (userToRemove) => {
    if (!selectedUsers.includes(userToRemove)) {
      toast({
        title: "User Already Removed",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    const newSelectedUsers = selectedUsers.filter(
      (user) => user._id !== userToRemove._id
    );

    setSelectedUsers(newSelectedUsers);

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };

    const body = {
      userId: userToRemove._id,
      chatId: selectedChat._id,
    };

    const { data } = await axios.put("/api/chat/removefromgroup", body, config);

    toast({
      title: "User Removed",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "top",
    });
  };

  const handleRenameGroup = async () => {
    if (!groupChatName) {
      toast({
        title: "Fill the field",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    const config = {
      headers: {
        "Content-type": "application/json",
        authorization: `Bearer ${user.token}`,
      },
    };

    const body = {
      chatId: selectedChat._id,
      chatName: groupChatName,
    };

    const { data } = await axios.put("/api/chat/renamegroupchat", body, config);

    setSelectedChat(data);
  };

  const handleSearch = async (searchKeyword) => {
    setSearch(searchKeyword);

    if (!searchKeyword) return;

    setLoading(true);

    const config = {
      headers: {
        "Content-type": "application/json",
        authorization: `Bearer ${user.token}`,
      },
    };

    const { data } = await axios.get(
      `/api/user/?search=${searchKeyword}`,
      config
    );

    setSearchResults(data);

    setLoading(false);
  };

  const handleAddToGroup = async (userToAdd) => {
    console.log(userToAdd);

    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User Already Added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);

    const config = {
      headers: {
        "Content-type": "application/json",
        authorization: `Bearer ${user.token}`,
      },
    };

    const body = {
      userId: userToAdd._id,
      chatId: selectedChat._id,
    };

    const { data } = await axios.put("/api/chat/addtogroup", body, config);

    setSelectedChat(data);

    toast({
      title: "User added",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "top",
    });
  };

  const handleSubmit = () => {};

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody d="flex" flexDir="column" alignItems="center">
            <Box w="100%" d="flex" flexWrap="wrap">
              {selectedUsers.map((user) => (
                <UserBadgeList
                  key={user._id}
                  user={user}
                  handleFunction={() => handleRemoveFromGroup(user)}
                />
              ))}
            </Box>
            <FormControl d="flex" m={1}>
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button onClick={handleRenameGroup}>Rename</Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: John, Piyush, Jane"
                mb={1}
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              // <ChatLoading />
              <div>Loading...</div>
            ) : (
              searchResults
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddToGroup(user)}
                  />
                ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleSubmit} colorScheme="blue">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default UpdateGroupChatModal;
