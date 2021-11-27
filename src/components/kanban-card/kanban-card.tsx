import { faArrowLeft, faArrowRight, faBan, faCheck, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { clone, cloneDeep, get } from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { IReducerState, updatePutStatus } from '../../reducers/reducer';
import Api from '../../store/store';
import { HttpRequestStatus, ListType } from '../../utils/enums';
import { ICard } from '../../utils/interfaces';
import { TextInput } from '../inputs/text-input/text-input';
import { TextareaInput } from '../inputs/textarea-input/textarea-input';
import PreLoader from '../pre-loader/pre-loader';
import './kanban-card.scss';

interface IKanbanCardProps extends StateProps, DispatchProps {
  card: ICard;
}

interface IKanbanCardState {
  temporaryCard: ICard;
  mode: CardMode;
  cardHeight?: number;
}

enum CardMode {
  VIEW = 'VIEW',
  EDIT = 'EDIT'
}

class KanbanCard extends React.Component<IKanbanCardProps, IKanbanCardState>  {
  constructor(props: IKanbanCardProps) {
    super(props);

    this.state = {
      temporaryCard: this.props.card,
      mode: CardMode.VIEW
    };
  }

  componentWillReceiveProps(newProps: IKanbanCardProps) {
    const uuid = this.props.card.id;

    if (get(newProps, `putResponse.${this.props.card.id}`) === HttpRequestStatus.SUCCESS) {
      this.setState({
        mode: CardMode.VIEW
      }, () => this.props.updatePutStatus(HttpRequestStatus.NOOP, uuid));
    }
  }

  renderCardView = () => {
    const { card } = this.props;

    return (
      <>
        <div className={'card-header'}>
          <h3 className={'card-title'}>{card.titulo}</h3>
          <div className={'icons-container'}>
            <FontAwesomeIcon className={'card-icon-op delete'} icon={faTrash} onClick={() => this.handleDeletePressed()} />
            <FontAwesomeIcon className={'card-icon-op edit'} onClick={() => this.handleEditPressed()} icon={faPen} />
          </div>
        </div>
        <div className={'card-body'}>
          <div className={'text-container'}>
            <p>{card.conteudo}</p>
          </div>
        </div>
        <div className={'arrow-buttons-container'}>
          {card.lista !== ListType.TO_DO && <FontAwesomeIcon className={'card-icon-op arrow left'} onClick={() => this.handleSwitchPressed('left')} icon={faArrowLeft} />}
          {card.lista !== ListType.DONE && <FontAwesomeIcon className={'card-icon-op arrow right'} onClick={() => this.handleSwitchPressed('right')} icon={faArrowRight} />}
        </div>
      </>
    );
  };

  handleDeletePressed = () => {
    const entity = clone(this.props.card);
    Api.deleteCard(entity.id);
  };

  handleEditPressed = () => {
    const cardElement = document.getElementById(get(this.props.card, 'id'));
    this.setState({
      mode: CardMode.EDIT,
      temporaryCard: cloneDeep(this.props.card),
      cardHeight: get(cardElement, 'clientHeight')
    });
  };

  handleSwitchPressed = (key: 'left' | 'right') => {
    const card = cloneDeep(this.props.card);
    const listOfTypes = Object.values(ListType);
    const index = listOfTypes.findIndex(it => it === card.lista);
    card.lista = listOfTypes[key === 'left' ? index - 1 : index + 1];
    Api.changeCardList(card);
  };

  renderCardEdit = () => {
    const { temporaryCard } = this.state;

    return (
      <>
        <div className={'card-header'}>
          <TextInput
            value={temporaryCard.titulo}
            onChange={event => this.setTemporaryCardValue(event.target.value, 'titulo')}
          />
          <div className={'icons-container'}>
            <FontAwesomeIcon className={'card-icon cancel'} onClick={() => this.cancelEdit()} icon={faBan} />
            <FontAwesomeIcon className={'card-icon confirm'} onClick={() => this.confirmEdit()} icon={faCheck} />
          </div>
        </div>
        <div className={'card-body'}>
          <div className={'text-container'}>
            <TextareaInput
              value={temporaryCard.conteudo}
              onChange={event => this.setTemporaryCardValue(event.target.value, 'conteudo')}
            />
          </div>
        </div>
      </>
    );
  };

  setTemporaryCardValue = (value: string, key: string) => {
    this.setState(prevState => ({
      temporaryCard: {
        ...prevState.temporaryCard,
        [key]: value
      }
    }));
  };

  cancelEdit = () => {
    this.setState({
      mode: CardMode.VIEW,
      cardHeight: undefined
    });
  };

  confirmEdit = () => {
    const entity = this.state.temporaryCard;
    Api.putCard(entity);
  };

  renderPreLoader = () => <PreLoader/>

  render() {
    const { card, deleteResponse, putResponse } = this.props;
    const { mode, cardHeight } = this.state;
    const renderController = {
      VIEW: () => this.renderCardView(),
      EDIT: () => this.renderCardEdit()
    };
    const deleteStatus = get(deleteResponse, `${card.id}`, HttpRequestStatus.NOOP);
    const putStatus = get(putResponse, `${card.id}`, HttpRequestStatus.NOOP);

    return (
      <div id={card.id}>
        <div className={`kanban-card-container ${card.lista} ${mode}`} style={ cardHeight ? { height: `${cardHeight - 27}px` } : {} }>
          {(deleteStatus === HttpRequestStatus.ONGOING || putStatus === HttpRequestStatus.ONGOING) ? this.renderPreLoader() : renderController[mode]()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (storeState: IReducerState) => ({
  putResponse: storeState.putData,
  deleteResponse: storeState.deleteData
});

const mapDispatchToProps = {
  updatePutStatus
}

type StateProps = ReturnType<typeof mapStateToProps>;

type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(KanbanCard);
