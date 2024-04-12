import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Chats from "./components/Chats";
import ChatProvider from "./Context/ChatProvider";
import { Box, Text } from "@chakra-ui/layout";
function App() {
  return (
    <>
      <Router>
        <ChatProvider>
          <Box className="HomeBgImg">
            <Routes>
              <Route exact path="/" Component={Home} />
              <Route exact path="/chats" Component={Chats} />
            </Routes>
          </Box>
        </ChatProvider>
      </Router>
    </>
  );
}

export default App;
