import tw from 'tailwind-styled-components';

export const ModalContainer = tw.div`
fixed inset-0 z-50 flex justify-center items-center h-full
`;

export const ModalOverlay = tw.div`
abosulte px-4 w-full  h-full inset-0 bg-gray-500 bg-opacity-75 transition-opacity  flex justify-center items-center
`;

export const ModalBox = tw.div`
relative bg-white rounded-lg shadow dark:bg-gray-700 w-full lg:w-6/12 max-h-full overflow-y-auto
`;

export const ModalHeader = tw.div`
flex justify-between items-start p-5 rounded-t border-b dark:border-gray-600
`;

export const ModalBody = tw.div`
py-4 px-6 space-y-6
`;

export const ModalFooter = tw.div`
flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600
`;

export const TableContainer = tw.div`p-12 mx-6 -mt-6 bg-white rounded shadow h-3/5`;
