const { io } = require("../server");
const { Users } = require("../classes/users");
const { createMsg } = require("../utils/utils");

const users = new Users();

io.on("connection", client => {
  client.on("enterChat", (data, cb) => {
    if (!data.name || !data.room) {
      return cb({
        error: true,
        msg: "Name/room is required"
      });
    }

    client.join(data.room);

    users.addPerson(client.id, data.name, data.room);

    client.broadcast
      .to(data.room)
      .emit("personList", users.getPeopleByRoom(data.room));

    client.broadcast
      .to(data.room)
      .emit("createMsg", createMsg("Admin", `${data.name} joined`));

    cb(users.getPeopleByRoom(data.room));
  });

  client.on("createMsg", (data, cb) => {
    let person = users.getPerson(client.id);

    let msg = createMsg(person.name, data.msg);

    client.broadcast.to(person.room).emit("createMsg", msg);

    cb(msg);
  });

  client.on("disconnect", () => {
    let deletedPerson = users.deletePerson(client.id);

    client.broadcast
      .to(deletedPerson.room)
      .emit("createMsg", createMsg("Admin", `${deletedPerson.name} left`));

    client.broadcast
      .to(deletedPerson.room)
      .emit("personList", users.getPeopleByRoom(deletedPerson.room));
  });

  // Private messages
  client.on("privateMsg", data => {
    let person = users.getPerson(client.id);
    client.broadcast
      .to(data.to)
      .emit("privateMsg", createMsg(person.name, data.msg));
  });
});
