import React from 'react';
import { getFirestore } from 'redux-firestore';

class ItemCard extends React.Component {
    
    
    moveItemUp = (e) => {
        console.log("move item up");
        e.preventDefault();
        const firestore = getFirestore();
        const items = this.props.todoList.items;
        let indexOfItem = items.indexOf(this.props.item);
        let temp = items[indexOfItem];
        items[indexOfItem] = items[indexOfItem-1];
        items[indexOfItem-1] = temp;
        firestore.collection("todoLists").doc(this.props.todoList.id).update({
            items:items,
        });
        console.log(this.props.todoList);
        
    }
    moveItemDown = (e) => {
        console.log("move item up");
        e.preventDefault();
        const firestore = getFirestore();
        const items = this.props.todoList.items;
        let indexOfItem = items.indexOf(this.props.item);
        let temp = items[indexOfItem];
        items[indexOfItem] = items[indexOfItem+1];
        items[indexOfItem+1] = temp;
        firestore.collection("todoLists").doc(this.props.todoList.id).update({
            items:items,
        });
        console.log(this.props.todoList);
        
    }
    deleteItem = (e) =>{
        e.preventDefault();
        const firestore = getFirestore();
        const items = this.props.todoList.items;
        let indexOfItem = items.indexOf(this.props.item);
        items.splice(indexOfItem,1)
        firestore.collection("todoLists").doc(this.props.todoList.id).update({
            items:items,
        });
    }
    stopBubble = (e) =>{
        e.preventDefault();
    }
    render() {
        const { item } = this.props;  
        return (
            <div className="card z-depth-0 todo-list-link pink-lighten-3 row">
                <div className="card-content black-text text-darken-3 col s4 left-align">
                    <span className="card-title">{item.description} </span>
                    <span>Assigned To: {item.assigned_to}</span>
                </div>
                
                <div className='card-content list_item_card_due_date black-text col s4'>
                    {item.due_date}
                </div>
                <div className='card-content list_item_card_completed black-text col s4'>
                    <strong className={(item.completed)? "completed":"pending"}>{(item.completed) ? "Completed": "Pending"}</strong>
                </div>
                <div className="fixed-action-btn direction-left">
                    <div className="btn-floating btn-large blue fab">
                        <i className="large material-icons">mode_edit</i>
                    </div>
                    <ul className="fab-options">
                        <li>
                            {(this.props.todoList.items.indexOf(item)===0) ?
                            <div className="btn-floating grey move-up-button" onClick = {e=> this.stopBubble(e)}>
                                <i className="material-icons">arrow_upward</i>
                            </div>: 
                            <div className="btn-floating green move-up-button" onClick = {e=> this.moveItemUp(e)}>
                                <i className="material-icons">arrow_upward</i>
                            </div>}
                        
                        </li>
                        <li>
                            {this.props.todoList.items.indexOf(item)===(this.props.todoList.items.length-1)?
                            <div className="btn-floating grey move-down-button" onClick = {e=> this.stopBubble(e)}>
                                <i className="material-icons">arrow_downward</i>
                            </div>:
                            <div className="btn-floating yellow darken-1 move-down-button" onClick = {e=> this.moveItemDown(e)}>
                            <i className="material-icons">arrow_downward</i>
                        </div>}
                            
                        </li>
                        <li>
                            <div className="btn-floating red delete-item-button" onClick = {e=> this.deleteItem(e)}>
                                <i className="material-icons">remove</i>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            
        );
    }
}
export default ItemCard;

const mapStateToProps = (state, ownProps) => {
    const todoList = ownProps.todoList;
    // const { listId} = ownProps.match.params;
    // const { todoLists } = state.firestore.data;
    // const todoList = todoLists ? todoLists[listId] : null;
    // if(todoList)
    //   todoList.id = listId;
    return {
        todoList,
        auth: state.firebase.auth,
    };
};