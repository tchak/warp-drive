import React from 'react';
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';

import { Collection as _Collection, Attribute } from '../graphql';

export type Collection = Pick<_Collection, 'id' | 'name' | 'updatedDate'> & {
  attributes: Array<Pick<Attribute, 'id' | 'name' | 'type'>>;
};

export function CollectionList({
  collections,
  remove,
  edit,
  saving,
}: {
  collections: Collection[];
  remove: (collection: Collection) => void;
  edit: (collection: Collection) => void;
  saving: boolean;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {collections.map((collection) => (
        <div
          key={collection.id}
          className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
        >
          <div className="flex-1">{collection.name}</div>
          <div className="flex-shrink-0 min-w-0">
            <button
              type="button"
              className="p-1 hover:text-blue-600 mr-2"
              disabled={saving}
              onClick={() => edit(collection)}
            >
              <HiOutlinePencil className="text-xl" />
            </button>
            <button
              type="button"
              className="p-1 hover:text-red-600"
              disabled={saving}
              onClick={() => remove(collection)}
            >
              <HiOutlineTrash className="text-xl" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
