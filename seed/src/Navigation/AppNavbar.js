import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import seed from '../art_assets/seed_logo.png';
import avatar from '../art_assets/avatar.png';
import seed_text from '../art_assets/seed_text.png';

const navigation = [
  { name: 'My Portfolio', href: '/dashboard', current: true },
  { name: '[PLACEHOLDER]', href: '/dashboard', current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function NavbarDefault() {
  return (
    <Disclosure as="nav" className="bg-[#f5f1e3] rounded-b-xl shadow-lg">
      {({ open }) => (
        <>
          <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-5 w-full">
              <div className="flex items-center">
                <img
                  className="h-16 w-auto rounded-2xl"
                  src={seed}
                  alt="Seed"
                />
                <img
                  className="h-8 w-auto pl-5"
                  src={seed_text}
                  alt="Seed"
                />
              </div>
              
              <div className="flex items-center">
                {/* Display navigation links side by side on large screens */}
                <div className="hidden sm:block sm:mr-16">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current ? 'black' : 'text-gray-500 hover:text-gray-900',
                          'px-3 py-2 rounded-md text-base font-medium'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
                
                {/* Static Avatar for Larger Screens */}
                <img
                  className="hidden sm:block h-16 w-16 rounded-full"
                  src={avatar}
                  alt=""
                />

                {/* Clickable Avatar for Small Screens */}
                <div className="sm:hidden">
                  <Menu as="div">
                    <div>
                      <Menu.Button className="flex text-base rounded-full focus:outline-none">
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-16 w-16 rounded-full"
                          src={avatar}
                          alt=""
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {navigation.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <a
                                href={item.href}
                                className={classNames(
                                  active ? 'bg-gray-100' : '',
                                  'block px-4 py-2 text-sm text-gray-700'
                                )}
                              >
                                {item.name}
                              </a>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                    'block px-3 py-2 rounded-md text-md font-normal'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}


