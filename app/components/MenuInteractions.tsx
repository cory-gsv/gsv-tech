"use client";

import { useEffect } from "react";

export default function MenuInteractions() {
  useEffect(() => {
    const menus = Array.from(
      document.querySelectorAll<HTMLDetailsElement>(".gsv-services-menu")
    );

    if (!menus.length) return;

    function closeAllMenus(except?: HTMLDetailsElement) {
      menus.forEach((menu) => {
        if (menu !== except) menu.open = false;
      });
    }

    function handleDocumentPointerDown(event: MouseEvent | PointerEvent) {
      const target = event.target as Node | null;
      if (!target) return;

      menus.forEach((menu) => {
        if (menu.open && !menu.contains(target)) {
          menu.open = false;
        }
      });
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeAllMenus();
      }
    }

    function handleToggle(event: Event) {
      const currentMenu = event.currentTarget as HTMLDetailsElement;
      if (currentMenu.open) closeAllMenus(currentMenu);
    }

    const cleanupFns: Array<() => void> = [];

    menus.forEach((menu) => {
      menu.addEventListener("toggle", handleToggle);
      cleanupFns.push(() => menu.removeEventListener("toggle", handleToggle));

      const links = Array.from(menu.querySelectorAll<HTMLAnchorElement>("a"));
      links.forEach((link) => {
        const closeOnClick = () => {
          menu.open = false;
        };

        link.addEventListener("click", closeOnClick);
        cleanupFns.push(() => link.removeEventListener("click", closeOnClick));
      });

      const cards = Array.from(
        menu.querySelectorAll<HTMLElement>(".gsv-services-mega-card")
      );

      cards.forEach((card) => {
        const enter = () => card.classList.add("is-menu-card-hovered");
        const leave = () => card.classList.remove("is-menu-card-hovered");

        card.addEventListener("pointerenter", enter);
        card.addEventListener("pointerleave", leave);

        cleanupFns.push(() => {
          card.removeEventListener("pointerenter", enter);
          card.removeEventListener("pointerleave", leave);
        });
      });
    });

    document.addEventListener("pointerdown", handleDocumentPointerDown, true);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handleDocumentPointerDown, true);
      document.removeEventListener("keydown", handleKeyDown);
      cleanupFns.forEach((cleanup) => cleanup());
    };
  }, []);

  return null;
}
