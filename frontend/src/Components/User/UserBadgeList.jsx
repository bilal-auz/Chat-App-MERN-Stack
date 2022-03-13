import React from "react";
import { Box, Badge } from "@chakra-ui/react";

function UserBadgeList({ user, handleFunction }) {
  return (
    <Badge
      px={2}
      py={2}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={15}
      colorScheme="linkedin"
      cursor="pointer"
      onClick={handleFunction}
    >
      {user.name}
      <span> &#x2715;</span>
    </Badge>
  );
}

export default UserBadgeList;
