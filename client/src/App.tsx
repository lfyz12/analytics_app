import React, {useContext, useEffect} from 'react';
import './App.css';
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter";
import {Context} from "./index";
import {observer} from "mobx-react-lite";
import Navbar from "./components/Navbar";

function App() {
    const {employeeStore} = useContext(Context)
    const checkAuth = async () => {
        await employeeStore.checkAuth()
    }

    useEffect(() => {
        checkAuth()
    }, []);

  return (
    <BrowserRouter>
      {employeeStore.is_auth && <Navbar/>}
      <AppRouter/>
    </BrowserRouter>
  );
}

export default observer(App);
