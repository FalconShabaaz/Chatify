import React from "react";
import { useEffect } from "react";
import { Image } from '@chakra-ui/react'

import {
  Container,
  Box,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import Login from "./authentication/Login";
import SignUp from "./authentication/SignUp";
import { useNavigate } from "react-router-dom";


function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo){
      navigate("/chats");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);
  
  return (
    <Container maxW="xl" centerContent >
      <Box 
        boxShadow='dark-lg'
        display="flex"
        justifyContent="center"
        p={3}
        w="100%"
        marginTop="25px"
        marginBottom="5px"
        borderRadius="lg"
        borderWidth="1px"
        borderColor="black"
        // backgroundColor="#77dd77"
        backgroundColor="transparent"
        fontWeight="bold"
      >
        {/* <Text textAlign="center" fontSize="25px">
          Chatifiy
        </Text> */}
        <Image className='AppLogoHome' src='https://res.cloudinary.com/dkkjomqdl/image/upload/v1709914601/Black_logo_-_no_background_luiqfu.svg' 
        alt='Chatify' />
      </Box>
      <Box
        boxShadow='dark-lg'
        w="100%"
        borderRadius="lg"
        borderWidth="1px"
        borderColor="black"
        // backgroundColor="#77dd77"
        backgroundColor="transparent"
        fontWeight="bold"
      >
        <Box margin='10px'>
          <Tabs variant="soft-rounded" colorScheme="gray" marginTop={5}>
            <TabList height='50px' width='100%' display='flex' justifyContent='space-between'>
              <Tab width='49%' border='2px solid black'>Login</Tab>
              <Tab width='49%' border='2px solid black'>Sign Up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login/>
              </TabPanel>
              <TabPanel>
                <SignUp/>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Box>
    </Container>
  );
}

export default Home;
