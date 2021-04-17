/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getMeasurement = /* GraphQL */ `
  query GetMeasurement($id: ID!) {
    getMeasurement(id: $id) {
      id
      clientId
      timestamp
      temperature
      humidity
    }
  }
`;
export const listMeasurements = /* GraphQL */ `
  query ListMeasurements(
    $filter: ModelMeasurementFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMeasurements(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        clientId
        timestamp
        temperature
        humidity
      }
      nextToken
    }
  }
`;
