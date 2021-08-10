import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/auth.context';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';

export const AuthPage = () => {
    const auth = useContext(AuthContext);
    const message = useMessage();
    const { loading, error, request, clearError } = useHttp();
    const [form, setForm] = useState({
        login: '', password: '', admin: false
    });

    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError]);

    useEffect(() => {
        window.M.updateTextFields();
    }, []);

    const changeHandler = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const checkboxHandler = (event) => {
        setForm({ ...form, admin: event.target.checked})
    }

    const registerHandler = async () => {
        try {
            await request('./api/auth/register', 'POST', { ...form });
        } catch (e) { }
    }

    const loginHandler = async () => {
        try {
            const data = await request('./api/auth/login', 'POST', { ...form });
            auth.login(data.token, data.userId, data.admin);
        } catch (e) { }
    }


    return (
        <div className="row">
            <div className="col s6 offset-s3">
                <h1>ToDo List</h1>
                <div className="card blue darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Authorization</span>
                        <div>
                            <div className="input-field">
                                <input
                                    placeholder="Enter login"
                                    id="login"
                                    type="text"
                                    name="login"
                                    className="yellow-input"
                                    value={form.login}
                                    onChange={changeHandler}
                                />
                                <label htmlFor="login">Login</label>
                            </div>
                            <div className="input-field">
                                <input
                                    placeholder="Enter password"
                                    id="password"
                                    type="password"
                                    name="password"
                                    className="yellow-input"
                                    value={form.password}
                                    onChange={changeHandler}
                                />
                                <label htmlFor="password">Password</label>
                            </div>
                            <div>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="admin"
                                        className="filled-in checkbox-yellow"
                                        onChange={checkboxHandler}
                                    />
                                    <span className="white-text">Admin</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="card-action">
                        <button
                            className="btn yellow darken-4"
                            disabled={loading}
                            onClick={loginHandler}
                        >
                            Log in
                        </button>
                        <button
                            className="btn grey lighten-1 black-text"
                            onClick={registerHandler}
                            disabled={loading}
                        >
                            Registration
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}