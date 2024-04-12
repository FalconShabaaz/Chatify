import React from 'react'
import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
// import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { Button } from "@chakra-ui/react";
import { ChatState } from '../Context/ChatProvider';
import { getSender } from '../config/ChatLogics';
import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";




const MyChats = ({fetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState();
  const {user,selectedChat,setSelectedChat,chats,setChats} = ChatState();
  const toast = useToast();
  const defaultProfilePic = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("http://localhost:3000/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);


  // console.log(chats)
  const setProfilePicToolTip = (chat) => {
    if(chat.chatName === "sender"){
      const name = chat.users[0]._id !== user._id && chat.users[0].name ? chat.users[0].name : chat.users[1].name;
      return name;
    }
    else
    return chat.chatName;
  };

const setProfileLatestMessagePicToolTip = (chat) =>{
const latest = chat.latestMessage;
if(latest){
  const message = chat.latestMessage.content;
  const sentBy = (chat.latestMessage.sender.name);
  return `${sentBy}: ${message}`;
}
else {
  if(chat.chatName === "sender"){
    const name = chat.users[0]._id !== user._id && chat.users[0].name ? chat.users[0].name : chat.users[1].name;
    return name;
  }
  else
  return chat.chatName;
}
};

  return (
    <Box
    display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
    flexDir="column"
    alignItems="center"
    p={3}
    backgroundColor="#128C7E"
    w={{ base: "100%", md: "31%" }}
    borderRadius="lg"
    borderWidth="1px"
  >
    <Box
      pb={3}
      px={3}
      fontSize={{ base: "20px", md: "28px" }}
      // fontFamily="Work sans"
      display="flex"
      w="100%"
      justifyContent="space-between"
      alignItems="center"
      color="white"
    >
      Chats
      <GroupChatModal>
        <Button
          display="flex"
          fontSize={{ base: "12px", md: "8px", lg: "14px" }}
          rightIcon={<AddIcon />}
        >
          New Group Chat
        </Button>
      </GroupChatModal>
    </Box>
    <Box
      display="flex"
      flexDir="column"
      p={3}
      bg="#075E54"
      w="100%"
      h="100%"
      borderRadius="lg"
      overflowY="hidden"
    >
      {chats ? (
        <Stack overflowY="scroll">
          {chats.map((chat) => (
            <Box
              onClick={() => setSelectedChat(chat)}
              cursor="pointer"
              bg={selectedChat === chat ? "#25D366" : "#E8E8E8"}
              color={selectedChat === chat ? "white" : "black"}
              px={3}
              py={2}
              borderRadius="lg"
              key={chat._id}
              display="flex"
            >
              {/* {console.log(chat)} */}
            <Tooltip label={setProfilePicToolTip(chat)} hasArrow placement="bottom-end">
            <Avatar
            size="md"
            cursor="pointer"
            src={(chat.users[0]._id === user._id && chat.users[1].pic ) ||
              (chat.users[1]._id === user._id && chat.users[0].pic )||(defaultProfilePic)
            }
            />
            </Tooltip>
            <Tooltip label={setProfileLatestMessagePicToolTip(chat)} hasArrow placement="bottom-end">
            <Box paddingLeft={3} backgroundColor="red"> 
              <Text>
                <b>{!chat.isGroupChat
                  ? getSender(loggedUser, chat.users)
                  : chat.chatName}</b>
              </Text>
              {chat.latestMessage && (
                <Text fontSize="xs" paddingTop="1px">
                  <b>{chat.latestMessage.sender.name}: </b>
                  {chat.latestMessage.content.length > 50
                    ? chat.latestMessage.content.substring(0, 51) + "..."
                    : chat.latestMessage.content}
                </Text>
              )}
              </Box>
            </Tooltip>
            </Box>
          ))}
        </Stack>
      ) : (
        <ChatLoading />
      )}
    </Box>
  </Box>
  )
}

export default MyChats
