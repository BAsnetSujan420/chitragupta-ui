import { useEffect, useState } from 'react'
import Navbar from '../../../components/layout/Navbar'
import JobApplicantDataTable from '../../../components/dashboard/JobApplicantDataTable'

const JobApplicant = () => {

  return (
    <>
      <Navbar />
      <JobApplicantDataTable />
    </>
  )
}

export default JobApplicant
