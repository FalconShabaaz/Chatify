import React from 'react'
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import { useState } from 'react';
import { Box, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { Tooltip } from "@chakra-ui/tooltip";
import { Spinner } from "@chakra-ui/spinner";
// import FontAwesomeIcon from "react-fontawesome";
import { debounce } from 'lodash';
import { Image } from '@chakra-ui/react';
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import { Avatar } from "@chakra-ui/avatar";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import { Input } from "@chakra-ui/input";
import {useDisclosure} from '@chakra-ui/hooks'
import UserListItem from '../userAvatar/UserListItem';
import{useNavigate} from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { getSender } from '../../config/ChatLogics';
import NotificationBadge from 'react-notification-badge';
import {Effect} from 'react-notification-badge';

const SideDrawer = () => {

  const navigate = useNavigate();
  
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const {user,setSelectedChat,chats,setChats, notification,setNotification} = ChatState();
 
  const { isOpen, onOpen, onClose } = useDisclosure();
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const toast = useToast();
  const handleSearch = async() =>{
    // if (!search) {
    if (!search>1) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
  }
  try {
    setLoading(true);

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    const { data } = await axios.get(`http://localhost:3000/api/user?search=${search}`, config);
    setLoading(false);
    setSearchResult(data);
  } catch (error) {
    toast({
      title: "Error Occured!",
      description: "Failed to Load the Search Results",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom-left",
    });
  }
};

const debouncedSearch = debounce(handleSearch, 500);

const accessChat = async (userId) => {
  // console.log(userId);

  try {
    setLoadingChat(true);
    const config = {
      headers: {
        "Content-type": "application/json",
         Authorization: `Bearer ${user.token}`,
      },
    };
    const { data } = await axios.post(`http://localhost:3000/api/chat`, { userId }, config);

    if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
    setSelectedChat(data);
    setLoadingChat(false);
    onClose();
  } catch (error) {
    toast({
      title: "Error fetching the chat",
      description: error.message,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom-left",
    });
  }
};
const imagePath = "";
  return (
   <>
    <Box
     display="flex"
     justifyContent="space-between"
     alignItems="center"
     backgroundColor="#25D366"
     w="100%"
     p="5px 10px 5px 10px"
     borderWidth="5px">
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px={4}>
              Search Your Buddies
            </Text>
          </Button>
        </Tooltip>
        {/* <Text fontSize="35px">
          Chatify
        </Text> */}
        <Image className='AppLogo' src='https://res.cloudinary.com/dkkjomqdl/image/upload/v1709914601/Black_logo_-_no_background_luiqfu.svg' 
        alt='Chatify' />
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.ROTATE_X}
              />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} backgroundColor="#25D366" rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
                backgroundColor="#25D366"
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
              <MenuItem>My Profile</MenuItem>{" "}
              </ProfileModal>
                <MenuDivider />
                <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent backgroundImage="radial-gradient(circle at 97% 32%, rgba(131, 131, 131,0.05) 0%, rgba(131, 131, 131,0.05) 50%,rgba(20, 20, 20,0.05) 50%, rgba(20, 20, 20,0.05) 100%),radial-gradient(circle at 61% 40%, rgba(35, 35, 35,0.05) 0%, rgba(35, 35, 35,0.05) 50%,rgba(239, 239, 239,0.05) 50%, rgba(239, 239, 239,0.05) 100%),radial-gradient(circle at 47% 73%, rgba(122, 122, 122,0.05) 0%, rgba(122, 122, 122,0.05) 50%,rgba(5, 5, 5,0.05) 50%, rgba(5, 5, 5,0.05) 100%),linear-gradient(90deg, rgb(0, 209, 117),rgb(205, 241, 44));">
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody >
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  debouncedSearch();
                }}
              />
              {/* <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" /> */}
              {/* <Button 
              onClick={handleSearch}
              >Go</Button> */}
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
   </>
  )
}

export default SideDrawer
