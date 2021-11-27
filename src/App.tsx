import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import './App.scss';
import Kanban from './components/kanban/kanban';
import NewCardAdder from './components/new-card-adder/new-card-adder';
import PageHeader from './components/page-header/page-header';
import PreLoader from './components/pre-loader/pre-loader';
import login from './store/login';
import { getStore } from './store/store';
import usePromise from 'react-promise';

const store = getStore();

const loginPromise: any = login(store);

function App() {
  const { loading } = usePromise<string>(loginPromise);

  if (loading) {
    return <PreLoader/>;
  }

  return (
    <div className="App">
      <div className="app-container">
        <PageHeader />
        <Provider store={store}>
          <NewCardAdder />
          <Kanban />
        </Provider>
        <Toaster position="bottom-center" />
      </div>
    </div>
  );
}

export default App;
