import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { connect} from 'react-redux'
import axios from 'axios'
import Jsona from 'jsona'
import Navbar from '../../../components/layout/Navbar'
import { handleUnauthorized } from '../../../lib/utils'
import { useGlobalContext } from '../../../context'
import { Btn } from '../../../components/formComponents'
import Modal from '../../../components/modal'
import JobApplicantForm from '../../../components/jobApplicantForm'
import { createNewJobApplicant } from '../../../redux/actions/jobApplicantAction'

const HiringCampaign = ({ createNewJobApplicant }) => {
  const router = useRouter()
  const { id } = router.query
  const dataFormatter = new Jsona()
  const [hiringCampaign, setHiringCampaign] = useState({})
  const setToken = useGlobalContext()
  const [createNew, setCreateNew] = useState(false)
  const creatingNew = () => setCreateNew(true)
  const [errors, setErrors] = useState({})
  const [jobApplicant, setJobApplicant] = useState({})
  const [jobApplication, setJobApplication] = useState({hiring_campaign_id: id})

  useEffect(() => {
    const fetchHiringCampaign = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/hiring_campaign/${id}.json`,
          // { headers: { Authorization: localStorage.token } },
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
      'primary_phone_number',
      'secondary_phone_number',
    ].forEach((field) => {
        if (jobApplicant[field] === undefined) {
            errorCount += 1
            errors[field] = "Can't be blank."
            setErrors({ ...errors })
        }
    })

    const file = document.querySelector("#file-upload").files[0]
    if (file === undefined) {
      setErrors({ ...errors, cv: "can't be blank" })
      errorCount += 1
    }

    if (file !== undefined) {
      if (file.type !== "application/pdf") {
        setErrors({ ...errors })
        errorCount += 1
        errors.cv = "Only pdf"
      }
    }

         return errorCount
    }

  // create new hiring campaign
  const createJobApplicant = async () => {
    if (checkIfFormIsValid() === 0) {
      createNewJobApplicant(jobApplicant, jobApplication)
      setCreateNew(false)
    }
  }

  const updateJobApplicant = (e) => {
    delete errors[e.target.name]
    if(
      !([
          'first_name',
          'last_name',
          'email',
          'primary_phone_number',
          'secondary_phone_number',
      ].includes(e.target.name))
    ) {
      setErrors({ ...errors, [e.target.name]: "can't be blank." })
    }
      setJobApplicant({ ...jobApplicant, [e.target.name]: e.target.value })
}

  const updateJobApplication = (e) => {
    delete errors[e.target.name]
    setJobApplication({ ...jobApplication, [e.target.name]: e.target.value })
  }

  const updateCv = (e) => {
    const file = document.querySelector("#file-upload").files[0]
    if (file !== undefined) {
      if (file.type !== "application/pdf")
      setErrors({ ...errors, [e.target.name]: "only pdf" })
    }
  }

  const updateReferrer = (e) => {
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
            <li className="flex flex-row uppercase h-20" >
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
            jobApplication={jobApplication}
            setJobApplication={setJobApplication}
            updateJobApplication={updateJobApplication}
            updateCv={updateCv}
            updateReferrer={updateReferrer}
          />
        </Modal>
      )}
    </>
  )
}

export default connect(() => ({}), { createNewJobApplicant })(HiringCampaign)

