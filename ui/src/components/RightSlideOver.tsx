import React, { ReactNode } from 'react';
import { Transition } from '@headlessui/react';

export function RightSlideOver({
  isOpen,
  children,
}: {
  isOpen: boolean;
  children: ReactNode;
}) {
  return (
    <Transition show={isOpen} className="fixed inset-0 overflow-hidden z-20">
      <div className="absolute inset-0 overflow-hidden">
        <section
          className="absolute inset-y-0 pl-16 max-w-full right-0 flex"
          aria-labelledby="slide-over-heading"
        >
          <Transition.Child
            className="w-screen max-w-md"
            enter="transform transition ease-in-out duration-500 sm:duration-700"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in-out duration-500 sm:duration-700"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            {children}
          </Transition.Child>
        </section>
      </div>
    </Transition>
  );
}
