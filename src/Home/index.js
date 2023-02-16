import './index.css'

const Home = props => {
  const {item} = props
  return (
    <li className="list-item">
      <img src={item.imageUrl} alt={item.name} className="image-size" />
      <div className="text-container">
        <p className="text">{item.name}</p>
      </div>
    </li>
  )
}

export default Home
