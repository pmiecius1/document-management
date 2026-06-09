import Sidebar from "./Sidebar";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-row overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
    </div>
  );
}
