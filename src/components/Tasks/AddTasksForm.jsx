import axios from "axios";
import React, { useState } from "react";
import addSvg from '../../assets/img/add.svg'


export const AddTasksForm = ({ list, onAddTask }) => {
    const [visibleForm, setVisibleForm] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const toogleFormVisible = () => {
        setVisibleForm(!visibleForm)
        setInputValue('')
    }

    const addTask = () => {
        const obj = {
            listId: list.id,
            text: inputValue,
            completed: false
        }
        setIsLoading(true)
        axios.post('http://localhost:3001/tasks', obj)
            .then(({ data }) => {
                console.log(data);
                onAddTask(list.id, data)
                toogleFormVisible()
            }).catch(() => {
                alert('Ошибка при добавлении задачи')
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    return <div className="tasks__form">
        {!visibleForm ?
            <div onClick={toogleFormVisible} className="tasks__form-new">
                <img src={addSvg} alt="иконка добавления" />
                <span>Новая задача</span>
            </div> :
            <div className="tasks__form-block">
                <input
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    className="field"
                    type="text"
                    placeholder="Текст задачи" />

                <button disabled={isLoading} onClick={addTask} className="button">
                    {isLoading ? 'Добавление...' : 'Добавить задачу'}
                </button>
                <button onClick={toogleFormVisible} className="button button--grey">
                    Отмена
                </button>
            </div>}


    </div>
}