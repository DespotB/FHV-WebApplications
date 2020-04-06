function popUpImage(imageUrl) {
  let img = new Image();
  img.src = imageUrl;
  img.onload = function () {
    let frame = window.open(imageUrl, `${imageUrl}`, `width=${img.width},height=${img.height}`);

    //drücke auf Bild um es zu schließen
    frame.onload = function () {
      frame.document.getElementsByTagName("img")[0].onclick = function () {
        frame.close();
      }
    }
  }
}
