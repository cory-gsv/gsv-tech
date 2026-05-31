"use client";

import { useEffect } from "react";

export default function MenuAutoClose() {
  useEffect(() => {
    const closeTimers = new Map<HTMLDetailsElement, ReturnType<typeof setTimeout>>();

    const closeMenu = (menu: HTMLDetailsElement) => {
      if (!menu.open || menu.classList.contains("is-menu-closing")) return;

      menu.classList.add("is-menu-closing");

      const existingTimer = closeTimers.get(menu);
      if (existingTimer) clearTimeout(existingTimer);

      const timer = setTimeout(() => {
        menu.open = false;
        menu.classList.remove("is-menu-closing");
        closeTimers.delete(menu);
      }, 380);

      closeTimers.set(menu, timer);
    };

    const closeAllMenus = (except?: HTMLDetailsElement) => {
      document.querySelectorAll<HTMLDetailsElement>(".gsv-services-menu[open]").forEach((menu) => {
        if (menu !== except) closeMenu(menu);
      });
    };

    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (!target) return;

      const summary = target.closest<HTMLElement>(".gsv-services-menu summary");

      if (summary) {
        const menu = summary.closest<HTMLDetailsElement>(".gsv-services-menu");

        if (!menu) return;

        event.preventDefault();

        if (menu.open) {
          closeMenu(menu);
        } else {
          menu.classList.remove("is-menu-closing");
          closeAllMenus(menu);
          menu.open = true;
        }

        return;
      }

      const clickedLink = target.closest(".gsv-services-menu a");

      if (clickedLink) {
        closeAllMenus();
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Element | null;

      if (!target) return;

      const openMenu = document.querySelector<HTMLDetailsElement>(".gsv-services-menu[open]");
      if (!openMenu) return;

      if (!openMenu.contains(target)) {
        closeMenu(openMenu);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeAllMenus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleDocumentClick, true);

    return () => {
      closeTimers.forEach((timer) => clearTimeout(timer));
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, []);

  return null;
}
