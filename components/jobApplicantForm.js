import { useState, useEffect } from 'react'

import InputWithLabelAndError from './InputWithLabelAndError'
import { Btn, Label, Input } from './formComponents'

const JobApplicantForm = ({ updateJobApplicant, jobApplicant, errors, onSubmit, updateJobApplication, title, updateCv, updateReferrer}) => {
  const [todayDate, setTodayDate] = useState()
    const setTodayDateValue = () => {
    const date = new Date().toJSON().slice(0,10).replace(/-/g,'/');
     setTodayDate(date)
   }
  useEffect(() => {
    setTodayDateValue()
  })

 return (
    <>
      <div className="flex flex-wrap">
        {[
          'first_name',
          'last_name',
          'email',
          'primary_phone_number',
          'secondary_phone_number'
        ].map((field) => (
          <InputWithLabelAndError
            name={field}
            value={jobApplicant[field]}
            errors={errors}
            onChange={updateJobApplicant}
          />
        ))}
     </div>
      <div className="w-full pr-4 mb-4 md:w-1/2">
              <Label
                className={`${errors.referrer_id ? 'text-red-500' : 'text-gray-500'
                  } uppercase`}
              >
                Referrer Id
              </Label>
              <Input
                name="referrer_id"
                type="number"
                onChange={updateReferrer}
                className={errors.referrer_id ? 'border-red-500' : ''}
              />
              {errors.referrer_id && (
                <span className="text-sm text-red-500">{errors.referrer_id}</span>
              )}
             </div>

     {
       title === "update" ?
          null :
        <div className="w-full">
             <div className="w-full pr-4 mb-4 md:w-1/2">
              <Label
                className={`${errors.cv ? 'text-red-500' : 'text-gray-500'
                  } uppercase`}
              >
                cv
              </Label>
              <Input
                id="file-upload"
                name="cv"
              type="file"
              onChange={updateCv}
              className={errors.cv ? 'border-red-500' : ''}
              />
              {errors.cv && (
                <span className="text-sm text-red-500">{errors.cv}</span>
              )}
             </div>

           <div className="w-full pr-4 mb-4 md:w-1/2">
             <Label
               className={`${errors.applied_at ? 'text-red-500' : 'text-gray-500'
                 } uppercase`}
             >
               Applied at
             </Label>
             <Input
               id="applied_at"
               value={todayDate}
               name="applied_at"
               className={errors.applied_at ? 'border-red-500' : ''}
             />
           </div>
           <div className="w-full pr-4 mb-4 md:w-1/2">
             <Label
               className={`${errors.proposal ? 'text-red-500' : 'text-gray-500'
                 } uppercase`}
             >
               Proposal
             </Label>
             <Input
               id="proposal"
               name="proposal"
               onChange={updateJobApplication}
               className={errors.applied_at ? 'border-red-500' : ''}
             />
           </div>
        </div>
       }

      <Btn className="bg-teal-500 hover:bg-teal-600" onClick={onSubmit}>
        Submit
      </Btn>
    </>
  )
}

export default JobApplicantForm
