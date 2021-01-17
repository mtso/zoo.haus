;(function() {
  window.addEventListener("load", init);

  function init() {
    var allImages = document.getElementsByTagName("img");
    var images = [];
    var dataShowName = "data-zoom-show";

    for (var i = 0; i < allImages.length; ++i) {
      if (null !== allImages[i].getAttribute("data-zoom-src")) {
        images.push(allImages[i]);
      }
    }

    images.forEach(function(image) {
      image.style.cursor = "zoom-in";

      var zoomSrc = image.getAttribute("data-zoom-src");
      var pop = createZoom(zoomSrc);
      image.addEventListener("click", toggle);
      pop.addEventListener("click", toggle);

      function toggle(event) {
      	if ("" === image.getAttribute(dataShowName) || null === image.getAttribute(dataShowName)) {
          document.body.appendChild(pop);
          image.setAttribute(dataShowName, "show");
      	} else {
      	  pop.remove();
          image.setAttribute(dataShowName, "");
      	}
      }
    });

    function createZoom(src) {
      var pop = document.createElement("div");
      var popImage = document.createElement("img");
      popImage.style.width = "100%";
      popImage.style.height = "auto";
      popImage.style.backgroundColor = "#dfcccc";
      popImage.src = src;
      pop.style.position = "fixed";
      pop.style.left = "0";
      pop.style.top = "0";
      pop.style.width = "100%";
      pop.style.height = "100%";
      pop.style.backgroundColor = "rgba(255,255,255,0.8)";
      pop.style.overflow = "scroll";
      pop.appendChild(popImage);
      pop.style.cursor = "zoom-out";
      return pop;
    }
  }
})();
