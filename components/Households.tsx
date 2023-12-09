'use client'
import React, { useEffect, useState } from 'react'
import { FaArrowsAltH, FaTrashAlt } from "react-icons/fa"
import { IoIosUndo } from "react-icons/io"
import Loading from './Loading'
import axios from 'axios'
import toast from 'react-hot-toast'

interface MembersType {
  id: string
  lastname: string
  firstname: string
  middlename: string
  member_delete?: string
  duplicate?: string
}

interface HouseholdsType {
  household_id: string
  barangay: string
  members: MembersType[]
  household_delete?: string
  duplicate_household_id: string
  duplicate_barangay: string
  duplicate_members: MembersType[]
  duplicate_household_delete?: string
}
function Households({ barangays}: { barangays: string[]}) {
  const [loading, setLoading] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const [filterBarangay, setFilterBarangay] = useState('')
  const [filterName, setFilterName] = useState('')
  const [data, setData] = useState<HouseholdsType[] | []>([])
  const [originalData, setOriginalData] = useState<HouseholdsType[] | []>([])

  const apiUrl = process.env.NEXT_PUBLIC_AO_API_URL ?? ''

  const fetchData = async () => {
    if (filterBarangay === '') return
    setLoading(true)

    const params = {
      filterBarangay
    }

    try {
      await axios.get(`${apiUrl}/households/duplicates`, { params })
        .then(response => {
          // console.log(response.data)
          const d: HouseholdsType[] = response.data

          // exclude same households duplicate
          const d2 = d.filter((item: HouseholdsType) => item.household_id !== item.duplicate_household_id)

          //exclude redundant duplicate
          const temp: HouseholdsType[] = []
          const filteredData = d2.filter(household => {
            temp.push(household)
            if (temp.find(item => item.household_id === household.duplicate_household_id && item.duplicate_household_id === household.household_id))
            {
              return false
            } else {
              return true
            }
          })

          setData(filteredData)
          setOriginalData(filteredData)
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

      return originalData.filter((household: HouseholdsType) => {
        let fullName = ''
        household.members.forEach((member: MembersType) => {
          fullName = `${fullName} ${member.lastname} ${member.firstname} ${member.middlename}`.toLowerCase();
        })
        household.duplicate_members.forEach((member: MembersType) => {
          fullName = `${fullName} ${member.lastname} ${member.firstname} ${member.middlename}`.toLowerCase();
        })
        fullName = fullName.toLowerCase()
        return searchWords.every(word => fullName.includes(word));
      })
    }

    // Search for a specific name
    const searchResult = filterByName(name)
    setData(searchResult)
  }

  const handleUpdate = async (id: string, requestType: string, memberId: string) => {
    let param: any = ''

    if (requestType === 'deleteHousehold' || requestType === 'deleteHouseholdDuplicate') {
      param = {
        delete_household: 'yes'
      }
    }
    if (requestType === 'undoDeleteHousehold' || requestType === 'undoDeleteHouseholdDuplicate') {
      param = {
        delete_household: ''
      }
    }
    if (requestType === 'deleteMember' || requestType === 'deleteMemberDuplicate') {
      param = {
        delete_member: 'yes'
      }
    }
    if (requestType === 'undoDeleteMember' || requestType === 'undoDeleteMemberDuplicate') {
      param = {
        delete_member: ''
      }
    }

    const params = {
      id: requestType.includes('Member') ? memberId : id,
      data: param
    }

    try {
      await axios.put(`${apiUrl}/households`, params)
        .then(response => {
          if (response.data.status === 'success') {
            if (requestType === 'deleteHousehold') {
              const d = data.map(household => {
                if (household.household_id === id) {
                  return { ...household, household_delete: 'yes'}
                }
                return household
              })
              setData(d)

              const origD = originalData.map(household => {
                if (household.household_id === id) {
                  return { ...household, household_delete: 'yes'}
                }
                return household
              })
              setOriginalData(origD)
            }
            if (requestType === 'deleteHouseholdDuplicate') {
              const d = data.map(household => {
                if (household.duplicate_household_id === id) {
                  return { ...household, duplicate_household_delete: 'yes'}
                }
                return household
              })
              setData(d)

              const origD = originalData.map(household => {
                if (household.duplicate_household_id === id) {
                  return { ...household, duplicate_household_delete: 'yes'}
                }
                return household
              })
              setOriginalData(origD)
            }
            if (requestType === 'undoDeleteHousehold') {
              const d = data.map(household => {
                if (household.household_id === id) {
                  return { ...household, household_delete: ''}
                }
                return household
              })
              setData(d)

              const origD = originalData.map(household => {
                if (household.household_id === id) {
                  return { ...household, household_delete: ''}
                }
                return household
              })
              setOriginalData(origD)
            }
            if (requestType === 'undoDeleteHouseholdDuplicate') {
              const d = data.map(household => {
                if (household.duplicate_household_id === id) {
                  return { ...household, duplicate_household_delete: ''}
                }
                return household
              })
              setData(d)

              const origD = originalData.map(household => {
                if (household.duplicate_household_id === id) {
                  return { ...household, duplicate_household_delete: ''}
                }
                return household
              })
              setOriginalData(origD)
            }
            if (requestType === 'deleteMember') {
              const d = data.map(household => {
                if (household.household_id === id) {
                  const m = household.members.map(member => {
                    if (member.id === memberId) {
                      return { ...member, member_delete: 'yes'}
                    }
                    return member
                  })
                  return { ...household, members: m}
                }
                return household
              })
              setData(d)

              const origD = originalData.map(household => {
                if (household.household_id === id) {
                  const m = household.members.map(member => {
                    if (member.id === memberId) {
                      return { ...member, member_delete: 'yes'}
                    }
                    return member
                  })
                  return { ...household, members: m}
                }
                return household
              })
              setOriginalData(origD)
            }
            if (requestType === 'deleteMemberDuplicate') {
              const d = data.map(household => {
                if (household.duplicate_household_id === id) {
                  const m = household.duplicate_members.map(member => {
                    if (member.id === memberId) {
                      return { ...member, member_delete: 'yes'}
                    }
                    return member
                  })
                  return { ...household, duplicate_members: m}
                }
                return household
              })
              setData(d)

              const origD = originalData.map(household => {
                if (household.duplicate_household_id === id) {
                  const m = household.duplicate_members.map(member => {
                    if (member.id === memberId) {
                      return { ...member, member_delete: 'yes'}
                    }
                    return member
                  })
                  return { ...household, duplicate_members: m}
                }
                return household
              })
              setOriginalData(origD)
            }
            if (requestType === 'undoDeleteMember') {
              const d = data.map(household => {
                if (household.household_id === id) {
                  const m = household.members.map(member => {
                    if (member.id === memberId) {
                      return { ...member, member_delete: ''}
                    }
                    return member
                  })
                  return { ...household, members: m}
                }
                return household
              })
              setData(d)

              const origD = originalData.map(household => {
                if (household.household_id === id) {
                  const m = household.members.map(member => {
                    if (member.id === memberId) {
                      return { ...member, member_delete: ''}
                    }
                    return member
                  })
                  return { ...household, members: m}
                }
                return household
              })
              setOriginalData(origD)
            }
            if (requestType === 'undoDeleteMemberDuplicate') {
              const d = data.map(household => {
                if (household.duplicate_household_id === id) {
                  const m = household.duplicate_members.map(member => {
                    if (member.id === memberId) {
                      return { ...member, member_delete: ''}
                    }
                    return member
                  })
                  return { ...household, duplicate_members: m}
                }
                return household
              })
              setData(d)

              const origD = originalData.map(household => {
                if (household.duplicate_household_id === id) {
                  const m = household.duplicate_members.map(member => {
                    if (member.id === memberId) {
                      return { ...member, member_delete: ''}
                    }
                    return member
                  })
                  return { ...household, duplicate_members: m}
                }
                return household
              })
              setOriginalData(origD)
            }
            toast.success('Successfully saved')
          } else {
            toast.error('Something went wrong, please refresh the page.')
          }
        })
    } catch (error) {
      console.error('error', error)
    }
  }

  const handleFilterUnsettled = () => {
    if (isChecked) {
      const d = data.filter((household: HouseholdsType) => {
        let settled = true
        if(household.household_delete === 'yes' || household.duplicate_household_delete === 'yes') {
          settled = false
        }
        household.members.forEach((member: MembersType) => {
          if(member.member_delete === 'yes') {
            settled = false
          }
        })
        household.duplicate_members.forEach((member: MembersType) => {
          if(member.member_delete === 'yes') {
            settled = false
          }
        })
        return settled
      })
      setFilterName('')
      setData(d)
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
      <div className="text-center text-2xl text-gray-300">Households with Duplicates</div>
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
            <div className='flex justify-end flex-1'>
              <button
                type='button'
                onClick={handleCheckboxChange}
                className={`${ isChecked ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-xs text-white font-bold px-2 py-2`}>{ isChecked ? 'All' : 'Unsettled' }</button>
            </div>
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
              data.map((household: HouseholdsType, index) => (
                <div key={index} className='bg-gray-800 flex items-center space-x-2 justify-center px-2 py-2'>
                  <div>
                    <div className={`${household.household_delete === 'yes' ? 'bg-red-500':'bg-yellow-200'} text-xs text-left space-y-1 px-4 py-2`}>
                      <div className='flex justify-between'>
                        <div className='font-medium'>H-ID: {household.household_id}</div>
                        {
                          household.household_delete === 'yes'
                            ? <button onClick={() => handleUpdate(household.household_id, 'undoDeleteHousehold', '')} className='flex justify-center space-x-1 bg-black text-white font-bold text-lg py-px px-1 rounded-sm'><IoIosUndo /></button>
                            : <button onClick={() => handleUpdate(household.household_id, 'deleteHousehold', '')} className='text-red-600 hover:text-red-700 text-lg'><FaTrashAlt /></button>

                        }
                      </div>
                      <div className='text-center font-bold text-sm'>{household.barangay}</div>
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
                              <div className={`${member.duplicate === 'yes' && 'border-b-2 border-green-600'} ${member.member_delete === 'yes' && 'bg-red-500'} text-sm px-1`}>{member.lastname}, {member.firstname} {member.middlename}</div>
                              {
                                (member.duplicate === 'yes' && household.household_delete !== 'yes') && (
                                  member.member_delete === 'yes'
                                    ? <button onClick={() => handleUpdate(household.household_id, 'undoDeleteMember', member.id)} className='flex justify-center space-x-1 text-lg font-bold py-px px-1 rounded-sm'><IoIosUndo /></button>
                                    : <button onClick={() => handleUpdate(household.household_id, 'deleteMember', member.id)} className='text-red-600 hover:text-red-700'><FaTrashAlt /></button>
                                )
                              }
                            </div>
                          </React.Fragment>
                        ))
                      }
                    </div>
                  </div>
                  <div className='text-center text-white'>
                    <FaArrowsAltH className='text-2xl'/>
                  </div>
                  <div className=''>
                    <div className={`${household.duplicate_household_delete === 'yes' ? 'bg-red-500':'bg-yellow-200'} text-xs text-left space-y-1 px-4 py-2`}>
                      <div className='flex justify-between'>
                        <div className='font-medium'>H-ID: {household.duplicate_household_id}</div>
                        {
                          household.duplicate_household_delete === 'yes'
                            ? <button onClick={() => handleUpdate(household.duplicate_household_id, 'undoDeleteHouseholdDuplicate','')} className='flex justify-center space-x-1 bg-black text-white font-bold text-lg py-px px-1 rounded-sm'><IoIosUndo /></button>
                            : <button onClick={() => handleUpdate(household.duplicate_household_id, 'deleteHouseholdDuplicate','')} className='text-red-600 hover:text-red-700 text-lg'><FaTrashAlt /></button>

                        }
                      </div>
                      <div className='text-center font-bold text-sm'>{household.duplicate_barangay}</div>
                      {
                        household.duplicate_members.map((member: MembersType, index) => (
                          <React.Fragment key={index}>
                            {
                              index === 0 && <div className='font-bold text-sm px-1'>Head</div>
                            }
                            {
                              index === 1 && <div className='font-bold text-sm px-1'>Members</div>
                            }
                            <div className="flex justify-between space-x-1">
                              <div className={`${member.duplicate === 'yes' && 'border-b-2 border-green-600'} ${member.member_delete === 'yes' && 'bg-red-500'} text-sm px-1`}>{member.lastname}, {member.firstname} {member.middlename}</div>
                              {
                                (member.duplicate === 'yes' && household.duplicate_household_delete !== 'yes')&& (
                                  member.member_delete === 'yes'
                                    ? <button onClick={() => handleUpdate(household.duplicate_household_id, 'undoDeleteMemberDuplicate', member.id)} className='flex justify-center space-x-1 text-lg font-bold py-px px-1 rounded-sm'><IoIosUndo /></button>
                                    : <button onClick={() => handleUpdate(household.duplicate_household_id, 'deleteMemberDuplicate', member.id)} className='text-red-600 hover:text-red-700'><FaTrashAlt /></button>
                                )
                              }
                            </div>
                          </React.Fragment>
                        ))
                      }
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
      }
    </div>
  )
}

export default Households