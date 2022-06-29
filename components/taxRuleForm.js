import { Btn, Label, Input } from './formComponents';

const TaxRuleForm = ({ taxRule, errors, onChange, removeTaxRule }) => (
    <div className="flex flex-wrap" key={taxRule.id || taxRule.key}>
        <div className="w-full pr-4 mb-4 md:w-1/3">
            <Label
                className={`${
                    errors[`amount_from_${taxRule.id || taxRule.key}`]
                        ? 'text-red-500'
                        : 'text-gray-500'
                } uppercase`}
            >
                From Amount
            </Label>
            <Input
                name={`amount_from_${taxRule.id || taxRule.key}`}
                value={taxRule[`amount_from_${taxRule.id || taxRule.key}`]}
                id={taxRule.id || taxRule.key}
                onChange={onChange}
                type="text"
                className={
                    errors[`amount_from_${taxRule.id || taxRule.key}`]
                        ? 'border-red-500'
                        : ''
                }
            />
            {errors[`amount_from_${taxRule.id || taxRule.key}`] && (
                <span className="text-sm text-red-500">
            {errors[`amount_from_${taxRule.id || taxRule.key}`]}
          </span>
            )}
        </div>

        <div className="w-full pr-4 mb-4 md:w-1/3">
            <Label
                className={`${
                    errors[`amount_to_${taxRule.id || taxRule.key}`]
                        ? 'text-red-500'
                        : 'text-gray-500'
                } uppercase`}
            >
                To Amount
            </Label>
            <Input
                name={`amount_to_${taxRule.id || taxRule.key}`}
                value={taxRule[`amount_to_${taxRule.id || taxRule.key}`]}
                id={taxRule.id || taxRule.key}
                onChange={onChange}
                type="text"
                className={
                    errors[`amount_to_${taxRule.id || taxRule.key}`]
                        ? 'border-red-500'
                        : ''
                }
            />
            {errors[`amount_to_${taxRule.id || taxRule.key}`] && (
                <span className="text-sm text-red-500">
            {errors[`amount_to_${taxRule.id || taxRule.key}`]}
          </span>
            )}
        </div>

        <div className="w-full pr-4 mb-4 md:w-1/6">
            <Label
                className={`${
                    errors[`rate_${taxRule.id || taxRule.key}`]
                        ? 'text-red-500'
                        : 'text-gray-500'
                } uppercase`}
            >
                Tax Rate
            </Label>
            <Input
                name={`rate_${taxRule.id || taxRule.key}`}
                value={taxRule[`rate_${taxRule.id || taxRule.key}`]}
                id={taxRule.id || taxRule.key}
                onChange={onChange}
                type="text"
                className={
                    errors[`rate_${taxRule.id || taxRule.key}`] ? 'border-red-500' : ''
                }
            />
            {errors[`rate_${taxRule.id || taxRule.key}`] && (
                <span className="text-sm text-red-500">
            {errors[`rate_${taxRule.id || taxRule.key}`]}
          </span>
            )}
        </div>

        {taxRule.id ? (
            ''
        ) : (
            <div className="w-full pr-4 mt-4 mb-4 md:w-1/6">
                <Btn
                    className="bg-red-400 hover:bg-red-500"
                    onClick={() => removeTaxRule(taxRule.key)}
                >
                    Delete
                </Btn>
            </div>
        )}
    </div>
)

export default TaxRuleForm;
