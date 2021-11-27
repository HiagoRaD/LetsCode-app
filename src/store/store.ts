
import axios from 'axios';
import { cloneDeep, get } from 'lodash';
import { createStore } from 'redux';
import appReducer, { addNewCard, updateCardList } from '../reducers/reducer';
import { HttpRequestStatus } from '../utils/enums';
import { API_PREFIX, getRequestConfig } from '../utils/utils';
import { updateCards, updateGetStatus, updateDeleteStatus, updatePutStatus, updateCard, updatePostStatus } from '../reducers/reducer';
import { ICard, ICardsList, ITemporaryCard } from '../utils/interfaces';
import toast from 'react-hot-toast';

const store = createStore(appReducer);

// api communication functions
export default class Api {
  static getCards() {
    store.dispatch(updateGetStatus(HttpRequestStatus.ONGOING));

    const promise = axios.get(`${API_PREFIX}/cards/`, getRequestConfig());

    promise.then(response => {
      store.dispatch(updateGetStatus(HttpRequestStatus.SUCCESS));
      const separatedList: any = getSeparatedList(response.data);
      store.dispatch(updateCards(separatedList))
    }).catch(() => store.dispatch(updateGetStatus(HttpRequestStatus.ERROR)));
  };

  static deleteCard(uuid: any) {
    store.dispatch(updateDeleteStatus(HttpRequestStatus.ONGOING, uuid));

    const promise = axios.delete(`${API_PREFIX}/cards/${uuid}`, getRequestConfig());

    promise.then(response => {
      store.dispatch(updateDeleteStatus(HttpRequestStatus.SUCCESS, uuid));
      toast.success('Card deletado com sucesso!');
      const separatedList: any = getSeparatedList(response.data);
      store.dispatch(updateCards(separatedList));
    }).catch(() => updateDeleteStatus(HttpRequestStatus.ERROR, uuid))
  };

  static putCard(card: ICard) {
    const uuid = card.id;
    store.dispatch(updatePutStatus(HttpRequestStatus.ONGOING, uuid));

    const promise = axios.put(`${API_PREFIX}/cards/${uuid}`, card, getRequestConfig());

    promise.then(response => {
      store.dispatch(updatePutStatus(HttpRequestStatus.SUCCESS, uuid));
      toast.success('Card atualizado com sucesso!');
      const responseCard = response.data;
      store.dispatch(updateCard(responseCard));
    }).catch(() => updatePutStatus(HttpRequestStatus.ERROR, uuid))
  };

  static postCard(card: ICard | ITemporaryCard) {
    console.log('card', card);
    store.dispatch(updatePostStatus(HttpRequestStatus.ONGOING));

    const promise = axios.post(`${API_PREFIX}/cards`, card, getRequestConfig());

    promise.then(response => {
      store.dispatch(updatePostStatus(HttpRequestStatus.SUCCESS));
      toast.success('Card criado com sucesso!');
      const responseCard = response.data;
      responseCard.id = `api-nao-retorna-o-card-com-id-entao-vou-crirar-um-${Date.now()}`;
      store.dispatch(addNewCard(responseCard));
    }).catch(() => updatePostStatus(HttpRequestStatus.ERROR))
  };

  static changeCardList(card: ICard) {
    store.dispatch(updatePostStatus(HttpRequestStatus.ONGOING));

    const promise = axios.put(`${API_PREFIX}/cards/${card.id}`, card, getRequestConfig());

    promise.then(response => {
      store.dispatch(updatePostStatus(HttpRequestStatus.SUCCESS));
      toast.success(`Card atualizado para ${card.lista}`);
      const responseCard = response.data;
      store.dispatch(updateCardList(responseCard));
    }).catch(() => updatePostStatus(HttpRequestStatus.ERROR))
  };
}

// utilities functions
export const getSeparatedList = (cards: ICard[]) => {
  const separatedList: any = {
    ToDo: [],
    Doing: [],
    Done: []
  };
  cards.forEach((it: any) => {
    separatedList[get(it, 'lista', '')].push(it);
  });
  return cloneDeep(separatedList);
};

export const getArrayFromSeparatedList = (cards: ICardsList) => {
  const newList: ICard[] = [];

  Object.values(cards).forEach(it => {
    it.forEach((item: any) => newList.push(item));
  });

  console.log(newList);
  return newList;
};

export const getStore = () => store;