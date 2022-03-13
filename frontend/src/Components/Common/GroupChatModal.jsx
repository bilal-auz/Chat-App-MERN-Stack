import {
  Button,
  FormControl,
  FormLabel,
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
  Box,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChatState } from "./../../Context/ChatProvider";
import UserListItem from "../User/UserListItem";
import UserBadgeList from "../User/UserBadgeList";

function GroupChatModal({ children }) {
  const { user, chats, setChats } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSearch = async (inputKeyword) => {
    console.log("inputKeyword", inputKeyword);
    setSearch(inputKeyword);

    if (!inputKeyword) return;

    try {
      setLoading(true);

      console.log("search", search);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data: searchResults } = await axios.get(
        `/api/user/?search=${search}`,
        config
      );

      console.log(searchResults);
      setSearchResults(searchResults);
      setLoading(false);
    } catch (error) {
      toast({
        title: "error occured",
        description: "Failed To load search",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  const handleAddToGroup = (userToAdd) => {
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
  };

  const handleDeleteSelectedUser = (userToDelete) => {
    if (!selectedUsers.includes(userToDelete)) {
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
      (user) => user._id !== userToDelete._id
    );

    setSelectedUsers([...newSelectedUsers]);
  };
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Fill the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${user.token}`,
        },
      };

      const body = {
        chatName: groupChatName,
        users: JSON.stringify(selectedUsers.map((user) => user._id)),
      };

      const { data } = await axios.post(
        "/api/chat/creategroupchat",
        body,
        config
      );

      toast({
        title: "Group Created Successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      setChats([data, ...chats]);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occurred",
        description: error.response.data.message,
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  };

  useEffect(() => {}, [search]);
  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily={"Work sans"}
            d="flex"
            justifyContent={"center"}
          >
            Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody d="flex" flexDir={"column"} alignItems="center">
            <FormControl>
              <FormLabel>Group Chat name</FormLabel>
              <Input
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
                placeholder="Enter Group Chat Name"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Search for users</FormLabel>

              <Input
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Add users"
              />
            </FormControl>
            <Box w="full" d="flex" flexWrap="wrap">
              {selectedUsers.map((user) => (
                <UserBadgeList
                  key={user._id}
                  user={user}
                  handleFunction={() => handleDeleteSelectedUser(user)}
                />
              ))}
            </Box>
            {loading ? (
              <div>Loading</div>
            ) : (
              searchResults
                .slice(0, 3)
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
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default GroupChatModal;
