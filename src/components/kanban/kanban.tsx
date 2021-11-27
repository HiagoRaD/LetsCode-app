import React from "react";
import { connect } from 'react-redux';
import { IReducerState } from "../../reducers/reducer";
import Api from "../../store/store";
import { ListType } from "../../utils/enums";
import KanbanColumn from '../kanban-column/kanban-column';
import './kanban.scss';

interface IKanbanProps extends StateProps {};

class Kanban extends React.Component<IKanbanProps, {}> {
  componentDidMount() {
    Api.getCards();
  }

  render() {
    return (
      <div className={'kanban-container'}>
        <KanbanColumn type={ListType.TO_DO} />
        <KanbanColumn type={ListType.DOING} />
        <KanbanColumn type={ListType.DONE} />
      </div>
    );
  }
}

const mapStateToProps = (storeState: IReducerState) => ({
  store: storeState
});

type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(Kanban);
