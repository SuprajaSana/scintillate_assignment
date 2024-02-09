const ctx = document.getElementById("voteChart").getContext("2d");

const chart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Candidates"],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

const socket = io("http://localhost:8000");

window.addEventListener("DOMContentLoaded", () => {
  socket.on("update", (candidates) => {
    candidates = Object.entries(candidates);

    for (const [key, candidate] of candidates) {
      if (
        typeof chart.data.datasets[key] == "undefined" &&
        chart.data.datasets.length < candidates.length
      ) {
        chart.data.datasets.push({
          backgroundColor: candidate.color,
          borderColor: candidate.color,
          data: [candidate.votes],
          label: candidate.label,
        });
      } else if (typeof chart.data.datasets[key] != "undefined") {
        chart.data.datasets[key].data = [candidate.votes];
      }
    }

    chart.update();
  });
});

function vote(index) {
  socket.emit("vote", index);
}

function addPollHandler() {
  console.log("added poll");
}

function chatHandler() {
  window.location.href = "./chat.html";
}

function logoutHandler() {
  window.location.href = "./home.html";
}
