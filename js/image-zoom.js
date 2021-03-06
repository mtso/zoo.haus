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
      var pop = createZoom(zoomSrc, image.getAttribute("data-zoom-bgcolor"));
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

    function createZoom(src, bgcolor) {
      var pop = document.createElement("div");
      var popImageContainer = document.createElement("div");
      var popImage = document.createElement("img");
      popImage.src = src;

      popImage.style.width = "100%";
      popImage.style.height = "auto";
      popImage.style.backgroundColor = bgcolor || "#d0ccdf"; /* "#dfcccc"; */
      popImage.style.margin = "auto";

      popImageContainer.style.height = "auto";
      popImageContainer.style.display = "inline-block";
      popImageContainer.style.margin = "auto";
      popImageContainer.style.padding = "20px";

      pop.style.display = "flex";
      pop.style.justifyContent = "center";
      pop.style.alignItems = "center";
      pop.style.position = "fixed";
      pop.style.left = "0";
      pop.style.top = "0";
      pop.style.width = "100%";
      pop.style.height = "100%";
      pop.style.backgroundColor = "rgba(215,215,230,0.8)";
      pop.style.overflow = "scroll";
      pop.style.cursor = "zoom-out";

      var raw = document.createElement("a");
      raw.setAttribute("href", src);
      raw.innerText = "View Raw Image";

      popImageContainer.appendChild(popImage);
      popImageContainer.appendChild(raw);
      pop.appendChild(popImageContainer);
      return pop;
    }
  }
})();
