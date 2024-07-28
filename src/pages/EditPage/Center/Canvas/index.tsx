
import styles from "./index.module.less"


const style =  {
    width: 320,
    height: 568,
    backgroundColor: "#ffffff",
    backgroundImage: "",
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  }


function Canvas() {
    return (
        <div className = {styles.main} style={style}>
            
        </div>
    )
}


export default Canvas