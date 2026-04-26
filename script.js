document.addEventListener("DOMContentLoaded", () => {
  const state = {
    property: "Hotel",
    checkin: "",
    checkout: "",
    rooms: 1,
    adults: 1,
    children: 0,
  };

  const propertyTabs = document.querySelectorAll(".tripto-property-tab");
  const checkinTrigger = document.querySelector(".tripto-checkin-trigger");
  const checkoutTrigger = document.querySelector(".tripto-checkout-trigger");
  const checkinInput = document.querySelector(".tripto-checkin-input");
  const checkoutInput = document.querySelector(".tripto-checkout-input");
  const checkinValue = document.querySelector(".tripto-checkin-value");
  const checkoutValue = document.querySelector(".tripto-checkout-value");
  const guestsTrigger = document.querySelector(".tripto-guests-trigger");
  const guestsPanel = document.querySelector(".tripto-guests-panel");
  const guestsApply = document.querySelector(".tripto-guests-apply");
  const guestsInputs = document.querySelectorAll(".tripto-guests-input");
  const roomsCount = document.querySelector(".tripto-rooms-count");
  const adultsCount = document.querySelector(".tripto-adults-count");
  const childrenCount = document.querySelector(".tripto-children-count");

  const formatter = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formatDate = (value) => {
    if (!value) {
      return "Add Dates";
    }
    const date = new Date(`${value}T00:00:00`);
    return formatter.format(date);
  };

  const applyPropertyState = () => {
    propertyTabs.forEach((tab) => {
      const isActive = tab.dataset.property === state.property;
      tab.classList.toggle("tripto-property-tab-active", isActive);
      tab.setAttribute("data-state", isActive ? "Selected" : "No");
    });
  };

  propertyTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      state.property = tab.dataset.property || state.property;
      applyPropertyState();
    });
  });

  const openDatePicker = (inputEl) => {
    if (!inputEl) {
      return;
    }
    if (typeof inputEl.showPicker === "function") {
      inputEl.showPicker();
    } else {
      inputEl.focus();
      inputEl.click();
    }
  };

  if (checkinTrigger && checkinInput) {
    checkinTrigger.addEventListener("click", () =>
      openDatePicker(checkinInput),
    );
  }

  if (checkoutTrigger && checkoutInput) {
    checkoutTrigger.addEventListener("click", () =>
      openDatePicker(checkoutInput),
    );
  }

  if (checkinInput) {
    checkinInput.addEventListener("change", () => {
      state.checkin = checkinInput.value;
      checkinValue.textContent = formatDate(state.checkin);
      checkoutInput.min = state.checkin || "";

      if (state.checkout && state.checkout < state.checkin) {
        state.checkout = "";
        checkoutInput.value = "";
        checkoutValue.textContent = "Add Dates";
      }
    });
  }

  if (checkoutInput) {
    checkoutInput.addEventListener("change", () => {
      state.checkout = checkoutInput.value;
      checkoutValue.textContent = formatDate(state.checkout);
    });
  }

  const syncGuestSummary = () => {
    roomsCount.textContent = String(state.rooms);
    adultsCount.textContent = String(state.adults);
    childrenCount.textContent = `,${state.children}`;
  };

  if (guestsTrigger && guestsPanel) {
    guestsTrigger.addEventListener("click", (event) => {
      event.stopPropagation();
      guestsPanel.hidden = !guestsPanel.hidden;
    });

    guestsPanel.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }

  if (guestsApply) {
    guestsApply.addEventListener("click", () => {
      guestsInputs.forEach((input) => {
        const value = Number(input.value || 0);
        const safeValue = Number.isNaN(value) ? 0 : value;
        if (input.dataset.target === "rooms") {
          state.rooms = Math.max(1, safeValue);
        }
        if (input.dataset.target === "adults") {
          state.adults = Math.max(1, safeValue);
        }
        if (input.dataset.target === "children") {
          state.children = Math.max(0, safeValue);
        }
      });
      syncGuestSummary();
      guestsPanel.hidden = true;
    });
  }

  document.addEventListener("click", () => {
    if (guestsPanel && !guestsPanel.hidden) {
      guestsPanel.hidden = true;
    }
  });

  syncGuestSummary();
  applyPropertyState();
});
