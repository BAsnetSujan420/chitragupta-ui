import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '../dropdownComponents';
import { logout } from '../../redux/actions/authActions';

const Navbar = (props) => {
  const [showDropdown, setShowDropDown] = useState(false);

  const isAdmin = () => props.user && props.user.role === 'admin';

  const page = { label: 'Dashboard', link: '/' };
  const subPages = [{ label: 'Calendar', link: '/calendar' }];

  if (isAdmin()) subPages.push({ label: 'Admin', link: '/admin' });

  const router = useRouter();

  useEffect(() => {
    const hideDropDown = (e) => {
      if (e.target.id !== 'dropdown-menu') setShowDropDown(false);
    };
    document.addEventListener('click', hideDropDown);

    return () => document.removeEventListener('click', hideDropDown);
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    props.logout();
    router.push('/login');
  };

  return props.user ? (
    <header className="px-4 py-8 text-white bg-blue-500">
      <div className="flex justify-between">
        <div className="text-sm uppercase">dashboard</div>
        <Dropdown>
          <DropdownTrigger
            id="dropdown-menu"
            onClick={() => setShowDropDown(!showDropdown)}
          >
            {props.user.first_name} {props.user.last_name}
          </DropdownTrigger>

          {showDropdown && (
            <DropdownMenu>
              <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
            </DropdownMenu>
          )}
        </Dropdown>
      </div>
      <nav
        className="flex px-5 py-8 text-white-700 dark:bg-white-800 dark:border-white-700"
        aria-label="Breadcrumb"
      >
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link href="/">
              <a className="inline-flex items-center mr-6 font-medium font-lg text-white-700 dark:text-white-400 dark:hover:text-white">
                Dashboard
              </a>
            </Link>
          </li>
          <li className="inline-flex items-center">
            <Link href="/">
              <a className="inline-flex items-center text-sm font-medium text-white-700 hover:text-white-900 dark:text-white-400 dark:hover:text-white">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Home
              </a>
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-white-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <a
                href={page.link}
                className="ml-1 text-sm font-medium text-white-700 hover:text-white-900 md:ml-2 dark:text-white-400 dark:hover:text-white"
              >
                {page.label}
              </a>
            </div>
          </li>

          {subPages.map((subPage) => (
            <li aria-current="page" key={subPage.label}>
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-white-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <a
                  href={subPage.link}
                  className="ml-1 text-sm font-medium text-white-400 md:ml-2 dark:text-white-500"
                >
                  {subPage.label}
                </a>
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </header>
  ) : null;
}

const mapStateToProps = (state) => ({
  token: state.auth.token,
  user: state.auth.user,
  error: state.error,
});
export default connect(mapStateToProps, { logout })(Navbar);
