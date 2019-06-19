var params = new URLSearchParams(window.location.search);
var name = params.get("name");
var room = params.get("room");

//jQuery references
let usersDiv = $("#usersDiv");
let formEnviar = $("#formEnviar");
let txtMsg = $("#txtMsg");

// render users function
function renderUsers(people) {
  console.log(people);

  let html = "";

  html += "<li>";
  html +=
    '<a href="javascript:void(0)" class="active"> Chat de <span> ' +
    params.get("room") +
    "</span></a>";
  html += "</li>";

  for (let i = 0; i < people.length; i++) {
    html += "<li>";
    html +=
      '    <a data-id="' +
      people[i].id +
      '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' +
      people[i].name +
      ' <small class="text-success">online</small></span></a>';
    html += "</li>";
  }

  usersDiv.html(html);
}

// Listeners
usersDiv.on("click", "a", function() {
  let id = $(this).data("id");

  if (id) {
    console.log(id);
  }
});

formEnviar.on("submit", function(e) {
  e.preventDefault();

  if (txtMsg.val().trim().length === 0) {
    return;
  }

  socket.emit(
    "createMsg",
    {
      name: name,
      msg: txtMsg.val()
    },
    function(resp) {
      console.log("respuesta server: ", resp);
    }
  );
});
