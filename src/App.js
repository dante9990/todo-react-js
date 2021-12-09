import React, { useEffect, useState } from 'react';
import { List } from './components/List';
import { AddList } from './components/AddList';
import { Tasks } from './components/Tasks';
import axios from 'axios';

// import DB from './assets/db.json'

import listSvg from './assets/img/list.svg';
import { Route, useHistory } from 'react-router-dom';

function App() {
  const [lists, setLists] = useState(null)
  const [colors, setColors] = useState(null)
  const [activeItem, setActiveItem] = useState(null)

  let history = useHistory()

  useEffect(() => {
    axios.get('http://localhost:3001/lists?_expand=color&_embed=tasks').then(({ data }) => {
      setLists(data);
    })
    axios.get('http://localhost:3001/colors').then(({ data }) => {
      setColors(data);
    })
  }, [])

  const onAddList = (obj) => {
    const newLists = [
      ...lists,
      obj
    ]
    setLists(newLists)
  }

  const onAddTask = (listId, taskObj) => {
    const newLists = lists.map(item => {
      if (item.id === listId) {
        item.tasks = [...item.tasks, taskObj]
      }
      return item
    })
    setLists(newLists)
  }

  const onRemoveTask = (listId, taskId) => {
    if (window.confirm('вы действительно хотите удалить задачу?')) {
      const newLists = lists.map(item => {
        if (item.id === listId) {
          item.tasks = item.tasks.filter(task => task.id !== taskId)
        }
        return item
      })
      setLists(newLists)
      axios.delete('http://localhost:3001/tasks/' + taskId)
        .catch(() => alert('Не удалось обновить задачу'))
    }
  }

  const onEditTask = (listId, taskObj) => {
    const newTaskText = window.prompt('Текст задачи', taskObj.text)
    if (!newTaskText) {
      return
    }
    const newLists = lists.map(list => {
      if (list.id === listId) {
        list.tasks = list.tasks.map(task => {
          if (task.id === taskObj.id) {
            task.text = newTaskText
          }
          return task
        })
      }
      return list
    })
    setLists(newLists)
    axios.patch('http://localhost:3001/tasks/' + taskObj.id,
      { text: newTaskText })
      .catch(() => alert('Не удалось обновить задачу'))
  }

  const onEditListTitle = (id, title) => {
    const newLists = lists.map(item => {
      if (item.id === id) {
        item.name = title;
      }
      return item
    })
    setLists(newLists)
  }

  const onCompleteTask = (listId, taskId, completed) => {
    const newLists = lists.map(list => {
      if (list.id === listId) {
        list.tasks = list.tasks.map(task => {
          if (task.id === taskId) {
            task.completed = completed
          }
          return task
        })
      }
      return list
    })
    setLists(newLists)
    axios.patch('http://localhost:3001/tasks/' + taskId,
      { completed: completed })
      .catch(() => alert('Не удалось удалить задачу'))
  }

  useEffect(() => {
    const listId = history.location.pathname.split('lists/')[1]
    if (lists) {
      const list = lists.find(list => list.id === Number(listId))
      setActiveItem(list)
    }
  }, [lists, history.location.pathname])

  return (
    <div className="todo">
      <div className="todo__sidebar">
        <List
          onClickItem={list => {
            history.push(`/`)
          }}
          items={[{
            active: history.location.pathname === '/',
            icon: (<img src={listSvg} alt="Это иконка списка" />),
            name: 'Все задачи'
          }]} />
        {
          lists ? (
            <List
              items={lists}
              onRemove={id => {
                const newLists = lists.filter(item => item.id !== id);
                setLists(newLists)
              }}
              onClickItem={list => {
                history.push(`/lists/${list.id}`)
              }}
              isRemovable
              activeItem={activeItem} />
          ) : (
            'Загрузка...'
          )
        }
        <AddList onAdd={onAddList} colors={colors} />
      </div>
      <div className='todo__tasks'>
        <Route exact path="/">
          {
            lists && lists.map(list => (
              <Tasks
                key={list.id}
                list={list}
                onAddTask={onAddTask}
                onRemoveTask={onRemoveTask}
                onEditTask={onEditTask}
                onEditTitle={onEditListTitle}
                onCompleteTask={onCompleteTask}
                withoutEmpty />
            ))
          }
        </Route>
        <Route path="/lists/:id">
          {
            lists && activeItem && <Tasks
              list={activeItem}
              onAddTask={onAddTask}
              onRemoveTask={onRemoveTask}
              onEditTask={onEditTask}
              onEditTitle={onEditListTitle}
              onCompleteTask={onCompleteTask} />
          }
        </Route>

      </div>
    </div>

  );
}

export default App;
