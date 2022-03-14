export const getSenderName = (loggedUser, users) => {
  const sender = users.filter((user) => user._id !== loggedUser._id);

  return sender[0].name;
};

export const getSenderProfile = (loggedUser, users) => {
  const sender = users.filter((user) => user._id !== loggedUser._id);

  return sender[0];
};

export const isSameSender = (messages, crntMsg, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== crntMsg.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

export const isSameSenderMargin = (messages, crntMsg, i, userId) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === crntMsg.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== crntMsg.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};

export const isSameUser = (messages, crntMsg, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== crntMsg.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};
