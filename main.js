const createTask = () => {
  const description = document.getElementById("description").value;

  fetch("http://localhost:5000/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ description }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(`Estas es la lista de tareas ${data.tasks}`);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};
