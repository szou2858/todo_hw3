import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { NavLink, Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';
import TodoListLinks from './TodoListLinks';
import {createTodoList} from '../../store/database/asynchHandler';
import { getFirestore } from 'redux-firestore';
import * as actionCreators from '../../store/actions/actionCreators.js'
import { Button } from 'react-materialize';
 
class HomeScreen extends Component {
    state = {
        newListId:null,
    }


    handleNewList = (e) => {
        const {props} = this;
        const firestore = getFirestore();
        
        let date = new Date().getTime()*-1;
        const todoList = {
            items: [],
            lastUpdated: date,
            name: "Unknown",
            owner: "Unknown",
            
        }
        console.log(this.state.newListId);
        firestore.collection("todoLists").add(todoList).then(a =>{
            console.log(a.id);
            todoList.id = a.id;
            this.setState({newListId: a.id});
            props.dispatch(actionCreators.createTodoList(todoList));
        })
        //firestore.collection("todoLists").orderBy("lastUpdated","asc");
        console.log(this.state.newListId);
        console.log(this.state.todoList)
        //props.createNewList(todoList);
    }


    render() {
        const todoLists = this.props.todoLists;
        if (!this.props.auth.uid) {
            return <Redirect to="/login" />;
        }
        if(this.state.newListId){
            return <Redirect to={'/todoList/' + this.state.newListId} />;
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
                                <Button className="home_new_list_button" onClick={this.handleNewList}>
                                    Create a New To Do List
                                </Button>
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