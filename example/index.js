import Fixer from "../src/fixer";
import "./index.scss";

document.addEventListener("DOMContentLoaded", function () {
  let fixer = new Fixer();

  fixer
    .addElement(".menu", {
      limit: "#side-block-1"
    })
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
      position: "bottom",
      limit: "#bottom-block-1"
    });
}, false);