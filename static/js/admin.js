/* =====================================================================
   Creative Cornerstone - admin interactions (Flask build)
   Works with the existing app.py routes (add/edit/delete + multipart forms).
   ===================================================================== */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };

  document.addEventListener("DOMContentLoaded", function () {
    // Mobile sidebar
    var menuBtn = $("menuBtn"), sidebar = $("sidebar"), backdrop = $("backdrop");
    if (menuBtn && sidebar && backdrop) {
      menuBtn.addEventListener("click", function () { sidebar.classList.add("open"); backdrop.classList.add("show"); });
      backdrop.addEventListener("click", function () { sidebar.classList.remove("open"); backdrop.classList.remove("show"); });
    }

    // Image preview on file inputs (label .file-drop > input + .prev)
    document.querySelectorAll('.file-drop input[type="file"]').forEach(function (inp) {
      inp.addEventListener("change", function (e) {
        var file = e.target.files[0];
        if (!file) return;
        var prev = inp.closest(".file-drop").querySelector(".prev");
        var r = new FileReader();
        r.onload = function (ev) { if (prev) prev.innerHTML = '<img src="' + ev.target.result + '" alt="">'; };
        r.readAsDataURL(file);
      });
    });

    if (window.lucide) window.lucide.createIcons();
  });

  // Populate the add-form for editing an existing item
  window.fillEdit = function (btn) {
    var form = document.getElementById("entityForm");
    if (!form) return;
    form.querySelectorAll("input[name], textarea[name]").forEach(function (inp) {
      if (inp.type === "file" || inp.type === "hidden") return;
      var v = btn.getAttribute("data-" + inp.name);
      if (v !== null) inp.value = v;
    });
    form.action = (window.EDIT_BASE || "") + btn.getAttribute("data-id");
    var t = document.getElementById("formTitle");
    if (t) t.textContent = "Edit " + (window.ENTITY_LABEL || "item");
    var submit = form.querySelector('[type="submit"]');
    if (submit) submit.innerHTML = '<i data-lucide="check"></i> Update';
    var cancel = document.getElementById("cancelEdit");
    if (cancel) cancel.style.display = "inline-flex";
    form.scrollIntoView({ behavior: "smooth", block: "start" });
    if (window.lucide) window.lucide.createIcons();
  };

  // Cancel edit -> reset form back to "add" mode
  window.cancelEdit = function () {
    var form = document.getElementById("entityForm");
    if (!form) return;
    form.reset();
    form.action = window.ADD_ACTION || form.action;
    var t = document.getElementById("formTitle");
    if (t) t.textContent = window.ADD_TITLE || "Add new";
    var submit = form.querySelector('[type="submit"]');
    if (submit) submit.innerHTML = '<i data-lucide="check"></i> ' + (window.ADD_SUBMIT || "Save");
    var cancel = document.getElementById("cancelEdit");
    if (cancel) cancel.style.display = "none";
    form.querySelectorAll(".file-drop .prev").forEach(function (p) { p.innerHTML = '<i data-lucide="image"></i>'; });
    if (window.lucide) window.lucide.createIcons();
  };
})();
