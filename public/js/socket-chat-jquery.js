var params = new URLSearchParams(window.location.search);
var name = params.get("name");
var room = params.get("room");

//jQuery references
var usersDiv = $("#usersDiv");
var formEnviar = $("#formEnviar");
var txtMsg = $("#txtMsg");
var divChatbox = $("#divChatbox");

// render users function
function renderUsers(people) {
  console.log(people);

  var html = "";

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

function renderMsgs(msg, me) {
  var html = "";
  var date = new Date(msg.date);
  var time = date.getHours() + ":" + date.getMinutes();

  var adminClass = "info";
  if (msg.name === "Admin") {
    adminClass = "danger";
  }

  if (me) {
    html += ' <li class="reverse">';
    html += '<div class="chat-content">';
    html += "<h5>" + msg.name + "</h5>";
    html += '<div class="box bg-light-inverse">' + msg.msg + "</div>";
    html += "</div>";
    html += '<div class="chat-img">';
    html += '<img src="assets/images/users/5.jpg" alt="user" />';
    html += "</div>";
    html += ' <div class="chat-time">' + time + "</div>";
    html += "</li>";
  } else {
    html += '<li class="animated fadeIn">';

    if (msg.name !== "Admin") {
      html +=
        '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
    }
    html += '<div class="chat-content">';
    html += ' <h5 class="">' + msg.name + "</h5>";
    html +=
      '  <div class="box bg-light-' + adminClass + '">' + msg.msg + "</div>";
    html += "</div>";
    html += '<div class="chat-time">' + time + "</div>";
    html += "</li>";
  }

  divChatbox.append(html);
}

function scrollBottom() {
  // selectors
  var newMessage = divChatbox.children("li:last-child");

  // heights
  var clientHeight = divChatbox.prop("clientHeight");
  var scrollTop = divChatbox.prop("scrollTop");
  var scrollHeight = divChatbox.prop("scrollHeight");
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight() || 0;

  if (
    clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=
    scrollHeight
  ) {
    divChatbox.scrollTop(scrollHeight);
  }
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
    function(msg) {
      txtMsg.val("").focus();
      renderMsgs(msg, true);
      scrollBottom();
    }
  );
});
