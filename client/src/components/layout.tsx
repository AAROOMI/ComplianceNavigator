
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import Header from "./header";
import VirtualAssistant from "./ai-assistant/VirtualAssistant";

export default function Layout() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
        <VirtualAssistant />
      </div>
    </div>
  );
}
