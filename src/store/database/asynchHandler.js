import * as actionCreators from '../actions/actionCreators.js'

export const loginHandler = ({ credentials, firebase }) => (dispatch, getState) => {
    firebase.auth().signInWithEmailAndPassword(
      credentials.email,
      credentials.password,
    ).then(() => {
      console.log("LOGIN_SUCCESS");
      dispatch(actionCreators.loginSuccess);
    }).catch((err) => {
      dispatch(actionCreators.loginError);
    });
  };

export const logoutHandler = (firebase) => (dispatch, getState) => {
    firebase.auth().signOut().then(() => {
        dispatch(actionCreators.logoutSuccess);
    });
};

export const registerHandler = (newUser, firebase) => (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    firebase.auth().createUserWithEmailAndPassword(
        newUser.email,
        newUser.password,
    ).then(resp => firestore.collection('users').doc(resp.user.uid).set({
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        initials: `${newUser.firstName[0]}${newUser.lastName[0]}`,
    })).then(() => {
        dispatch(actionCreators.registerSuccess);
    }).catch((err) => {
        console.log(err);
        dispatch(actionCreators.registerError);
    });
};

export const createTodoList = todoList => (dispatch, getState, { getFirestore }) => {
    const fireStore = getFirestore();
    fireStore.collection('todoLists').add({
      ...todoList,
  
    }).then(() => dispatch(
      actionCreators.createTodoList(todoList),
    )).catch(err => dispatch(
      actionCreators.createTodoListError,
    ));
  };

  export const editList = (todoList) => (dispatch, getState, { getFirestore }) => {
    console.log("Edit list handler called");
      const fireStore = getFirestore();
      fireStore.collection('todoLists').doc(todoList.id).update({
        name:todoList.name,
        owner:todoList.owner,
        lastUpdated: todoList.lastUpdated,
    })
      .then(() => dispatch(
        actionCreators.editList(todoList),
      )).catch(err => dispatch(
        actionCreators.editListError,
      ));
    };

    export const createNewItem = (todoList,item) => (dispatch, getState, { getFirestore }) => {
      const fireStore = getFirestore();
      fireStore.collection('todoLists').doc(todoList.id).set(
            { items: [{item}] },
            { merge: true }
        )
          .then(() => dispatch(
            actionCreators.editList(todoList),
          )).catch(err => dispatch(
            actionCreators.editListError,
          ));
    };
  