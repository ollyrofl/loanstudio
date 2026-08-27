document.addEventListener("DOMContentLoaded", function () {
    console.log("construction-popup.js loaded");
  
    const storageKey = "constructionLoanPopupShown";
  
    // Don't show again in the same browser session
    if (sessionStorage.getItem(storageKey)) {
      console.log("Popup already shown this session");
      return;
    }
  
    // Inject popup CSS
    const style = document.createElement("style");
  
    style.textContent = `
      #construction-loan-popup {
        position: fixed;
        inset: 0;
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        background: rgba(0, 0, 0, 0);
        opacity: 0;
        visibility: hidden;
        transition:
          opacity 0.3s ease,
          background 0.3s ease,
          visibility 0.3s ease;
      }
  
      #construction-loan-popup.is-visible {
        background: rgba(0, 0, 0, 0.55);
        opacity: 1;
        visibility: visible;
      }
  
      #construction-loan-popup-content {
        position: relative;
        width: 100%;
        max-width: 60%;
        background: #ffffff;
        border-radius: 15px;
        text-align: center;
        box-shadow: 0 24px 70px rgba(0, 0, 0, 0.25);
        transform: scale(0.95) translateY(10px);
        opacity: 0;
        transition:
          transform 0.3s ease,
          opacity 0.3s ease;
          overflow: auto;
      }
  
      #construction-loan-popup.is-visible
      #construction-loan-popup-content {
        transform: scale(1) translateY(0);
        opacity: 1;
      }
  
      #construction-popup-close {
        position: absolute;
        top: 14px;
        right: 14px;
        width: 38px;
        height: 38px;
  
        display: flex;
        align-items: center;
        justify-content: center;
  
        border: 0;
        border-radius: 50%;
        background: transparent;
        color: #666;
        cursor: pointer;
  
        font-size: 26px;
        line-height: 1;
      }
  
      #construction-popup-close:hover {
        background: #f3f4f6;
        color: #111;
      }
  
      .construction-popup-footer {
        margin: 20px 0 0;
        font-size: 14px;
        line-height: 1.5;
        font-style: italic;
        color: #6b7280;
      }
  
      @media (max-width: 640px) {
  
        .construction-popup-title {
          font-size: 24px;
        }
  
        .construction-popup-button {
          width: 100%;
          box-sizing: border-box;
        }
        #construction-loan-popup-content {
            max-width: 100%;
        }
        #construction-loan-popup-content video{
            width: 70% !important;
            margin: 20px auto 0;
        }
      }
    `;
  
    document.head.appendChild(style);
  
    // Create popup
    const popup = document.createElement("div");
  
    popup.id = "construction-loan-popup";
  
    popup.innerHTML = `
      <div
        id="construction-loan-popup-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="construction-popup-title"
      >
  
        <button
          id="construction-popup-close"
          type="button"
          aria-label="Close popup"
        >
          &times;
        </button>
        <div class="md:grid-cols-2 items-center grid">
        <video autoplay muted loop playsinline style="width: 100%; height: auto;" class="relative rounded-2xl w-full object-cover shadow-2xl">
            <source src="/images/const-video-comp.mp4" type="video/mp4"></video>
            <div class="md:p-4 p-2 bg-white"><p class="construction-popup-eyebrow uppercase text-sm font-bold text-[#E04E08] tracking-widest font-sans mb-2 pt-4 md:pt-0">
            Planning to Build?
          </p>
    
          <h2 id="construction-popup-title" class="text-[#305047] text-2xl md:text-5xl font-sans font-semibold md:mb-4 mb-3">
            Talk to a Construction Lending Specialist
          </h2>
    
          <p class="construction-popup-description text-gray-600 md:text-lg text-sm leading-relaxed font-sans mb-2  md:mb-6">
            Get expert help comparing lenders, structuring your finance
            and managing progress payments throughout your build.
          </p>
    
          <a href="/services/construction-loan-brokers/" class="inline-flex items-center justify-center hover:bg-[#dd6831] transition-all duration-300 gap-2 shadow-[#DDF2A8]/20 group text-[white] text-base sm:text-lg font-semibold font-sans bg-[#E04E08] rounded-full pt-4 pr-6 sm:pr-8 pb-4 pl-6 sm:pl-8 shadow-lg whitespace-nowrap">
            Explore Construction Loans &nbsp; →
          </a>
    
          <p class="construction-popup-footer">
            Specialist support from planning through to completion.
          </p></div>
        </div>
  
      </div>
    `;
  
    document.body.appendChild(popup);
  
    const closeButton = document.getElementById(
      "construction-popup-close"
    );
  
    function showPopup() {
      console.log("Showing construction popup");
  
      popup.classList.add("is-visible");
  
      document.body.style.overflow = "hidden";
  
      sessionStorage.setItem(storageKey, "true");
    }
  
    function closePopup() {
      popup.classList.remove("is-visible");
  
      document.body.style.overflow = "";
    }
  
    // Show after 5 seconds
    setTimeout(showPopup, 5000);
  
    // Close button
    closeButton.addEventListener("click", closePopup);
  
    // Close by clicking dark overlay
    popup.addEventListener("click", function (event) {
      if (event.target === popup) {
        closePopup();
      }
    });
  
    // Escape key
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closePopup();
      }
    });
  });