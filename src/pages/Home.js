import "./Home.scss";

const Home = () => {
  return (
    <div className="home page-wrapper">
      <div className="page-cont">
        <div className="toc">
          <h1 className="hd3">Room Of Silence</h1>
          <ul>
            <li><h2 className="hd5">Current Prototypes</h2>
              <ul>
                <li><a href="/room-of-silence/particle-visualization">Particle Visualization</a></li>
                <li><a href="/room-of-silence/hands-translation-interaction">Object Feature with RTF and Hands (from previous experiments)</a></li>
              </ul>
            </li>
          </ul>
         </div>
       </div>
    </div>
  )
}

export default Home;
