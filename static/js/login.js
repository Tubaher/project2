document.addEventListener("DOMContentLoaded", () => {
  // Save username to localStorage
  document.querySelector("#username").onsubmit = (event) => {
    const username = document.querySelector("#username-field").value;
    if (username == "") {
      return false
    }

    localStorage.setItem("username", username);
    localStorage.removeItem("channel");
    window.location.href = "/";
    return false
  };
});
