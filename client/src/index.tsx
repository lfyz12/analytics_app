import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {EmployeeStore} from "./store/EmployeeStore";
import {WorkSessionStore} from "./store/WorkSessionStore";
import {TaskStore} from "./store/TaskStore";
import {TaskTimeLogStore} from "./store/TaskTimeLogStore";
import {ReportStore} from "./store/ReportStore";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

interface State {
    employeeStore: EmployeeStore
    workSessionStore: WorkSessionStore
    taskStore: TaskStore
    taskTimeLogStore: TaskTimeLogStore
    reportStore: ReportStore
}

export const employeeStore = new EmployeeStore()
export const workSessionStore = new WorkSessionStore()
export const taskStore = new TaskStore()
export const taskTimeLogStore = new TaskTimeLogStore()
export const reportStore = new ReportStore()

export const Context = createContext<State>({
    employeeStore,
    workSessionStore,
    taskStore,
    taskTimeLogStore,
    reportStore
})

root.render(
  <Context.Provider value={{
      employeeStore,
      workSessionStore,
      taskStore,
      taskTimeLogStore,
      reportStore
  }}>
    <App />
  </Context.Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
