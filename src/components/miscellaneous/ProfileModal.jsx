import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  Text,
  Image,
} from "@chakra-ui/react";

const ProfileModal = ({user,children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
    {children ? (
      <span onClick={onOpen}>{children}</span>
    ) : (
      <IconButton display={{ base: "flex" }} 
      color="white" 
      backgroundColor="#075E54" 
      fontSize="25px" icon={<ViewIcon />} 
      _focus={{ bg: "#075E54" }}      
      onClick={onOpen} 
      />
    )}
    <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent h="390px" width="500px">
        <ModalHeader
          fontSize="30px"
          // fontFamily="Work sans"
          display="flex"
          justifyContent="center"
          paddingBottom="5px"
        >
          {user.name}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody
          display="flex"
          flexDir="column"
          alignItems="center"
          justifyContent="space-between"
        >
          <Image
            borderRadius="20px"
            height="200px"
            width="200px"
            // boxSize="150px"
            src={user.pic}
            alt={user.name}
            paddingBottom="5px"
          />
          <Text
            fontSize={{ base: "20px", md: "24px" }}
            // fontFamily="Work sans"
          >
            {user.email}
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button  colorScheme="red" onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </>
  )
}

export default ProfileModal
