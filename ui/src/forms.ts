import { useFormik, FormikErrors } from 'formik';
import { isAlphanumeric, minLength, isEmpty, maxLength } from 'class-validator';
import { useMutation, CombinedError } from 'urql';

import {
  Scope,
  AttributeType,
  CreateAttributeDocument,
  DeleteAttributeDocument,
  CreateManyToOneRelationshipDocument,
  CreateOneToOneRelationshipDocument,
  DeleteRelationshipDocument,
  CreateCollectionDocument,
  CreateAttributeMutationVariables,
  CreateManyToOneRelationshipMutationVariables,
  CreateOneToOneRelationshipMutationVariables,
  CreateCollectionMutationVariables,
  CreateKeyDocument,
  UpdateKeyDocument,
  CreateKeyMutationVariables,
  UpdateKeyMutationVariables,
  UpdateCollectionMutationVariables,
  UpdateCollectionDocument,
} from './graphql';

type CreateRelationshipMutationVariables = (
  | CreateManyToOneRelationshipMutationVariables
  | CreateOneToOneRelationshipMutationVariables
) & { type: 'ManyToOne' | 'OneToOne' };

export type KeyMutationVariables = (
  | CreateKeyMutationVariables
  | UpdateKeyMutationVariables
) & { scope: Scope[] };

export type CollectionMutationVariables = (
  | CreateCollectionMutationVariables
  | UpdateCollectionMutationVariables
) & { permissions: string[] };

export type AttributeForm = ReturnType<typeof useAttributeForm>['form'];
export type RelationshipForm = ReturnType<typeof useRelationshipForm>['form'];
export type CollectionForm = ReturnType<typeof useCollectionForm>['form'];

export interface UseFormOptions {
  success?: () => void;
  error?: (error: CombinedError) => void;
}

export function useAttributeForm(
  collectionId: string,
  options?: UseFormOptions
) {
  const [{ fetching: creating }, createAttribute] = useMutation(
    CreateAttributeDocument
  );
  const [{ fetching: deleting }, deleteAttribute] = useMutation(
    DeleteAttributeDocument
  );
  const form = useFormik<CreateAttributeMutationVariables>({
    initialValues: {
      collectionId,
      type: AttributeType.String,
      name: '',
    },
    validate({ name }) {
      const errors: FormikErrors<CreateAttributeMutationVariables> = {};

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
      const { data, error } = await createAttribute(values);

      if (data) {
        options?.success && options.success();
      } else if (error) {
        options?.error && options.error(error);
      }
    },
  });

  return {
    form,
    delete: deleteAttribute,
    fetching: creating || deleting,
  };
}

export function useRelationshipForm(
  collectionId: string,
  relatedCollectionId: string,
  options?: UseFormOptions
) {
  const [
    { fetching: creatingManyToOne },
    createManyToOneRelationship,
  ] = useMutation(CreateManyToOneRelationshipDocument);
  const [
    { fetching: creatingOneToOne },
    createOneToOneRelationship,
  ] = useMutation(CreateOneToOneRelationshipDocument);
  const [{ fetching: deleting }, deleteRelationship] = useMutation(
    DeleteRelationshipDocument
  );
  const form = useFormik<CreateRelationshipMutationVariables>({
    initialValues: {
      collectionId,
      type: 'ManyToOne',
      name: '',
      relatedCollectionId,
      inverse: '',
    },
    validate({ name }) {
      const errors: FormikErrors<CreateManyToOneRelationshipMutationVariables> = {};

      if (isEmpty(name)) {
        errors.name = 'Name is required.';
      } else if (!minLength(name, 2)) {
        errors.name = 'Name should be at least 2 characters long.';
      } else if (!maxLength(name, 35)) {
        errors.name = 'Name should be at most 35 characters long.';
      } else if (!isAlphanumeric(name)) {
        errors.name = 'Name should contain only alphanumeric characters.';
      }

      if (!isEmpty(name) && !minLength(name, 2)) {
        errors.inverse = 'Inverse should be at least 2 characters long.';
      } else if (!maxLength(name, 35)) {
        errors.inverse = 'Inverse should be at most 35 characters long.';
      } else if (!isAlphanumeric(name)) {
        errors.inverse = 'Inverse should contain only alphanumeric characters.';
      }

      return errors;
    },
    validateOnBlur: false,
    validateOnChange: false,
    async onSubmit({ type, ...values }) {
      const { data, error } = await (type == 'ManyToOne'
        ? createManyToOneRelationship(values)
        : createOneToOneRelationship(values));

      if (data) {
        options?.success && options.success();
      } else if (error) {
        options?.error && options.error(error);
      }
    },
  });

  return {
    form,
    delete: deleteRelationship,
    fetching: creatingManyToOne || creatingOneToOne || deleting,
  };
}

export function useCollectionForm(
  input: CollectionMutationVariables,
  options?: UseFormOptions
) {
  const [{ fetching: creating }, createCollection] = useMutation(
    CreateCollectionDocument
  );
  const [{ fetching: updating }, updateCollection] = useMutation(
    UpdateCollectionDocument
  );
  const form = useFormik<CollectionMutationVariables>({
    initialValues: input,
    validateOnBlur: false,
    validateOnChange: false,
    validate({ name }) {
      const errors: FormikErrors<CollectionMutationVariables> = {};

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
      const { data, error } = await ('id' in values
        ? updateCollection(values)
        : createCollection(values));

      if (data) {
        options?.success && options.success();
      } else if (error) {
        options?.error && options.error(error);
      }
    },
  });

  return {
    form,
    fetching: creating || updating,
  };
}

export function useKeyForm(
  input: KeyMutationVariables,
  options?: UseFormOptions
) {
  const [{ fetching: creating }, createKey] = useMutation(CreateKeyDocument);
  const [{ fetching: updating }, updateKey] = useMutation(UpdateKeyDocument);
  const form = useFormik({
    initialValues: input,
    validateOnBlur: false,
    validateOnChange: false,
    validate({ name }) {
      const errors: FormikErrors<KeyMutationVariables> = {};

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
      const { data, error } = await ('id' in values
        ? updateKey(values)
        : createKey(values));

      if (data) {
        options?.success && options.success();
      } else if (error) {
        options?.error && options.error(error);
      }
    },
  });

  return {
    form,
    fetching: creating || updating,
  };
}
