(() => {
  const styleSelect = document.querySelector("#style");
  const ratioSelect = document.querySelector("#ratio");
  const previewImage = document.querySelector("#previewImage");
  const resultStatus = document.querySelector("#resultStatus");
  const resultTitle = document.querySelector("#resultTitle");
  const generateButton = document.querySelector("#generateButton");
  const inlineResult = document.querySelector("#inlineResult");
  const inlineImage = inlineResult?.querySelector("img");
  const inlineStatus = document.querySelector("#inlineStatus");
  const inlineTitle = document.querySelector("#inlineTitle");
  const chips = [...document.querySelectorAll(".chip")];

  const styleImages = {
    "产品摄影": "assets/gallery-product.png",
    "电影感": "assets/hero-studio.png",
    "室内设计": "assets/gallery-interior.png",
    "奇幻概念": "assets/gallery-fantasy.png",
  };

  const requiredNodes = [
    styleSelect,
    ratioSelect,
    previewImage,
    resultStatus,
    resultTitle,
    generateButton,
    inlineImage,
    inlineStatus,
    inlineTitle,
  ];

  if (requiredNodes.some((node) => !node)) {
    console.warn("DreamCanvas: generator markup is incomplete.");
    return;
  }

  function setActiveStyle(style) {
    styleSelect.value = style;
    chips.forEach((chip) => {
      chip.classList.toggle("is-active", chip.dataset.style === style);
    });
  }

  function setGenerating(isGenerating) {
    generateButton.classList.toggle("is-generating", isGenerating);
    generateButton.disabled = isGenerating;
    generateButton.lastChild.textContent = isGenerating ? " 生成中..." : " 生成图片";
  }

  function finishGeneration(style) {
    const image = styleImages[style] || styleImages["电影感"];
    const title = `${style} · ${ratioSelect.value}`;

    previewImage.src = image;
    inlineImage.src = image;
    resultStatus.textContent = "已生成";
    inlineStatus.textContent = "生成成功";
    resultTitle.textContent = title;
    inlineTitle.textContent = title;
    setGenerating(false);

    inlineResult.animate(
      [
        { transform: "translateY(4px)", opacity: 0.7 },
        { transform: "translateY(0)", opacity: 1 },
      ],
      { duration: 220, easing: "ease-out" },
    );
  }

  function correctGeneratorHashScroll() {
    if (window.location.hash !== "#generator") return;

    const header = document.querySelector(".site-header");
    const headerHeight = header ? header.getBoundingClientRect().height : 0;
    const top = window.scrollY + generateButton.closest("#generator").getBoundingClientRect().top;

    window.scrollTo({
      top: Math.max(top - headerHeight - 22, 0),
      behavior: "auto",
    });
  }

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      setActiveStyle(chip.dataset.style);
    });
  });

  styleSelect.addEventListener("change", () => setActiveStyle(styleSelect.value));

  generateButton.addEventListener("click", () => {
    const style = styleSelect.value;
    setGenerating(true);
    resultStatus.textContent = "生成中";
    inlineStatus.textContent = "正在生成";
    inlineTitle.textContent = "请稍等，正在整理预览结果";

    window.clearTimeout(generateButton._timer);
    generateButton._timer = window.setTimeout(() => {
      try {
        finishGeneration(style);
      } catch (error) {
        console.error(error);
        inlineStatus.textContent = "生成失败";
        inlineTitle.textContent = "请刷新页面后重试";
        resultStatus.textContent = "生成失败";
        setGenerating(false);
      }
    }, 700);
  });

  setActiveStyle(styleSelect.value);
  window.addEventListener("hashchange", () => {
    window.requestAnimationFrame(correctGeneratorHashScroll);
  });
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(correctGeneratorHashScroll);
  });
})();
