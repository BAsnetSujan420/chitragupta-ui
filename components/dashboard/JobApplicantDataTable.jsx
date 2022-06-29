import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import DataTable from './DataTable'
import { columns } from '../../data/jobApplicantTableData'
import { fetchJobApplicants } from '../../redux/actions/dashboardActions'
import { TableContainer } from '../modalComponents'
import Modal from '../modal'
import JobApplicantForm from '../jobApplicantForm'

const JobApplicant = ({ fetchJobApplicants }) => {
  const [jobApplicant, setJobApplicant] = useState({})
  const [errors, setErrors] = useState({})
  const [updatingJobApplicant, setUpdatingJobApplicant] = useState(false)

  useEffect(() => {
    fetchJobApplicants()
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

    // updating hiring campaign
  const remoteUpdateJobApplicant = async () => {
    const formData = new FormData()

    Object.keys(jobApplicant).forEach(field => {
       formData.append(`job_applicant[${field}]`, jobApplicant[field])
    });

    formData.append('cv', document.querySelector("#file-upload").files[0])

    if (checkIfFormIsValid() === 0) {
      try {
        await axios.put(
          `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/job_applicant/${jobApplicant.id}.json`,
            formData,
          {
            headers: {
              Authorization: localStorage.token,
              'Content-Type': 'multipart/form-data',
            },
          },
        )
        window.location.reload()
      } catch (error) {
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
      <TableContainer>
        <DataTable
          rowClick={(row) => {
            console.log(row.original)
            setJobApplicant(row.original)
            setUpdatingJobApplicant(true)
          }}
          columns={columns}
          fetchFunction={fetchJobApplicants} />
      </TableContainer>

        {updatingJobApplicant && (
        <Modal
          showModal={updatingJobApplicant}
          setShowModal={setUpdatingJobApplicant}
          title="Update job Applicant"
        >
          <JobApplicantForm
            updateJobApplicant={updateJobApplicant}
            errors={errors}
            jobApplicant={jobApplicant}
            onSubmit={remoteUpdateJobApplicant}
          />
        </Modal>
      )}
    </>
  )
}

const mapDispatchToProps = (dispatch) => (
  {
    fetchJobApplicants: () => dispatch(fetchJobApplicants()),
  }
)

export default connect(null,mapDispatchToProps)(JobApplicant)
