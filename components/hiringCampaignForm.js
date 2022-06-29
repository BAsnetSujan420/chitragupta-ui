import InputWithLabelAndError from './InputWithLabelAndError'
import { Btn, Label, Input, Select, Option} from './formComponents'

function HiringCampaignForm({ hiringCampaign, errors, onSubmit, updateHiringCampaign }) {
  return (
    <>
        <div className="flex flex-wrap">
          <div className="w-full pr-4 mb-4 md:w-1/2">
            <Label
              className={`${
                errors.start_date ? 'text-red-500' : 'text-gray-500'
              } uppercase`}
            >
              Start Date
            </Label>
            <Input
              name="start_date"
              value={hiringCampaign.start_date}
              onChange={updateHiringCampaign}
              type="date"
              className={errors.start_date ? 'border-red-500' : ''}
            />
            {errors.start_date && (
              <span className="text-sm text-red-500">{errors.start_date}</span>
            )}
          </div>

          <div className="w-full pr-4 mb-4 md:w-1/2">
            <Label
              className={`${
                errors.end_date ? 'text-red-500' : 'text-gray-500'
              } uppercase`}
            >
              End Date
            </Label>
            <Input
              name="end_date"
              value={hiringCampaign.end_date}
              onChange={updateHiringCampaign}
              type="date"
              className={errors.end_date ? 'border-red-500' : ''}
            />
            {errors.end_date && (
              <span className="text-sm text-red-500">{errors.end_date}</span>
            )}
          </div>
        </div>

      <div className="flex flex-wrap">
        {[
          'job_title',
          'job_description',
          'remarks',
        ].map((field, index) => (
          <InputWithLabelAndError
            name={field}
            value={hiringCampaign[field]}
            errors={errors}
            key={index}
            onChange={updateHiringCampaign}
          />
        ))}
        <div className="w-status">
           <Label className="block pb-3 text-sm font-semibold text-gray-500 uppercase">Status</Label>
           <Select className="w-full px-3 py-3 text-sm border rounded-lg mt-0"
            name="status"
            onClick={updateHiringCampaign}
            errrors={errors}
            >
              <Option>
                Please Select one
              </Option>
              <Option
                value="draft"
                selected={hiringCampaign.status == 'draft'}
              >
                draft
              </Option>
              <Option
                value="publised"
                selected={hiringCampaign.status == 'publised'}
              >
                published
              </Option>
              <Option
                value="achived"
                selected={hiringCampaign.status == 'achived'}
              >
                achived
              </Option>
            </Select>
        </div>
      </div>
      <Btn className="bg-teal-500 hover:bg-teal-600" onClick={onSubmit}>
        Submit
      </Btn>
    </>
  )
}

export default HiringCampaignForm
