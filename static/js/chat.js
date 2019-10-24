/*jshint esversion: 6 */

// Redirect to login page if username is not in localStorage
if (!localStorage.getItem("username"))
  window.location.replace("/login/");

function addChannelToList(socket, channel_name) {
  // Add channel to channels list
  var div = document.querySelector("#channels-list");

  const a = document.createElement("a");
  a.classList.add("collection-item");
  a.href = "#";
  a.dataset.channel = channel_name;
  a.innerText = channel_name;

  div.appendChild(a);
  setOnChannelClick(socket, a);
}

function addMessage(timestamp, type, data) {
  // "type" can only be "message", "system" or "file"
  var ul, li, div1, div2, span_ts, span_user, span_message, datetime;
  datetime = new Date(timestamp * 1000);
  datetime = datetime.toLocaleString().replace(",", "");

  ul = document.querySelector("#messages-list");
  li = document.createElement("li");

  if (type == "message") {
    div1 = document.createElement("div");
    div1.classList.add("message-header");

    span_user = document.createElement("span");
    span_user.classList.add("m-username");
    span_user.innerText = data.username;

    span_ts = document.createElement("time");
    span_ts.classList.add("m-timestamp");
    span_ts.setAttribute("datetime", datetime);
    span_ts.innerText = datetime;

    div1.appendChild(span_user);
    div1.appendChild(span_ts);

    div2 = document.createElement("div");
    div2.classList.add("message-body");
    if (data.owner) {
      var strong = document.createElement("strong");
      strong.innerText = data.message;
      div2.appendChild(strong);
    } else {
      div2.innerText = data.message;
    }

    li.appendChild(div1);
    li.appendChild(div2);
  } else if (type == "system") {
    div1 = document.createElement("div");
    div1.classList.add("message-system", "center-align");
    div1.innerText = data.message;

    li.appendChild(div1);
  } else if (type == "file") {
    div1 = document.createElement("div");
    div1.classList.add("message-header");

    span_user = document.createElement("span");
    span_user.classList.add("m-username");
    span_user.innerText = data.username;

    span_ts = document.createElement("time");
    span_ts.classList.add("m-timestamp");
    span_ts.setAttribute("datetime", datetime);
    span_ts.innerText = datetime;

    div1.appendChild(span_user);
    div1.appendChild(span_ts);

    div2 = document.createElement("div");
    div2.classList.add("message-body");
    if (data.owner) {
      var strong = document.createElement("strong");
      strong.innerText = "File: ";
      div2.appendChild(strong);
    } else {
      div2.innerText = "File: ";
    }
    var a = document.createElement("a");
    a.href = data.link;
    a.dataset.link = data.link;
    a.innerText = data.filename;
    setOnFileClick(a);
    div2.appendChild(a);

    li.appendChild(div1);
    li.appendChild(div2);
  }

  ul.appendChild(li);

  // Scroll to bottom
  updateMessagesScroll();
}

function eventFire(el, etype) {
  if (el.fireEvent) {
    el.fireEvent('on' + etype);
  } else {
    var evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
}

function getChannels(socket) {
  // Get channels list from server

  removeChannels();
  removeUsers();

  const request = new XMLHttpRequest();
  request.open("POST", "/get-channels/");

  request.onload = () => {
    if (request.status == 204) {
      showMessagesBlock(false);
      showNoChannelSelected(true);
      showNoChannelsList(true);
    } else if (request.status == 200) {
      // Got channels list
      const data = JSON.parse(request.responseText);
      var div = document.querySelector("#channels-list");

      data.forEach(channel_name => {
        addChannelToList(socket, channel_name);
      });

      var channel_name = localStorage.getItem("channel");
      var link = document.querySelector(`[data-channel='${channel_name}']`);
      if (channel_name && link != null) {
        eventFire(link, "click");
      }
      showNoChannelsList(false);
      sortChannelsList();
    };
  };

  request.send();
  return false;
}

function getMessages(channel_name) {
  // Get channel messages

  removeMessages();

  // Check if loaded channel exists
  var element = document.querySelector(`[data-channel='${channel_name}']`);
  showMessagesBlock(element != null);
  showNoChannelSelected(element == null);
  if(element != null) {
    const request = new XMLHttpRequest();
    request.open("POST", "/get-messages/");

    request.onload = () => {
      if (request.status == 404) {
        // Channel doesn't exist
      }
      if (request.status == 204) {
        // No messages in the channel
      }
      if (request.status == 200) {
        // Got messages
        const data = JSON.parse(request.responseText);
        data.forEach(message => {
          const owner = (message.username == localStorage.getItem("username"));
          if (message.message === undefined) {
            addMessage(message.timestamp, "file", {"username": message.username, "filename": message.filename, "link": message.link, "owner": owner});
          } else {
            addMessage(message.timestamp, "message", {"username": message.username, "message": message.message, "owner": owner});
          }
        });
      }
    };

    const data = new FormData();
    data.append("channel_name", channel_name);
    request.send(data);
    return false;
  }
}

function getUsers(channel) {
  const request = new XMLHttpRequest();
  request.open("POST", "/get-users/");

  request.onload = () => {
    removeUsers();

    if (request.status == 404) {
      // Channel doesn't exist
    }
    if (request.status == 204) {
      // No users in the channel
    }
    if (request.status == 200) {
      // Got users
      const data = JSON.parse(request.responseText);
      var ul = document.querySelector("#users-list");
      data.forEach(user => {
        var li = document.createElement("li");
        li.classList.add("collection-item");
        li.innerText = user;
        ul.append(li);
      });
    }

    sortUsersList();
  };

  const data = new FormData();
  data.append("channel_name", channel);
  request.send(data);
  return false;
}

function removeChannels() {
  // Remove all channels from list
  var ul = document.querySelector("#channels-list");
  var lis = ul.querySelectorAll("a");
  if (lis) {
    lis.forEach((li) => {
      li.remove();
    })
  }
}

function removeMessages() {
  // Remove all messages
  var ul = document.querySelector("#messages-list");
  while (ul.firstChild) {
    ul.removeChild(ul.firstChild);
  }
}

function removeUsers() {
  // Remove all messages
  var ul = document.querySelector("#users-list");
  while (ul.firstChild) {
    ul.removeChild(ul.firstChild);
  }
}

function sendFile(socket) {
  // Send file to server
  if (document.querySelector("#upload-file").value != "") {
    var file = document.querySelector("#upload-file").files[0];

    const request = new XMLHttpRequest();
    request.open("POST", "/receive-file/");

    request.onload = () => {
      if (request.status == 204) {
        // Received empty file name
      }
      if (request.status == 201) {
        // File was saved
        const data = JSON.parse(request.responseText);
        const channel_name = localStorage.getItem("channel");
        const username = localStorage.getItem("username");
        const filename = data.filename;
        const link = data.link;

        socket.emit("file sent", {"channel_name": channel_name, "username": username, "filename": filename, "link": link});
      }
    };

    var data = new FormData();
    data.append("file", file, file.name);
    data.append("channel_name", localStorage.getItem("channel"));
    request.send(data);

  } else {
    // File not specified
  }
}

function setOnChannelClick(socket, a) {
  // Set onclick method
  a.onclick = (e) => {
    const old_channel = localStorage.getItem("channel");
    const channel_name = a.dataset.channel;
    const username = localStorage.getItem("username");

    // Remove "active" class from all links
    const div = document.querySelector("#channels-list");
    var links = div.querySelectorAll("a");
    links.forEach((link) => {
      if (link.classList.contains("active")) {
        link.classList.remove("active")
      }
    });

    a.classList.add("active");

    if (old_channel != null && old_channel != channel_name) {
      socket.emit("leave", {
        "channel_name": old_channel,
        "username": username
      });
    }
    socket.emit("join", {
      "channel_name": channel_name,
      "username": username
    });
    localStorage.setItem("channel", channel_name);
    getMessages(channel_name);
    getUsers(channel_name);

    e.preventDefault();
    e.stopPropagation();
  };
}

function setOnFileClick(a) {
  // Set onclick method
  a.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(a.dataset.link , '_blank');
  };
}

function showMessagesBlock(show) {
  // Show/hide messages block
  var m_block = document.querySelectorAll("#messages-block, #new-message-block");
  m_block.forEach((m) => {
    if (show) {
      m.style.visibility = "visible";
    } else {
      m.style.visibility = "hidden";
    }
  });
}

function showNoChannelsList(show) {
  // Show/hide no channels block
  var no_channels = document.querySelector("#no-channel-list");
  if (show) {
    no_channels.style.display = "block";
  } else {
    no_channels.style.display = "none";
  }
}

function showNoChannelSelected(show) {
  // Show/hide no channel block
  var n_channel = document.querySelector("#no-channel-selected");
  if (show) {
    n_channel.style.visibility = "visible";
  } else {
    n_channel.style.visibility = "hidden";
  }
}

function sortChannelsList() {
  // Sort channels in alphabetical order
  var list, i, switching, b, shouldSwitch;
  list = document.querySelector("#channels-list");
  switching = true;
  while (switching) {
    switching = false;
    b = list.querySelectorAll("a");
    for (i = 0; i < (b.length - 1); i++) {
      shouldSwitch = false;
      if (b[i].innerText.toLowerCase() > b[i + 1].innerText.toLowerCase()) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      b[i].parentNode.insertBefore(b[i + 1], b[i]);
      switching = true;
    }
  }
}

function sortUsersList() {
  // Sort channels in alphabetical order
  var list, i, switching, b, shouldSwitch;
  list = document.querySelector("#users-list");
  switching = true;
  while (switching) {
    switching = false;
    b = list.querySelectorAll("li");
    for (i = 0; i < (b.length - 1); i++) {
      shouldSwitch = false;
      if (b[i].innerHTML.toLowerCase() > b[i + 1].innerHTML.toLowerCase()) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      b[i].parentNode.insertBefore(b[i + 1], b[i]);
      switching = true;
    }
  }
}

function updateMessagesScroll(){
    var element = document.querySelector("#messages-wrapper");
    element.scrollTop = element.scrollHeight;
}

document.addEventListener("DOMContentLoaded", () => {
  // Define socketio
  var socket = io.connect(location.protocol + "//" + document.domain + ":" + location.port);

  // On logout
  document.querySelector("#logout-link").onclick = () => {
    const username = localStorage.getItem("username");

    // Remove localStorage data
    localStorage.removeItem("username");
    localStorage.removeItem("channel");
    socket.emit("user disconnected", {"username": username});

    socket.close();
  };

  // On connect
  socket.on("connect", () => {
    var username = localStorage.getItem("username");
    var channel_name = localStorage.getItem("channel");
    socket.emit("user connected", {"username": username});

    getChannels(socket);

    // On create new channel
    document.querySelector("#new-channel").onsubmit = () => {
      const channel_name = document.querySelector("#new-channel-name").value;
      if (channel_name == "")
        return false;

      var exists = false;
      document.querySelectorAll("[data-channel]").forEach(el => {
        if (el.dataset.channel.toLowerCase() == channel_name.toLowerCase())
          exists = true;
      });
      if (exists) {
        alert(`Channel ${channel_name} already exists`);
      } else {
        // If channel doesn't exist, emit the message
        socket.emit("channel created", {"channel_name": channel_name});
        document.querySelector("#new-channel-name").value = "";
      }
      return false;
    };
    // On message sent
    document.querySelector("#new-message").onsubmit = () => {
      const message = document.querySelector("#new-message-text").value;
      if (message == '')
        return false;

      const channel_name = localStorage.getItem("channel");
      const username = localStorage.getItem("username");

      socket.emit("message sent", {
        "channel_name": channel_name,
        "username": username,
        "message": message
      });
      document.querySelector("#new-message-text").value = "";
      return false;
    };
    // On file upload click
    document.querySelector("#upload-file-button").onclick = () => {
      document.querySelector("#upload-file").click();
    };
    // On file choose
    document.querySelector("#upload-file").onchange = () => {
      sendFile(socket);
      socket.emit("send file");
    };
  });
  // On user disconnect
  socket.on("disconnect", () => {
    getUsers();
  });
  // On channel create
  socket.on("announce channel", data => {
    const channel_name = data.channel_name;

    showNoChannelsList(false);
    addChannelToList(socket, channel_name);
    sortChannelsList();
  });
  // On user join
  socket.on("user joined", data => {
    const channel_name = data.channel_name;
    const username = data.username;
    const timestamp = data.timestamp;

    getUsers(channel_name);

    addMessage(timestamp, "system", {"message": `${username} has joined ${channel_name}`});
  });
  // On user leave
  socket.on("user leaved", data => {
    const channel_name = data.channel_name;
    if (channel_name == null)
      return;

    const username = data.username;
    const timestamp = data.timestamp;

    getUsers(channel_name);

    addMessage(timestamp, "system", {"message": `${username} has leaved ${channel_name}`});
  });
  // On new message receive
  socket.on("announce message", data => {
    const username = data.username;
    const message = data.message;
    const timestamp = data.timestamp;

    const owner = (username == localStorage.getItem("username"));
    addMessage(timestamp, "message", {"username": username, "message": message, "owner": owner});
  });
  // On new file receive
  socket.on("announce file", data => {
    const username = data.username;
    const timestamp = data.timestamp;
    const link = data.link;
    const filename = data.filename;

    const owner = (username == localStorage.getItem("username"));
    addMessage(timestamp, "file", {"username": username, "filename": filename, "link": link, "owner": owner});
  });
});
