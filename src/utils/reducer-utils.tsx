import { get, set } from 'lodash';
import { getArrayFromSeparatedList, getSeparatedList } from '../store/store';
import { ICard, ICardsList } from './interfaces';

export default class ReducerUtils {
  static updateCardsState (cards: ICardsList, cardToUpdate: ICard) {
    const newCards = cards;
    const index = get(newCards, cardToUpdate.lista).findIndex((it: any) => it.id === cardToUpdate.id);
    set(get(newCards, cardToUpdate.lista), index, cardToUpdate);
    return (
      newCards
    );
  };

  static createNewCardState (cards: ICardsList, cardToAdd: ICard) {
    const newCards = cards;
    const list = get(newCards, cardToAdd.lista);
    list.push(cardToAdd);
    set(newCards, cardToAdd.lista, list);
    return (
      newCards
    );
  };

  static updateListsCardState (cards: ICardsList, cardToAdd: ICard) {
    const list = getArrayFromSeparatedList(cards);
    const index = list.findIndex(it => it.id === cardToAdd.id);
    list[index] = cardToAdd;
    return getSeparatedList(list);
  };
}
