import { UserButton } from "@clerk/nextjs"
import { NavLinks } from "./NavLinks"

export const NavBar = () => {
  return (
    <div className="flex items-center ml-0 sm:pl-32 px-4 py-2 bg-gray-800">
      <div className="flex-1">
        <NavLinks/>
      </div>
      <div>
        <UserButton afterSignOutUrl="/"/>
      </div>
    </div>
  )
}
