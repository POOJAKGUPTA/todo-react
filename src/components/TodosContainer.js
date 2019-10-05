import React, { Component } from 'react'
import update from 'immutability-helper'
import axios from 'axios'
import Container from 'react-bootstrap/Container'
import 'bootstrap/dist/css/bootstrap.min.css'
import './TodosContainer.css';



class TodosContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      todos: [],
      done_todo: []
    }	
  }

createTodo = (e) => {
  if (e.key === 'Enter') {
    axios.post('/api/v1/todos', {todo: {title: e.target.value}})
    .then(response => {
      const todos = update(this.state.todos, {
        $splice: [[0, 0, response.data]]
      })
    this.setState({
 	 todos: todos,
  	 inputValue: ''
	})
    })
    .catch(error => console.log(error))      
  }    
}

updateTodo = (e, id) => {
axios.put(`/api/v1/todos/${id}`, {todo: {done: e.target.checked}})
.then(response => {
  const todoIndex = this.state.todos.findIndex(x => x.id === response.data.id)
  const todos = update(this.state.todos, {
    [todoIndex]: {$set: response.data}
  })
  this.setState({
    todos: todos
  })
})
.catch(error => console.log(error))      
}

	
handleChange = (e) => {
  this.setState({inputValue: e.target.value});
}

getTodos() {
    axios.get('/api/v1/todos')
    .then(response => {
      this.setState({todos: response.data})
    })
    .catch(error => console.log(error))
    axios.get('/api/v1/done')
    .then(response => {
        this.setState({done_todo: response.data})
    })
}

  componentDidMount() {
    this.getTodos()
  }

   deleteTodo = (id) => {
    axios.delete(`/api/v1/todos/${id}`)
    .then(response => {
      const todoIndex = this.state.todos.findIndex(x => x.id === id)
      const todos = update(this.state.todos, {
        $splice: [[todoIndex, 1]]
      })
      this.setState({
        todos: todos
      })
    })
    .catch(error => console.log(error))
  }

  render() {
    return (
    <div>
        <div class="row">
            <div class="col-md-6">
                <div class="todolist not-done">
                 <h1>Todos</h1>
                    <input className="taskInput" type="text" placeholder="Add a task" maxLength="50" onKeyPress={this.createTodo} value={this.state.inputValue} onChange={this.handleChange} />
                    <ul id="sortable" class="list-unstyled">
                        {this.state.todos.map((todo) => {
                            return(
                                <li className="task" todo={todo} key={todo.id}>
                                    <input className="taskCheckbox" type="checkbox"  checked={todo.done} onChange={(e) => this.updateTodo(e, todo.id)} />              
                                    <label className="taskLabel">{todo.title}</label>
                                    <span className="deleteTaskBtn" onClick={(e) => this.deleteTodo(todo.id)}> x</span>
                                </li>
                            )       
                         })}   
                    </ul>
                    <div class="todo-footer">
                        <strong><span class="count-todos"></span></strong> Items Left
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="todolist">
                 <h1>Already Done</h1>
                    <ul id="done-items" class="list-unstyled">
                        {this.state.done_todo.map((todo) => {
                            return(
                                <li className="task" todo={todo} key={todo.id}>             
                                    <label className="taskLabel">{todo.title}</label>
                                </li>
                            )       
                         })} 
                    </ul>
                </div>
            </div>
        </div>
    </div>
    )
  }
}

export default TodosContainer