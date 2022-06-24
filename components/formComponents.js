import tw from 'tailwind-styled-components';

export const Input = tw.input`
w-full px-3 py-3 text-sm border rounded-lg
`;

export const Label = tw.label`
block pb-3 text-sm font-semibold
`;

export const FormControl = tw.div`
w-full px-3 bg-white rounded-lg shadow px-5 py-7
`;

export const FormContainer = tw.div`
container px-2 py-2 mx-auto md:w-full md:max-w-md
`;

export const Btn = tw.button`
inline-block py-3 px-5 mt-4 text-sm font-semibold text-center text-white transition rounded shadow-sm
`;

export const BtnPrimary = tw.button`
inline-block py-2 px-4 text-sm font-semibold text-center text-white transition bg-blue-500 rounded shadow-sm hover:bg-blue-600
`;

export const Select = tw.select`
block appearance-none w-full bg-gray-200 border text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500
`;

export const Option = tw.option`
w-full px-2 py-2 text-sm
`;
