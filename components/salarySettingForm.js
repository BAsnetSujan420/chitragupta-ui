import InputWithLabelAndError from './InputWithLabelAndError';
import { Btn, Label, Input } from './formComponents';
import TaxRuleForm from './taxRuleForm';

const SalarySettingForm = ({
  updateSalarySetting,
  salarySetting,
  errors,
  taxRules,
  onSubmit,
  setTaxRules,
  updateTaxRules,
  removeTaxRule,
}) => (
    <>
      <div className="flex flex-wrap">
        {[
          'ssf_office',
          'ssf_employee',
          'life_insurance_max',
          'ssf_tax_exemption_rate',
          'ssf_tax_exemption_max',
        ].map((field) => (
            <InputWithLabelAndError
                name={field}
                onChange={updateSalarySetting}
                value={salarySetting[field]}
                errors={errors}
                key={field}
            />
        ))}

        <div className="w-full pr-4 mb-4 md:w-1/2">
          <Label
              className={`${
                  errors.from_date ? 'text-red-500' : 'text-gray-500'
              } uppercase`}
          >
            From Date
          </Label>
          <Input
              name="from_date"
              value={salarySetting.from_date}
              onChange={updateSalarySetting}
              type="date"
              className={errors.from_date ? 'border-red-500' : ''}
          />
          {errors.from_date && (
              <span className="text-sm text-red-500">{errors.from_date}</span>
          )}
        </div>

        <div className="w-full pr-4 mb-4 md:w-1/2">
          <Label
              className={`${
                  errors.to_date ? 'text-red-500' : 'text-gray-500'
              } uppercase`}
          >
            To Date
          </Label>
          <Input
              name="to_date"
              value={salarySetting.to_date}
              onChange={updateSalarySetting}
              type="date"
              className={errors.to_date ? 'border-red-500' : ''}
          />
          {errors.to_date && (
              <span className="text-sm text-red-500">{errors.to_date}</span>
          )}
        </div>

        <div className="w-full">
          <h1 className="text-lg font-semibold text-gray-900 lg:text-xl ">
            Tax Rules
          </h1>
          {taxRules.length <= 0 ? (
              <div>N/A</div>
          ) : (
              taxRules.map((taxRule) => (
                  <TaxRuleForm
                      errors={errors}
                      taxRule={taxRule}
                      onChange={updateTaxRules}
                      removeTaxRule={removeTaxRule}
                      key={taxRule.id || taxRule.key}
                  />
              ))
          )}
        </div>
        <button
            type="button"
            className="py-2.5 px-5 mr-2 my-2 text-xs font-medium text-gray-900 border-0 hover:text-blue-700"
            onClick={() =>
                setTaxRules([...taxRules, { key: new Date().getTime() }])
            }
        >
          Add Tax Rules
        </button>
      </div>

      <Btn className="bg-teal-500 hover:bg-teal-600" onClick={onSubmit}>
        Submit
      </Btn>
    </>
);

export default SalarySettingForm;
