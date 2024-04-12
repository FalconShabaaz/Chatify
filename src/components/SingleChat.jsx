import { ChatState } from "../Context/ChatProvider";
import { FormControl } from "@chakra-ui/form-control";
import { useRef } from "react";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import "./styles.css";
import { IconButton, Spinner, useToast, Button } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
// import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import { Avatar } from "@chakra-ui/avatar";
import { IoSend } from "react-icons/io5";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import io from "socket.io-client";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal ";
const ENDPOINT = "http://localhost:4000";
var socket, selectedChatCompare;
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [isPickerVisible, setPickerVisible] = useState(false);
  const inputRef = useRef(null);

  const toast = useToast();
  const defaultProfilePic =
    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

  const handleEmojiSelect = (emoji) => {
    setNewMessage((prevMessage) => prevMessage + emoji.native);
    setPickerVisible(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `http://localhost:3000/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "http://localhost:3000/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const sendButton = async () => {
    socket.emit("stop typing", selectedChat._id);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      setNewMessage("");
      const { data } = await axios.post(
        "http://localhost:3000/api/message",
        {
          content: newMessage,
          chatId: selectedChat._id,
        },
        config
      );
      socket.emit("new message", data);
      setMessages([...messages, data]);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to send the Message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const handleProfileClick = () => {
    console.log("hello profile")
  }

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "20px", md: "25px" }}
            pb={3}
            px={2}
            w="100%"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
            color="white"
          >
            {/* <Avatar
              size="sm"
              cursor="pointer"
              src={
                selectedChat.users[0]._id !== user._id &&
                selectedChat.users[0].pic
                  ? selectedChat.users[0].pic
                  : defaultProfilePic
              }
            /> */}
            <Avatar
              size="sm"
              cursor="pointer"
              onClick={handleProfileClick}
              src={
                (selectedChat.users[0]._id === user._id &&
                selectedChat.users[1].pic) || (
                    selectedChat.users[1]._id === user._id &&
                   selectedChat.users[0].pic
                  )||(defaultProfilePic)
              }
            />
{/* { console.log("Avatar source:", selectedChat.users[1]._id, "UserID",user._id, "seledt 0",selectedChat.users[0].pic)} */}
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
            className="chatBoxBackgroundImage"
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
            <Box display={isPickerVisible ? "block" : "none"}>
              <Picker
                data={data}
                previewPosition="none"
                onEmojiSelect={handleEmojiSelect}
              />
            </Box>
            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
              display={"flex"}
            >
              {istyping ? (
                <div>
                  {/* <Lottie
                    options={defaultOptions}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  /> */}
                </div>
              ) : (
                <></>
              )}
              <Button
                fontSize="25px"
                backgroundColor="#25D366"
                borderEndRadius="none"
                onClick={() => setPickerVisible(!isPickerVisible)}
              >
                <MdOutlineEmojiEmotions />
              </Button>
              <Input
                ref={inputRef}
                className="MessageInput"
                variant="filled"
                bg="white"
                placeholder="Message"
                value={newMessage}
                onChange={typingHandler}
                borderRadius="none"
                _focus={{ bg: "white" }}
                autoComplete="off"
              />
              <Button
                backgroundColor="#25D366"
                borderStartRadius="0"
                onClick={sendButton}
                fontSize="25px"
              >
                <IoSend />
              </Button>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} color="white">
            Start Chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
