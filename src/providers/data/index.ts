import type { DataProvider, GetListParams } from 'react-admin';
import client from '../supabase';

type ResourceOptionsWithFullTextSearch = {
  table?: string;
  view?: string;
  primaryKey?: string;
  fields: string[];
  fullTextSearchFields?: string[];
};
type InternalResourceOptions = Required<ResourceOptionsWithFullTextSearch>;
export type ResourceOptions = string[] | ResourceOptionsWithFullTextSearch;
export type ResourcesOptions = Record<string, ResourceOptions>;

const getResourceOptions = (
  resource: string,
  options: ResourcesOptions
): InternalResourceOptions => {
  const resourceOptions = options[resource];

  if (Array.isArray(resourceOptions)) {
    return {
      table: resource,
      view: resource,
      primaryKey: 'id',
      fields: resourceOptions,
      fullTextSearchFields: resourceOptions,
    };
  }

  return {
    table: resourceOptions.table ?? resource,
    view: resourceOptions.view ?? resourceOptions.table ?? resource,
    primaryKey: resourceOptions.primaryKey ?? 'id',
    fields: resourceOptions.fields,
    fullTextSearchFields:
      resourceOptions.fullTextSearchFields ?? resourceOptions.fields,
  };
};

const getList = async ({
  resourceOptions,
  params,
}: {
  resourceOptions: InternalResourceOptions;
  params: GetListParams;
}) => {
  const {
    pagination,
    sort,
    filter: { q, ...filter },
  } = params;

  const rangeFrom = (pagination.page - 1) * pagination.perPage;
  const rangeTo = rangeFrom + pagination.perPage;

  let query = client
    .from(resourceOptions.view)
    .select(resourceOptions.fields.join(', '), { count: 'exact' })
    .order(sort.field, { ascending: sort.order === 'ASC' })
    .match(filter)
    .range(rangeFrom, rangeTo);

  if (q) {
    const fullTextSearchFields = Array.isArray(resourceOptions)
      ? resourceOptions
      : resourceOptions.fullTextSearchFields;

    fullTextSearchFields.forEach((field) => {
      query = query.ilike(field, `%${q}%`);
    });
  }

  const { data, error, count } = await query;

  if (error) {
    throw new Error(`(${error.code}) ${error.message}`);
  }
  return {
    data:
      resourceOptions.primaryKey === 'id'
        ? data
        : data.map((item) => ({
            ...item,
            id: item[resourceOptions.primaryKey],
          })) ?? [],
    total: count ?? 0,
  };
};

export const supabaseDataProvider = (
  resources: ResourcesOptions
): DataProvider => ({
  async getList(resource, params) {
    const resourceOptions = getResourceOptions(resource, resources);
    return getList({ resourceOptions, params });
  },
  async getOne(resource, { id }) {
    const resourceOptions = getResourceOptions(resource, resources);
    const { data, error } = await client
      .from(resourceOptions.view)
      .select(resourceOptions.fields.join(', '))
      .match({ id })
      .single();

    if (error) {
      throw new Error(`(${error.code}) ${error.message}`);
    }

    if (resourceOptions.primaryKey === 'id') {
      return { data };
    }

    return { ...data, id: data[resourceOptions.primaryKey] };
  },
  async getMany(resource, { ids }) {
    const resourceOptions = getResourceOptions(resource, resources);

    const { data, error } = await client
      .from(resourceOptions.view)
      .select(resourceOptions.fields.join(', '))
      .in('id', ids);

    if (error) {
      throw new Error(`(${error.code}) ${error.message}`);
    }
    return { data: data ?? [] };
  },
  async getManyReference(resource, originalParams) {
    const resourceOptions = getResourceOptions(resource, resources);
    const { target, id } = originalParams;
    const params = {
      ...originalParams,
      filter: { ...originalParams.filter, [target]: id },
    };
    return getList({ resourceOptions, params });
  },
  async create(resource, { data }) {
    const resourceOptions = getResourceOptions(resource, resources);
    const { data: record, error } = await client
      .from(resourceOptions.table)
      .insert(data)
      .single();

    if (error) {
      throw new Error(`(${error.code}) ${error.message}`);
    }

    if (resourceOptions.primaryKey === 'id') {
      return { data: record };
    }

    return { ...record, id: record[resourceOptions.primaryKey] };
  },
  async update(resource, { id, data }) {
    const resourceOptions = getResourceOptions(resource, resources);
    const { data: record, error } = await client
      .from(resourceOptions.table)
      .update(data)
      .match({ id })
      .single();

    if (error) {
      throw new Error(`(${error.code}) ${error.message}`);
    }

    if (resourceOptions.primaryKey === 'id') {
      return { data: record };
    }

    return { ...record, id: record[resourceOptions.primaryKey] };
  },
  async updateMany(resource, { ids, data }) {
    const resourceOptions = getResourceOptions(resource, resources);
    const { data: records, error } = await client
      .from(resourceOptions.table)
      .update(data)
      .in('id', ids);

    if (error) {
      throw new Error(`(${error.code}) ${error.message}`);
    }
    return {
      data: records?.map((record) => record[resourceOptions.primaryKey]),
    };
  },
  async delete(resource, { id }) {
    const resourceOptions = getResourceOptions(resource, resources);
    const { data: record, error } = await client
      .from(resourceOptions.table)
      .delete()
      .match({ id })
      .single();

    if (error) {
      throw new Error(`(${error.code}) ${error.message}`);
    }

    if (resourceOptions.primaryKey === 'id') {
      return { data: record };
    }

    return { ...record, id: record[resourceOptions.primaryKey] };
  },
  async deleteMany(resource, { ids }) {
    const resourceOptions = getResourceOptions(resource, resources);
    const { data: records, error } = await client
      .from(resourceOptions.table)
      .delete()
      .in('id', ids);

    if (error) {
      throw new Error(`(${error.code}) ${error.message}`);
    }
    return {
      data: records?.map((record) => record[resourceOptions.primaryKey]),
    };
  },
});
