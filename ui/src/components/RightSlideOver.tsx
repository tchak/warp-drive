import React, { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Transition } from '@headlessui/react';

export function RightSlideOver({
  isOpen,
  afterLeave,
  children,
}: {
  isOpen: boolean;
  afterLeave?: () => void;
  children: ReactNode;
}) {
  return createPortal(
    <Transition
      show={isOpen}
      afterLeave={afterLeave}
      className="fixed inset-0 overflow-hidden z-20"
    >
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
    </Transition>,
    document.getElementById('slide-over') as HTMLElement
  );
}
