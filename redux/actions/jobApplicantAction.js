import axios from "axios";
import {returnAlerts, returnErrors} from "./alertActions";

export const createNewJobApplicant = (jobApplicant, jobApplication) => async (dispatch, getState) => {
   const formData = new FormData()

    Object.keys(jobApplicant).forEach(field => {
       formData.append(`job_applicant[${field}]`, jobApplicant[field])
    });

    formData.append('cv', document.querySelector("#file-upload").files[0])

    Object.keys(jobApplication).forEach(field => {
      formData.append(`job_applicant[job_application_attributes][${field}]`, jobApplication[field])
    })

  formData.append('job_applicant[job_application_attributes][applied_at]', document.querySelector("#applied_at").value)

  try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/job_applicant`,
             formData,
          {
            headers: {
                Authorization: getState().auth.token,
                'Content-Type': 'multipart/form-data',
            },
          },
        )

        if (response.statusText === 'OK') {
          dispatch(returnAlerts("Successfully created new job Applicant.", response.status))
        } else {
          dispatch(returnErrors(response.data.message || response.data.error, response.status, response.statusText))
        }
      }
  catch (error) {
    dispatch(returnErrors(error.response.data?.message || error.response.data?.error, error.response.status, error.response.statusText))
  }
}

export const remoteUpdateJobApplicant = (jobApplicant) => async (dispatch, getState) => {
    const formData = new FormData()

  Object.keys(jobApplicant).forEach(field => {
    if (jobApplicant[field] === null){
          formData.append(`job_applicant[${field}]`, " ")
    }
    else {
          formData.append(`job_applicant[${field}]`, jobApplicant[field])

    }
    });

  try {
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/job_applicant/${jobApplicant.id}.json`,
             formData,
          {
            headers: {
              Authorization: getState().auth.token,
              'Content-Type': 'multipart/form-data',
            },
          },
        )

        if (response.statusText === 'OK') {
          dispatch(returnAlerts("Successfully update job applicant.", response.status))
        } else {
          dispatch(returnErrors(response.data.message || response.data.error, response.status, response.statusText))
        }
      }
  catch (error) {
    dispatch(returnErrors(error.response.data?.message || error.response.data?.error, error.response.status, error.response.statusText))
  }
}
