import { get, kebabCase, upperFirst } from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { IReducerState } from '../../reducers/reducer';
import { ListType } from '../../utils/enums';
import { ICard } from '../../utils/interfaces';
import KanbanCard from '../kanban-card/kanban-card';
import './kanban-column.scss';

interface IKanbanColumnProps extends StateProps {
  type: ListType;
};

function KanbanColumn(props: IKanbanColumnProps) {
  const getColumnTitle = (type: ListType) => upperFirst(kebabCase(type).replace('-', ' '));

  const { type } = props;
  const cardsList: ICard[] = get(props.cardsList, type, []);

  return (
    <div className={`kanban-column-container ${type}`}>
      <div className={'column-head'}>
        <h2>{getColumnTitle(type)}</h2>
      </div>
      <div className={'column-body'}>
        {cardsList.map((card, index) => (
          <KanbanCard key={index} card={card} />
        ))}
      </div>
    </div>
  );
};

const mapStateToProps = (storeState: IReducerState, ownProps: any) => ({
  cardsList: storeState.cards
});

type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(KanbanColumn);
