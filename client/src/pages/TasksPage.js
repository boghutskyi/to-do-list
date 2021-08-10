import React, { useContext, useState, useCallback, useEffect } from 'react';
import { AuthContext } from '../context/auth.context';
import { useHttp } from '../hooks/http.hook';
import { Loader } from '../components/Loader';


export const TasksPage = () => {
    const auth = useContext(AuthContext);
    const { loading, request } = useHttp();
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState({
        description: ''
    });
    const fetchTasks = useCallback(async () => {
        try {
            const fetched = await request('/api/tasks', 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            });
            setTasks(fetched);
        } catch (e) { }
    }, [auth.token, request]);

    const deleteHandler = useCallback(async (task) => {
        try {
            await request('/api/tasks', 'DELETE', { _id: task._id }, {
                Authorization: `Bearer ${auth.token}`
            });
            await fetchTasks();
        } catch (e) { }
    }, [auth.token, request, fetchTasks]);

    const updateHandler = useCallback(async (task) => {
        try {
            await request('/api/tasks', 'PATCH', { ...task }, {
                Authorization: `Bearer ${auth.token}`
            });
            await fetchTasks();
        } catch (e) { }
    }, [auth.token, request, fetchTasks])

    const addHandler = async () => {
        try {
            await request('/api/tasks/add', 'POST', { ...task }, {
                Authorization: `Bearer ${auth.token}`
            });
            setTask({ description: '' });
            await fetchTasks();
        } catch (e) { }
    };

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    return (
        <div>
            <h3>{auth.admin ? 'Admin' : 'User'} Todo List</h3>
            {loading ? <Loader />
                :
                <div>
                    <div className="table">
                        <div className="table-item">Status</div>
                        <div className="table-item description">Description</div>
                        <div className="table-item">Action</div>
                    </div>
                    {
                        tasks.map((task, index) => {
                            return (
                                <div key={index} className={`task ${task.done && 'completed'}`}>
                                    <div>
                                        <p>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    className="filled-in"
                                                    checked={task.done}
                                                    onChange={() => updateHandler(task)}
                                                />
                                                <span />
                                            </label>
                                        </p>
                                    </div>

                                    <div className={`task-description ${task.done && "text-through"}`} >{task.description}</div>
                                    <div
                                        className="task-delete"
                                        onClick={() => deleteHandler(task)}
                                    >
                                        Delete
                                    </div>
                                </div>

                            )
                        })
                    }
                    <div>
                        <div className="input-field col s6">
                            <input
                                placeholder="Description"
                                id="description"
                                type="text"
                                value={task.description}
                                name='description'
                                className="validate"
                                onChange={e => setTask({ ...task, [e.target.name]: e.target.value })}
                            />
                        </div>
                        <div>
                            <button
                                className="waves-effect waves-light btn"
                                onClick={addHandler}
                            >Add task
                            </button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}