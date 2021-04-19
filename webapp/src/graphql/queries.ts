/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getMeasurement = /* GraphQL */ `
  query GetMeasurement($type: String!, $timestamp: Float!) {
    getMeasurement(type: $type, timestamp: $timestamp) {
      id
      type
      clientId
      timestamp
      temperature
      humidity
    }
  }
`;
export const listMeasurements = /* GraphQL */ `
  query ListMeasurements(
    $type: String
    $timestamp: ModelFloatKeyConditionInput
    $filter: ModelMeasurementFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listMeasurements(
      type: $type
      timestamp: $timestamp
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        type
        clientId
        timestamp
        temperature
        humidity
      }
      nextToken
    }
  }
`;
