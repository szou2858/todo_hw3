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
import { Modal, Button } from 'react-materialize';


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
    handleYes = () => {
        const firestore = getFirestore();
        firestore.collection("todoLists").doc(this.props.todoList.id).delete();
    }

    render() {
        const auth = this.props.auth;
        const todoList = this.props.todoList;
        const items = todoList.items;
        if (!auth.uid) {
            return <Redirect to="/" />;
        }
        if(!todoList){
            return <React.Fragment/>
        }


        return (
            <div className="container white">
                <h5 className="grey-text text-darken-3">Todo List</h5>

                <Modal header="Delete List?" trigger={
                    <Button className = "delete_button">
                        <i className="material-icons">delete</i>
                    </Button>}>
                    <div className="modal_dialog">
                        <section className="dialog_content">
                            <p><strong>Are you sure you want to delete this list?</strong></p>
                        </section>
                        <Link to={'/'}>
                            <Button id="dialog_yes_button" modal = "close" onClick={this.handleYes}>Yes</Button>
                        </Link>
                        <Button id="dialog_no_button" modal ="close">No</Button>
                        <div className="dialog_footer">
                            <p><strong>The list will not be retreivable.</strong></p>
                        </div>
                    </div>
                </Modal>
                <div className="input-field">
                    <label className="active" htmlFor="email">Name</label>
                    <input className="active" type="text" name="name" id="name" onChange={this.handleChange} value={todoList.name} />
                </div>
                <div className="input-field">
                    <label className="active" htmlFor="password">Owner</label>
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