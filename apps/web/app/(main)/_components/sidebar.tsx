import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { NavUser } from "./nav-user"
import { Separator } from "@/components/ui/separator"

interface AppSideBarProps extends React.ComponentProps<typeof Sidebar> {}

export function AppSidebar({ ...props }: AppSideBarProps) {
  return (
    <Sidebar {...props}>
      <div className="flex flex-1 flex-col justify-between">
        <SidebarHeader>
          <div>
            <h1 className="text-left text-base font-semibold sm:text-xl md:text-2xl">
              Commit.io {"</>"}
            </h1>
          </div>
        </SidebarHeader>
        <Separator />
        <SidebarContent>
          <nav></nav>
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
      </div>
    </Sidebar>
  )
}
