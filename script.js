import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onChildAdded,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDtbvCVRbegWpmkVcFZzC7RxlVf9ZEt6rE",
  authDomain: "chat-app-ce44e.firebaseapp.com",
  databaseURL: "https://chat-app-ce44e-default-rtdb.firebaseio.com",
  projectId: "chat-app-ce44e",
  storageBucket: "chat-app-ce44e.firebasestorage.app",
  messagingSenderId: "897990700516",
  appId: "1:897990700516:web:aedde0c593e530f1436bf1",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

let user = null;
const messagesRef = ref(db, "messages");

signInAnonymously(auth).catch(console.error);

onAuthStateChanged(auth, (u) => {
  if (u) {
    user = u;
    initChat();
  }
});

function initChat() {
  const input = document.getElementById("messageInput");
  const sendButton = document.getElementById("sendButton");
  const messagesList = document.getElementById("messages");

  sendButton.addEventListener("click", () => {
    const text = input.value.trim();

    if (text) {
      push(messagesRef, {
        uid: user.uid,
        text,
        timestamp: Date.now(),
      });
      input.value = "";
    }
  });

  onChildAdded(messagesRef, (snapshot) => {
    const msg = snapshot.val();
    const li = document.createElement("li");
    li.textContent =
      (msg.uid === user.uid ? "You" : "Anonymous") + ": " + msg.text;
    messagesList.appendChild(li);
    messagesList.scrollTop = messagesList.scrollHeight;
  });
}
