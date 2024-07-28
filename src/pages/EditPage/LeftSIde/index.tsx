import classNames from "classnames"
import styles from "./index.module.less"
import "/public/iconfont/iconfont.css"

function LeftSider() {
    return(
        <div className={styles.main} >
            <ul className={styles.cmps}>
                <li
                className={classNames(
                    styles.cmp,
                    // showSide === isTextComponent ? styles.selected : ""
                  )}>
                    <i className={classNames("iconfont icon-wenben", styles.cmpIcon)} />
                    <span className={styles.cmpText}>文本</span>
                </li>
                <li
                className={classNames(
                    styles.cmp,
                    // showSide === isTextComponent ? styles.selected : ""
                  )}>
                    <i className={classNames("iconfont icon-tupian", styles.cmpIcon)}></i>
                    <span className={styles.cmpText}>图片</span>
                </li>
                <li
                className={classNames(
                    styles.cmp,
                    // showSide === isTextComponent ? styles.selected : ""
                  )}>
                    <i className={classNames("iconfont icon-graphical", styles.cmpIcon)}></i>
                    <span className={styles.cmpText}>图形</span>
                </li>
            </ul>
        </div>
    )
} 

export default LeftSider