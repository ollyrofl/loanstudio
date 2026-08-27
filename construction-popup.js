document.addEventListener("DOMContentLoaded", function () {
    // Only show once per browser session
    if (sessionStorage.getItem("constructionLoanPopupShown")) {
      return;
    }
  
    // Create popup HTML
    const popup = document.createElement("div");
  
    popup.id = "construction-loan-popup";
  
    popup.className =
      "pointer-events-none fixed inset-0 z-[9999] flex items-center justify-center bg-black/0 px-4 opacity-0 transition-all duration-300";
  
    popup.setAttribute("aria-hidden", "true");
  
    popup.innerHTML = `
      <div
        id="construction-loan-popup-content"
        class="relative w-full max-w-lg scale-95 rounded-2xl bg-white p-8 text-center opacity-0 shadow-2xl transition-all duration-300 sm:p-10"
        role="dialog"
        aria-modal="true"
        aria-labelledby="construction-popup-title"
      >
        <button
          id="construction-popup-close"
          type="button"
          class="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-900"
          aria-label="Close popup"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
  
        <p class="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
          Planning to Build?
        </p>
  
        <h2
          id="construction-popup-title"
          class="mb-4 text-2xl font-bold leading-tight text-gray-900 sm:text-3xl"
        >
          Talk to a Construction Lending Specialist
        </h2>
  
        <p class="mb-7 text-base leading-relaxed text-gray-600">
          Get expert help comparing lenders, structuring your finance and managing
          progress payments throughout your build.
        </p>
  
        <a
          href="/services/construction-loan-brokers/"
          class="inline-flex w-full items-center justify-center rounded-lg bg-gray-900 px-6 py-3.5 font-semibold text-white transition duration-200 hover:bg-gray-700 sm:w-auto"
        >
          Explore Construction Loans
  
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="ml-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </a>
  
        <p class="mt-5 text-sm italic text-gray-500">
          Specialist support from planning through to completion.
        </p>
      </div>
    `;
  
    // Add it to the page
    document.body.appendChild(popup);
  
    const popupContent = document.getElementById(
      "construction-loan-popup-content"
    );
  
    const closeButton = document.getElementById(
      "construction-popup-close"
    );
  
    function openPopup() {
      popup.classList.remove(
        "pointer-events-none",
        "opacity-0",
        "bg-black/0"
      );
  
      popup.classList.add(
        "opacity-100",
        "bg-black/50"
      );
  
      popupContent.classList.remove(
        "scale-95",
        "opacity-0"
      );
  
      popupContent.classList.add(
        "scale-100",
        "opacity-100"
      );
  
      popup.setAttribute("aria-hidden", "false");
  
      document.body.style.overflow = "hidden";
  
      sessionStorage.setItem(
        "constructionLoanPopupShown",
        "true"
      );
    }
  
    function closePopup() {
      popup.classList.add(
        "pointer-events-none",
        "opacity-0",
        "bg-black/0"
      );
  
      popup.classList.remove(
        "opacity-100",
        "bg-black/50"
      );
  
      popupContent.classList.add(
        "scale-95",
        "opacity-0"
      );
  
      popupContent.classList.remove(
        "scale-100",
        "opacity-100"
      );
  
      popup.setAttribute("aria-hidden", "true");
  
      document.body.style.overflow = "";
    }
  
    // Show after 5 seconds
    setTimeout(function () {
      openPopup();
    }, 5000);
  
    // Close button
    closeButton.addEventListener("click", closePopup);
  
    // Close when clicking overlay
    popup.addEventListener("click", function (event) {
      if (event.target === popup) {
        closePopup();
      }
    });
  
    // Close with Escape
    document.addEventListener("keydown", function (event) {
      if (
        event.key === "Escape" &&
        popup.getAttribute("aria-hidden") === "false"
      ) {
        closePopup();
      }
    });
  });