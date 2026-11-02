document.addEventListener("DOMContentLoaded", function () {
    console.log("construction-popup.js loaded");
  
    const storageKey = "constructionLoanPopupShown";

    // ?popup in the URL forces it to show straight away (for testing)
    const forcePopup = new URLSearchParams(window.location.search).has("popup");

    // Don't show again in the same browser session
    if (!forcePopup && sessionStorage.getItem(storageKey)) {
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
        max-width: 880px;
        max-height: calc(100vh - 40px);
        background: #ffffff;
        border-radius: 20px;
        overflow: auto;
        box-shadow: 0 24px 70px rgba(0, 0, 0, 0.25);
        transform: scale(0.95) translateY(10px);
        opacity: 0;
        transition:
          transform 0.3s ease,
          opacity 0.3s ease;
      }

      #construction-loan-popup.is-visible
      #construction-loan-popup-content {
        transform: scale(1) translateY(0);
        opacity: 1;
      }

      .construction-popup-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
        align-items: stretch;
      }

      .construction-popup-media {
        background: #f3f1ea;
        min-width: 0;
      }

      .construction-popup-media video {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .construction-popup-body {
        min-width: 0;
        padding: 48px 44px 40px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: left;
        font-family: 'Inter', sans-serif;
      }

      .construction-popup-eyebrow {
        margin: 0 0 12px;
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: #E04E08;
      }

      .construction-popup-title {
        margin: 0 0 16px;
        font-size: 36px;
        line-height: 1.1;
        font-weight: 600;
        letter-spacing: -0.02em;
        color: #305047;
      }

      .construction-popup-description {
        margin: 0 0 28px;
        font-size: 16px;
        line-height: 1.6;
        color: #4b5563;
      }

      .construction-popup-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        align-self: flex-start;
        padding: 14px 28px;
        border-radius: 999px;
        background: #E04E08;
        color: #ffffff;
        font-size: 16px;
        font-weight: 600;
        text-decoration: none;
        white-space: nowrap;
        box-shadow: 0 10px 24px rgba(224, 78, 8, 0.25);
        transition: background 0.2s ease;
      }

      .construction-popup-button:hover {
        background: #c54305;
      }

      #construction-popup-close {
        position: absolute;
        top: 12px;
        right: 12px;
        z-index: 2;
        width: 38px;
        height: 38px;

        display: flex;
        align-items: center;
        justify-content: center;

        border: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.9);
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

      @media (max-width: 767px) {
        #construction-loan-popup-content {
          max-width: 440px;
        }

        .construction-popup-grid {
          grid-template-columns: minmax(0, 1fr);
        }

        .construction-popup-media video {
          height: 200px;
        }

        .construction-popup-body {
          padding: 24px 24px 28px;
          text-align: center;
        }

        .construction-popup-title {
          font-size: 26px;
          margin-bottom: 12px;
        }

        .construction-popup-description {
          font-size: 15px;
          margin-bottom: 22px;
        }

        .construction-popup-button {
          align-self: stretch;
        }

        .construction-popup-footer {
          margin-top: 16px;
          font-size: 13px;
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
        <div class="construction-popup-grid">
          <div class="construction-popup-media">
            <video autoplay muted loop playsinline aria-hidden="true">
              <source src="/images/const-video-comp.mp4" type="video/mp4">
            </video>
          </div>
          <div class="construction-popup-body">
            <p class="construction-popup-eyebrow">Planning to Build?</p>

            <h2 id="construction-popup-title" class="construction-popup-title">
              Talk to a Construction Lending Specialist
            </h2>

            <p class="construction-popup-description">
              Get expert help comparing lenders, structuring your finance
              and managing progress payments throughout your build.
            </p>

            <a href="/services/construction-loan-brokers/" class="construction-popup-button">
              Explore Construction Loans <span aria-hidden="true">→</span>
            </a>

            <p class="construction-popup-footer">
              Specialist support from planning through to completion.
            </p>
          </div>
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
    setTimeout(showPopup, forcePopup ? 300 : 5000);
  
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