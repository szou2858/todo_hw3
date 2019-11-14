import React, { Component } from 'react';
import { firestoreConnect } from 'react-redux-firebase';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { getFirestore } from 'redux-firestore';
import { Link } from 'react-router-dom';

class ItemScreen extends Component {
    state = {
        description: this.props.currentItem.description,
        assigned_to: this.props.currentItem.assigned_to,
        due_date: this.props.currentItem.due_date,
        completed: this.props.currentItem.completed,
    }

    handleDescriptionChange = (event) => {
        this.setState({description: event.target.value});
        console.log(this.state.description);
    }

    handleAssignedToChange = (event) => {
        this.setState({assigned_to: event.target.value});
    }

    handleDueDateChange = (event) => {
        this.setState({due_date: event.target.value});
    }

    handleCompletedChange = (event) => {
        this.setState({completed: event.target.value});
    }

    handleSubmit = () => {
        const firestore = getFirestore();
        console.log(this.props.todoList);
        console.log(this.props.currentItem);
        
        let currentItemId = this.props.currentItem.id;
        const newItem = {
            key: this.props.currentItem.key,
            description: this.state.description,
            assigned_to: this.state.assigned_to,
            due_date: this.state.due_date,
            completed: this.state.completed
        }
        const newItems = this.props.todoList.items;
        newItems[currentItemId] = newItem;
        console.log(newItems);
        firestore.collection("todoLists").doc(this.props.todoList.id).update({
            items: newItems,
        });
    }

    render() {
        //const currentItem = this.props.currentItem;
        return (
            <div id ='todo_item' >
                <div id="item_form_container">
                    
                    <h1>Items</h1>
                    
                    <p>
                        <span id="item_description_prompt">Description: </span>
                        <input type="text" id="item_description_textfield" onChange={this.handleDescriptionChange} defaultValue={(this.props.currentItem) ? this.props.currentItem.description: null}/>
                    </p>

                    <p>
                        <span id="item_assigned_to_prompt" >Assigned to: </span>
                        <input type="text" id="item_assigned_to_textfield" onChange={this.handleAssignedToChange} defaultValue={(this.props.currentItem) ? this.props.currentItem.assigned_to: null}/>
                    </p>
                    <p>
                        <span id="item_due_date_prompt">Due Date: </span>
                        <input type="date" id="item_due_date_picker" onChange={this.handleDueDateChange} defaultValue={(this.props.currentItem) ? this.props.currentItem.due_date: null}/>
                    </p>
                    <p>
                        <span id="item_completed_prompt" >Completed: </span>
                        <input type="checkbox" id="item_completed_checkbox" onChange={this.handleCompletedChange} defaultChecked={(this.props.currentItem) ? this.props.currentItem.completed: false}/>
                    </p>
                    <p>
                        <Link to={'/todoList/' + this.props.todoList.id} key={this.props.todoList.id}>
                            <button id="item_form_submit_button"
                                onClick={this.handleSubmit}>Submit</button>
                            <button id="item_form_cancel_button"
                                onClick={this.handleCancel}>Cancel</button>
                        </Link>
                    </p>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state, ownProps) => {
    const { id } = ownProps.match.params;
    const { listId} = ownProps.match.params;
    console.log(listId);
    const { todoLists } = state.firestore.data;
    const todoList = todoLists ? todoLists[listId] : null;
    if(todoList)
      todoList.id = listId;
    const currentItem  = todoList.items[id];
    if(currentItem)
      currentItem.id = id;
    console.log(currentItem);
  
    return {
      todoList,
      currentItem,
      auth: state.firebase.auth,
    };
  };
const mapDispatchToProps = dispatch => ({
    
  });
export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
      { collection: 'todoLists' },
    ]),
  )(ItemScreen);
