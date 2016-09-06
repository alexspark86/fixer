import Fixer from "../src/fixer";
import WebFont from "webfontloader";
import "./index.scss";

WebFont.load({
  google: {
    families: ["Merriweather", "PT Serif"]
  }
});

document.addEventListener("DOMContentLoaded", function () {
  let fixer = new Fixer();

  fixer
    .addElement(".menu")
    .addElement("#side-block-1", {
      limit: "#side-block-2"
    })
    .addElement("#side-block-2", {
      limit: ".bottom-block"
    })
    .addElement("#bottom-block-1", {
      position: "bottom"
    })
    .addElement("#bottom-block-2", {
      position: "bottom"
    });
}, false);