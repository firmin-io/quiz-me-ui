import React, { Component } from "react";
import GlobalContext from "./contexts/globalContext";
import { Redirect } from "react-router-dom";
import QuizMeService from "../services/quizMeService";
import { apiWrapper } from "../common/utils";
import Item from "./item";
import Modal from "react-modal";
import Quiz from "./quiz";

const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "50%"
  }
};

Modal.setAppElement("#root");

class Creations extends Component {
  static contextType = GlobalContext;
  state = {
    quizzes: [],
    flashcard_decks: []
  };

  constructor(props, context) {
    super(props, context);

    if (this.context.user.isLoggedIn) {
      this.loadQuizzes();
      this.loadFlashcardDecks();
    }
  }

  state = {
    quizModal: false,
    flashcardModal: false,
    quizzes: [],
    flashcard_decks: []
  };

  closeModal = name => {
    this.setState({ [name]: !this.state[name] });
  };

  loadQuizzes = async () => {
    await apiWrapper(
      QuizMeService.getUserQuizzes,
      {
        userId: this.context.user.id,
        token: this.context.user.token
      },
      json => {
        let _state = this.state;
        _state.quizzes = json;
        this.setState(_state);
      },
      this.context.modals.openErrorModal,
      this.context.user.logout
    );
  };

  loadFlashcardDecks = async () => {
    await apiWrapper(
      QuizMeService.getUserFlashcardDecks,
      {
        userId: this.context.user.id,
        token: this.context.user.token
      },
      json => {
        let _state = this.state;
        console.log("card res");
        console.log(json);
        _state.flashcard_decks = json;
        this.setState(_state);
      },
      this.context.modals.openErrorModal,
      this.context.user.logout
    );
  };

  preRender = () => {
    if (!this.context.user.isLoggedIn) {
      return <Redirect to="/" />;
    }
  };

  renderFlashcardDecks = () => {
    return (
      <div className="flashcard-deck-grid qm-text-primary-medium">
        {this.state.flashcard_decks.map(it => (
          <Item
            key={`fi-{it.id}`}
            item={it}
            onView={() => alert(`you are viewing ${it.name}`)}
            onDelete={() => alert(`you are deleting ${it.name}`)}
            onEdit={() => alert(`you are editing ${it.name}`)}
          ></Item>
        ))}
      </div>
    );
  };

  openQuizModal = quiz => {
    const _state = this.state;
    _state.quiz = (
      <React.Fragment>
        <Quiz key={quiz.id} quiz={quiz}></Quiz>
      </React.Fragment>
    );
    _state.quizModal = !_state.quiizModal;
    this.setState(_state);
  };

  deleteQuiz = quiz => {
    this.context.modals.openWarningModal(
      "Are you sure you want to delete this quiz? This action cannot be undone.",
      async () => {
        await apiWrapper(
          QuizMeService.deleteQuiz,
          {
            quiz_id: quiz.id,
            token: this.context.user.token
          },
          json => {
            let _state = this.state;
            _state.quizzes = _state.quizzes.filter(q => q.id !== quiz.id);
            this.setState(_state);
          },
          msg => {
            this.context.modals.openErrorModal(msg);
          },
          this.context.user.logout
        );
      }
    );
  };

  createQuiz = () => {
    const _state = this.state;
    _state.quiz = (
      <React.Fragment>
        <Quiz create={true}></Quiz>
      </React.Fragment>
    );
    _state.quizModal = !_state.quizModal;
    this.setState(_state);
  };

  editQuiz = quiz => {
    const _state = this.state;
    _state.quiz = (
      <React.Fragment>
        <Quiz edit={true} quiz={quiz}></Quiz>
      </React.Fragment>
    );
    _state.quizModal = !_state.quizModal;
    this.setState(_state);
  };

  renderQuizzes = () => {
    return (
      <div className="quiz-grid qm-text-primary-medium">
        {this.state.quizzes.map(it => (
          <Item
            key={`qi-${it.id}`}
            item={it}
            onView={() => alert(`you are viewing ${it.name}`)}
            onStudy={() => alert(`you are studying ${it.name}`)}
            onDelete={() => this.deleteQuiz(it)}
            onEdit={() => this.editQuiz(it)}
          ></Item>
        ))}
      </div>
    );
  };

  render() {
    return (
      <React.Fragment>
        {this.preRender()}
        <div>
          <div className="form-inline">
            <h3 className="qm-text-secondary-medium">My Quizzes</h3>
            <button
              className="btn btn-outline-primary ml-auto"
              onClick={() => this.createQuiz()}
            >
              Create
            </button>
          </div>
          <div style={{ paddingTop: ".5em", paddingBottom: ".5em" }}>
            {this.renderQuizzes()}
          </div>
        </div>
        <div>
          <div className="form-inline mt-5">
            <h3 className="qm-text-secondary-medium">My Flashcard Decks</h3>
            <button className="btn btn-outline-primary ml-auto">Create</button>
          </div>
          <div style={{ paddingTop: ".5em", paddingBottom: ".5em" }}>
            {this.renderFlashcardDecks()}
          </div>
        </div>

        <Modal
          isOpen={this.state.quizModal}
          onRequestClose={e => this.closeModal("quizModal")}
          style={modalStyles}
          contentLabel="quiz modal"
          key="quizModal"
        >
          {this.state.quiz}
        </Modal>
      </React.Fragment>
    );
  }
}

export default Creations;
