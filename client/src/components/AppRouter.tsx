import React, {useContext} from 'react';
import {Route, Routes} from "react-router-dom";
import {authRoutes, IRoutes, publicRoutes} from "../Router";
import Auth from "../pages/auth/Auth";
import {Context} from "../index";
import {observer} from "mobx-react-lite";

const AppRouter = () => {
    const {employeeStore} = useContext(Context)

    return (
        <Routes>
            {employeeStore.is_auth ?
                authRoutes.map((item: IRoutes) => <Route key={item.path} path={item.path} element={item.element}/>)
                :
                publicRoutes.map((item: IRoutes) => <Route key={item.path} path={item.path} element={item.element}/>)}
            <Route path='*' element={<Auth/>}/>
        </Routes>
    );
};

export default observer(AppRouter);