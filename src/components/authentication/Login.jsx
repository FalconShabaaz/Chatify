import { FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react';
import React, { useState } from 'react';
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";


const Login = () => {
    const [show,setShow]= useState(false);
    const [email, setEmail]=useState();
    const [password,setpassword] = useState();
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    const handleShowHide = () =>{
        if(show == false){
            setShow(true);
        }
        else{
            setShow(false)
        }
    }
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        handleSubmit();
      }
    };

    const handleSubmit =async()=>{
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post("http://localhost:3000/api/user/login",{ email, password },config);
      // console.log(data);
      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing='5px'>
        <FormControl id='email1' isRequired marginTop='5px'>
            <FormLabel  fontWeight='bold'>Email</FormLabel>
            <Input placeholder='Enter the Email' onChange={(e)=>setEmail(e.target.value)}  borderColor='black'/>
        </FormControl>
        <FormControl id='password1' isRequired marginTop='5px'>
            <FormLabel  fontWeight='bold'>Password</FormLabel>
            <InputGroup size='md'>
                <Input type={show ? "text" : "password"} onChange={(e)=>setpassword(e.target.value)}   borderColor='black' placeholder='Enter the Password' onKeyDown={handleKeyDown}/>
                <InputRightElement width='4.5rem'>
                    <Button h='1.75rem' size='sm' onClick={handleShowHide}>{show ? "Hide" : "Show"}</Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
        <Button width='100%' style={{marginTop:15}} onClick={handleSubmit} isLoading={loading}>Login</Button>
        <Button width='100%' variant='solid' colorScheme='red' style={{marginTop:10}} onClick={()=>{
            setEmail('guest@example.com');
            setpassword("123456");
        }}>Login as a Guest</Button>
    </VStack>
  )
}

export default Login;
