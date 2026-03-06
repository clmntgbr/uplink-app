"use client";

import dynamic from "next/dynamic";
import { ProjectSwitcher } from "./project/project-switcher";
import { UserMenu } from "./user-menu";

const Menu = dynamic(() => import("./menu").then((mod) => mod.Menu), {
  ssr: false,
});

export function Header() {
  return (
    <div className="mx-auto border-b sticky top-0 bg-background">
      <header className="@container/main grid grid-cols-[1fr_auto_1fr] gap-2 items-center px-4 py-2">
        <div className="flex items-center justify-self-start">
          <ProjectSwitcher />
        </div>
        <div className="flex items-center justify-self-center">
          <Menu />
        </div>
        <div className="flex items-center justify-self-end">
          <UserMenu />
        </div>
      </header>
    </div>
  );
}
