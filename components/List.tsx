'use client'
import React, { useEffect, useState } from 'react'
import Loading from '@/components/Loading'
import axios from 'axios'

interface MembersType {
  id: string
  lastname: string
  firstname: string
  middlename: string
}

interface HouseholdsType {
  household_id: string
  masterlist_number: string
  barangay: string
  address: string
  members: MembersType[]
}

function List() {
  const [loading, setLoading] = useState(false)
  const [boxMessage, setBoxMessage] = useState('Search for Name')
  const [filterName, setFilterName] = useState('')
  const [data, setData] = useState<HouseholdsType[] | []>([])

  const apiUrl = process.env.NEXT_PUBLIC_AO_API_URL ?? ''

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    handleSearch()
  }

  const handleSearch = async () => {
    if (filterName.trim() === '') return
    setLoading(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_AO_API_URL ?? ''

      const params = {
        filterKeyword: filterName,
        take: 10,
        skip: 0
      }

      await axios.get(`${apiUrl}/districthouseholds`, { params })
        .then(response => {
          const d: HouseholdsType[] = response.data
          if (d.length === 0) {
            setBoxMessage('No results found')
          } else {
            setBoxMessage('')
          }
          setData(d)
        })
    } catch (error) {
      console.error('error', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (filterName === '') {
      setFilterName('')
      setData([])
    }
    setBoxMessage('Search for Name')
  }, [filterName])

  return (
    <div>
      <div className="text-center text-2xl text-gray-300">Search for District 2 Household Member</div>
      <div className="text-gray-300 text-sm mt-6 mb-2">
        <form onSubmit={handleSubmit}>
          <div className="w-full flex justify-between space-x-2">
            <div className='flex space-x-1'>
              <input
                placeholder='Search Name'
                className='outline-none text-black px-1 py-px w-48'
                onChange={e => setFilterName(e.target.value)}
                value={filterName}
                type='text'/>
              <button
                type='button'
                onClick={handleSearch}
                className='bg-green-600 hover:bg-green-700 text-xs text-white font-bold px-2 py-2'>Search</button>
                <button
                type='button'
                onClick={() => setFilterName('')}
                className='bg-gray-600 hover:bg-gray-700 text-xs text-white font-bold px-2 py-2'>Clear</button>
            </div>
          </div>
        </form>
      </div>
      { (boxMessage === 'Search for Name' && data.length === 0) && <div className='bg-gray-800 text-gray-400 text-center border border-dashed border-gray-400 py-10'>Search for household member.</div> }
      { boxMessage === 'No results found' && <div className='bg-gray-800 text-gray-400 text-center border border-dashed border-gray-400 py-10'>No results found for this Name.</div> }
      { loading && <Loading/> }
      {
        (!loading && data.length > 0) &&
          <div className='flex flex-wrap gap-2 px-4 py-2'>
            {
              data.map((household: HouseholdsType, index) => (
                <div key={index} className='bg-yellow-200 text-xs text-left space-y-1 px-4 py-2 w-full sm:w-96'>
                  <div className='flex justify-between'>
                    <div className='font-medium'>H-ID: {household.household_id}</div>
                    <div className='font-medium'>MASTERLIST #: {household.masterlist_number}</div>
                  </div>
                  <div className='text-center font-bold text-sm'>{household.barangay}, {household.address}</div>
                  {
                    household.members.map((member: MembersType, index) => (
                      <React.Fragment key={index}>
                        {
                          index === 0 && <div className='font-bold text-sm px-1'>Head</div>
                        }
                        {
                          index === 1 && <div className='font-bold text-sm px-1'>Members</div>
                        }
                        <div className="flex items=center justify-between gap-1">
                          <div className='text-sm px-1'>{member.lastname}, {member.firstname} {member.middlename}</div>
                        </div>
                      </React.Fragment>
                    ))
                  }
                </div>
              ))
            }
          </div>
      }
    </div>
  )
}

export default List