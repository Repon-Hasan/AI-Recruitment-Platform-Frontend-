import { UserRole } from "./navigation-config";
import { Sidebar } from "./sidebar";

export function DesktopSidebar({
  role,
}: {
  role: UserRole;
}) {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r bg-background lg:block">
      <Sidebar role={role} />
    </aside>
  );
}