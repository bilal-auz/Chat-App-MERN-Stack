import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChatState } from "./../Context/ChatProvider";

import { Box } from "@chakra-ui/react";
import SideDrawer from "./../Components/Common/SideDrawer";
import MyChats from "./../Components/Common/MyChats";
import ChatBox from "./../Components/Common/ChatBox";

function ChatPages() {
  const { user } = ChatState();
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
}

export default ChatPages;
