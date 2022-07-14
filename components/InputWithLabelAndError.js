import { Label, Input } from './formComponents';

const InputWithLabelAndError = ({ name, errors, value, onChange }) => (
    <div className="w-full pr-4 mb-4 md:w-1/2">
        <Label
            className={`${
                errors[name] ? 'text-red-500' : 'text-gray-500'
            } uppercase`}
        >
            {name.split('_').join(' ')}
        </Label>
        <Input
            name={name}
            value={value}
            onChange={onChange}
            className={errors[name] ? 'border-red-500' : ''}
        />
        {errors[name] && (
            <span className="text-sm text-red-500">{errors[name]}</span>
        )}
    </div>
)

export default InputWithLabelAndError;
