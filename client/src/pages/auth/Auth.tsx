import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../../index";
import {useLocation, useNavigate, useNavigation} from "react-router-dom";
import {DASHBOARDROUTER, LOGINROUTER} from "../../utils/consts";
import AuthForm from "./AuthForm";

const Auth = () => {
    const {employeeStore} = useContext(Context)

    const [isLogin, setIsLogin] = useState<boolean>(false)
    const location = useLocation()
    const navigation = useNavigate()
    const checkIsLogin = () => location.pathname === LOGINROUTER ? setIsLogin(true) : setIsLogin(false)

    useEffect(() => {

            checkIsLogin()

    }, [location.pathname]);

    return (
        <div>
            <AuthForm isLogin={isLogin}/>
        </div>
    );
};

export default Auth;