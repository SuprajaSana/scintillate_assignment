function pollHandler() {
  window.location.href = "./poll.html";
}

function chatHandler() {
  window.location.href = "./chat.html";
}

function logoutHandler() {
  localStorage.removeItem("token");
  window.location.href = "./login.html";
}
