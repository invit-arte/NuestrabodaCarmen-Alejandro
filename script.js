document.addEventListener("DOMContentLoaded", function () {
  initOpeningScreen();
  initRevealAnimations();
  initCountdown();
  initWhatsAppRSVP();
});


/* =========================
   ANIMACIONES AL DESLIZAR
========================= */

function initRevealAnimations() {
  const elements = document.querySelectorAll(
  ".reveal, .reveal-card, .reveal-line"
);

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => {
      element.classList.add("is-visible");
    });

    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.28
    }
  );

  elements.forEach((element) => {
    observer.observe(element);
  });
}


/* =========================
   CONTADOR REGRESIVO
========================= */

function initCountdown() {
  const daysElement = document.getElementById("days");
  const hoursElement = document.getElementById("hours");
  const minutesElement = document.getElementById("minutes");
  const secondsElement = document.getElementById("seconds");

  // Cambia aquí la fecha de la boda.
  const eventDate = new Date("Octuber 24, 2026 13:00:00").getTime();

  function updateCountdown() {
    const currentDate = new Date().getTime();
    const distance = eventDate - currentDate;

    if (distance <= 0) {
      daysElement.textContent = "00";
      hoursElement.textContent = "00";
      minutesElement.textContent = "00";
      secondsElement.textContent = "00";

      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));

    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) /
      (1000 * 60 * 60)
    );

    const minutes = Math.floor(
      (distance % (1000 * 60 * 60)) /
      (1000 * 60)
    );

    const seconds = Math.floor(
      (distance % (1000 * 60)) /
      1000
    );

    daysElement.textContent = formatNumber(days);
    hoursElement.textContent = formatNumber(hours);
    minutesElement.textContent = formatNumber(minutes);
    secondsElement.textContent = formatNumber(seconds);
  }

  updateCountdown();

  setInterval(updateCountdown, 1000);
}

function formatNumber(number) {
  return String(number).padStart(2, "0");
}

/* =========================
   APERTURA DE LA INVITACIÓN
========================= */

function initOpeningScreen() {
  const openingScreen = document.getElementById("openingScreen");
  const openButton = document.getElementById("openInvitation");
  const sealVideo = document.getElementById("sealVideo");
  const invitation = document.getElementById("invitation");
  const backgroundMusic = document.getElementById("backgroundMusic");

  if (
    !openingScreen ||
    !openButton ||
    !sealVideo ||
    !invitation
  ) {
    console.error(
      "Faltan elementos necesarios para abrir la invitación."
    );

    return;
  }

  document.body.classList.add("opening-active");

  let isOpening = false;

  openButton.addEventListener("click", async function () {
    if (isOpening) return;

    isOpening = true;
    openButton.disabled = true;

    /*
     * El clic del usuario permite intentar reproducir
     * tanto el video como el audio.
     */
    sealVideo.currentTime = 0;
    sealVideo.classList.add("is-playing");

    try {
      await sealVideo.play();
    } catch (error) {
      console.warn("No se pudo reproducir el video:", error);

      openInvitationPage();
      return;
    }

    if (backgroundMusic) {
      backgroundMusic.volume = 0.65;

      try {
        await backgroundMusic.play();
      } catch (error) {
        console.warn("No se pudo iniciar la música:", error);
      }
    }
  });

  sealVideo.addEventListener("ended", function () {
    openInvitationPage();
  });

  function openInvitationPage() {
    invitation.classList.add("is-open");

    openingScreen.classList.add("is-hidden");
    document.body.classList.remove("opening-active");

    window.scrollTo(0, 0);

    setTimeout(function () {
      openingScreen.style.display = "none";
    }, 850);
  }
}
/* =========================
   CONFIRMACIÓN POR WHATSAPP
========================= */

function initWhatsAppRSVP() {
  const form = document.getElementById("rsvpForm");

  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const attendance = document.getElementById("attendance").value;
    const guestName = document.getElementById("guestName").value.trim();
    const guestMessage = document.getElementById("guestMessage").value.trim();
    const confirmData = document.getElementById("confirmData").checked;

    if (!attendance || !guestName || !confirmData) {
      alert("Por favor completa los campos obligatorios.");
      return;
    }

    /*
      Cambia este número por el WhatsApp de los novios.
      Debe llevar código de país, sin +, espacios ni guiones.

      Ejemplo México:
      5214771234567
    */
    const whatsappNumber = "523411026948";

    let message =
      "Hola, quiero confirmar mi asistencia a la boda.%0A%0A" +
      "Confirmación: " + encodeURIComponent(attendance) + "%0A" +
      "Nombre de los asistentes: " + encodeURIComponent(guestName);

    if (guestMessage) {
      message +=
        "%0A" +
        "Mensaje para los novios: " +
        encodeURIComponent(guestMessage);
    }

    const whatsappURL =
      "https://wa.me/" +
      whatsappNumber +
      "?text=" +
      message;

    window.open(
      whatsappURL,
      "_blank",
      "noopener,noreferrer"
    );
  });
}
