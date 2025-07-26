document.addEventListener("DOMContentLoaded", function() {});
document.addEventListener("DOMContentLoaded", () => {
  const listPanel = document.getElementById("list");
  const showPanel = document.getElementById("show-panel");

  const currentUser = { id: 1, username: "pouros" };

  fetch("http://localhost:3000/books")
    .then(res => res.json())
    .then(renderBookList);

  function renderBookList(books) {
    listPanel.innerHTML = "";
    books.forEach(book => {
      const li = document.createElement("li");
      li.textContent = book.title;
      li.addEventListener("click", () => showBookDetails(book));
      listPanel.appendChild(li);
    });
  }

  function showBookDetails(book) {
    showPanel.innerHTML = `
      <h2>${book.title}</h2>
      <img src="${book.img_url}" />
      <p>${book.description}</p>
      <h4>Liked by:</h4>
      <ul id="users">${book.users.map(u => `<li>${u.username}</li>`).join("")}</ul>
      <button id="like-btn">${userHasLiked(book) ? "Unlike" : "Like"}</button>
    `;

    document.getElementById("like-btn").addEventListener("click", () => toggleLike(book));
  }

  function userHasLiked(book) {
    return book.users.some(u => u.id === currentUser.id);
  }

  function toggleLike(book) {
    let updatedUsers;

    if (userHasLiked(book)) {
      // Unlike: Remove current user
      updatedUsers = book.users.filter(u => u.id !== currentUser.id);
    } else {
      // Like: Add current user
      updatedUsers = [...book.users, currentUser];
    }

    fetch(`http://localhost:3000/books/${book.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ users: updatedUsers })
    })
      .then(res => res.json())
      .then(updatedBook => showBookDetails(updatedBook));
  }
});
