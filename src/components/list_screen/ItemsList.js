import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import ItemCard from './ItemCard';
import { firestoreConnect } from 'react-redux-firebase';
import { Link } from 'react-router-dom';

class ItemsList extends React.Component {

    state = {
        currentSortingCriteria: null,
    }
    processSortItemsByTask = () =>{
        if (this.state.sortingCriteria==="sort_by_task_increasing") {
            this.sortTasks("sort_by_task_decreasing");
        }
        else {
          this.setState({sortingCriteria:"sort_by_task_increasing"});
          this.sortTasks("sort_by_task_increasing");
        }
    }
    processSortItemsByDueDate = () =>{
        if (this.state.sortingCriteria==="sort_by_due_date_increasing") {
            this.sortTasks("sort_by_due_date_decreasing");
        }
        else {
          this.setState({sortingCriteria:"sort_by_due_date_increasing"});
          this.sortTasks("sort_by_due_date_increasing");
        }
      }
      processSortItemsByStatus = () =>{
        if (this.state.sortingCriteria==="sort_by_status_increasing") {
            this.sortTasks("sort_by_status_decreasing");
        }
        else {
          this.setState({sortingCriteria:"sort_by_status_increasing"});
          this.sortTasks("sort_by_status_increasing");
        }
      }

    render() {
        const todoList = this.props.todoList;
        const items = todoList.items;
        console.log("ItemsList: todoList.id " + todoList.id);
        return (
            <div className="todo-lists section">
                <div className="list_item_header_card">
                    <div className="list_item_task_header"
                        onClick ={this.props.processSortItemsByTask}>Task</div>
                    <div className="list_item_due_date_header"
                        onClick ={this.props.processSortItemsByDueDate}>Due Date</div>
                    <div className="list_item_status_header"
                        onClick ={this.props.processSortItemsByStatus}>Status</div>
                </div>
                {items && items.map(function(item) {
                    item.id = item.key;
                    return (
                        <Link to={'/itemScreen/' +todoList.id +'/'+item.id} key={item.id}>
                            <ItemCard todoList={todoList} item={item} />
                        </Link>
                        
                    );})
                }
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const todoList = ownProps.todoList;
    return {
        todoList,
        auth: state.firebase.auth,
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        { collection: 'todoLists' },
    ]),
)(ItemsList);