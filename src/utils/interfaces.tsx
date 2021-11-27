import { HttpRequestStatus, ListType } from "./enums";

export interface IRequestData<T> {
  status?: HttpRequestStatus;
  data?: T;
}

export interface IReducerListObjects<DataType> {
  [key: string]: IRequestData<DataType>;
}

export interface IReducerListStatusObjects {
  [key: string]: HttpRequestStatus;
}

export interface ICardsList {
  'ToDo': ICard[];
  'Doing': ICard[];
  'Done': ICard[];
}

export interface ICard {
  id: string;
  titulo: string;
  conteudo: string;
  lista: ListType;
}

export interface ITemporaryCard {
  id?: string;
  titulo?: string;
  conteudo?: string;
  lista?: ListType;
}

export interface IAction {
  type?: string;
  payload?: any;
  meta?: any;
}
