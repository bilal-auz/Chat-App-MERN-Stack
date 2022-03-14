export const getSenderName = (loggedUser, users) => {
  const sender = users.filter((user) => user._id !== loggedUser._id);

  return sender[0].name;
};

export const getSenderProfile = (loggedUser, users) => {
  const sender = users.filter((user) => user._id !== loggedUser._id);

  return sender[0];
};
