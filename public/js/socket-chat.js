var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has("name") || !params.has("room")) {
  window.location = "index.html";
  throw new Error("Name and room are required");
}

let user = {
  name: params.get("name"),
  room: params.get("room")
};

socket.on("connect", function() {
  console.log("Connected to server");

  socket.emit("enterChat", user, resp =>
    // console.log("Connected users: ", resp)
    renderUsers(resp)
  );
});

// listen
socket.on("disconnect", function() {
  console.log("Server connection lost");
});

// Enviar información
// socket.emit(
//   "createMsg",
//   {
//     usuario: "Fernando",
//     mensaje: "Hola Mundo"
//   },
//   function(resp) {
//     console.log("respuesta server: ", resp);
//   }
// );

// Escuchar información
socket.on("createMsg", function(msg) {
  console.log("Server:", msg);
  renderMsgs(msg, false);
  scrollBottom();
});

// listen users changes
// when a user enters or leaves chat
socket.on("personList", function(people) {
  renderUsers(people);
});

// Private Messages
socket.on("privateMsg", msg => {
  console.log("Private Message: ", msg);
});
