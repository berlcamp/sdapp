'use client'
import Link from "next/link"
import { usePathname } from "next/navigation"

export const NavLinks = () => {
  const currentRoute = usePathname()

  return (
    <div className="space-x-4 space-y-2">
      <Link className={`inline-flex ${currentRoute === '/households' ? 'underline underline-offset-4 font-bold text-gray-200' : 'text-gray-300'}`}  href='/households'>Households</Link>
    </div>
  )
}
