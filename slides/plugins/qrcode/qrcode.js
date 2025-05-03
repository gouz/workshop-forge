window.addEventListener("load", () => {
  document.querySelectorAll(".sd-qrcode").forEach((e, _) => {
    e.innerHTML = window.QRCodeRender(
      window.QRCodeGetMatrix(e.getAttribute("data-url")),
      "#000",
    );
  })
});
