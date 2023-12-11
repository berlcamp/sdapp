'use client'
import Link from "next/link"
import { usePathname } from "next/navigation"

export const NavLinks = () => {
  const currentRoute = usePathname()

  return (
    <div className="space-x-4">
      <Link className={`${currentRoute === '/' ? 'underline underline-offset-4 font-bold text-gray-200' : 'text-gray-300'}`} href='/'>Duplicates</Link>
      <Link className={`${currentRoute === '/heads' ? 'underline underline-offset-4 font-bold text-gray-200' : 'text-gray-300'}`}  href='/heads'>Head&nbsp;SP</Link>
      <Link className={`${currentRoute === '/notregistered' ? 'underline underline-offset-4 font-bold text-gray-200' : 'text-gray-300'}`}  href='/notregistered'>Not&nbsp;Registered</Link>
      <Link className={`${currentRoute === '/search' ? 'underline underline-offset-4 font-bold text-gray-200' : 'text-gray-300'}`}  href='/search'>Search</Link>
    </div>
  )
}
