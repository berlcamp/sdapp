'use client'
import React, { useEffect, useState } from 'react'
import { FaArrowsAltH, FaTrashAlt } from "react-icons/fa"
import { IoIosUndo } from "react-icons/io"
import Loading from '@/components/Loading'
import axios from 'axios'

interface HouseholdHeadType {
  id: string
  fullname: string
}

function List({ barangays}: { barangays: string[]}) {
  const [loading, setLoading] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const [filterBarangay, setFilterBarangay] = useState('')
  const [filterName, setFilterName] = useState('')
  const [data, setData] = useState<HouseholdHeadType[] | []>([])
  const [originalData, setOriginalData] = useState<HouseholdHeadType[] | []>([])

  const apiUrl = process.env.NEXT_PUBLIC_AO_API_URL ?? ''

  const fetchData = async () => {
    if (filterBarangay === '') return
    setLoading(true)

    const params = {
      filterBarangay
    }

    try {
      await axios.get(`${apiUrl}/households/nospheads`, { params })
        .then(response => {
          const d: HouseholdHeadType[] = response.data

          setData(d)
          setOriginalData(d)
          setFilterName('')
        })
    } catch (error) {
      console.error('error', error)
    }

    setLoading(false)
  }

  const handleFilterName = (name: string) => {
    const filterByName = (name: string) => {
      const searchWords = name.toLowerCase().split(' ');

      return originalData.filter((head: HouseholdHeadType) => {
        return searchWords.every(word => head.fullname.includes(word));
      })
    }

    // Search for a specific name
    const searchResult = filterByName(name)
    setData(searchResult)
  }

  const handleUpdate = async (id: string, spId: string) => {
    let param: any = {
      spId
    }

    const params = {
      id: id,
      data: param
    }

    try {
      // await axios.put(`${apiUrl}/households/updateSp`, params)
      //   .then(response => {

      //   })
    } catch (error) {
      console.error('error', error)
    }
  }

  const handleFilterUnsettled = () => {
    if (isChecked) {
      setFilterName('')
    } else {
      fetchData()
    }
  }

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked); // Toggles the checkbox state
  };

  useEffect(() => {
    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterBarangay])

  useEffect(() => {
    handleFilterName(filterName)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterName])

  useEffect(() => {
    handleFilterUnsettled()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChecked])

  return (
    <div>
      <div className="text-center text-2xl text-gray-300">Households Head without SP</div>
      {
        data.length > 0 && <div className='text-center text-xs text-gray-300'>{data.length} total results.</div>
      }
      <div className="text-gray-300 text-sm mt-6 mb-2">
        <div>
          <div className="w-full flex justify-between space-x-2">
            <div className='flex space-x-1'>
              <select
                onChange={e => setFilterBarangay(e.target.value)}
                className="border text-gray-600 outline-none w-32">
                  <option>Choose Barangay</option>
                  {
                    barangays.map((barangay: string, index) => <option key={index}>{barangay}</option>)
                  }
              </select>
            </div>
            <div className='flex space-x-1'>
              <input
                placeholder='Search Name'
                className='outline-none text-black px-1 py-px w-32'
                onChange={e => setFilterName(e.target.value)}
                value={filterName}
                type='text'/>
              <button type='button' onClick={e => setFilterName('')} className='bg-gray-600 hover:bg-gray-700 text-xs px-1'>Clear</button>
            </div>
            {/* <div className='flex justify-end flex-1'>
              <button
                type='button'
                onClick={handleCheckboxChange}
                className={`${ isChecked ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-xs text-white font-bold px-2 py-2`}>{ isChecked ? 'All' : 'Unsettled' }</button>
            </div> */}
          </div>
        </div>
      </div>
      { (filterBarangay === '' || filterBarangay === 'Choose Barangay') && <div className='bg-gray-800 text-gray-400 text-center border border-dashed border-gray-400 py-10'>Please choose Barangay...</div> }
      { (filterBarangay !== '' && filterBarangay !== 'Choose Barangay' && data.length === 0) && <div className='bg-gray-800 text-gray-400 text-center border border-dashed border-gray-400 py-10'>No results found for this barangay.</div> }
      { loading && <Loading/> }
      {
        !loading &&
          <div className='w-full flex flex-col gap-8'>
            {
              data.map((head: HouseholdHeadType, index) => (
                <div key={index} className=''>

                </div>
              ))
            }
          </div>
      }
    </div>
  )
}

export default List