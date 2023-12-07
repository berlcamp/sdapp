import Households from "@/components/Households"
import { UserButton } from "@clerk/nextjs"
import { currentUser } from '@clerk/nextjs'

export default async function Home() {
  const user = await currentUser()

  const id = user?.id
  let barangays: string[] = []

  // Berl
  if (id === 'user_2ZA73AGLyPUkOXHfSWwNODxsMrG') {
    barangays.push('50th', 'Aguada', 'tabid', 'manaka')
  }

  return (
    <div className="max-w-5xl px-4 py-10 mx-auto">
      <UserButton afterSignOutUrl="/"/>
      <div className='sm:fixed sm:top-28 sm:left-5 sm:mt-0 mt-8 mb-4'>
        <div className="text-white">Legend:</div>
        <div className="text-gray-300 text-xs mt-2 flex flex-col items-start gap-3">
          <div>
            <div>Active Household</div>
            <div className="h-8 w-8 bg-yellow-200"></div>
          </div>

          <div>
            <div>Deleted Household</div>
            <div className="h-8 w-8 bg-red-500"></div>
          </div>

          <div>
            <div>Deleted Member</div>
            <div className="h-2 w-16 bg-red-500"></div>
          </div>

          <div>
            <div>Possible Duplicate</div>
            <div className="mt-4 h-px w-16 bg-green-500"></div>
          </div>
        </div>
      </div>
      <div className="ml-0 sm:ml-32">
        <Households barangays={barangays}/>
      </div>
    </div>
  )
}
