import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Header from './Header'
import Home from './Home'
import './App.css'

//  This is the list (static data) used in the application. You can move it to any component if needed.

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

// Replace your code here
class App extends Component {
  state = {
    option: categoriesList[0].id,
    apiStatus: apiStatusConstants.initial,
    newArray: [],
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {option} = this.state
    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${option}`

    const response = await fetch(apiUrl)

    if (response.ok) {
      const data = await response.json()
      const updatedData = data.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))

      this.setState({
        newArray: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onChangeOption = event => {
    this.setState({option: event.target.value}, this.getData)
  }

  renderApiProjects = () => {
    const {newArray} = this.state
    return (
      <>
        <ul className="list-Container">
          {newArray.map(each => (
            <Home key={each.id} item={each} />
          ))}
        </ul>
      </>
    )
  }

  renderApiLoading = () => (
    <div className="loader" data-testId="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  onClickRetry = () => {
    this.getData()
  }

  renderApiFailure = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-para">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" className="btn" onClick={this.onClickRetry}>
        Retry
      </button>
    </div>
  )

  renderApiStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderApiProjects()
      case apiStatusConstants.failure:
        return this.renderApiFailure()
      case apiStatusConstants.inProgress:
        return this.renderApiLoading()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="app-container">
        <Header />
        <div className="select-container">
          <select className="select-bar" onChange={this.onChangeOption}>
            {categoriesList.map(each => (
              <option value={each.id} key={each.id}>
                {each.displayText}
              </option>
            ))}
          </select>
        </div>
        <div className="home-container">{this.renderApiStatus()}</div>
      </div>
    )
  }
}

export default App
