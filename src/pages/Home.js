import "./Home.scss";

const Home = () => {
  return (
    <div className="home page-wrapper">
      <div className="page-cont">
        <div className="logo">
          <img src="assets/images/frog.svg" />
        </div>
        <div className="toc">
          <h1 className="hd3">Immersive Web Demos</h1>
          <ul>
            <li><h2 className="hd5">Techniques:</h2>
              <ul>
                <li><a href="/objectdemo">Object Feature</a></li>
                <li><a href="/objectdemo-rtf">Object Feature with React Three Fiber</a></li>
                <li><a href="/hands-translation-interaction">Object Feature with RTF and Hands</a></li>
                <li><a href="/hover">Hover Interaction</a></li>
                <li><a href="/clicktarget">Click Target</a></li>
                <li><a href="/scroll-sections">Scroll Sections (multiple items)</a></li>
              </ul>
            </li>
            <li><h2 className="hd5">Case Study: </h2>
              <ul>
                <li><a href="/scroll-animation">Dispatch Goods</a></li>
              </ul>
            </li>
          </ul>
         </div>
       </div>
    </div>
  )
}

export default Home;
