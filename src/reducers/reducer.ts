import { cloneDeep } from 'lodash';
import { HttpRequestStatus } from '../utils/enums';
import { IAction, ICard, ICardsList, IReducerListStatusObjects, IRequestData } from '../utils/interfaces';
import ReducerUtils from '../utils/reducer-utils';

export const ACTION_TYPES = {
  UPDATE_CARD: 'UPDATE_CARD',
  ADD_NEW_CARD: 'ADD_NEW_CARD',
  UPDATE_CARD_LIST: 'UPDATE_CARD_LIST',

  UPDATE_GET_STATUS: 'UPDATE_GET_STATUS',
  UPDATE_GET_DATA: 'UPDATE_GET_DATA',
  
  UPDATE_PUT_STATUS: 'UPDATE_PUT_STATUS',
  UPDATE_PUT_DATA: 'UPDATE_PUT_DATA',
  
  UPDATE_POST_STATUS: 'UPDATE_POST_STATUS',
  UPDATE_POST_DATA: 'UPDATE_POST_DATA',
  
  UPDATE_DELETE_STATUS: 'UPDATE_DELETE_STATUS',
  UPDATE_DELETE_DATA: 'UPDATE_DELETE_DATA',

  UPDATE_TOKEN: 'UPDATE_TOKEN',

  UPDATE_CARDS: 'UPDATE_CARDS'
};

export interface IReducerState {
  cards: ICardsList;
  getData: IRequestData<ICard[]>;
  putData: IReducerListStatusObjects;
  postStatus: HttpRequestStatus;
  deleteData: IReducerListStatusObjects;
  jwtToken: string;
}

const initialState: IReducerState = {
  cards: {
    'ToDo': [],
    'Doing': [],
    'Done': []
  },
  getData: {},
  putData: {},
  postStatus: HttpRequestStatus.NOOP,
  deleteData: {},
  jwtToken: ''
};

const appReducer = (state: IReducerState = initialState, action: IAction): IReducerState => {
  switch (action.type) {
    case ACTION_TYPES.UPDATE_CARDS:
      return {
        ...state,
        cards: action.payload.data
      }; 
    case ACTION_TYPES.UPDATE_GET_STATUS:
      return {
        ...state,
        getData: {
          ...state.getData,
          status: action.payload.status
        }
      };
    case ACTION_TYPES.UPDATE_GET_DATA:
      return {
        ...state,
        getData: {
          ...state.getData,
          data: action.payload.data
        }
      };
    case ACTION_TYPES.UPDATE_PUT_STATUS:
      return {
        ...state,
        putData: {
          ...state.putData,
          [action.meta.key]: action.payload.status
        }
      };
    case ACTION_TYPES.UPDATE_DELETE_STATUS:
      return {
        ...state,
        deleteData: {
          ...state.deleteData,
          [action.meta.key]: action.payload.status
        }
      };
    case ACTION_TYPES.UPDATE_POST_STATUS:
      return {
        ...state,
        postStatus: action.payload.status
      };
    case ACTION_TYPES.UPDATE_CARD:
      return {
        ...state,
        cards: ReducerUtils.updateCardsState(cloneDeep(state.cards), action.payload.data)
      };
    case ACTION_TYPES.ADD_NEW_CARD:
      return {
        ...state,
        cards: ReducerUtils.createNewCardState(cloneDeep(state.cards), action.payload.data)
      };
    case ACTION_TYPES.UPDATE_CARD_LIST:
      return {
        ...state,
        cards: ReducerUtils.updateListsCardState(cloneDeep(state.cards), action.payload.data)
      };
    case ACTION_TYPES.UPDATE_TOKEN:
      return {
        ...state,
        jwtToken: action.payload
      }
    default:
      return state;
  }
};

export default appReducer;

export const updateJwtToken = (newToken: string) => ({
  type: ACTION_TYPES.UPDATE_TOKEN,
  payload: newToken
});

export const updateCard = (card: ICard) => ({
  type: ACTION_TYPES.UPDATE_CARD,
  payload: { data: card }
}); 

export const addNewCard = (card: ICard) => ({
  type: ACTION_TYPES.ADD_NEW_CARD,
  payload: { data: card }
}); 

export const updateCards = (cardsList: ICardsList) => ({
  type: ACTION_TYPES.UPDATE_CARDS,
  payload: { data: cardsList }
});

export const updateGetStatus = (status: HttpRequestStatus) => ({
  type: ACTION_TYPES.UPDATE_GET_STATUS,
  payload: { status }
});

export const updatePostStatus = (status: HttpRequestStatus) => ({
  type: ACTION_TYPES.UPDATE_POST_STATUS,
  payload: { status }
});

export const updateCardList = (card: ICard) => ({
  type: ACTION_TYPES.UPDATE_CARD_LIST,
  payload: { data: card }
});

export const updatePutStatus = (status: HttpRequestStatus, uuid: string | undefined) => ({
  type: ACTION_TYPES.UPDATE_PUT_STATUS,
  payload: { status },
  meta: { key: uuid }
});

export const updateDeleteStatus = (status: HttpRequestStatus, uuid: string | undefined) => ({
  type: ACTION_TYPES.UPDATE_DELETE_STATUS,
  payload: { status },
  meta: { key: uuid }
});
