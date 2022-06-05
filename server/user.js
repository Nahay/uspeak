let users = [];

exports.addUser = ({ id, name, room }) => {
  if (!name || !room) return { error: "name and room required." };
  const user = { id, name, room };

  users.push(user);

  return { user };
};

exports.removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    const user = users[index];

    users.splice(index, 1);
    return user;
};

exports.getUsersNumberByRoom = (room) => users.filter((user) => user.room === room).length;