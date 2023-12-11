import React, { useState } from 'react'
import axios from 'axios'

export const Ref = ({ memberId, householdId, handleUpdateList }: { memberId: string, householdId: string, handleUpdateList: (hId: string) => void }) => {
  const [refId, setRefId] = useState('')
  const [error, setError] = useState('')
  const apiUrl = process.env.NEXT_PUBLIC_AO_API_URL ?? ''

  const handleSave = async () => {
    // Perform any desired action with the value
    let param: any = {
      voter_id: refId
    }

    console.log(param)

    const params = {
      id: memberId,
      data: param
    }

    try {
      await axios.put(`${apiUrl}/households/voterid`, params)
        .then((response: any) => {
          console.log(response.data.voter_fullname)
          if (response.data.voter_fullname === 'Voter Not Found') {
            setError('Ref ID Not Found')
          } else {
            setRefId('')
            setError('')
            handleUpdateList(householdId)
          }
        })
    } catch (error) {
      console.error('error', error)
    }
  }

  return (
    <div>
      <div className='flex items-center space-x-px'>
        <span className='text-xs font-bold'>R-</span>
        <input
          className='text-xs border border-gray-400 outline-none px-1 py-1 w-10'
          placeholder='ID'
          value={refId}
          onChange={e => setRefId(e.target.value)}
          type='text'/>
        <button
          onClick={handleSave}
          className='text-xs bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-500 text-white px-1 py-1 rounded-sm'>Save</button>
      </div>
      <div className='font-bold text-red-500'>{error}</div>
    </div>
  )
}
