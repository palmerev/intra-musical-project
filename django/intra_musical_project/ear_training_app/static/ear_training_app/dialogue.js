function showDialogue() {
  document.getElementById("grayout").classList.remove("hidden");
  document.getElementById("dialogue").classList.remove("hidden");
}

function hideDialogue() {
  document.getElementById("grayout").classList.add("hidden");
  document.getElementById("dialogue").classList.add("hidden");
}

var btn = document.getElementById("dialogue-ok");
if (btn) {
    btn.addEventListener("click", hideDialogue);
}
else {
    alert("error: dialogue ok button not found by id");
}
