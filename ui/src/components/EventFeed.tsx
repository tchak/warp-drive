import React from 'react';
import { HiCheck, HiDatabase, HiUserAdd } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { FormattedDate } from 'react-intl';

import { Event, EventType } from '../graphql';
import { EventTypeBadge } from './badges';

export function EventFeed({ events }: { events: Event[] }) {
  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {events.map((event, index) => (
          <li key={event.id}>
            <div className="relative pb-8">
              {index != events.length - 1 && (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                ></span>
              )}
              <div className="relative flex space-x-3">
                <div>
                  <EventTypeIcon type={event.type} />
                </div>
                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      <EventTypeBadge type={event.type} />{' '}
                      <a href="#" className="font-medium text-gray-900"></a>
                    </p>
                  </div>
                  <div className="text-right text-sm whitespace-nowrap text-gray-500">
                    <time dateTime="2020-09-20">
                      <FormattedDate
                        value={event.createdDate}
                        dateStyle="medium"
                        timeStyle="short"
                      />
                    </time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function EventTypeIcon({ type }: { type: EventType }) {
  switch (type) {
    case EventType.AccountCreate:
    case EventType.UsersCreate:
    case EventType.AccountSessionsCreate:
      return (
        <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
          <HiUserAdd className="h-5 w-5 text-white" />
        </span>
      );
    case EventType.AccountUpdateEmail:
    case EventType.AccountUpdateName:
    case EventType.AccountUpdatePassword:
      return (
        <span className="h-8 w-8 rounded-full bg-gray-500 flex items-center justify-center ring-8 ring-white">
          <HiUserAdd className="h-5 w-5 text-white" />
        </span>
      );
    case EventType.AccountDelete:
    case EventType.UsersDelete:
    case EventType.UsersSessionsDelete:
      return (
        <span className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center ring-8 ring-white">
          <HiUserAdd className="h-5 w-5 text-white" />
        </span>
      );
    case EventType.DatabaseCollectionsCreate:
    case EventType.DatabaseDocumentsCreate:
      return (
        <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
          <HiDatabase className="h-5 w-5 text-white" />
        </span>
      );
    case EventType.DatabaseCollectionsUpdate:
    case EventType.DatabaseDocumentsUpdate:
      return (
        <span className="h-8 w-8 rounded-full bg-gray-500 flex items-center justify-center ring-8 ring-white">
          <HiDatabase className="h-5 w-5 text-white" />
        </span>
      );
    case EventType.DatabaseCollectionsDelete:
    case EventType.DatabaseDocumentsDelete:
      return (
        <span className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center ring-8 ring-white">
          <HiDatabase className="h-5 w-5 text-white" />
        </span>
      );
    default:
      return (
        <span className="h-8 w-8 rounded-full bg-gray-500 flex items-center justify-center ring-8 ring-white">
          <HiCheck className="h-5 w-5 text-white" />
        </span>
      );
  }
}
