// let wishes = JSON.parse(localStorage.getItem("wishes")) || [];
// let pendingWishes = [];

// document.getElementById("add-wish").addEventListener("click", () => {
//   const name = document.getElementById("employee-name").value.trim();
//   const wish = document.getElementById("employee-wish").value.trim();

//   if (name && wish) {
//     pendingWishes.push({ name, wish });
//     renderPendingList();
//     document.getElementById("employee-name").value = "";
//     document.getElementById("employee-wish").value = "";
//   } else {
//     alert("Please fill in both fields!");
//   }
// });

// document.getElementById("clear-all").addEventListener("click", () => {
//   localStorage.clear();
//   wishes = [];
//   pendingWishes = [];
//   renderWishList();
//   renderPendingList();
//   document.getElementById("shuffled-list").innerHTML = "";
// });

// document.getElementById("approve-wishes").addEventListener("click", () => {
//   wishes = wishes.concat(pendingWishes);
//   pendingWishes = [];
//   localStorage.setItem("wishes", JSON.stringify(wishes));
//   renderWishList();
//   renderPendingList();
// });

// document.getElementById("shuffle-wishes").addEventListener("click", () => {
//   if (wishes.length < 2) {
//     alert("Add at least two wishes to shuffle!");
//     return;
//   }

//   const shuffled = [...wishes];
//   let matched = false;

//   do {
//     matched = false;
//     shuffled.sort(() => Math.random() - 0.5);

//     // Avoid self-gifting
//     for (let i = 0; i < shuffled.length; i++) {
//       if (shuffled[i].name === wishes[i].name) {
//         matched = true;
//         break;
//       }
//     }
//   } while (matched);

//   const result = shuffled.map((item, index) => {
//     const giver = wishes[index];
//     return `<li>${giver.name} will gift "${item.wish}" to ${item.name}</li>`;
//   });

//   document.getElementById("shuffled-list").innerHTML = result.join("");
// });

// document.getElementById("employee-wish").addEventListener("input", (e) => {
//   const userInput = e.target.value;
//   const suggestionList = document.getElementById("suggestion-list");
//   suggestionList.innerHTML = "";

//   Object.keys(suggestions).forEach((key) => {
//     if (userInput.toLowerCase().includes(key.toLowerCase())) {
//       suggestions[key].forEach((item) => {
//         const li = document.createElement("li");
//         li.textContent = item;
//         suggestionList.appendChild(li);
//       });
//     }
//   });
// });

// function renderWishList() {
//   const wishList = document.getElementById("wish-list");
//   wishList.innerHTML = wishes
//     .map((item) => `<li>${item.name}: ${item.wish}</li>`)
//     .join("");
// }

// function renderPendingList() {
//   const pendingList = document.getElementById("pending-list");
//   pendingList.innerHTML = pendingWishes
//     .map((item) => `<li>${item.name}: ${item.wish}</li>`)
//     .join("");
// }

// // Initial Render
// renderWishList();
// renderPendingList();

(() => {
  let wishes = JSON.parse(localStorage.getItem("wishes")) || [];
  let pendingWishes = [];

  const elements = {
    nameInput: document.getElementById("employee-name"),
    wishInput: document.getElementById("employee-wish"),
    pendingList: document.getElementById("pending-list"),
    wishList: document.getElementById("wish-list"),
    shuffledList: document.getElementById("shuffled-list"),
    addWishBtn: document.getElementById("add-wish"),
    clearAllBtn: document.getElementById("clear-all"),
    approveWishesBtn: document.getElementById("approve-wishes"),
    shuffleWishesBtn: document.getElementById("shuffle-wishes"),
  };

  function renderPendingList() {
    elements.pendingList.innerHTML = pendingWishes
      .map((item, index) => `
        <li>
          <span>${item.name}: ${item.wish}</span>
          <div class="action-buttons">
            <button class="btn secondary-btn" onclick="editPendingWish(${index})">Edit</button>
            <button class="btn danger-btn" onclick="deletePendingWish(${index})">Delete</button>
          </div>
        </li>`)
      .join("");
  }

  function renderWishList() {
    elements.wishList.innerHTML = wishes
      .map(({ name, wish }) => `<li>${name}: ${wish}</li>`)
      .join("");
  }

  function addWish() {
    const name = elements.nameInput.value.trim();
    const wish = elements.wishInput.value.trim();

    if (!name || !wish) {
      alert("Please fill in both fields!");
      return;
    }

    pendingWishes.push({ name, wish });
    renderPendingList();

    elements.nameInput.value = "";
    elements.wishInput.value = "";
  }

  function editPendingWish(index) {
    const { name, wish } = pendingWishes[index];
    elements.nameInput.value = name;
    elements.wishInput.value = wish;

    deletePendingWish(index); // Remove the wish to prevent duplication during edit
  }

  function deletePendingWish(index) {
    pendingWishes.splice(index, 1);
    renderPendingList();
  }

  function approveWishes() {
    wishes = [...wishes, ...pendingWishes];
    pendingWishes = [];
    localStorage.setItem("wishes", JSON.stringify(wishes));
    renderWishList();
    renderPendingList();
  }

  function shuffleWishes() {
    if (wishes.length < 2) {
      alert("Add at least two wishes to shuffle!");
      return;
    }

    const shuffled = [...wishes];
    do {
      shuffled.sort(() => Math.random() - 0.5);
    } while (shuffled.some((item, idx) => item.name === wishes[idx].name));

    elements.shuffledList.innerHTML = shuffled
      .map((item, idx) => `<li>${wishes[idx].name} will gift "${item.wish}" to ${item.name}</li>`)
      .join("");
  }

  function clearAll() {
    wishes = [];
    pendingWishes = [];
    localStorage.clear();
    renderWishList();
    renderPendingList();
    elements.shuffledList.innerHTML = "";
  }

  elements.addWishBtn.addEventListener("click", addWish);
  elements.clearAllBtn.addEventListener("click", clearAll);
  elements.approveWishesBtn.addEventListener("click", approveWishes);
  elements.shuffleWishesBtn.addEventListener("click", shuffleWishes);

  // Initial render
  renderWishList();
  renderPendingList();

  // Attach functions to the global scope for buttons
  window.editPendingWish = editPendingWish;
  window.deletePendingWish = deletePendingWish;
})();
