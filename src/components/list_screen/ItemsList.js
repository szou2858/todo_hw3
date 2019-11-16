import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import ItemCard from './ItemCard';
import { firestoreConnect } from 'react-redux-firebase';
import { Link } from 'react-router-dom';
import { getFirestore } from 'redux-firestore';

class ItemsList extends React.Component {

    state = {
        sortingCriteria: null,
    }
    processSortItemsByTask = () =>{
        if (this.state.sortingCriteria==="sort_by_task_increasing") {
            this.sortTasks("sort_by_task_decreasing");
        }
        else {
          this.setState({sortingCriteria:"sort_by_task_increasing"});
          this.sortTasks("sort_by_task_increasing");
        }
        console.log(this.state.sortingCriteria)
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
    sortTasks = (sortingCriteria) =>{
        const firestore = getFirestore();
        this.setState({
            sortingCriteria: sortingCriteria,
        })
        this.props.todoList.items.sort(this.compare);
        firestore.collection("todoLists").doc(this.props.todoList.id).update({
            items:this.props.todoList.items,
        });
        
    }
    compare = (item1, item2) =>{
        // IF IT'S A DECREASING CRITERIA SWAP THE ITEMS
        if (this.state.sortingCriteria==="sort_by_task_decreasing"
            || this.state.sortingCriteria==="sort_by_status_decreasing"
            || this.state.sortingCriteria==="sort_by_due_date_decreasing") {
            let temp = item1;
            item1 = item2;
            item2 = temp;
        }
        // SORT BY ITEM DESCRIPTION
        if (this.state.sortingCriteria==="sort_by_task_increasing"
            || this.state.sortingCriteria==="sort_by_task_decreasing") {
            if (item1.description < item2.description)
                return -1;
            else if (item1.description > item2.description)
                return 1;
            else
                return 0;
        }
        // SORT BY DUE DATE
        else if (this.state.sortingCriteria==="sort_by_due_date_increasing"
        || this.state.sortingCriteria==="sort_by_due_date_decreasing") {
            if (item1.due_date < item2.due_date)
                return -1;
            else if (item1.due_date > item2.due_date)
                return 1;
            else
                return 0;
        }
        // SORT BY COMPLETED
        else{
            if (item1.completed < item2.completed)
                return -1;
            else if (item1.completed > item2.completed)
                return 1;
            else
                return 0;
        }
      }

    render() {
        const todoList = this.props.todoList;
        const items = todoList.items;
        console.log("ItemsList: todoList.id " + todoList.id);
        return (
            <div className="todo-lists section">
                <div className="list_item_header_card row  grey darken-3 ">
                    <div className="list_item_task_header col s4 pointer"
                        onClick ={this.processSortItemsByTask}><h5>Task</h5></div>
                    <div className="list_item_due_date_header col s4 pointer"
                        onClick ={this.processSortItemsByDueDate}><h5>Due Date</h5></div>
                    <div className="list_item_status_header col s4 pointer"
                        onClick ={this.processSortItemsByStatus}><h5>Status</h5></div>
                </div>
                <div className = "row">
                {items && items.map(function(item) {
                    item.id = item.key;
                    return (
                        <Link to={'/itemScreen/' +todoList.id +'/'+item.id} key={item.id}>
                            <ItemCard todoList={todoList} item={item} />
                            <div class="divider"></div>
                        </Link>
                        
                    );})
                }
                </div>
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
const mapDispatchToProps = dispatch => ({
    processSortItemsByTask: (todoList) => dispatch("SORT_BY_TASK"),
  });
export default compose(
    connect(mapStateToProps,mapDispatchToProps),
    firestoreConnect([
        { collection: 'todoLists' },
    ]),
)(ItemsList);