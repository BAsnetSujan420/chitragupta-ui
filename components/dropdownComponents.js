import tw from 'tailwind-styled-components';

export const Dropdown = tw.div`relative inline-block text-left`;

export const DropdownTrigger = tw.div`px-4 py-2 text-sm text-white cursor-pointer`;

export const DropdownMenu = tw.div`origin-top-right absolute right-0 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none`;

export const DropdownItem = tw.a`text-gray-700 block px-4 py-2 text-sm cursor-pointer`;
