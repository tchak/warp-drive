import React from 'react';

export default function DocsPage() {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Documentation
            </h2>

            <ul>
              {docs.map(({ title, client, server }) => (
                <li key={title}>
                  <h3>{title}</h3>
                  <ul className="mb-2">
                    {client.map(({ title, method, url }) => (
                      <li key={title} className="mb-2">
                        <h4>{title}</h4>
                        <p className="text-sm">
                          {method} https://warp.cloud/v1/:projectId/{url}
                        </p>
                      </li>
                    ))}
                  </ul>
                  <ul className="mb-2">
                    {server.map(({ title, method, url }) => (
                      <li key={title} className="mb-2">
                        <h4>{title}</h4>
                        <p className="text-sm">
                          {method} https://warp.cloud/v1/:projectId/{url}
                        </p>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

interface DocEntry {
  title: string;
  url: string;
  method: 'GET' | 'POST' | 'DELETE' | 'PATCH' | 'HEAD';
  params?: Record<string, DocParam>;
}

type DocParamType = 'String' | 'String!';
type DocParam = DocParamType | Record<string, DocParamType>;

interface DocSection {
  title: string;
  client: DocEntry[];
  server: DocEntry[];
}

const docs: DocSection[] = [
  {
    title: 'Account API',
    client: [
      {
        title: 'Create account',
        url: 'account',
        method: 'POST',
        params: {
          email: 'String!',
          password: 'String!',
          name: 'String',
        },
      },
      {
        title: 'Get account',
        url: 'account',
        method: 'GET',
      },
      {
        title: 'Create account session',
        url: 'sessions',
        method: 'POST',
        params: {
          email: 'String!',
          password: 'String!',
        },
      },
      {
        title: 'Delete account',
        url: 'account',
        method: 'DELETE',
      },
      {
        title: 'Delete account session',
        url: 'sessions/:id',
        method: 'DELETE',
      },
      {
        title: 'Delete account sessions',
        url: 'sessions',
        method: 'DELETE',
      },
    ],
    server: [],
  },
  {
    title: 'Database API',
    client: [
      {
        title: 'Create document',
        url: 'database/documents',
        method: 'POST',
        params: {
          type: 'String!',
          attributes: {},
          relationships: {},
        },
      },
      {
        title: 'Update document',
        url: 'database/documents/:id',
        method: 'PATCH',
        params: {
          type: 'String!',
          id: 'String!',
          attributes: {},
          relationships: {},
        },
      },
      {
        title: 'Delete document',
        url: 'database/documents/:id',
        method: 'DELETE',
      },
      {
        title: 'Get document',
        url: 'database/documents/:id',
        method: 'GET',
      },
    ],
    server: [
      {
        title: 'Create collection',
        url: 'database/collections',
        method: 'POST',
        params: {
          name: 'String!',
          permissions: {
            read: 'String',
            write: 'String',
          },
        },
      },
      {
        title: 'Update collection',
        url: 'database/collections/:id',
        method: 'PATCH',
        params: {
          name: 'String',
          permissions: {
            read: 'String',
            write: 'String',
          },
        },
      },
      {
        title: 'Delete collection',
        url: 'database/collections/:id',
        method: 'DELETE',
      },
    ],
  },
  {
    title: 'Users API',
    client: [],
    server: [
      {
        title: 'Create user',
        url: 'users',
        method: 'POST',
        params: {
          email: 'String!',
          password: 'String!',
          name: 'String',
        },
      },
      {
        title: 'Delete user',
        url: 'users/:id',
        method: 'DELETE',
      },
      {
        title: 'Get user',
        url: 'users/:id',
        method: 'GET',
      },
      {
        title: 'List users',
        url: 'users',
        method: 'GET',
      },
    ],
  },
  {
    title: 'Teams API',
    client: [],
    server: [],
  },
  {
    title: 'Health API',
    client: [],
    server: [
      {
        title: 'Health HTTP',
        url: 'health',
        method: 'HEAD',
      },
      {
        title: 'Health DB',
        url: 'health/db',
        method: 'HEAD',
      },
    ],
  },
];
