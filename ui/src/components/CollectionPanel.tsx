import React from 'react';
import {
  HiOutlinePlusCircle,
  HiOutlineTrash,
  HiOutlineX,
} from 'react-icons/hi';
import { useMutation } from 'urql';
import { useFormik, FormikErrors } from 'formik';
import { useHotkeys } from 'react-hotkeys-hook';
import { isAlphanumeric, minLength, isEmpty, maxLength } from 'class-validator';

import {
  AttributeType,
  CreateCollectionDocument,
  CreateAttributeDocument,
  DeleteAttributeDocument,
} from '../graphql';
import { SlideOverPanel } from './SlideOverPanel';
import { Collection } from './CollectionList';

export function CollectionPanel({
  initialValues,
  show,
  close,
  afterClose,
}: {
  initialValues: Collection | { projectId: string; name: string };
  show: boolean;
  close: () => void;
  afterClose?: () => void;
}) {
  return (
    <SlideOverPanel afterLeave={afterClose} show={show}>
      {'id' in initialValues ? (
        <EditCollectionForm initialValues={initialValues} close={close} />
      ) : (
        <AddCollectionForm initialValues={initialValues} close={close} />
      )}
    </SlideOverPanel>
  );
}

function EditCollectionForm({
  initialValues,
  close,
}: {
  initialValues: Collection;
  close: () => void;
}) {
  const [{ fetching }, createAttribute] = useMutation(CreateAttributeDocument);
  const [{ fetching: deleting }, deleteAttribute] = useMutation(
    DeleteAttributeDocument
  );
  const isSaving = fetching || deleting;
  useHotkeys('esc', close, { enabled: !isSaving });
  const form = useFormik({
    initialValues: {
      collectionId: initialValues.id,
      type: AttributeType.String,
      name: '',
    },
    validate({ name }) {
      const errors: FormikErrors<{ name: string }> = {};

      if (isEmpty(name)) {
        errors.name = 'Name is required.';
      } else if (!minLength(name, 2)) {
        errors.name = 'Name should be at least 2 characters long.';
      } else if (!maxLength(name, 35)) {
        errors.name = 'Name should be at most 35 characters long.';
      } else if (!isAlphanumeric(name)) {
        errors.name = 'Name should contain only alphanumeric characters.';
      }
      return errors;
    },
    validateOnBlur: false,
    validateOnChange: false,
    async onSubmit(values) {
      const { data } = await createAttribute(values);
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
              {initialValues.name}
            </h2>
            <div className="ml-3 h-7 flex items-center">
              <button
                type="button"
                className="bg-green-700 rounded-md text-green-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                onClick={close}
                disabled={isSaving}
              >
                <span className="sr-only">Close panel</span>
                <HiOutlineX className="h-6 w-6" />
              </button>
            </div>
          </div>
          <div className="mt-1"></div>
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div className="px-4 sm:px-6">
            <div className="space-y-6 pt-6 pb-5">
              <div>
                <AttributeList
                  attributes={initialValues.attributes}
                  isSaving={isSaving}
                  remove={(id) => deleteAttribute({ id })}
                />
              </div>
            </div>
            <div className="pt-2 pb-6">
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
                    onKeyUp={({ key, currentTarget }) => {
                      if (key == 'Escape' && currentTarget.value == '') {
                        close();
                      }
                    }}
                  />
                  <button
                    type="submit"
                    className={`${
                      isSaving ? 'opacity-50' : ''
                    } py-2 px-2 border border-gray-300 rounded-r-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                    disabled={isSaving}
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
    </div>
  );
}

function AttributeList({
  attributes,
  isSaving,
  remove,
}: {
  attributes: { id: string; name: string; type: AttributeType }[];
  isSaving: boolean;
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
              disabled={isSaving}
              type="button"
              onClick={() => remove(attribute.id)}
            >
              <HiOutlineTrash className="text-xl hover:text-red-600" />
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

function AddCollectionForm({
  initialValues,
  close,
}: {
  initialValues: { projectId: string; name: string };
  close: () => void;
}) {
  const [{ fetching }, createCollection] = useMutation(
    CreateCollectionDocument
  );
  const form = useFormik({
    initialValues,
    validateOnBlur: false,
    validateOnChange: false,
    validate({ name }) {
      const errors: FormikErrors<{ name: string }> = {};

      if (isEmpty(name)) {
        errors.name = 'Name is required.';
      } else if (!minLength(name, 2)) {
        errors.name = 'Name should be at least 2 characters long.';
      } else if (!maxLength(name, 35)) {
        errors.name = 'Name should be at most 35 characters long.';
      } else if (!isAlphanumeric(name)) {
        errors.name = 'Name should contain only alphanumeric characters.';
      }
      return errors;
    },
    async onSubmit(values) {
      const { data } = await createCollection(values);

      if (data) {
        close();
      }
    },
  });
  useHotkeys('esc', close, { enabled: !fetching });

  return (
    <form
      className="h-full divide-y divide-gray-200 flex flex-col bg-white shadow-xl"
      onSubmit={form.handleSubmit}
    >
      <div className="flex-1 h-0 overflow-y-auto">
        <div className="py-6 px-4 bg-green-700 sm:px-6">
          <div className="flex items-center justify-between">
            <h2
              id="slide-over-heading"
              className="text-lg font-medium text-white"
            >
              Add Collection
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
          <div className="mt-1">
            <p className="text-sm text-green-300">
              A collection defines a schema for a type of document your
              application can create.
            </p>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div className="px-4 divide-y divide-gray-200 sm:px-6">
            <div className="space-y-6 pt-6 pb-5">
              <div>
                <label
                  htmlFor="collection-name"
                  className="block text-sm font-medium text-gray-900"
                >
                  Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="collection-name"
                    className="block w-full shadow-sm sm:text-sm focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md"
                    autoComplete="off"
                    autoCapitalize="off"
                    autoCorrect="off"
                    autoFocus={true}
                    value={form.values.name}
                    onChange={form.handleChange}
                    onBlur={form.handleBlur}
                    onKeyUp={({ key, currentTarget }) => {
                      if (key == 'Escape' && currentTarget.value == '') {
                        close();
                      }
                    }}
                  />
                </div>
                {!form.isValid && (
                  <p className="mt-2 text-sm text-red-600">
                    {form.errors.name}
                  </p>
                )}
              </div>
            </div>
            <div className="pt-4 pb-6"></div>
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
        <button
          type="submit"
          className="ml-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          disabled={fetching}
        >
          Save
        </button>
      </div>
    </form>
  );
}
