"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const Sidebar = dynamic(() => import("./Sidebar"), { ssr: false });

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDocOpen = pathname !== "/docs";

  return (
    <div className="flex flex-1 flex-row overflow-hidden">
      <div className={isDocOpen ? "hidden md:flex" : "flex w-full"}>
        <Sidebar />
      </div>
      <div className={isDocOpen ? "flex flex-1 flex-col overflow-hidden" : "hidden md:flex md:flex-1 md:flex-col md:overflow-hidden"}>
        {children}
      </div>
    </div>
  );
}
