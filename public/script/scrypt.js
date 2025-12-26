fetch("/login", { method: "POST" })
  .then(res => res.json())
  .then(data => alert(data.message));
