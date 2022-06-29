import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import Jsona from 'jsona'
import Navbar from '../../../components/layout/Navbar'
import { handleUnauthorized } from '../../../lib/utils'
import { useGlobalContext } from '../../../context'
import { Btn } from '../../../components/formComponents'
import Modal from '../../../components/modal'
import JobApplicantForm from '../../../components/jobApplicantForm'



function HiringCampaign() {
  const router = useRouter()
  const id  = router.query.id
  const dataFormatter = new Jsona()

  const [hiringCampaign, setHiringCampaign] = useState({})
  const setToken = useGlobalContext()
  const creatingNew = () => setCreateNew(true)
  const [createNew, setCreateNew] = useState(false)
  const [errors, setErrors] = useState({})
  const [jobApplicant, setJobApplicant] = useState({})
  const [updatingJobApplicant, setUpdatingJobApplicant] = useState(false)

  useEffect(() => {
    const fetchHiringCampaign = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/hiring_campaign/${id}.json`,
          { headers: { Authorization: localStorage.token } },
        )
        setHiringCampaign(dataFormatter.deserialize(response.data))
      } catch (error) {
        // console.log(error);
        handleUnauthorized(error, setToken, router)
      }
    }
    fetchHiringCampaign()
  }, [])

  const checkIfFormIsValid = () => {
        let errorCount = 0;
        [
            'first_name',
            'last_name',
            'email',
            'referrer_id',
            'primary_phone_number',
            'secondary_phone_number',
        ].forEach((field) => {
            if (jobApplicant[field] === undefined) {
                errorCount += 1
                errors[field] = "Can't be blank."
                setErrors({ ...errors })
            }
        })
         return errorCount
    }

  // create new hiring campaign
  const createJobApplicant = async () => {
       const formData = new FormData()

    for (const field in jobApplicant) {
      formData.append(`job_applicant[${field}]`, jobApplicant[field])
    }

      formData.append('cv', document.querySelector("#file-upload").files[0])
    if (checkIfFormIsValid() === 0) {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/job_applicant`,
            formData,
          {
            headers: {
              Authorization: localStorage.token,
              'Content-Type': 'multipart/form-data',
            },
          },
        )
        window.location.reload()
        if (response.statusText === 'OK') {
          setJobApplicant([
            dataFormatter.deserialize(response.data),
            ...jobApplicant,
          ])
        }
      }

      catch (error) {
        console.log(error);
      }
    }
  }

const updateJobApplicant = (e) => {
    delete errors[e.target.name]
    if  (
      !([
          'first_name',
          'last_name',
          'email',
          'referrer_id',
          'primary_phone_number',
          'secondary_phone_number',
      ].includes(e.target.name))
    ) {
      setErrors({ ...errors, [e.target.name]: "can't be blank." })
    }
      setJobApplicant({ ...jobApplicant, [e.target.name]: e.target.value })
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col container max-w-md mt-10 mx-auto w-full items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow">
        <ul className="flex flex-col divide-y w-full">
          {[
            'start_date',
            'end_date',
            'job_title',
            'job_description',
            'remarks',
            'status',
            'creator_id',
          ].map((field) => (
            <li className="flex flex-row uppercase h-20">
              <div className="my-auto ml-4 align-middle">
                {field.split('_').join(' ')}: {hiringCampaign[field]}
              </div>
            </li>
          ))}
        </ul>
      </div>
       <div className="flex justify-end py-4">
            <Btn className="bg-teal-500 hover:bg-teal-600" onClick={creatingNew}>
                Apply Now
            </Btn>
      </div>


      {createNew && (
        <Modal
          showModal={createNew}
          setShowModal={setCreateNew}
          title="New Job Applicant"
        >
          <JobApplicantForm
            onSubmit={createJobApplicant}
            errors={errors}
            jobApplicant={jobApplicant}
            updateJobApplicant={updateJobApplicant}
          />
        </Modal>
      )}

    </>
  )
}

export default HiringCampaign
