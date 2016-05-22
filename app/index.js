var React = require('react');
var ReactDOM = require('react-dom');
var Modal = require('react-bootstrap').Modal;
var FormGroup = require('react-bootstrap').FormGroup;
var ControlLabel = require('react-bootstrap').ControlLabel;
var FormControl = require('react-bootstrap').FormControl;
var Panel = require('react-bootstrap').Panel;
var PanelGroup = require('react-bootstrap').PanelGroup;
var ListGroupItem = require('react-bootstrap').ListGroupItem;
var ListGroup = require('react-bootstrap').ListGroup;
require('./style.css');

var MainContainer = React.createClass({
  getInitialState: function() {
    localStorage.clear() //uncomment to clear local storage
    var saved = JSON.parse(localStorage.getItem('savedRecipes'));
    var savedCount = localStorage.getItem('savedCount');
    return {
      count: savedCount || 4, //if savedCount exists it will use that, else it will use "4"
      recipes: saved || //default values
      [
        {
          id: 1, name: "Apple Pie", ingredients: ["Apple", "Pie", "Potato"]
        },
        {
          id: 2, name: "Pumpkin Pie", ingredients: ["Pumpkin", "Butter", "Sugar"]
        },
        {
          id: 3, name: "Blueberry Pie", ingredients: ["Blueberry", "Blue", "Berries"]
        }
      ]
    }
  },
  handleAdd: function(recipeName, recipeIngredients) { //handles ADDITIONS to the recipes JSON
    var recipes = this.state.recipes.slice(); //new array created then new recipes pushed to end, arguments are from <AddRecipe />
    recipes.push(
      {
        id: this.state.count++, name: recipeName, ingredients: recipeIngredients.split(',')
      }
    );
    localStorage.setItem('savedRecipes', JSON.stringify(recipes));
    this.setState({recipes: recipes});
    localStorage.setItem('savedCount', this.state.count); // cached the count to prevent id collisions
  },
  handleEdit: function(id, recipeName, ingredients) { //handles EDITS to the recipes JSON
    var recipes = this.state.recipes.slice();
    recipes.map(function(recipe){
      if (recipe.id === id) { //if id in json is equal to id that requested an edit
        recipe.name = recipeName; //update the name
        recipe.ingredients = ingredients.split(','); // update and parse the ingredients
      }
    });
    localStorage.setItem('savedRecipes', JSON.stringify(recipes)); //updates the local storage to account for changes
    this.setState({recipes: recipes});
  },
  handleDelete: function(id) {
    var recipes = this.state.recipes.slice();
    recipes = recipes.filter(function(recipe){
      return recipe.id !== id //returns everything without the id of the recipe we want to delete
    });
    localStorage.setItem('savedRecipes', JSON.stringify(recipes));
    this.setState({recipes: recipes});
  },
  render: function() {
    return (
      <div className="container">
        <div className="jumbotron">
          <h4 id="titleName">Recipe Box</h4>
          <div className="row">
            {this.state.recipes.map(function(recipe){ //prints out each ingredient
              return  <Recipe key={recipe.id} id={recipe.id} recipeName={recipe.name} recipeIngredients={recipe.ingredients} onEdit={this.handleEdit} onDelete={this.handleDelete}/>
            }.bind(this))}
          </div>
        </div>
        <AddRecipe onUpdate={this.handleAdd}/>
      </div>
    )
  }
});

var AddRecipe = React.createClass({
  getInitialState: function() {
    return {
      showModal: false
    }
  },
  handleRecipeName: function(event) { //controls the input boxes on add recipe modal
    this.setState({
      recipeName: event.target.value
    })
  },
  handleIngredients: function(event) {
    this.setState({
      ingredients: event.target.value
    })
  },
  handleSubmit: function() {
    this.props.onUpdate(this.state.recipeName, this.state.ingredients); //calls the "onupdate" function to set the new state of parent compontent
    this.setState({
      showModal: false
    });
  },
  close: function() { //close modal
    this.setState({
      showModal: false
    })
  },
  open: function() { //open modal
    this.setState({
      showModal: true
    })
  },
  render: function() {
    return (
      <div>
        <Modal show={this.state.showModal} bsSize={"large"}>
          <Modal.Header />
          <Modal.Body>
            <form>
                <FormGroup controlId="formControlsText">
                  <ControlLabel>Recipe Name</ControlLabel>
                  <FormControl type="text" placeholder="Enter recipe name" onChange={this.handleRecipeName} value={this.state.recipeName}/>
                </FormGroup>
                <FormGroup controlId="formControlsIngredients">
                  <ControlLabel>Ingredients</ControlLabel>
                  <FormControl type="text" placeholder="Enter ingredients seperated by commas" onChange={this.handleIngredients} value={this.state.ingredients}/>
                </FormGroup>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <button className="btn btn-primary" onClick={this.handleSubmit}>Submit</button>
              <button className="btn btn-default" onClick={this.close}>Close</button>
            </Modal.Footer>
        </Modal>
        <button className="btn btn-primary" onClick={this.open}>Add Recipe</button>
      </div>
    )
  }
});

var Recipe = React.createClass({
  getInitialState: function() {
    return {
      showModal: false,
      recipeName: this.props.recipeName, // by default uses the props from the recipe thats been selected
      ingredients: this.props.recipeIngredients
    }
  },
  open: function() {
    this.setState({
      showModal: true
    })
  },
  close: function() {
    this.setState({
      showModal: false
    })
  },
  handleRecipeName: function(event) {
    this.setState({
      recipeName: event.target.value
    })
  },
  handleIngredients: function(event) {
    this.setState({
      ingredients: event.target.value
    })
  },
  handleSubmit: function() {
    this.props.onEdit(this.props.id, this.state.recipeName, this.state.ingredients) //calls onedit function to update app data
    this.setState({
      showModal: false
    })
  },
  handleDelete: function() {
    this.props.onDelete(this.props.id); // calls ondelete function to delete the requested recipe
  },
  render: function() {
    return (
      <div>
        <div className="col-lg-12">
        <Modal show={this.state.showModal} bsSize={"large"}>
          <Modal.Header />
          <Modal.Body>
            <form>
                <FormGroup controlId="formControlsText">
                  <ControlLabel>Edit Recipe</ControlLabel>
                  <FormControl type="text" placeholder="Recipe Name" onChange={this.handleRecipeName} defaultValue={this.props.recipeName} value={this.state.recipeName}/>
                </FormGroup>
                <FormGroup controlId="formControlsIngredients">
                  <ControlLabel>Ingredients</ControlLabel>
                  <FormControl type="text" placeholder="Enter ingredients seperated by commas" onChange={this.handleIngredients} defaultValue={this.props.recipeIngredients} value={this.state.ingredients}/>
                </FormGroup>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <button className="btn btn-primary" onClick={this.handleSubmit}>Edit Recipe</button>
              <button className="btn btn-default" onClick={this.close}>Close</button>
            </Modal.Footer>
          </Modal>
          <PanelGroup accordion>
            <Panel header={this.props.recipeName} bsStyle="success" eventKey={this.props.id}>
              <p id="ingredientsTitle">Ingredients</p>
              <Ingredient ingredients={this.props.recipeIngredients} />
              <button className="btn btn-danger" id="deleteButton" onClick={this.handleDelete}>Delete</button>
              <button className="btn btn-default" id="editButton" onClick={this.open}>Edit</button>
            </Panel>
          </PanelGroup>
        </div>
      </div>
    )
  }
});

var Ingredient = React.createClass({
  render: function() {
    return (
      <div>
        {this.test}
        <ListGroup>
            {this.props.ingredients.map(function(ingredient){
              return <ListGroupItem>{ingredient}</ListGroupItem> //returns a list group for each ingredient in array
            })}
        </ListGroup>
      </div>
    )
  }
});

ReactDOM.render(
  <MainContainer />,
  document.getElementById('app')
);
