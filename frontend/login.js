async function postUserDetails(e) {
  e.preventDefault();

  const email = e.target.email.value;
  const password = e.target.password.value;

  const obj = {
    email,
    password,
  };

  try {
    const response = await axios.post("http://localhost:8000/user/login", obj);
    if (response.status === 200) {
      console.log(response.data);
      localStorage.setItem("token", response.data.token);
      window.location.href = "./home.html";
    } else {
      document.body.innerHTML += `<div style="color:red;text-align:center">"Failed to Login"</div>`;
      throw new Error("Failed to Login");
    }

    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
  } catch (err) {
    document.body.innerHTML += `<div style="color:red;text-align:center;">${err.message}</div>`;
  }
}
