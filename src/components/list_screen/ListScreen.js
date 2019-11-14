import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import ItemsList from './ItemsList.js'
import { firestoreConnect } from 'react-redux-firebase';
import {editList} from '../../store/database/asynchHandler';
import {createNewItem} from '../../store/database/asynchHandler';
import { getFirestore } from 'redux-firestore';
import { Link } from 'react-router-dom';


class ListScreen extends Component {
    state = {
        name: this.props.todoList.name,
        owner: this.props.todoList.owner,
    }

    handleChange = (e) => {
        const { props,state } = this;
        const { target } = e;

        if(target.id === "name")
            props.todoList.name = target.value;
        else if(target.id === "owner")
            props.todoList.owner = target.value;

        let date = new Date().getTime()*-1;
        props.todoList.lastUpdated = date;

        this.setState(state => ({
            ...state,
            [target.id]: target.value,
        }));
        
        props.editList(props.todoList);
    }

    handleNewItem = () => {
        const firestore = getFirestore();
        const items = this.props.todoList.items;
        const newItem = {
            assigned_to: "",
            completed: "",
            description: "",
            due_date: "",
            key: this.props.todoList.items.length,
        }
        items.push(newItem);
        console.log(items);
        firestore.collection("todoLists").doc(this.props.todoList.id).update({
            items: items,
        });
        //this.props.createNewItem(this.props.todoList, newItem)

    }
    
    render() {
        const auth = this.props.auth;
        const todoList = this.props.todoList;
        const items = todoList.items;
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
                <div className="new_item_container">
                    <Link to={'/itemScreen/' +todoList.id +'/'+items.length} key={items.length}>
                        <button className="new_item_button" onClick={this.handleNewItem}>
                            Add Item
                        </button>
                    </Link>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps.match.params;
  const { todoLists } = state.firestore.data;
  const todoList = todoLists ? todoLists[id] : null;
   if(todoList)
	todoList.id = id;

  return {
    todoList,
    auth: state.firebase.auth,
  };
};
const mapDispatchToProps = dispatch => ({
    editList: (todoList) => dispatch(editList(todoList)),
    createNewItem: (todoList,newItem) => dispatch(createNewItem(todoList,newItem)),
  });

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    { collection: 'todoLists' },
  ]),
)(ListScreen);