import React, { useEffect, useState } from "react";
import { List } from "../List";

import addSvg from '../../assets/img/add.svg'
import closeSvg from '../../assets/img/close.svg'

import './AddList.scss'
import { Badge } from "../Badge";
import axios from "axios";

export const AddList = ({ colors, onAdd }) => {
    const [visiblePopup, setVisiblePopup] = useState(false);
    const [selectedColor, setSelectedColor] = useState(3);
    const [isLoading, setIsLoading] = useState(false);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        if (Array.isArray(colors)) {
            setSelectedColor(colors[0].id);
        }
    }, [colors])

    const onClose = () => {
        setVisiblePopup(false)
        setInputValue('')
        setSelectedColor(colors[0].id)
    }

    const addList = () => {
        if (!inputValue) {
            alert('Введите название списка')
            return
        }
        setIsLoading(true)
        axios.post('http://localhost:3001/lists', {
            name: inputValue,
            colorId: selectedColor
        }).then(({ data }) => {
            const color = colors.filter(c => c.id === selectedColor)[0]
            const listObg = { ...data, color, tasks: [] }
            onAdd(listObg);
            onClose();
        })
            .catch(() => {
                alert('Ошибка при добавлении списка')
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    return (
        <div className="add-list">
            <List onClick={() => setVisiblePopup(true)}
                items={[{
                    className: 'list__add-button',
                    icon: (<img src={addSvg} alt="Это иконка добавления" className="list__icon-plus" />),
                    name: 'Добавить список'
                }]} />
            {visiblePopup &&
                (<div className="add-list__popup">
                    <input value={inputValue} onChange={e => setInputValue(e.target.value)} className="field" type="text" placeholder="Название списка" />
                    <img onClick={onClose} src={closeSvg} alt="Кнопка закрыть" className="add-list__popup-close-btn" />
                    <div className="add-list__popup-colors">
                        {
                            colors.map(color => <Badge
                                onClick={() => setSelectedColor(color.id)}
                                key={color.id}
                                color={color.name}
                                className={selectedColor === color.id && 'active'} />)
                        }
                    </div>

                    <button onClick={addList} className="button">
                        {isLoading ? 'Добавление...' : 'Добавить'}
                    </button>
                </div>)}
        </div>
    )
}