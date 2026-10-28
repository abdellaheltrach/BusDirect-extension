const container = document.getElementById("TicketsContainer");
const STORAGE_KEY = "arrPLaces";
const arr = !localStorage.getItem(STORAGE_KEY) ? [] : JSON.parse(localStorage.getItem(STORAGE_KEY));

// li.className = "bg-white/40 p-4 rounded-xl border border-slate-100 flex flex-col gap-3";
// li.innerText = "mohamed sidi hmed";
// container.prepend(li);
// ;

for (const place of arr) {
  if (place.nom === "") continue;

  const li = document.createElement("li");
  li.className =
    "bg-white/40  p-4 rounded-lg text-[#0C1E4A] flex items-center justify-between border border-white/40 shadow-xs transition-colors";

  li.innerHTML = `
    <div class="flex items-center gap-3">
      <span class="text-xs font-semibold px-2 py-1 rounded bg-[#0C1E4A]/20 border border-[#0C1E4A]/10">
        Line: ${place.line || "Safi"}
      </span>
      <span class="font-medium text-base">
        ${place.nom}
      </span>
    </div>
          <span class="text-white font-bold px-4 py-1.5 rounded-full bg-[#0066FF] ">${place.prix || 80} DH / place</span>


  `;

  container.prepend(li);
}
