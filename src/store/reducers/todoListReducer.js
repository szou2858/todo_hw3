import * as actionCreators from '../actions/actionCreators'

const initState = {
    todoLists: []
};

const todoListReducer = (state = initState, action) => {
    console.log(action.type);
    switch (action.type) {
        /* IF YOU HAVE ANY TODO LIST EDITING REDUCERS ADD THEM HERE */ 
        case actionCreators.CREATE_TODO_LIST:
            console.log("CREATE_TODOLIST_ACTION REDUCER");
            return {
                ...state,
                todoList: action.todoList,
            };
        case actionCreators.EDIT_LIST:
            console.log("EDIT LIST ACTION REDUCER");
            return{
                ...state,
                todoList: action.todoList,
                name: action.todoList.name,
                owner: action.todoList.owner,
            };
        default:
            return state;
    }
};

export default todoListReducer;