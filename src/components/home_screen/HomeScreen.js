import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { NavLink, Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';
import TodoListLinks from './TodoListLinks';
import {createTodoList} from '../../store/database/asynchHandler';

class HomeScreen extends Component {


    handleNewList = (e) => {
        const {props} = this;
        let date = new Date().getTime()*-1;
        const todoList = {
            items: [],
            lastUpdated: date,
            name: "Unknown",
            owner: "Unknown",
            
        }
        props.createNewList(todoList);
    }


    render() {
        const todoLists = this.props.todoLists;
        if (!this.props.auth.uid) {
            return <Redirect to="/login" />;
        }

        return (
            <div className="dashboard container">
                <div className="row">
                    <div className="col s12 m4">
                        <TodoListLinks />
                    </div>

                    <div className="col s8">
                        <div className="banner">
                            @todo<br />
                            List Maker
                        </div>
                        
                        <div className="home_new_list_container">
                                <button className="home_new_list_button" onClick={this.handleNewList}>
                                    Create a New To Do List
                                </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        todoLists: state.firestore.ordered.todoLists,
    };
};
const mapDispatchToProps = dispatch => ({
    createNewList: (todoList) => dispatch(createTodoList(todoList)),
  });

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
      { collection: 'todoLists',orderBy:['lastUpdated']},
    ]),
)(HomeScreen);