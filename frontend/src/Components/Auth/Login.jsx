import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";

function Login() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = () => {};
  return (
    <VStack spacing="5px">
      <FormControl>
        <FormLabel>Email</FormLabel>
        <Input onChange={(e) => setEmail(e.target.value)} value={email} />
      </FormControl>
      <FormControl>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <InputRightElement width="4.5rem">
            <Button onClick={() => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button width="100%" colorScheme="blue" onClick={submitHandler}>
        Login
      </Button>
      <Button
        width="100%"
        colorScheme="whatsapp"
        onClick={() => {
          setEmail("Hello");
          setPassword("PILAL");
        }}
      >
        Get Guest User
      </Button>
    </VStack>
  );
}

export default Login;
