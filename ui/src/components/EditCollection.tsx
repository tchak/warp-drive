import React from 'react';
import {
  HiOutlinePlusCircle,
  HiOutlineTrash,
  HiOutlineX,
} from 'react-icons/hi';
import { useMutation } from 'urql';
import { useFormik } from 'formik';

import {
  AttributeType,
  CreateAttributeDocument,
  DeleteAttributeDocument,
} from '../graphql';
import { RightSlideOver } from './RightSlideOver';
import { useCollection } from '../hooks';

export function EditCollection({
  collectionId,
  isOpen,
  close,
}: {
  collectionId: string;
  isOpen: boolean;
  close: () => void;
}) {
  return (
    <RightSlideOver isOpen={isOpen}>
      <EditCollectionForm collectionId={collectionId} close={close} />
    </RightSlideOver>
  );
}

function EditCollectionForm({
  collectionId,
  close,
}: {
  collectionId: string;
  close: () => void;
}) {
  const [{ fetching }, createAttribute] = useMutation(CreateAttributeDocument);
  const [{ fetching: deleting }, deleteAttribute] = useMutation(
    DeleteAttributeDocument
  );
  const collection = useCollection(collectionId);

  const form = useFormik({
    initialValues: {
      type: AttributeType.String,
      name: '',
    },
    validate(values) {
      if (!values.name.trim()) {
        return {
          name: 'Attribute name is required.',
        };
      }
    },
    validateOnBlur: false,
    async onSubmit(values) {
      const { data } = await createAttribute({
        collectionId: collection?.id as string,
        ...values,
      });
      if (data) {
        form.resetForm();
      }
    },
  });

  return (
    <div className="h-full divide-y divide-gray-200 flex flex-col bg-white shadow-xl">
      <div className="flex-1 h-0 overflow-y-auto">
        <div className="py-6 px-4 bg-green-700 sm:px-6">
          <div className="flex items-center justify-between">
            <h2
              id="slide-over-heading"
              className="text-lg font-medium text-white"
            >
              New Collection
            </h2>
            <div className="ml-3 h-7 flex items-center">
              <button
                type="button"
                className="bg-green-700 rounded-md text-green-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                onClick={close}
                disabled={fetching}
              >
                <span className="sr-only">Close panel</span>
                <HiOutlineX className="h-6 w-6" />
              </button>
            </div>
          </div>
          <div className="mt-1"></div>
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div className="px-4 divide-y divide-gray-200 sm:px-6">
            <div className="space-y-6 pt-6 pb-5">
              <div>
                <AttributeList
                  attributes={collection?.attributes ?? []}
                  fetching={deleting}
                  remove={(id) => deleteAttribute({ id })}
                />
              </div>
            </div>
            <div className="pt-4 pb-6">
              <form onSubmit={form.handleSubmit}>
                <span className="relative z-0 inline-flex shadow-sm rounded-md w-full">
                  <select
                    name="type"
                    id="attribute-type"
                    className="-mr-px w-36 px-2 py-2 rounded-r-none rounded-l-md border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    value={form.values.type}
                    onChange={form.handleChange}
                  >
                    <option value={AttributeType.String}>String</option>
                    <option value={AttributeType.Boolean}>Boolean</option>
                    <option value={AttributeType.Int}>Integer</option>
                    <option value={AttributeType.Float}>Float</option>
                    <option value={AttributeType.Datetime}>DateTime</option>
                    <option value={AttributeType.Date}>Date</option>
                  </select>
                  <input
                    type="text"
                    name="name"
                    id="attribute-name"
                    className="-mr-px w-full sm:text-sm focus:ring-green-500 focus:border-green-500 border-gray-300"
                    autoComplete="off"
                    autoCapitalize="off"
                    autoCorrect="off"
                    autoFocus={true}
                    value={form.values.name}
                    onChange={form.handleChange}
                    onBlur={form.handleBlur}
                  />
                  <button
                    type="submit"
                    className={`${
                      fetching || !form.values.name ? 'opacity-50' : ''
                    } py-2 px-2 border border-gray-300 rounded-r-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                    disabled={fetching}
                  >
                    <HiOutlinePlusCircle className="text-xl" />
                  </button>
                </span>
                {!form.isValid && (
                  <p className="mt-2 text-sm text-red-600">
                    {form.errors.name}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 px-4 py-4 flex justify-end">
        <button
          type="button"
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          onClick={close}
          disabled={fetching}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function AttributeList({
  attributes,
  fetching,
  remove,
}: {
  attributes: { id: string; name: string; type: AttributeType }[];
  fetching: boolean;
  remove: (id: string) => void;
}) {
  return (
    <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
      {attributes.map((attribute) => (
        <li
          key={attribute.id}
          className="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
        >
          <div className="w-0 flex-1 flex items-center">
            <span className="w-20">
              <AttributeTypeBadge type={attribute.type} />
            </span>
            <span className="ml-2 flex-1 w-0 truncate">{attribute.name}</span>
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              disabled={fetching}
              type="button"
              onClick={() => remove(attribute.id)}
            >
              <HiOutlineTrash className="text-xl" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

function AttributeTypeBadge({ type }: { type: AttributeType }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 text-gray-800">
      {type}
    </span>
  );
}
