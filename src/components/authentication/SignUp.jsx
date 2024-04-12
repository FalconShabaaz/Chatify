import { FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [show,setShow]= useState(false);
    const [name,setName] = useState();
    const [email, setEmail]=useState();
    const [password,setpassword] = useState();
    const [confirmpassword,setConfirmpassword] = useState();
    const [pic,setPic] = useState();
    const [loading,setLoading] = useState(false);
    const [picLoading, setPicLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate()
    const handleShowHide = () =>{
        if(show == false){
            setShow(true);
        }
        else{
            setShow(false);
        }
    }


    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
          handleSubmit();
        }
      };


    const postDetails=(pics) =>{
        setLoading(true);
        if(pics === undefined){
            toast({
                title: "Image is required.",
                status:'warning',
                duration:5000,
                isClosable:true,
                position:"bottom",
            });
            return;
        }
        if(pics.type === "image/jpeg" || pics.type === "image/png"){
            const data = new FormData();
            data.append("file",pics);
            data.append("upload_preset","Chatify");
            data.append("cloud_name","dkkjomqdl");
            fetch("https://api.cloudinary.com/v1_1/dkkjomqdl/image/upload",{
                method:"post",
                body: data
            }).then((res)=>res.json()).then(data=>{
                setPic(data.url.toString());
                // console.log(data.url.toString());
                setLoading(false);
            }).catch((error)=>{
                // console.log(error);
                setLoading(false);
            });
        }
        else{
            toast({
                title: "Image is required.",
                status:'warning',
                duration:5000,
                isClosable:true,
                position:"bottom",
            });
            setLoading(false);
            return;
        }
    }

    const handleSubmit =async()=>{
        setPicLoading(true);
        if (!name || !email || !password || !confirmpassword) {
          toast({
            title: "Please Fill all the Feilds",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setPicLoading(false);
          return;
        }
        if (password !== confirmpassword) {
            toast({
              title: "Passwords Do Not Match",
              status: "warning",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            return;
        }
        // console.log(name, email, password, pic);
        try {
        const config = {
        headers: {
          "Content-type": "application/json",
        },
        };
        const { data } = await axios.post("http://localhost:3000/api/user",{name,email,password,pic,},config);
        // console.log(data);
        toast({
            title: "Registration Successful",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
        });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false);
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
      setPicLoading(false);
    }
    };

  return (
    <VStack spacing='5px'>
        <FormControl id='first-name' isRequired>
            <FormLabel  fontWeight='bold'>Name</FormLabel>
            <Input placeholder='Enter your name' onChange={(e)=>setName(e.target.value)} borderColor='black'/>
        </FormControl>
        <FormControl id='email' isRequired marginTop='5px'>
            <FormLabel  fontWeight='bold'>Email</FormLabel>
            <Input placeholder='Enter the Email' onChange={(e)=>setEmail(e.target.value)}  borderColor='black'/>
        </FormControl>
        <FormControl id='password' isRequired marginTop='5px'>
            <FormLabel  fontWeight='bold'>Password</FormLabel>
            <InputGroup size='md'>
                <Input type={show ? "text" : "password"} onChange={(e)=>setpassword(e.target.value)}   onKeyDown={handleKeyDown} borderColor='black' placeholder='Enter the Password'/>
                <InputRightElement width='4.5rem'>
                    <Button h='1.75rem' size='sm' onClick={handleShowHide}>{show ? "Hide" : "Show"}</Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl id='confirm-password' isRequired marginTop='5px'>
            <FormLabel  fontWeight='bold'>Confirm Password</FormLabel>
            <InputGroup size='md'> 
                <Input type='text' onChange={(e) => setConfirmpassword(e.target.value)} placeholder='Re-enter the Password'  borderColor='black'/>
            </InputGroup>
        </FormControl>
        <FormControl id='pic' marginTop='5px'>
            <FormLabel  fontWeight='bold'>Upload Your Picture</FormLabel>
            <Input type='file' accept='image/*' 
              onKeyDown={handleKeyDown}
            onChange={(e)=>postDetails(e.target.files[0])}  borderColor='black'/>
        </FormControl>
        <Button width='100%' style={{marginTop:15}} onClick={handleSubmit} isLoading={loading}>Sign Up</Button>
    </VStack>
  )
}

export default SignUp
