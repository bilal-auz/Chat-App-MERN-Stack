import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

function Register() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [pic, setPic] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();

  const postDetailes = (image) => {
    if (image === undefined) {
      return toast({
        title: "please select an image",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }

    if (image.type === "image/jpeg" || image.type === "image/png") {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "ChatApp");
      data.append("cloud_name", "chat-app-yg");

      fetch("https://api.cloudinary.com/v1_1/chat-app-yg/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "please select an image",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });

      setLoading(false);

      return;
    }
  };
  const submitHandler = async () => {
    // return console.log({ name, email, password, pic });
    setLoading(true);
    if (!name || !email || !password || !confPassword) {
      toast({
        title: "Fill all fields",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    if (password !== confPassword) {
      toast({
        title: "passwords dont match",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });

      return;
    }

    try {
      const options = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const res_data = await axios.post(
        "/api/user",
        { name, email, password, pic },
        options
      );

      toast({
        title: "Registration Successful",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("userInfo", JSON.stringify(res_data));
      setLoading(false);
      history.push("/chats");
    } catch (error) {
      console.log(error.response.data.message);
      toast({
        title: "Error Occurred",
        description: error.response.data.message,
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  return (
    <VStack spacing="5px">
      <FormControl id="name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter Your Email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Your Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <InputRightElement width="4.5rem">
            <Button onClick={() => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="confPassword" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <Input
          type={show ? "text" : "password"}
          placeholder="Confirm Your Password"
          onChange={(e) => {
            setConfPassword(e.target.value);
          }}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Upload You Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetailes(e.target.files[0])}
        />
      </FormControl>

      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Register
      </Button>
    </VStack>
  );
}

export default Register;
