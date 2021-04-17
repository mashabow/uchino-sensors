/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type Measurement = {
  __typename: "Measurement",
  id?: string,
  clientId?: string,
  temperature?: number,
  humidity?: number,
  createdAt?: string,
  updatedAt?: string,
};

export type ModelMeasurementFilterInput = {
  id?: ModelIDInput | null,
  clientId?: ModelStringInput | null,
  temperature?: ModelFloatInput | null,
  humidity?: ModelFloatInput | null,
  and?: Array< ModelMeasurementFilterInput | null > | null,
  or?: Array< ModelMeasurementFilterInput | null > | null,
  not?: ModelMeasurementFilterInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelMeasurementConnection = {
  __typename: "ModelMeasurementConnection",
  items?:  Array<Measurement | null > | null,
  nextToken?: string | null,
};

export type GetMeasurementQueryVariables = {
  id?: string,
};

export type GetMeasurementQuery = {
  getMeasurement?:  {
    __typename: "Measurement",
    id: string,
    clientId: string,
    temperature: number,
    humidity: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListMeasurementsQueryVariables = {
  filter?: ModelMeasurementFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListMeasurementsQuery = {
  listMeasurements?:  {
    __typename: "ModelMeasurementConnection",
    items?:  Array< {
      __typename: "Measurement",
      id: string,
      clientId: string,
      temperature: number,
      humidity: number,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type OnCreateMeasurementSubscription = {
  onCreateMeasurement?:  {
    __typename: "Measurement",
    id: string,
    clientId: string,
    temperature: number,
    humidity: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};
