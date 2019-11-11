import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import ItemsList from './ItemsList.js'
import { firestoreConnect } from 'react-redux-firebase';
import {editList} from '../../store/database/asynchHandler';

class ListScreen extends Component {
    state = {
        name: this.props.todoList.name,
        owner: this.props.todoList.owner,
    }

    handleChange = (e) => {
        const { props,state } = this;
        const { target } = e;


        let b = target.id;
        props.todoList.name = target.value;

        let date = new Date().getTime()*-1;
        props.todoList.lastUpdated = date;

        this.setState(state => ({
            ...state,
            [target.id]: target.value,
        }));
        
        props.editList(props.todoList.id, props.todoList);
    }
    
    render() {
        const auth = this.props.auth;
        const todoList = this.props.todoList;
        if (!auth.uid) {
            return <Redirect to="/" />;
        }

        return (
            <div className="container white">
                <h5 className="grey-text text-darken-3">Todo List</h5>
                <div className="input-field">
                    <label htmlFor="email">Name</label>
                    <input className="active" type="text" name="name" id="name" onChange={this.handleChange} value={todoList.name} />
                </div>
                <div className="input-field">
                    <label htmlFor="password">Owner</label>
                    <input className="active" type="text" name="owner" id="owner" onChange={this.handleChange} value={todoList.owner} />
                </div>
                <ItemsList todoList={todoList} />
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps.match.params;
  const { todoLists } = state.firestore.data;
  const todoList = todoLists ? todoLists[id] : null;
  todoList.id = id;

  return {
    todoList,
    auth: state.firebase.auth,
  };
};
const mapDispatchToProps = dispatch => ({
    editList: (todoListId,todoList) => dispatch(editList(todoListId,todoList)),
  });

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    { collection: 'todoLists' },
  ]),
)(ListScreen);