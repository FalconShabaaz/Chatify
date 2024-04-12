import { Box, Flex } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import SideDrawer from "./miscellaneous/SideDrawer";
import MyChats from "./MyChats";
import ChatBox from "./ChatBox";
import { useState } from "react";

const Chats = () => {
   const {user} = ChatState();
   const [fetchAgain,setFetchAgain] = useState(false);

    return (
      <div style={{width:"100%",backgroundColor:"#128C7E"}}>
        { user && <SideDrawer/>}
        <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px" backgroundColor="#f8f3d4">
            { user && <MyChats fetchAgain={fetchAgain}/>}
            { user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
        </Box>
      </div>
    );
};

export default Chats;
