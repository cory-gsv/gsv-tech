"use client";

import { useEffect } from "react";

export default function MenuAutoClose() {
  useEffect(() => {
    const closeAllMenus = () => {
      document.querySelectorAll<HTMLDetailsElement>(".gsv-services-menu[open]").forEach((menu) => {
        menu.open = false;
      });
    };

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Element | null;

      if (!target) return;

      const openMenu = document.querySelector<HTMLDetailsElement>(".gsv-services-menu[open]");
      if (!openMenu) return;

      if (!openMenu.contains(target)) {
        openMenu.open = false;
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeAllMenus();
      }
    };

    const handleLinkClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const clickedLink = target?.closest(".gsv-services-menu a");

      if (clickedLink) {
        closeAllMenus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleLinkClick, true);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleLinkClick, true);
    };
  }, []);

  return null;
}
