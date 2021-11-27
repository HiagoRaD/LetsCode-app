import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { connect } from 'react-redux';
import { IReducerState } from '../../reducers/reducer';
import Api from '../../store/store';
import { HttpRequestStatus, ListType } from '../../utils/enums';
import { ITemporaryCard } from '../../utils/interfaces';
import { TextInput } from '../inputs/text-input/text-input';
import { TextareaInput } from '../inputs/textarea-input/textarea-input';
import { updatePostStatus } from './../../reducers/reducer';
import './new-card-adder.scss';

interface INewCardAdderState {
  expanded: boolean;
  temporaryCard: ITemporaryCard;
  errors: {
    titulo?: boolean;
    conteudo?: boolean;
  }
}

interface INewCardAdderProps extends StateProps, DispatchProps {};

class NewCardAdder extends React.Component<INewCardAdderProps, INewCardAdderState> {
  constructor(props: any) {
    super(props);
    this.state = {
      expanded: false,
      temporaryCard: {
        lista: ListType.TO_DO,
        titulo: '',
        conteudo: ''
      },
      errors: {}
    };
  }

  componentWillReceiveProps(newProps: StateProps) {
    if (newProps.postStatus === HttpRequestStatus.SUCCESS) {
      this.setState({
        expanded: false,
        temporaryCard: {
          lista: ListType.TO_DO,
          titulo: '',
          conteudo: ''
        },
        errors: {}
      }, () => this.props.updatePostStatus(HttpRequestStatus.NOOP));
    }
  }

  setTemporaryCardValue = (value: string, key: 'titulo' | 'conteudo') => this.setState(prevState => ({
    temporaryCard: {
      ...prevState.temporaryCard,
      [key]: value
    }
  }));

  toggleExpanded = () => {
    if (this.state.expanded) {
      this.submitCard();
      return;
    }
    this.setState({
      expanded: true
    });
  };

  submitCard = () => {
    if (!this.getCardValidation()) {
      const entity = this.state.temporaryCard;
      Api.postCard(entity);
    }
  };

  getCardValidation = () => {
    const { temporaryCard } = this.state;
    const errors = {
      titulo: temporaryCard.titulo == null || temporaryCard.titulo === '',
      conteudo: temporaryCard.conteudo == null || temporaryCard.conteudo === ''
    };
    this.setState({
      errors
    });
    return errors.titulo || errors.conteudo;
  };

  render() {
    const { expanded, temporaryCard, errors } = this.state;

    return (
      <div className={`new-card-adder-container ${expanded && 'expanded'}`}>
        <div className={'form-content hidden'}>
          <TextInput
            title={'Título'}
            placeholder={'Ex: Marcar reunião'}
            value={temporaryCard.titulo}
            onChange={event => this.setTemporaryCardValue(event.target.value, 'titulo')}
            error={errors.titulo}
          />
          <TextareaInput
            title={'Conteúdo'}
            placeholder={'Ex: Falar com Fulano sobre a reunião'}
            value={temporaryCard.conteudo}
            onChange={event => this.setTemporaryCardValue(event.target.value, 'conteudo')}
            error={errors.conteudo}
          />
        </div>
        <div className={'create-card-button-container'}>
          <button className={'add-button'} type={'button'} onClick={() => this.toggleExpanded()}>
            <span className={'text'}>Novo</span>
            <FontAwesomeIcon className={'add-icon'} icon={faPlus}/>
          </button>
        </div>
      </div>
    );
  }
};

const mapStateToProps = (storeState: IReducerState) => ({
  postStatus: storeState.postStatus
});

const mapDispatchToProps = {
  updatePostStatus
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(NewCardAdder);
