import InputWithLabelAndError from './InputWithLabelAndError'
import { Btn, Label, Input } from './formComponents'

const JobApplicantForm = ({ updateJobApplicant, jobApplicant, errors, onSubmit }) =>
   (
    <>
      <div className="flex flex-wrap">
        {[
          'first_name',
          'last_name',
          'email',
          'referrer_id',
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

        <div className="w-full pr-4 mb-4 md:w-1/2">
            <Label
              className={`${
                errors.cv ? 'text-red-500' : 'text-gray-500'
              } uppercase`}
            >
              cv
            </Label>
          <Input
            id="file-upload"
              name="cv"
            type="file"

              className={errors.cv ? 'border-red-500' : ''}
            />
            {errors.cv && (
              <span className="text-sm text-red-500">{errors.cv}</span>
            )}
          </div>
      </div>
      <Btn className="bg-teal-500 hover:bg-teal-600" onClick={onSubmit}>
        Submit
      </Btn>
    </>
  )

export default JobApplicantForm
