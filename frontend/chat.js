const chatSocket = io("http://localhost:8000/chat");

chatSocket.on("connect", () => {
  console.log("You are connected to", chatSocket.id);
});

const sender = localStorage.getItem("sender");

chatSocket.on("receivemsg", (msg, name) => {
  console.log(msg);
  const obj = [
    {
      message: msg,
      sentBy: name,
    },
  ];
    showChatOnScreen(obj);
});

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("grpid");
    const response = await axios.get("http://localhost:8000/get/users", {
      headers: { Authorization: token },
    });
    showUsersListOnScreen(response.data.users);
  } catch (err) {
    console.log(err);
  }
});

function showUsersListOnScreen(users) {
  const parentNode = document.getElementById("div2");
  parentNode.innerHTML = "";
  for (var i = 0; i < users.length; i++) {
    if (i == 0) {
      const childHTML = `<div id=${users[i].id} onclick="showmsgs('${users[i].username}')" style="margin-top:50px;padding:10px;background-color: rgb(176, 168, 168);border-radius:5px;font-weight:bold;font-size:large"> ${users[i].username}</div>`;
      parentNode.innerHTML = parentNode.innerHTML + childHTML;
    } else {
      const childHTML = `<div id=${users[i].id} onclick="showmsgs('${users[i].username}')" style="margin-top:5px;padding:10px;background-color: rgb(176, 168, 168);border-radius:5px;font-weight:bold;font-size:large"> ${users[i].username}</div>`;
      parentNode.innerHTML = parentNode.innerHTML + childHTML;
    }
  }
}

async function sendMsgs(e) {
  e.preventDefault();
  const msg = document.getElementById("msg").value;
  const name = localStorage.getItem("receiver");

  const obj = {
    msg: msg,
    name: name,
  };

  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `http://localhost:8000/send/messages`,
      obj,
      {
        headers: { Authorization: token },
      }
    );
    console.log(response);
    chatSocket.emit("sendmsg", msg, sender);
    document.getElementById("msg").value = "";
  } catch (err) {
    console.log(err);
  }
}

async function showmsgs(name) {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `http://localhost:8000/get/messages?receiver=${name}`,
      {
        headers: { Authorization: token },
      }
    );
    showChatOnScreen(response.data.messages);
  } catch (err) {
    console.log(err);
  }
  localStorage.setItem("receiver", name);
}

function showChatOnScreen(messages) {
  const parentHTML = document.getElementById("div4");
  let chHTML = "";
  for (var i = 0; i < messages.length; i++) {
    if (sender == messages[i].sentBy) {
      const childHTML = `<div style="padding:10px;background-color:lightgrey;border-radius:5px;width:600px;margin-top:10px;text-align:start;margin-left:10px">${messages[i].sentBy} - ${messages[i].message}</div>`;
      chHTML = chHTML + childHTML;
    } else {
      const childHTML = `<div style="padding:10px;background-color:whitesmoke;border-radius:5px;width:600px;margin-top:10px;text-align:start;margin-left:10px">${messages[i].sentBy} - ${messages[i].message}</div>`;
      chHTML = chHTML + childHTML;
    }
  }
  const formEle =
    '<form onsubmit="sendMsgs(event)"><input id="msg" placeholder="Type message" /><button>Send</button></form >';
  parentHTML.innerHTML = chHTML + formEle;
}

function pollHandler() {
  window.location.href = "./poll.html";
}

function logoutHandler() {
  window.location.href = "./home.html";
}
