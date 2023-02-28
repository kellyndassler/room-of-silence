
import "./InfoOverlay.scss";

const InfoOverlay = ({ header, body, visible }) => {
  return (
    <div className={`infoOverlay ${visible ? "" : "hide"}`}>
      <h3>{header}</h3>
      <p>{body}</p>
    </div>
  )
}

export default InfoOverlay;